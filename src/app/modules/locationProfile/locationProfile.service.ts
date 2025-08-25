import httpStatus from 'http-status';
import AppError from '../../utils/AppError';
import User from '../user/user.model';
import { TLocationProfile } from './locationProfile.interface';
import LocationProfile from './locationProfile.model';
import { TAuthUser } from '../../interface/authUser';
import { cacheData, deleteCache, getCachedData } from '../../../redis';
import { minuteToSecond } from '../../utils/minitToSecond';
import generateUID from '../../utils/generateUID';
import QueryBuilder from '../../QueryBuilder/queryBuilder';
import { TMeta } from '../../utils/sendResponse';

const createLocationProfile = async (
  payload: TLocationProfile,
  user: TAuthUser,
) => {
  const cacheKey = `location_profile-${user._id}`;

  const findHub = await User.findOne({
    uid: payload.hubUid,
  });

  if (!findHub) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Hub not found');
  }

  const createLocationProfile = await LocationProfile.create({
    ...payload,
    uid: await generateUID(LocationProfile, 'LP'),
    hubId: findHub._id,
  });

  await deleteCache(cacheKey);
  return createLocationProfile;
};

const getAllLocationProfile = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  const cacheKey = `location_profile-${user._id}`;
  const cached = await getCachedData<{
    meta: TMeta;
    result: TLocationProfile[];
  }>(cacheKey);
  if (cached) {
    console.log('🚀 Serving from Redis cache');
    return cached;
  }
  const locationQuery = new QueryBuilder(
    LocationProfile.find({}).populate('hubId'),
    query,
  )
    .search(['locationName', 'email'])
    .sort()
    .paginate();

  const [result, meta] = await Promise.all([
    locationQuery.queryModel,
    locationQuery.countTotal(),
  ]);

  console.log(result, 'result');
  const time = minuteToSecond(5);

  await cacheData(cacheKey, { meta, result }, time);
  return { meta, result };
};

const updateLocationProfile = async (
  id: string,
  payload: Partial<TLocationProfile>,
  user: TAuthUser,
) => {
  const cacheKey = `location_profile-${user._id}`;

  let findHub;
  if (payload.hubUid) {
    findHub = await User.findOne({
      uid: payload.hubUid,
    });
    if (!findHub) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Hub not found');
    }
  }

  const updateLocationProfile = await LocationProfile.findOneAndUpdate(
    { _id: id },
    {
      ...payload,
      hubId: findHub?._id,
    },
    { new: true },
  );

  await deleteCache(cacheKey);
  return updateLocationProfile;
};

const deleteLocationProfile = async (id: string, user: TAuthUser) => {
  const cacheKey = `location_profile-${user._id}`;

  const result = await LocationProfile.findByIdAndDelete(id);

  await deleteCache(cacheKey);
  return result;
};

export const LocationProfileService = {
  createLocationProfile,
  getAllLocationProfile,
  updateLocationProfile,
  deleteLocationProfile,
};
