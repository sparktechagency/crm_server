/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { cacheData, deleteCache, getCachedData } from '../../../redis';
import { passwordSend } from '../../../shared/html/passwordSendingHtml';
import QueryBuilder from '../../QueryBuilder/queryBuilder';
import { USER_ROLE } from '../../constant';
import { TAuthUser } from '../../interface/authUser';
import AppError from '../../utils/AppError';
import generateUID from '../../utils/generateUID';
import sendMail from '../../utils/sendMail';
import User from './user.model';
import { findUserWithUid, uidForUserRole } from './user.utils';
import { minuteToSecond } from '../../utils/minitToSecond';
import { TUser } from './user.interface';

const createUsers = async (payload: Record<string, unknown>) => {
  const generatePassword = Math.floor(10000000 + Math.random() * 90000000);
  const { email, phoneNumber, role, spokeUid, hubUid, ...rest } = payload;

  const uidKey = uidForUserRole(payload.role as string);
  const uid = hubUid ? hubUid : spokeUid;
  const data = await findUserWithUid(uid as string);

  const userData = {
    uid: await generateUID(User, uidKey),
    password: generatePassword,
    email,
    ...data,
    phoneNumber,
    role,
    hubUid,
    spokeUid,
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

  const cacheKey = `getAllDrivers-${authUser._id}`;
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

const getUsersBaseOnRole = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  const { role } = query;
  const cacheKey = `users::${user._id}`;
  // Try to fetch from Redis cache first
  const cached = await getCachedData<{ result: TUser[] }>(cacheKey);
  if (cached) {
    console.log('🚀 Serving from Redis cache');
    return cached;
  }

  // Build match stage dynamically
  const matchStage: Record<string, unknown> =
    user.role === USER_ROLE.hubManager
      ? { hubId: user._id }
      : user.role === USER_ROLE.spokeManager
        ? { spokeId: user._id }
        : {};

  const userQuery = new QueryBuilder(User.find({ ...matchStage, role }), query)
    .search(['customFields.name', 'email', 'phoneNumber'])
    .sort()
    .paginate()
    .filter(['status']);

  // Run both queries in parallel (faster than awaiting sequentially)
  const [result, meta] = await Promise.all([
    userQuery.queryModel,
    userQuery.countTotal(),
  ]);

  const time = minuteToSecond(5);
  await cacheData(cacheKey, { meta, result }, time);

  return { meta, result };
};

const updateUsers = async (id: string, payload: Record<string, unknown>) => {
  const { email, phoneNumber, ...rest } = payload;

  const userData = {
    email,
    phoneNumber,
    customFields: {
      ...rest,
    },
  };

  const result = await User.findByIdAndUpdate(id, userData, { new: true });
  return result;
};

const assignSpoke = async (payload: {
  spokeUid: string;
  fieldOfficerId: string;
}) => {
  const spokeManager = await User.findOne({ uid: payload.spokeUid });
  if (!spokeManager) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Spoke Manager not found with this uid',
    );
  }

  const result = await User.findOneAndUpdate(
    { _id: payload.fieldOfficerId },
    {
      spokeUid: payload.spokeUid,
      spokeId: spokeManager._id,
      isAssignSpoke: true,
    },
    { new: true },
  );
  return result;
};

export const UserService = {
  updateUserActions,
  createUsers,
  getUsersBaseOnRole,
  updateUsers,
  assignSpoke,
};
