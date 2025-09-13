/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import sendNotification from '../../../socket/sendNotification';
import { USER_ROLE } from '../../constant';
import { TAuthUser } from '../../interface/authUser';
import AggregationQueryBuilder from '../../QueryBuilder/aggregationBuilder';
import AppError from '../../utils/AppError';
import generateUID from '../../utils/generateUID';
import { TMeta } from '../../utils/sendResponse';
import { transactionWrapper } from '../../utils/transactionWrapper';
import LoanApplication from '../loanApplication/loanApplication.model';
import { NOTIFICATION_TYPE } from '../notification/notification.interface';
import {
  IReturnTypeLeadsAndClients,
  LeadsAndClients,
} from './leadsAndClients.interface';
import LeadsAndClientsModel from './leadsAndClients.model';
import { filteringCalculation } from '../../utils/filteringCalculation';

const createLeadsAndClients = async (
  payload: Record<string, unknown>,
  user: TAuthUser,
  session?: mongoose.ClientSession,
): Promise<LeadsAndClients> => {
  const { email, phoneNumber, ...rest } = payload;

  const leadClientData = {
    uid: await generateUID(LeadsAndClientsModel as any, 'ID'),
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

  const receiverId = [user.hubId, user.spokeId, user.adminId];

  // Send notifications and wait for all to be completed
  await Promise.all(
    receiverId.map(async (id) => {
      const notificationData = {
        type: NOTIFICATION_TYPE.NEW_LEAD_ADDED,
        senderId: user._id,
        receiverId: id,
        linkId: result._id,
        role: user.role,
        message: `${user.customFields.name} has added a new lead`,
      };

      await sendNotification(user, notificationData);
    }),
  );

  return result;
};

const getAllLeadsAndClients = async (
  user: TAuthUser,
  query: Record<string, unknown>,
): Promise<{ meta: TMeta; result: LeadsAndClients[] }> => {
  const { filtering } = query;

  const filteringData = filteringCalculation(filtering as string);

  let matchStage = {};
  if (user.role === USER_ROLE.fieldOfficer) {
    matchStage = {
      fieldOfficerId: new mongoose.Types.ObjectId(String(user._id)),
    };
  } else if (user.role === USER_ROLE.hubManager) {
    matchStage = {
      hubId: new mongoose.Types.ObjectId(String(user._id)),
      isClient: false,
    };
  } else if (user.role === USER_ROLE.admin) {
    matchStage = {
      isClient: false,
    };
  }

  const leadsQuery = new AggregationQueryBuilder(query);

  const [result, meta] = await Promise.all([
    leadsQuery
      .customPipeline([
        {
          $match: {
            ...matchStage,
            ...filteringData,
          },
        },
      ])
      .search(['customFields.name', 'email', 'phoneNumber'])
      .sort()
      .paginate()
      .execute(LeadsAndClientsModel),
    leadsQuery.countTotal(LeadsAndClientsModel),
  ]);

  return { meta, result };
};

const updateLeadsOrClients = async (
  id: string,
  payload: Record<string, unknown>,
  user?: TAuthUser,
): Promise<LeadsAndClients | null> => {
  const findLeads = await LeadsAndClientsModel.findById(id);

  if (!findLeads) {
    throw new Error('Leads not found');
  }

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

  return result;
};

const deleteLeadsAndClient = async (
  id: string,
  user: TAuthUser,
): Promise<LeadsAndClients | null> => {
  let matchStage = {};

  if (user.role === USER_ROLE.fieldOfficer) {
    matchStage = {
      fieldOfficerId: user._id,
    };
  } else if (user.role === USER_ROLE.hubManager) {
    matchStage = {
      hubId: user._id,
    };
  }

  const result = await LeadsAndClientsModel.findOneAndDelete({
    _id: id,
    ...matchStage,
    isClient: false,
  });

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

  const { filtering } = query;

  const filteringData = filteringCalculation(filtering as string);

  let matchStage = {};
  if (user.role === USER_ROLE.fieldOfficer) {
    matchStage = {
      hubId: new mongoose.Types.ObjectId(String(user.hubId)),
      spokeId: new mongoose.Types.ObjectId(String(user.spokeId)),
      fieldOfficerId: new mongoose.Types.ObjectId(String(user._id)),
    };
  } else if (user.role === USER_ROLE.hubManager) {
    matchStage = {
      hubId: new mongoose.Types.ObjectId(String(user._id)),
    };
  } else if (user.role === USER_ROLE.admin) {
    matchStage = {};
  }

  const [result, meta] = await Promise.all([
    clientQuery
      .customPipeline([
        {
          $match: {
            ...matchStage,
            ...filteringData,
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

const deleteClient = async (
  id: string,
  user: TAuthUser,
): Promise<LeadsAndClients | null> => {
  const result = transactionWrapper(async (session) => {
    const client = await LeadsAndClientsModel.findOneAndDelete(
      { _id: id },
      { session },
    );

    if (!client)
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Client not deleted try again',
      );
    await LoanApplication.deleteMany({ clientId: id }, { session });
    return client;
  });

  return result;
};

export const LeadsAndClientsService = {
  createLeadsAndClients,
  getAllLeadsAndClients,
  updateLeadsOrClients,
  deleteLeadsAndClient,
  getLeadsUsingUId,
  getAllClients,
  deleteClient,
};
