const catchAsync = require('../utils/catchAsync');
const { requestService } = require('../services');

const sendRequest = catchAsync(async (req, res) => {
  const fromUserId = req.user._id;
  const { touserId: toUserId, status } = req.params;

  const data = await requestService.sendConnectionRequest(fromUserId, toUserId, status);

  res.json({ message: `Connection request marked as '${status}'.`, data });
});

const reviewRequest = catchAsync(async (req, res) => {
  const loggedInUser = req.user;
  const { status, requestId } = req.params;

  const data = await requestService.reviewConnectionRequest(loggedInUser._id, requestId, status);

  res.json({ message: `Connection request ${status}`, data });
});

module.exports = {
  sendRequest,
  reviewRequest,
};
