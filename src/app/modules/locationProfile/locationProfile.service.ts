import httpStatus from 'http-status';
import { TAuthUser } from '../../interface/authUser';
import QueryBuilder from '../../QueryBuilder/queryBuilder';
import AppError from '../../utils/AppError';
import generateUID from '../../utils/generateUID';
import User from '../user/user.model';
import { TLocationProfile } from './locationProfile.interface';
import LocationProfile from './locationProfile.model';

const createLocationProfile = async (
  payload: TLocationProfile,
  user: TAuthUser,
) => {
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

  return createLocationProfile;
};

const getAllLocationProfile = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
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

  return { meta, result };
};

const updateLocationProfile = async (
  id: string,
  payload: Partial<TLocationProfile>,
  user: TAuthUser,
) => {
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

  return updateLocationProfile;
};

const deleteLocationProfile = async (id: string, user: TAuthUser) => {
  const result = await LocationProfile.findByIdAndDelete(id);

  return result;
};

export const LocationProfileService = {
  createLocationProfile,
  getAllLocationProfile,
  updateLocationProfile,
  deleteLocationProfile,
};
