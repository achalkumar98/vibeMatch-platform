const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const getProfile = catchAsync(async (req, res) => {
  res.send(req.user);
});

const editProfile = catchAsync(async (req, res) => {
  const loggedInUser = await userService.editProfile(req.user, req.body);

  res.json({
    message: `${loggedInUser.firstName}, your profile was updated successfully.`,
    data: loggedInUser,
  });
});

const getReceivedRequests = catchAsync(async (req, res) => {
  const data = await userService.getReceivedRequests(req.user._id);
  res.json({ message: 'Data fetched successfully', data });
});

const getConnections = catchAsync(async (req, res) => {
  const data = await userService.getConnections(req.user._id);
  res.json({ data });
});

const getFeed = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const cursor = req.query.cursor || null;

  const result = await userService.getFeed(req.user, page, limit, cursor);
  res.send(result);
});

// POST /api/heartbeat — updates lastSeen to now, lightweight keep-alive
const heartbeat = catchAsync(async (req, res) => {
  await userService.updateLastSeen(req.user._id);
  res.json({ ok: true });
});

module.exports = {
  getProfile,
  editProfile,
  getReceivedRequests,
  getConnections,
  getFeed,
  heartbeat,
};
