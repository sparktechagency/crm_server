/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import { emailVerifyHtml } from '../../../shared/html/emailVerifyHtml';
import { forgotPasswordHtml } from '../../../shared/html/forgotPasswordHtml';
import { USER_STATUS } from '../../constant';
import AppError from '../../utils/AppError';
import { decodeToken } from '../../utils/decodeToken';
import generateToken from '../../utils/generateToken';
import { isMatchedPassword } from '../../utils/matchPassword';
import { OtpService } from '../otp/otp.service';
import { TUser } from '../user/user.interface';
import User from '../user/user.model';

const loginUser = async (
  payload: Pick<TUser, 'email' | 'password'>,
) => {
  const { email, password } = payload;
  // Step 1: Find user with password
  const user = await User.findOne({ email }).select('+password');
  const userWithoutPassword = await User.findOne({ email }).select('-password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // Step 2: Validate user status
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  if (user.status === USER_STATUS.blocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  // Step 3: Check password
  const isPasswordValid = await isMatchedPassword(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password not matched!');
  }

  // Step 4: Generate token
  const tokenGenerate = generateToken(
    { ...(userWithoutPassword as any)._doc },
    config.jwt.access_token as Secret,
    config.jwt.access_expires_in as string,
  );

  return { accessToken: tokenGenerate };
};

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const tokenGenerate = generateToken(
    { user },
    config.jwt.forgot_password_token as Secret,
    config.jwt.forgot_password_expires_in as string,
  );

  const checkOtpExist = await OtpService.checkOtpByEmail(email);
  if (checkOtpExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Otp already exist');
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  const emailBody = {
    email: email,
    html: forgotPasswordHtml('Forgot Password', otp),
  };

  const otpExpiryTime = parseInt(config.otp_expire_in as string) || 1;

  await OtpService.sendOTP(
    emailBody,
    otpExpiryTime,
    'email',
    'forget-password',
    otp,
  );
  return { forgotPasswordToken: tokenGenerate };
};

const verifyOtp = async (token: string, otp: { otp: number }) => {
  const decodedUser = decodeToken(
    token,
    config.jwt.forgot_password_token as Secret,
  ) as JwtPayload;

  if (!decodedUser) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }

  const checkOtpExist = await OtpService.checkOtpByEmail(
    decodedUser.user.email,
  );

  if (!checkOtpExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Otp doesn't exist");
  }

  const otpVerify = await OtpService.verifyOTP(
    otp.otp,
    checkOtpExist?._id.toString(),
  );

  if (!otpVerify) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Otp not matched');
  }

  await OtpService.deleteOtpById(checkOtpExist?._id.toString());
  const tokenGenerate = generateToken(
    decodedUser.user,
    config.jwt.reset_password_token as Secret,
    config.jwt.reset_password_expires_in as string,
  );
  return { resetPasswordToken: tokenGenerate };
};

const resetPassword = async (
  token: string,
  payload: { confirmPassword: string; password: string },
) => {
  const decodedUser = decodeToken(
    token,
    config.jwt.reset_password_token as Secret,
  ) as any;

  if (!decodedUser) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }

  const user = await User.findOne({ email: decodedUser?.email }).select(
    '+password',
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  user.password = payload.password;
  await user.save();
  return true;
};

const changePassword = async (
  token: string,
  payload: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  },
) => {
  const decodedUser = decodeToken(
    token,
    config.jwt.access_token as Secret,
  ) as JwtPayload;

  if (!decodedUser) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }

  const user = await User.findOne({ email: decodedUser.email }).select(
    '+password',
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const matchPassword = await isMatchedPassword(
    payload.oldPassword,
    user?.password,
  );

  if (!matchPassword) {
    throw new AppError(httpStatus.FORBIDDEN, 'password not matched');
  }

  user.password = payload.newPassword;

  await user.save();
  return true;
};

const resendOtp = async (
  token: string,
  payload: { email?: string; purpose: string },
) => {
  const decodedUser = decodeToken(
    token,
    payload.purpose === 'email-verification'
      ? (config.jwt.sing_up_token as Secret)
      : (config.jwt.forgot_password_token as Secret),
  ) as JwtPayload;

  const otp = Math.floor(100000 + Math.random() * 900000);

  const emailBody = {
    email:
      payload.purpose === 'email-verification'
        ? decodedUser.email
        : decodedUser.user.email,
    html:
      payload.purpose === 'email-verification'
        ? emailVerifyHtml('Email Verification', otp)
        : forgotPasswordHtml('Forget Password', otp),
  };

  const otpExpiryTime = parseInt(config.otp_expire_in as string) || 3;

  await OtpService.sendOTP(
    emailBody,
    otpExpiryTime,
    'email',
    payload.purpose,
    otp,
  );
};

export const AuthService = {
  resendOtp,
  loginUser,
  verifyOtp,
  resetPassword,
  forgotPassword,
  changePassword,
};
