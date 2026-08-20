const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const adminService = require('../services/admin.service');
const ApiError = require('../utils/ApiError');

/**
 * GET /admin/analytics
 * Returns headline metrics: total revenue, DAU, total matches, plus 30-day charts.
 */
const getAnalytics = catchAsync(async (req, res) => {
  const days = parseInt(req.query.days, 10) || 30;

  const [totalRevenue, dailyActiveUsers, totalMatches, revenueChart, dauChart] = await Promise.all([
    adminService.getTotalRevenue(),
    adminService.getDailyActiveUsers(),
    adminService.getTotalMatches(),
    adminService.getRevenueChart(days),
    adminService.getDauChart(days),
  ]);

  res.json({
    totalRevenue,
    dailyActiveUsers,
    totalMatches,
    revenueChart,
    dauChart,
  });
});

/**
 * GET /admin/users
 * Paginated user list with optional search query.
 */
const listUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const search = req.query.search || '';

  const data = await adminService.listUsers(page, limit, search);
  res.json(data);
});

/**
 * PATCH /admin/users/:userId/ban
 * Body: { isBanned: true|false }
 */
const banUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { isBanned } = req.body;

  if (typeof isBanned !== 'boolean') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'isBanned must be a boolean');
  }

  const user = await adminService.setUserBan(userId, isBanned);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  res.json({
    message: `User ${isBanned ? 'banned' : 'unbanned'} successfully`,
    data: user,
  });
});

/**
 * GET /admin/reported
 * Returns reported/banned profiles for review.
 */
const getReportedProfiles = catchAsync(async (req, res) => {
  const data = await adminService.getReportedProfiles();
  res.json({ data });
});

module.exports = {
  getAnalytics,
  listUsers,
  banUser,
  getReportedProfiles,
};
