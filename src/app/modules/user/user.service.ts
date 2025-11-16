/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { passwordSend } from '../../../shared/html/passwordSendingHtml';
import sendNotification from '../../../socket/sendNotification';
import AggregationQueryBuilder from '../../QueryBuilder/aggregationBuilder';
import { USER_ROLE } from '../../constant';
import { TAuthUser } from '../../interface/authUser';
import AppError from '../../utils/AppError';
import { filteringCalculation } from '../../utils/filteringCalculation';
import sendMail from '../../utils/sendMail';
import LocationSpoke from '../locationSpoke/location.model';
import { NOTIFICATION_TYPE } from '../notification/notification.interface';
import User from './user.model';

const createUsers = async (
  payload: Record<string, unknown>,
  user: TAuthUser,
) => {
  const generatePassword = Math.floor(10000000 + Math.random() * 90000000);
  const { email, phoneNumber, role, uid, locationProfileHubId, locationSpokeId, ...rest } = payload;

  const userData = {
    uid: uid,
    password: generatePassword,
    email,
    phoneNumber,
    role,
    locationProfileHubId,
    locationSpokeId,
    customFields: {
      ...rest,
    },
  };

  await sendMail({
    email: payload.email as string,
    subject: 'Change Your Password Please',
    html: passwordSend(generatePassword, userData.uid as string),
  });

  const createUser = await User.create(userData);

  let receiverIds: any;
  // if (role === USER_ROLE.fieldOfficer) {
  //   receiverIds = [user.adminId, data?.hubId, data?.spokeId];
  // } else if (role === USER_ROLE.spokeManager) {
  //   receiverIds = [user.adminId, data.hubId];
  // } else if (role === USER_ROLE.hubManager) {
  //   receiverIds = [user.adminId];
  // }

  if (user.role === USER_ROLE.admin) {
    return createUser;
  }

  await Promise.all(
    receiverIds.map(async (id: string) => {
      const notificationData = {
        type: NOTIFICATION_TYPE.NEW_LEAD_ADDED,
        senderId: user._id,
        receiverId: id,
        linkId: createUser._id,
        role: user.role,
        message: `${user.customFields.name} has added a new lead`,
      };

      await sendNotification(user, notificationData);
    }),
  );
  return createUser;
};

const updateUserActions = async (
  id: string,
  action: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  authUser: TAuthUser,
): Promise<any> => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.status === action) {
    throw new AppError(httpStatus.BAD_REQUEST, `User already ${action}`);
  }

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

  return user;
};

const getUsersBaseOnRole = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  const { role } = query;

  const { filtering } = query;

  const filteringData = filteringCalculation(filtering as string);

  const matchStage: Record<string, unknown> =
    user.role === USER_ROLE.hubManager
      ? { locationProfileHubId: new mongoose.Types.ObjectId(String(user.locationProfileHubId)) }
      : user.role === USER_ROLE.spokeManager
        ? { locationSpokeId: new mongoose.Types.ObjectId(String(user.locationSpokeId)) }
        : {};
  

  const userQuery = new AggregationQueryBuilder(query);

  const [result, meta] = await Promise.all([
    userQuery
      .customPipeline([
        {
          $match: {
            ...matchStage,
            ...filteringData,
            role,
          },
        },
      ])
      .search(['customFields.name', 'email', 'phoneNumber'])
      .sort()
      .paginate()
      .filter(['status', 'role'])
      .execute(User),

    userQuery.countTotal(User),
  ]);

  return { meta, result };
};

const updateUsers = async (id: string, payload: Record<string, unknown>) => {
  const { email, phoneNumber, ...rest } = payload;

  const updateQuery: Record<string, any> = {};

  // Update only custom fields
  for (const key in rest) {
    updateQuery[`customFields.${key}`] = rest[key];
  }

  // Build final update object safely
  const userData: Record<string, any> = { ...updateQuery };

  if (email !== undefined) userData.email = email;
  if (phoneNumber !== undefined) userData.phoneNumber = phoneNumber;

  const result = await User.findByIdAndUpdate(id, userData, { new: true });
  return result;
};

const assignSpoke = async (payload: {
  locationSpokeId: string;
  fieldOfficerId: string;
}) => {
  const spokeLocation = await LocationSpoke.findOne({ _id: payload.locationSpokeId });
  if (!spokeLocation) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Spoke Location not found with this uid',
    );
  }

  const result = await User.findOneAndUpdate(
    { _id: payload.fieldOfficerId },
    {
      locationSpokeId: payload.locationSpokeId,
      isAssignSpoke: true,
    },
    { new: true },
  );
  return result;
};

const deleteUsers = async (id: string, user: TAuthUser) => {
  const result = await User.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};

const getAllManagers = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  console.log('query', query);
  const managersQuery = new AggregationQueryBuilder(query);

  const { filtering } = query;

  const filteringData = filteringCalculation(filtering as string);

  const [result, meta] = await Promise.all([
    managersQuery
      .customPipeline([
        {
          $match: {
            $or: [
              { role: USER_ROLE.hubManager },
              { role: USER_ROLE.spokeManager },
            ],
            ...filteringData,
          },
        },
      ])
      .search(['customFields.name', 'email', 'phoneNumber'])
      .sort()
      .paginate()
      .filter(['status', 'role'])
      .execute(User),

    managersQuery.countTotal(User),
  ]);

  return { meta, result };
};

const getFieldOfficerRecord = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  return user;
};

const getProfile = async (user: TAuthUser) => {
  const result = await User.findById(user._id);

  return result;
};

const updateProfile = async (
  user: TAuthUser,
  payload: Record<string, unknown>,
) => {
  const { phoneNumber, ...rest } = payload;

  const updateQuery: Record<string, any> = {};
  for (const key in rest) {
    updateQuery[`customFields.${key}`] = rest[key];
  }

  const userData = {
    phoneNumber,
    ...updateQuery,
  };

  const result = await User.findByIdAndUpdate(user._id, userData, {
    new: true,
  });
  return result;
};

export const UserService = {
  updateUserActions,
  createUsers,
  getUsersBaseOnRole,
  updateUsers,
  assignSpoke,
  deleteUsers,
  getAllManagers,
  getFieldOfficerRecord,
  getProfile,
  updateProfile,
};
