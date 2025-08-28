import httpStatus from 'http-status';
import AppError from '../../utils/AppError';
import LeadsAndClientsModel from '../leadsAndClients/leadsAndClients.model';
import LoanApplication from '../loanApplication/loanApplication.model';
import { IRepaymentsDates } from '../loanApplication/loanApplication.interface';

export const findClientAndLoan = async (clientUid: string, loanUid: string) => {
  const [client, loan] = await Promise.all([
    LeadsAndClientsModel.findOne({ uid: clientUid, isClient: true }),
    LoanApplication.findOne({ uid: loanUid }),
  ]);

  if (!client) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Client not found');
  }
  if (!loan) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Loan not found');
  }

  return { client, loan };
};

export const calculatePenalty = (
  loanRepaymentsMonth: IRepaymentsDates,
): number => {
  if (!loanRepaymentsMonth) return 0;

  const dueDate = new Date(loanRepaymentsMonth.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return dueDate < today ? 100 : 0;
};
