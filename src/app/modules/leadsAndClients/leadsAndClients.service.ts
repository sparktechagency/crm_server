import mongoose from 'mongoose';
import { cacheData, deleteCache, getCachedData } from '../../../redis';
import { TAuthUser } from '../../interface/authUser';
import QueryBuilder from '../../QueryBuilder/queryBuilder';
import generateUID from '../../utils/generateUID';
import { minuteToSecond } from '../../utils/minitToSecond';
import { TMeta } from '../../utils/sendResponse';
import {
  IReturnTypeLeadsAndClients,
  LeadsAndClients,
} from './leadsAndClients.interface';
import LeadsAndClientsModel from './leadsAndClients.model';
import LoanApplication from '../loanApplication/loanApplication.model';
import AggregationQueryBuilder from '../../QueryBuilder/aggregationBuilder';

const createLeadsAndClients = async (
  payload: Record<string, unknown>,
  user: TAuthUser,
  session?: mongoose.ClientSession,
): Promise<LeadsAndClients> => {
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

  let result: LeadsAndClients;

  if (session) {
    const docs = await LeadsAndClientsModel.create([leadClientData], {
      session,
    });
    result = docs[0] as LeadsAndClients;
  } else {
    const doc = await LeadsAndClientsModel.create(leadClientData);
    result = doc as LeadsAndClients;
  }

  await deleteCache(cacheKey);

  return result;
};

const getAllLeadsAndClients = async (
  user: TAuthUser,
  query: Record<string, unknown>,
): Promise<{ meta: TMeta; result: LeadsAndClients[] }> => {
  const cacheKey = `leadsAndClients::${user._id}`;

  // Try to fetch from Redis cache first
  const cached = await getCachedData<{
    meta: TMeta;
    result: LeadsAndClients[];
  }>(cacheKey);
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
): Promise<LeadsAndClients | null> => {
  const findLeads = await LeadsAndClientsModel.findById(id);

  if (!findLeads) {
    throw new Error('Leads not found');
  }

  const cacheKey = `leadsAndClients::${user._id}`;
  const { email, phoneNumber, ...rest } = payload;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateQuery: Record<string, any> = {};
  for (const key in rest) {
    updateQuery[`customFields.${key}`] = rest[key];
  }

  const leadClientData = {
    email,
    phoneNumber,
    ...updateQuery,
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

const deleteLeadsAndClient = async (
  id: string,
  user: TAuthUser,
): Promise<LeadsAndClients | null> => {
  const cacheKey = `leadsAndClients::${user._id}`;

  const result = await LeadsAndClientsModel.findOneAndDelete({
    _id: id,
    fieldOfficerId: user._id,
    isClient: false,
  });

  // Remove Redis cache
  await deleteCache(cacheKey);
  return result;
};

const getLeadsUsingUId = (
  uid: string,
): Promise<IReturnTypeLeadsAndClients | null> => {
  return LeadsAndClientsModel.findOne({ uid });
};

const getAllClients = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  const clientQuery = new AggregationQueryBuilder(query);

  const [result, meta] = await Promise.all([
    clientQuery
      .customPipeline([
        {
          $match: {
            hubId: new mongoose.Types.ObjectId(String(user.hubId)),
            spokeId: new mongoose.Types.ObjectId(String(user.spokeId)),
            fieldOfficerId: new mongoose.Types.ObjectId(String(user._id)),
          },
        },
        {
          $lookup: {
            from: 'leadsandclients',
            localField: 'clientId',
            foreignField: '_id',
            as: 'client',
          },
        },
        {
          $unwind: '$client',
        },
      ])
      .search([
        'client.customFields.name',
        'client.email',
        'client.phoneNumber',
      ])
      .sort()
      .paginate()
      .execute(LoanApplication),

    clientQuery.countTotal(LoanApplication),
  ]);

  return { meta, result };
};

export const LeadsAndClientsService = {
  createLeadsAndClients,
  getAllLeadsAndClients,
  updateLeadsOrClients,
  deleteLeadsAndClient,
  getLeadsUsingUId,
  getAllClients,
};
