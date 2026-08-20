const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { chatService } = require('../services');

const getChat = catchAsync(async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  const connected = await chatService.isConnected(userId, targetUserId);
  if (!connected) {
    return res.status(httpStatus.FORBIDDEN).json({ message: 'You can only chat with connected users.' });
  }

  const chat = await chatService.getOrCreateChat(userId, targetUserId);
  return res.json(chat);
});

module.exports = {
  getChat,
};
