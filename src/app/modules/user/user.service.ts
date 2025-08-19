/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { deleteCache } from '../../../redis';
import { TAuthUser } from '../../interface/authUser';
import AppError from '../../utils/AppError';
import generateUID from '../../utils/generateUID';
import User from './user.model';
import sendMail from '../../utils/sendMail';

const createFieldOfficer = async (payload: any) => {
  const generatePassword = Math.floor(10000000 + Math.random() * 90000000);

  const userData = {
    uid: await generateUID(User, 'FO'),
    password: generatePassword,
    customFields: {
      ...payload,
    },
  };

  await sendMail({
    email: payload.email,
    subject: 'Change Your Password Please',
    html: `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f7fa;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    <tr>
      <td style="padding: 40px; text-align: center;">
        <h1 style="color: #2c3e50; font-size: 24px; margin: 0 0 20px;">🔐 Password Reset Required</h1>
        <p style="font-size: 16px; color: #34495e; line-height: 1.6; margin: 0 0 30px;">
          Hello,<br><br>
          For security reasons, please change your password as soon as possible.
        </p>
        <p style="font-size: 18px; font-weight: bold; color: #e74c3c; margin: 0 0 30px;">
          Your temporary password is:<br>
          <span style="font-size: 22px; font-family: monospace;">${generatePassword}</span>
        </p>
        <p style="font-size: 14px; color: #7f8c8d; line-height: 1.6; margin: 30px 0 0;">
          If you did not request this change, you can safely ignore this email.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #f4f7fa; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
        <p style="font-size: 12px; color: #95a5a6; margin: 0;">
          &copy; 2025 Your Company. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`,
  });

  return userData;
};

const updateUserActions = async (
  id: string,
  action: string,
  authUser: TAuthUser,
): Promise<any> => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.status === action) {
    throw new AppError(httpStatus.BAD_REQUEST, `User already ${action}`);
  }

  const cacheKey = `getAllDrivers-${authUser.userId}`;
  switch (action) {
    case 'blocked':
      user.status = 'blocked';
      await user.save();
      break;
    case 'active':
      user.status = 'active';
      await user.save();
      break;
    default:
      break;
  }

  await deleteCache(cacheKey);

  return user;
};

export const UserService = {
  updateUserActions,
  createFieldOfficer,
};
