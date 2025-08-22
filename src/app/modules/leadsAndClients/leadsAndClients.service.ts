import { cacheData, deleteCache, getCachedData } from '../../../redis';
import { TAuthUser } from '../../interface/authUser';
import QueryBuilder from '../../QueryBuilder/queryBuilder';
import generateUID from '../../utils/generateUID';
import { minuteToSecond } from '../../utils/minitToSecond';
import { LeadsAndClients } from './leadsAndClients.interface';
import LeadsAndClientsModel from './leadsAndClients.model';

const createLeadsAndClients = async (
  payload: Record<string, unknown>,
  user: TAuthUser,
) => {
  const cacheKey = `leadsAndClients::${user._id}`;
  const { email, phoneNumber, ...rest } = payload;

  const leadClientData = {
    uid: await generateUID(LeadsAndClientsModel, 'ID'),
    email,
    phoneNumber,
    hubId: user.hubId,
    spokeId: user.spokeId,
    fieldOfficerId: user._id,
    customFields: {
      ...rest,
    },
  };

  const result = await LeadsAndClientsModel.create(leadClientData);

  // Remove Redis cache
  await deleteCache(cacheKey);

  return result;
};

const getAllLeadsAndClients = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  const cacheKey = `leadsAndClients::${user._id}`;
  // Try to fetch from Redis cache first
  const cached = await getCachedData<{ result: LeadsAndClients[] }>(cacheKey);
  if (cached) {
    console.log('🚀 Serving from Redis cache');
    return cached;
  }

  const leadsQuery = new QueryBuilder(
    LeadsAndClientsModel.find({
      fieldOfficerId: user._id,
    }),
    query,
  )
    .search(['customFields.name', 'email', 'phoneNumber'])
    .sort()
    .paginate()
    .filter(['status']);

  const [result, meta] = await Promise.all([
    leadsQuery.queryModel,
    leadsQuery.countTotal(),
  ]);

  const time = minuteToSecond(10);
  // Store in Redis cache
  await cacheData(cacheKey, { meta, result }, time);

  return { meta, result };
};

const updateLeadsOrClients = async (
  id: string,
  payload: Record<string, unknown>,
  user: TAuthUser,
) => {
  const cacheKey = `leadsAndClients::${user._id}`;
  const { email, phoneNumber, ...rest } = payload;

  const leadClientData = {
    email,
    phoneNumber,
    customFields: {
      ...rest,
    },
  };

  const result = await LeadsAndClientsModel.findOneAndUpdate(
    { _id: id },
    leadClientData,
    { new: true },
  );

  // Remove Redis cache
  await deleteCache(cacheKey);
  return result;
};

export const LeadsAndClientsService = {
  createLeadsAndClients,
  getAllLeadsAndClients,
  updateLeadsOrClients,
};
