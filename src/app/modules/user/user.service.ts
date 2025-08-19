/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { deleteCache } from '../../../redis';
import { TAuthUser } from '../../interface/authUser';
import AppError from '../../utils/AppError';
import generateUID from '../../utils/generateUID';
import User from './user.model';
import sendMail from '../../utils/sendMail';
import { passwordSend } from '../../../shared/html/passwordSendingHtml';
import { uidForUserRole } from './user.utils';

const createFieldOfficer = async (payload: Record<string, unknown>) => {
  const generatePassword = Math.floor(10000000 + Math.random() * 90000000);
  const { email, phoneNumber, role, ...rest } = payload;

  const uidKey = uidForUserRole(payload.role as string);

  const userData = {
    uid: await generateUID(User, uidKey),
    password: generatePassword,
    email,
    phoneNumber,
    role,
    customFields: {
      ...rest,
    },
  };

  await sendMail({
    email: payload.email as string,
    subject: 'Change Your Password Please',
    html: passwordSend(generatePassword),
  });


  const createUser = await User.create(userData);
  return createUser;

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
