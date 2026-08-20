const { User, ConnectionRequest } = require('../models');
const Payment = require('../models/payment.model');

/**
 * Total revenue from captured Razorpay payments (amount is stored in paise).
 * Returns rupees (amount / 100).
 */
const getTotalRevenue = async () => {
  const result = await Payment.aggregate([
    { $match: { status: 'captured' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  return result.length > 0 ? result[0].total / 100 : 0;
};

/**
 * Daily Active Users — users who sent a heartbeat (lastSeen) in the last 24 h.
 */
const getDailyActiveUsers = async () => {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return User.countDocuments({ lastSeen: { $gte: since } });
};

/**
 * Total accepted connections (matches).
 */
const getTotalMatches = async () => ConnectionRequest.countDocuments({ status: 'accepted' });

/**
 * Revenue per day for the last `days` days — for charting.
 */
const getRevenueChart = async (days = 30) => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return Payment.aggregate([
    { $match: { status: 'captured', createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { date: '$_id', revenue: { $divide: ['$revenue', 100] }, count: 1, _id: 0 } },
  ]);
};

/**
 * DAU chart — count of users who were seen on each day for the last `days` days.
 */
const getDauChart = async (days = 30) => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return User.aggregate([
    { $match: { lastSeen: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$lastSeen' } },
        activeUsers: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { date: '$_id', activeUsers: 1, _id: 0 } },
  ]);
};

/**
 * Paginated list of all users for admin user-management table.
 */
const listUsers = async (page = 1, limit = 20, search = '') => {
  const cappedLimit = Math.min(limit, 100);
  const skip = (page - 1) * cappedLimit;

  const filter = search
    ? {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { emailId: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('firstName lastName emailId photoUrl isPremium isAdmin isBanned lastSeen createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(cappedLimit),
    User.countDocuments(filter),
  ]);

  return { users, total, page, limit: cappedLimit, totalPages: Math.ceil(total / cappedLimit) };
};

/**
 * Ban or unban a user. Returns the updated user.
 */
const setUserBan = async (userId, isBanned) => {
  const user = await User.findByIdAndUpdate(userId, { isBanned }, { new: true }).select(
    'firstName lastName emailId isBanned'
  );
  return user;
};

/**
 * Reported profiles (placeholder — extend with a Report model later).
 */
const getReportedProfiles = async () => {
  // For now returns banned users as a proxy until a Report model is added
  return User.find({ isBanned: true }).select('firstName lastName emailId photoUrl isBanned createdAt');
};

module.exports = {
  getTotalRevenue,
  getDailyActiveUsers,
  getTotalMatches,
  getRevenueChart,
  getDauChart,
  listUsers,
  setUserBan,
  getReportedProfiles,
};
