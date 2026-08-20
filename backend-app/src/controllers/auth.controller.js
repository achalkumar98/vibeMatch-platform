const catchAsync = require('../utils/catchAsync');
const { authService } = require('../services');

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
};

const signup = catchAsync(async (req, res) => {
  const { savedUser, token } = await authService.signup(req.body);

  res.cookie('token', token, {
    ...cookieOptions,
    expires: new Date(Date.now() + 8 * 3600000),
  });

  res.json({ message: 'User Added Successfully', data: savedUser });
});

const login = catchAsync(async (req, res) => {
  const { user, token } = await authService.login(req.body);

  res.cookie('token', token, {
    ...cookieOptions,
    expires: new Date(Date.now() + 8 * 3600000),
  });

  res.send(user);
});

const logout = catchAsync(async (req, res) => {
  res.cookie('token', '', {
    ...cookieOptions,
    expires: new Date(0),
  });

  res.status(200).json({ message: 'Logout successfully' });
});

module.exports = {
  signup,
  login,
  logout,
};
