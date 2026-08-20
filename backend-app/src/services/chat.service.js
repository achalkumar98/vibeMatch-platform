const { Chat, ConnectionRequest } = require('../models');

const isConnected = async (userId, targetUserId) => {
  const request = await ConnectionRequest.findOne({
    $or: [
      { fromUserId: userId, toUserId: targetUserId, status: 'accepted' },
      { fromUserId: targetUserId, toUserId: userId, status: 'accepted' },
    ],
  });
  return !!request;
};

const getOrCreateChat = async (userId, targetUserId) => {
  let chat = await Chat.findOne({
    participants: { $all: [userId, targetUserId] },
  }).populate({
    path: 'messages.senderId',
    select: 'firstName lastName',
  });

  if (!chat) {
    chat = new Chat({ participants: [userId, targetUserId], messages: [] });
    await chat.save();
  }

  return chat;
};

module.exports = {
  isConnected,
  getOrCreateChat,
};
