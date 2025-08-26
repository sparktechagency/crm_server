import { TAuthUser } from '../../interface/authUser';
import QueryBuilder from '../../QueryBuilder/queryBuilder';
import generateUID from '../../utils/generateUID';
import { IReturnTypeLeadsAndClients } from '../leadsAndClients/leadsAndClients.interface';
import { LeadsAndClientsService } from '../leadsAndClients/leadsAndClients.service';
import { TApplicationStatus, TLoanApplication } from './loanApplication.interface';
import LoanApplication from './loanApplication.model';

import mongoose from 'mongoose';
import { TLocationProfile } from '../locationProfile/locationProfile.interface';
import LocationProfile from '../locationProfile/locationProfile.model';
import { installmentAmountCalculator } from './loanApplication.utils';
import { LOAN_APPLICATION_STATUS, USER_ROLE } from '../../constant';
import AppError from '../../utils/AppError';
import httpStatus from 'http-status';

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
    };

    const findHubForFormula = (await LocationProfile.findOne({
      hubId: user.hubId,
    })) as TLocationProfile;

    const installmentAmount = await installmentAmountCalculator(
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
      installMentAmount: installmentAmount,
      ...payload,
    };

    // Save loan application
    const loanApplication = await LoanApplication.create(
      [loanApplicationInfo],
      { session },
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

  let matchStage = {}

  if (user.role === USER_ROLE.fieldOfficer) {
    matchStage = {
      hubId: user.hubId,
      spokeId: user.spokeId,
      fieldOfficerId: user._id,
    }
  } else if (user.role === USER_ROLE.hubManager) {
    matchStage = {
      hubId: user._id,
      supervisorApproval: LOAN_APPLICATION_STATUS.approved
    }
  } else if (user.role === USER_ROLE.supervisor) {
    matchStage = {}
  }

  const loanApplicationQuery = new QueryBuilder(
    LoanApplication.find({ ...matchStage }),
    query,
  );

  const [result, meta] = await Promise.all([
    loanApplicationQuery.queryModel,
    loanApplicationQuery.countTotal(),
  ]);

  return { meta, result };
};

const updateLoanApplication = async (
  id: string,
  payload: Partial<TLoanApplication>,
  user: TAuthUser,
) => {
  let installmentAmount: number = 0;
  if (payload.loanAmountRequested) {
    const findHubForFormula = (await LocationProfile.findOne({
      hubId: user.hubId,
    })) as TLocationProfile;

    installmentAmount = await installmentAmountCalculator(
      findHubForFormula?.excelFormula,
      payload.loanAmountRequested as number,
      payload.term as string,
    );
  }

  const result = await LoanApplication.findOneAndUpdate(
    { _id: id },
    { ...payload, installMentAmount: installmentAmount },
    {
      new: true,
    },
  );
  return result;
};

const loanApplicationAction = async (payload: { loanId: string, action: TApplicationStatus }, user: TAuthUser) => {

  const findLoan = await LoanApplication.findOne({ _id: payload.loanId });

  if (!findLoan) {
    throw new AppError(httpStatus.NOT_FOUND, 'Loan not found');
  }

  let actionPayload = {}
  if (user.role === USER_ROLE.supervisor) {
    actionPayload = {
      supervisorApproval: payload.action
    }
  } else if (user.role === USER_ROLE.hubManager) {
    actionPayload = {
      hubManagerApproval: payload.action
    }
  }

  const result = await LoanApplication.findOneAndUpdate(
    { _id: payload.loanId },
    { ...actionPayload },
    {
      new: true,
    },
  );

  return result;
}

export const LoanApplicationService = {
  createLoanApplication,
  getAllLoanApplication,
  updateLoanApplication,
  loanApplicationAction
};
