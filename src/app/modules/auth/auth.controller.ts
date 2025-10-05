import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const { accessToken, user } = await AuthService.loginUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in successfully',
    data: {
      accessToken,
      user,
    },
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await AuthService.forgotPassword(email);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Email sent successfully',
    data: result,
  });
});

const verifyOtp = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const otp = req.body;
  const result = await AuthService.verifyOtp(token as string, otp);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Otp verified successfully',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new Error('Token not found');
  }
  const result = await AuthService.resetPassword(token as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Password reset successfully',
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new Error('Token not found');
  }
  const result = await AuthService.changePassword(token as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Password changed successfully',
    data: result,
  });
});

const resendOtp = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await AuthService.resendOtp(token as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Otp sent successfully',
    data: result,
  });
});

const twoFactorLogin = catchAsync(async (req, res) => {
  const result = await AuthService.twoFactorLogin(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in successfully',
    data: result,
  });
});

const twoFactorRegister = catchAsync(async (req, res) => {
  const result = await AuthService.twoFactorRegister(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User registered successfully',
    data: result,
  });
});

export const AuthController = {
  resendOtp,
  verifyOtp,
  loginUser,
  resetPassword,
  changePassword,
  forgotPassword,
  twoFactorLogin,
  twoFactorRegister,
};
