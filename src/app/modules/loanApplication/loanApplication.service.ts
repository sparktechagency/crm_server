import { TAuthUser } from '../../interface/authUser';
import QueryBuilder from '../../QueryBuilder/queryBuilder';
import generateUID from '../../utils/generateUID';
import { IReturnTypeLeadsAndClients } from '../leadsAndClients/leadsAndClients.interface';
import { LeadsAndClientsService } from '../leadsAndClients/leadsAndClients.service';
import { TLoanApplication } from './loanApplication.interface';
import LoanApplication from './loanApplication.model';

import mongoose from 'mongoose';
import { TLocationProfile } from '../locationProfile/locationProfile.interface';
import LocationProfile from '../locationProfile/locationProfile.model';
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
  const loanApplicationQuery = new QueryBuilder(
    LoanApplication.find({
      hubId: user.hubId,
      spokeId: user.spokeId,
      fieldOfficerId: user._id,
    }),
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

export const LoanApplicationService = {
  createLoanApplication,
  getAllLoanApplication,
  updateLoanApplication,
};
