const mongoose = require('mongoose');
const { User, ConnectionRequest } = require('../models');
const { USER_SAFE_DATA } = require('../utils/constants');

const editProfile = async (loggedInUser, updates) => {
  const allowedUpdates = Object.keys(updates);
  allowedUpdates.forEach((key) => {
    // eslint-disable-next-line no-param-reassign
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
    .populate('fromUserId', `${USER_SAFE_DATA} lastSeen`)
    .populate('toUserId', `${USER_SAFE_DATA} lastSeen`);

  return connectionRequests.map((row) => {
    if (row.fromUserId._id.toString() === loggedInUserId.toString()) {
      return row.toUserId;
    }
    return row.fromUserId;
  });
};

/**
 * Supports both offset pagination (page/limit) and cursor-based pagination.
 * Cursor-based: pass cursor = last document _id returned. This avoids the
 * skip cost and prevents duplicate/missing results on live feeds.
 *
 * Returns: { users, nextCursor, hasMore }
 */
// eslint-disable-next-line no-unused-vars
const getFeed = async (loggedInUser, _page = 1, limit = 10, cursor = null) => {
  const cappedLimit = Math.min(limit, 50);

  const connectionRequests = await ConnectionRequest.find({
    $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
  }).select('fromUserId toUserId');

  const hideUsersFromFeed = new Set();
  hideUsersFromFeed.add(loggedInUser._id.toString());
  connectionRequests.forEach((request) => {
    hideUsersFromFeed.add(request.fromUserId.toString());
    hideUsersFromFeed.add(request.toUserId.toString());
  });

  const baseFilter = {
    _id: { $nin: Array.from(hideUsersFromFeed) },
    isBanned: { $ne: true },
  };

  // Cursor-based: $gt on _id (ObjectId is time-sortable)
  if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
    baseFilter._id.$gt = new mongoose.Types.ObjectId(cursor);
    // Remove $nin conflict — rebuild properly
    baseFilter._id = {
      $gt: new mongoose.Types.ObjectId(cursor),
      $nin: Array.from(hideUsersFromFeed),
    };
  }

  const users = await User.find(baseFilter)
    .select(`${USER_SAFE_DATA} lastSeen`)
    .sort({ _id: 1 })
    .limit(cappedLimit + 1); // fetch one extra to determine hasMore

  const hasMore = users.length > cappedLimit;
  const pageUsers = hasMore ? users.slice(0, cappedLimit) : users;
  const nextCursor = hasMore ? pageUsers[pageUsers.length - 1]._id.toString() : null;

  return { users: pageUsers, nextCursor, hasMore };
};

/** Update the lastSeen timestamp for a user (used by heartbeat endpoint) */
const updateLastSeen = async (userId) => {
  await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
};

module.exports = {
  editProfile,
  getReceivedRequests,
  getConnections,
  getFeed,
  updateLastSeen,
};
