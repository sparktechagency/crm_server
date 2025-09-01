import { TFieldInterface } from '../../../../shared/validation/commonZodValidation';
import Repayments from '../repayments.model';

const addRepayments = async (data: TFieldInterface) => {
  const result = await Repayments.create(data);
  return result;
};

const getUsersFields = async () => {
  const result = await Repayments.find();
  return result;
};

const updateRepayments = async (id: string, data: TFieldInterface) => {
  const result = await Repayments.findByIdAndUpdate(id, data, { new: true });
  return result;
};

const deleteRepayments = async (id: string) => {
  const result = await Repayments.findByIdAndDelete(id);
  return result;
};

export const RepaymentsFieldService = {
  addRepayments,
  getUsersFields,
  updateRepayments,
  deleteRepayments,
};
