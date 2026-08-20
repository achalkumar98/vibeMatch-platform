const { User, ConnectionRequest } = require('../models');
const { USER_SAFE_DATA } = require('../utils/constants');

const editProfile = async (loggedInUser, updates) => {
  Object.keys(updates).forEach((key) => {
    loggedInUser[key] = updates[key];
  });

  await loggedInUser.save();
  return loggedInUser;
};

const getReceivedRequests = async (loggedInUserId) =>
  ConnectionRequest.find({
    toUserId: loggedInUserId,
    status: 'interested',
  }).populate('fromUserId', USER_SAFE_DATA);

const getConnections = async (loggedInUserId) => {
  const connectionRequests = await ConnectionRequest.find({
    $or: [
      { fromUserId: loggedInUserId, status: 'accepted' },
      { toUserId: loggedInUserId, status: 'accepted' },
    ],
  })
    .populate('fromUserId', USER_SAFE_DATA)
    .populate('toUserId', USER_SAFE_DATA);

  return connectionRequests.map((row) => {
    if (row.fromUserId._id.toString() === loggedInUserId.toString()) {
      return row.toUserId;
    }
    return row.fromUserId;
  });
};

const getFeed = async (loggedInUser, page = 1, limit = 10) => {
  const cappedLimit = limit > 50 ? 50 : limit;
  const skip = (page - 1) * cappedLimit;

  const connectionRequests = await ConnectionRequest.find({
    $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
  }).select('fromUserId toUserId');

  const hideUsersFromFeed = new Set();
  connectionRequests.forEach((request) => {
    hideUsersFromFeed.add(request.fromUserId.toString());
    hideUsersFromFeed.add(request.toUserId.toString());
  });

  return User.find({
    $and: [{ _id: { $nin: Array.from(hideUsersFromFeed) } }, { _id: { $ne: loggedInUser._id } }],
  })
    .select(USER_SAFE_DATA)
    .skip(skip)
    .limit(cappedLimit);
};

module.exports = {
  editProfile,
  getReceivedRequests,
  getConnections,
  getFeed,
};
