import generateUID from '../../utils/generateUID';
import { TLoan } from './loans.interface';
import Loan from './loans.model';

const createLoan = async (
  payload: Pick<TLoan, 'title' | 'features'>,
): Promise<TLoan> => {
  const result = await Loan.create({
    loanUid: await generateUID(Loan, 'loan'),
    title: payload.title,
    features: payload.features,
  });

  return result;
};

const getAllLoan = async (): Promise<TLoan[]> => {
  const result = await Loan.find();
  return result;
};

const updateLoan = async (
  id: string,
  payload: Pick<TLoan, 'title' | 'features'>,
) => {
  const result = await Loan.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteLoan = async (id: string) => {
  const result = await Loan.findByIdAndDelete(id);
  return result;
};

export const LoanService = {
  createLoan,
  getAllLoan,
  updateLoan,
  deleteLoan,
};
