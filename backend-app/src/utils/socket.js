const { Server } = require("socket.io");
const logger = require("../config/logger");
const crypto = require("crypto");
const { Chat } = require("../models/chat.model");
const ConnectionRequest = require("../models/connectionRequest.model");
const User = require("../models/user.model");

const onlineUsers = {}; // { userId: socket.id }

const getRoomId = (userId, targetUserId) =>
  crypto.createHash("sha256").update([userId, targetUserId].sort().join("_")).digest("hex");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN,
      credentials: true,
    },
    transports: ["websocket"], // ensures websocket is used
  });

  io.on("connection", (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.on("joinChat", async ({ userId, targetUserId }) => {
      if (!userId || !targetUserId) return;

      try {
        const connected = await ConnectionRequest.findOne({
          $or: [
            { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
            { fromUserId: targetUserId, toUserId: userId, status: "accepted" },
          ],
        });
        if (!connected) return;

        onlineUsers[userId] = socket.id;
        const roomId = getRoomId(userId, targetUserId);
        socket.join(roomId);

        // Notify target user
        if (onlineUsers[targetUserId]) {
          io.to(onlineUsers[targetUserId]).emit("userStatus", { userId, isOnline: true });
        }

        // Notify current user
        socket.emit("userStatus", { userId: targetUserId, isOnline: !!onlineUsers[targetUserId] });
      } catch (err) {
        logger.error(`joinChat error: ${err.message}`);
      }
    });

    socket.on("sendMessage", async ({ userId, targetUserId, text }) => {
      if (!userId || !targetUserId || !text) return;

      try {
        const connected = await ConnectionRequest.findOne({
          $or: [
            { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
            { fromUserId: targetUserId, toUserId: userId, status: "accepted" },
          ],
        });
        if (!connected) return;

        const roomId = getRoomId(userId, targetUserId);
        let chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } });
        if (!chat) chat = new Chat({ participants: [userId, targetUserId], messages: [] });

        chat.messages.push({ senderId: userId, text });
        await chat.save();

        const senderUser = await User.findById(userId).select("firstName lastName");
        io.to(roomId).emit("messageReceived", {
          senderId: senderUser._id,
          firstName: senderUser.firstName,
          lastName: senderUser.lastName,
          text,
        });
      } catch (err) {
        logger.error(`sendMessage error: ${err.message}`);
      }
    });

    socket.on("disconnect", () => {
      const offlineUserId = Object.keys(onlineUsers).find(key => onlineUsers[key] === socket.id);
      if (offlineUserId) {
        delete onlineUsers[offlineUserId];
        io.emit("userStatus", { userId: offlineUserId, isOnline: false });
      }
    });
  });
};

module.exports = initializeSocket;
