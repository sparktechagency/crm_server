/* eslint-disable @typescript-eslint/no-explicit-any */
import { TAuthUser } from '../../interface/authUser';
import generateUID from '../../utils/generateUID';
import { IReturnTypeLeadsAndClients } from '../leadsAndClients/leadsAndClients.interface';
import { LeadsAndClientsService } from '../leadsAndClients/leadsAndClients.service';
import {
  TApplicationStatus,
  TLoanApplication,
} from './loanApplication.interface';
import LoanApplication from './loanApplication.model';

import httpStatus from 'http-status';
import mongoose from 'mongoose';
import cron from 'node-cron';
import sendNotification from '../../../socket/sendNotification';
import { LOAN_APPLICATION_STATUS, USER_ROLE } from '../../constant';
import AggregationQueryBuilder from '../../QueryBuilder/aggregationBuilder';
import AppError from '../../utils/AppError';
import { filteringCalculation } from '../../utils/filteringCalculation';
import LeadsAndClientsModel from '../leadsAndClients/leadsAndClients.model';
import { TLocationProfile } from '../locationProfile/locationProfile.interface';
import LocationProfile from '../locationProfile/locationProfile.model';
import { NOTIFICATION_TYPE } from '../notification/notification.interface';
import User from '../user/user.model';
import { installmentAmountCalculator } from './loanApplication.utils';

const createLoanApplication = async (
  user: TAuthUser,
  payload: Partial<TLoanApplication>,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const leadInfo = {
      name: payload.name,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      homeAddress: payload.homeAddress,
      image: payload.image,
      nid: payload.nid,
    };

    const findHubForFormula = (await LocationProfile.findOne({
      hubId: user.hubId,
    })) as TLocationProfile;

    const amountCalculation = await installmentAmountCalculator(
      findHubForFormula?.excelFormula,
      payload.loanAmountRequested as number,
      payload.term as string,
    );

    let createLead: IReturnTypeLeadsAndClients;

    if (payload.applicantStatus === 'New') {
      createLead = (await LeadsAndClientsService.createLeadsAndClients(
        leadInfo,
        user,
        session, // pass session
      )) as IReturnTypeLeadsAndClients;
    } else {
      createLead = (await LeadsAndClientsService.getLeadsUsingUId(
        payload.leadUid as string,
      )) as IReturnTypeLeadsAndClients;
    }

    const loanApplicationInfo = {
      uid: await generateUID(LoanApplication, 'Application'),
      clientId: createLead._id,
      hubId: user.hubId,
      spokeId: user.spokeId,
      fieldOfficerId: user._id,
      leadUid: createLead.uid,
      installMentAmount: amountCalculation.installmentAmount,
      grossProfit: amountCalculation.grossProfit,
      totalRepayment: amountCalculation.totalRepayments,
      repaymentsDates: amountCalculation.repaymentsDates,
      ...payload,
    };

    // Save loan application
    const loanApplication = await LoanApplication.create(
      [loanApplicationInfo],
      { session },
    );

    await LeadsAndClientsModel.findOneAndUpdate(
      {
        _id: createLead._id,
      },
      { isClient: true },
      { session },
    );

    const receiverId = [user.hubId, user.spokeId];

    console.log(receiverId, 'receiverId');
    // Send notifications and wait for all to be completed
    await Promise.all(
      receiverId.map(async (id) => {
        const notificationData = {
          type: NOTIFICATION_TYPE.NEW_APPLICATION_ADDED,
          senderId: user._id,
          receiverId: id,
          linkId: loanApplication[0]?._id,
          role: user.role,
          message: `${user.customFields.name} has added a new loan application`,
        };

        await sendNotification(user, notificationData);
      }),
    );

    // ✅ Commit transaction
    await session.commitTransaction();
    session.endSession();

    return loanApplication[0];
  } catch (error) {
    // ❌ Rollback transaction
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllLoanApplication = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  let matchStage = {};
  const { filtering } = query;

  const filteringData = filteringCalculation(filtering as string);

  if (user.role === USER_ROLE.fieldOfficer) {
    matchStage = {
      hubId: new mongoose.Types.ObjectId(String(user.hubId)),
      spokeId: new mongoose.Types.ObjectId(String(user.spokeId)),
      fieldOfficerId: new mongoose.Types.ObjectId(String(user._id)),
    };
  } else if (user.role === USER_ROLE.hubManager) {
    matchStage = {
      hubId: new mongoose.Types.ObjectId(String(user._id)),
      ...(query.supervisorApproval
        ? { supervisorApproval: query.supervisorApproval }
        : { supervisorApproval: LOAN_APPLICATION_STATUS.approved }),
      ...(query.hubManagerApproval
        ? { hubManagerApproval: query.hubManagerApproval }
        : {}),
    };
  } else if (
    user.role === USER_ROLE.supervisor ||
    user.role === USER_ROLE.admin
  ) {
    matchStage = {
      ...(query.supervisorApproval === 'pending' && {
        supervisorApproval: query.supervisorApproval,
      }),
    };
  }

  const loanApplicationQuery = new AggregationQueryBuilder(query);

  const [result, meta] = await Promise.all([
    loanApplicationQuery
      .customPipeline([
        {
          $match: { ...matchStage, ...filteringData },
        },
        {
          $lookup: {
            from: 'leadsandclients',
            localField: 'clientId',
            foreignField: '_id',
            as: 'clientId',
          },
        },
        {
          $unwind: {
            path: '$clientId',
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .search(['clientId.customFields.name', 'email', 'phoneNumber'])
      .sort()
      .paginate()
      .execute(LoanApplication),

    loanApplicationQuery.countTotal(LoanApplication),
  ]);

  return { meta, result };
};

const updateLoanApplication = async (
  id: string,
  payload: Partial<TLoanApplication>,
  user: TAuthUser,
) => {
  const leadInfo = {
    name: payload.name,
    email: payload.email,
    phoneNumber: payload.phoneNumber,
    homeAddress: payload.homeAddress,
    image: payload.image,
    nid: payload.nid,
  };

  let amountCalculation;
  if (payload.loanAmountRequested) {
    const findHubForFormula = (await LocationProfile.findOne({
      hubId: user.hubId,
    })) as TLocationProfile;

    amountCalculation = await installmentAmountCalculator(
      findHubForFormula?.excelFormula,
      payload.loanAmountRequested as number,
      payload.term as string,
    );
  }

  const result = await LoanApplication.findOneAndUpdate(
    { _id: id },
    {
      ...payload,
      installMentAmount: amountCalculation?.installmentAmount,
      grossProfit: amountCalculation?.grossProfit,
      totalRepayment: amountCalculation?.totalRepayments,
    },
    {
      new: true,
    },
  );

  // Check if any field in leadInfo has a value (not empty or undefined)
  const isLeadInfoValid = Object.values(leadInfo).some(
    (value) => value !== null && value !== undefined && value !== '',
  );
  if (isLeadInfoValid) {
    (await LeadsAndClientsService.updateLeadsOrClients(
      result?.clientId as any,
      leadInfo,
    )) as IReturnTypeLeadsAndClients;
  }

  return result;
};

const loanApplicationAction = async (
  payload: { loanId: string; action: TApplicationStatus },
  user: TAuthUser,
) => {
  const findLoan = await LoanApplication.findOne({ _id: payload.loanId });

  if (!findLoan) {
    throw new AppError(httpStatus.NOT_FOUND, 'Loan not found');
  }

  let actionPayload = {};
  if (user.role === USER_ROLE.supervisor) {
    actionPayload = {
      supervisorApproval: payload.action,
    };
  } else if (user.role === USER_ROLE.hubManager) {
    actionPayload = {
      hubManagerApproval: payload.action,
      loanStatus: payload.action,
    };
  }

  if (payload.action === LOAN_APPLICATION_STATUS.rejected) {
    actionPayload = {
      ...actionPayload,
      loanStatus: LOAN_APPLICATION_STATUS.rejected,
    };
  }

  const result = await LoanApplication.findOneAndUpdate(
    { _id: payload.loanId },
    { ...actionPayload },
    {
      new: true,
    },
  );

  return result;
};

const deleteLoanApplication = async (id: string, user: TAuthUser) => {
  const result = await LoanApplication.findOneAndDelete({ _id: id });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Loan not found');
  }

  return result;
};

// Function to send notification to the field officer
const sendLoanStartNotification = async (loan: TLoanApplication) => {
  const admin = await User.findOne({ role: USER_ROLE.admin });

  try {
    const notificationData = {
      type: NOTIFICATION_TYPE.LOAN_REMINDER,
      senderId: admin?._id,
      receiverId: loan.fieldOfficerId,
      linkId: loan._id,
      role: USER_ROLE.admin,
      message: `The loan with ID ${loan.uid} is about to start tomorrow. Please review the details.`,
    };

    // Send the notification (You can use your existing sendNotification function)
    await sendNotification(
      {
        _id: admin?._id as any,
      },
      notificationData,
    );
    console.log(`Notification sent to field officer ${loan.fieldOfficerId}`);
  } catch (error) {
    console.error('Error sending loan start notification:', error);
  }
};

// Cron job to check the loans every day at 12 AM
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Node corn job running..........');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Find loans where the startDate is tomorrow
    const loans = await LoanApplication.find({
      startDate: {
        $gte: tomorrow,
        $lt: new Date(tomorrow.getTime() + 86400000), // Get all loans starting tomorrow
      },
    });

    // Send notification for each loan
    for (const loan of loans) {
      await sendLoanStartNotification(loan);
    }
  } catch (error) {
    console.error('Error in cron job:', error);
  }
});

export const LoanApplicationService = {
  createLoanApplication,
  getAllLoanApplication,
  updateLoanApplication,
  loanApplicationAction,
  deleteLoanApplication,
};
