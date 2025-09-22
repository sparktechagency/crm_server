import httpStatus from 'http-status';
import mongoose from 'mongoose';
import sendNotification from '../../../socket/sendNotification';
import { USER_ROLE } from '../../constant';
import { TAuthUser } from '../../interface/authUser';
import AggregationQueryBuilder from '../../QueryBuilder/aggregationBuilder';
import AppError from '../../utils/AppError';
import { IRepaymentsDates } from '../loanApplication/loanApplication.interface';
import LoanApplication from '../loanApplication/loanApplication.model';
import { NOTIFICATION_TYPE } from '../notification/notification.interface';
import { TRepayments } from './repayments.interface';
import Repayments from './repayments.model';
import { calculatePenalty, findClientAndLoan } from './repayments.utils';
import { filteringCalculation } from '../../utils/filteringCalculation';

const createRepayments = async (payload: TRepayments, user: TAuthUser) => {
  const { month, ...rest } = payload;

  const { client: findClient, loan: findLoan } = await findClientAndLoan(
    payload.clientUid,
    payload.loanUid,
  );

  const loanRepaymentsMonth = findLoan.repaymentsDates.find(
    (item) => item.month === payload.month,
  ) as IRepaymentsDates;

  const findRepayments = await Repayments.findOne({
    applicationId: findLoan._id,
    clientId: findClient._id,
    month: payload.month,
  });

  if (findRepayments) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Repayment already exists');
  }

  const penalty = calculatePenalty(loanRepaymentsMonth);

  const repaymentData = {
    month,
    customFields: {
      ...rest,
    },
    // installmentAmount: findLoan.installMentAmount,
    installmentAmount: payload.installmentAmount,
    clientId: findClient._id,
    applicationId: findLoan._id,
    hubId: user.hubId,
    spokeId: user.spokeId,
    penalty: 0,
    fieldOfficerId: user._id,
    status: penalty > 0 ? 'overdue' : 'paid',
    paidOn: new Date(),
    dueDate: new Date(loanRepaymentsMonth.dueDate),
  };

  // Create repayment and update loan status in a single batch operation
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [result, updateLoan] = await Promise.all([
    Repayments.create(repaymentData),
    LoanApplication.findOneAndUpdate(
      {
        _id: findLoan._id,
        'repaymentsDates._id': loanRepaymentsMonth?._id,
      },
      { $set: { 'repaymentsDates.$.status': 'paid' } },
      { new: true },
    ),
  ]);

  const notificationData = {
    type: NOTIFICATION_TYPE.REPAYMENT,
    senderId: user._id,
    receiverId: user.adminId,
    linkId: result._id,
    role: user.role,
    message: `${user.customFields.name} has added a new repayment`,
  };

  await sendNotification(user, notificationData);

  return result;
};

const getAllRepayments = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  const repaymentQuery = new AggregationQueryBuilder(query);

  const { filtering } = query;

  const filteringData = filteringCalculation(filtering as string);

  let matchStage = {};

  if (user.role === USER_ROLE.fieldOfficer) {
    matchStage = {
      fieldOfficerId: new mongoose.Types.ObjectId(String(user._id)),
      hubId: new mongoose.Types.ObjectId(String(user.hubId)),
      spokeId: new mongoose.Types.ObjectId(String(user.spokeId)),
    };
  } else if (user.role === USER_ROLE.hubManager) {
    matchStage = {
      hubId: new mongoose.Types.ObjectId(String(user._id)),
    };
  } else if (user.role === USER_ROLE.admin) {
    matchStage = {};
  }

  const result = await repaymentQuery
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
        $unwind: {
          path: '$client',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'loanapplications',
          localField: 'applicationId',
          foreignField: '_id',
          as: 'loan',
        },
      },
      {
        $unwind: {
          path: '$loan',
          preserveNullAndEmptyArrays: true,
        },
      },
    ])
    .sort()
    .search(['client.customFields.name', 'email'])
    .paginate()
    .execute(Repayments);

  const meta = await repaymentQuery.countTotal(Repayments);

  return { meta, result };
};

const confirmRepayments = async (id: string, user: TAuthUser) => {
  const result = await Repayments.findOneAndUpdate(
    { _id: id },
    { $set: { isConfirm: true } },
    { new: true },
  );
  return result;
};

const deleteRepayments = async (id: string) => {
  const result = await Repayments.findByIdAndDelete(id);
  return result;
};

export const RepaymentsService = {
  createRepayments,
  getAllRepayments,
  confirmRepayments,
  deleteRepayments,
};
