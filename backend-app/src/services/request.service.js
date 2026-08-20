const httpStatus = require('http-status');
const { User, ConnectionRequest } = require('../models');
const ApiError = require('../utils/ApiError');

const sendConnectionRequest = async (fromUserId, toUserId, status) => {
  const toUser = await User.findById(toUserId);
  if (!toUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found.');
  }

  const existingConnectionRequest = await ConnectionRequest.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId },
    ],
  });

  if (existingConnectionRequest) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Connection request already exists.');
  }

  const connectionRequest = new ConnectionRequest({
    fromUserId,
    toUserId,
    status,
  });

  return connectionRequest.save();
};

const reviewConnectionRequest = async (loggedInUserId, requestId, status) => {
  const connectionRequest = await ConnectionRequest.findOne({
    _id: requestId,
    toUserId: loggedInUserId,
    status: 'interested',
  });

  if (!connectionRequest) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Connection request not found');
  }

  connectionRequest.status = status;
  return connectionRequest.save();
};

module.exports = {
  sendConnectionRequest,
  reviewConnectionRequest,
};
