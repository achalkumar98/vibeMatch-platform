const crypto = require('crypto');
const { Server } = require('socket.io');
const logger = require('../config/logger');
const { Chat } = require('../models/chat.model');
const ConnectionRequest = require('../models/connectionRequest.model');
const User = require('../models/user.model');

/**
 * In-memory map of userId → socket.id
 * Not Redis-backed — works for single-instance deployments.
 * Scale-out: replace with a Redis adapter (socket.io-redis).
 */
const onlineUsers = {};

/** Deterministic room ID for a two-person chat */
const getRoomId = (userId, targetUserId) =>
  crypto.createHash('sha256').update([userId, targetUserId].sort().join('_')).digest('hex');

/** Persist lastSeen and broadcast status to all relevant rooms */
const setUserOffline = async (io, userId) => {
  delete onlineUsers[userId];
  try {
    await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
  } catch (err) {
    logger.error(`lastSeen update failed for ${userId}: ${err.message}`);
  }
  // Broadcast to everyone — chat pages listen for this
  io.emit('userStatus', { userId, isOnline: false, lastSeen: new Date().toISOString() });
};

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN,
      credentials: true,
    },
    transports: ['websocket'],
    // Ping / pong — detect stale connections within 45 s
    pingInterval: 25000,
    pingTimeout: 20000,
  });

  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // ── joinChat ─────────────────────────────────────────────────────────────
    socket.on('joinChat', async ({ userId, targetUserId }) => {
      if (!userId || !targetUserId) return;

      try {
        const connected = await ConnectionRequest.findOne({
          $or: [
            { fromUserId: userId, toUserId: targetUserId, status: 'accepted' },
            { fromUserId: targetUserId, toUserId: userId, status: 'accepted' },
          ],
        });
        if (!connected) return;

        onlineUsers[userId] = socket.id;

        // Update lastSeen when user joins a room
        await User.findByIdAndUpdate(userId, { lastSeen: new Date() });

        const roomId = getRoomId(userId, targetUserId);
        socket.join(roomId);

        // Tell the target that this user is online
        if (onlineUsers[targetUserId]) {
          io.to(onlineUsers[targetUserId]).emit('userStatus', {
            userId,
            isOnline: true,
          });
        }

        // Tell the current user whether target is online + their lastSeen
        const targetUser = await User.findById(targetUserId).select('lastSeen');
        socket.emit('userStatus', {
          userId: targetUserId,
          isOnline: !!onlineUsers[targetUserId],
          lastSeen: targetUser?.lastSeen?.toISOString() ?? null,
        });
      } catch (err) {
        logger.error(`joinChat error: ${err.message}`);
      }
    });

    // ── sendMessage ───────────────────────────────────────────────────────────
    socket.on('sendMessage', async ({ userId, targetUserId, text }) => {
      if (!userId || !targetUserId || !text) return;

      try {
        const connected = await ConnectionRequest.findOne({
          $or: [
            { fromUserId: userId, toUserId: targetUserId, status: 'accepted' },
            { fromUserId: targetUserId, toUserId: userId, status: 'accepted' },
          ],
        });
        if (!connected) return;

        const roomId = getRoomId(userId, targetUserId);
        let chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } });
        if (!chat) chat = new Chat({ participants: [userId, targetUserId], messages: [] });

        chat.messages.push({ senderId: userId, text });
        await chat.save();

        const senderUser = await User.findById(userId).select('firstName lastName');

        // Update lastSeen on message send
        await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
        onlineUsers[userId] = socket.id; // refresh map

        io.to(roomId).emit('messageReceived', {
          senderId: senderUser._id,
          firstName: senderUser.firstName,
          lastName: senderUser.lastName,
          text,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        logger.error(`sendMessage error: ${err.message}`);
      }
    });

    // ── heartbeat ─────────────────────────────────────────────────────────────
    // Client emits this every ~30 s to keep the user "active" without navigating
    socket.on('heartbeat', async ({ userId }) => {
      if (!userId) return;
      try {
        onlineUsers[userId] = socket.id;
        await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
      } catch (err) {
        logger.error(`heartbeat error: ${err.message}`);
      }
    });

    // ── disconnect ────────────────────────────────────────────────────────────
    socket.on('disconnect', async () => {
      const offlineUserId = Object.keys(onlineUsers).find((key) => onlineUsers[key] === socket.id);
      if (offlineUserId) {
        await setUserOffline(io, offlineUserId);
        logger.info(`Client disconnected: ${socket.id} (userId: ${offlineUserId})`);
      }
    });
  });
};

module.exports = initializeSocket;
