import httpStatus from 'http-status';
import { TAuthUser } from '../../interface/authUser';
import AppError from '../../utils/AppError';
import LeadsAndClientsModel from '../leadsAndClients/leadsAndClients.model';
import LoanApplication from '../loanApplication/loanApplication.model';
import { TRepayments } from './repayments.interface';
import Repayments from './repayments.model';
import { IRepaymentsDates } from '../loanApplication/loanApplication.interface';
import { calculatePenalty, findClientAndLoan } from './repayments.utils';

// const createRepayments = async (payload: TRepayments, user: TAuthUser) => {
//   const [findClient, findLoan] = await Promise.all([
//     LeadsAndClientsModel.findOne({
//       uid: payload.clientUid,
//       isClient: true,
//     }),
//     LoanApplication.findOne({
//       uid: payload.loanUid,
//     }),
//   ]);
//   if (!findClient) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Client not found');
//   }
//   if (!findLoan) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Loan not found');
//   }

//   const loanRepaymentsMonth = findLoan.repaymentsDates.find((item) => {
//     return item.month === payload.month;
//   });

//   const findRepayments = await Repayments.findOne({
//     applicationId: findLoan?._id,
//     clientId: findClient?._id,
//     month: payload.month,
//   });

//   if (findRepayments) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Repayment already exist');
//   }

//   let penalty = 0;
//   if (loanRepaymentsMonth) {
//     const dueDate = new Date(loanRepaymentsMonth.dueDate);
//     if (dueDate < new Date()) {
//       penalty = 100;
//     }
//   }

//   const result = await Repayments.create({
//     ...payload,
//     installmentAmount: findLoan?.installMentAmount,
//     clientId: findClient?._id,
//     applicationId: findLoan?._id,
//     hubId: user.hubId,
//     spokeId: user.spokeId,
//     penalty: penalty,
//     status: penalty > 0 ? 'overdue' : 'paid',
//     paidOn: new Date(),
//     dueDate: new Date(),
//   });

//   const updateLoan = await LoanApplication.findOneAndUpdate(
//     {
//       _id: findLoan?._id,
//       'repaymentsDates._id': loanRepaymentsMonth?._id,
//     },
//     {
//       $set: {
//         'repaymentsDates.$.status': 'paid',
//       },
//     },
//     {
//       new: true,
//     },
//   );

//   return updateLoan;
// };

const createRepayments = async (payload: TRepayments, user: TAuthUser) => {
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
    ...payload,
    installmentAmount: findLoan.installMentAmount,
    clientId: findClient._id,
    applicationId: findLoan._id,
    hubId: user.hubId,
    spokeId: user.spokeId,
    penalty,
    status: penalty > 0 ? 'overdue' : 'paid',
    paidOn: new Date(),
    dueDate: new Date(),
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

  return result;
};

export const RepaymentsService = {
  createRepayments,
};
