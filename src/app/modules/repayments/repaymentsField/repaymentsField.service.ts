import { TFieldInterface } from '../../../../shared/validation/commonZodValidation';
import Repayments from '../repayments.model';
import { RepaymentsField } from './repaymentsField.model';

const addRepayments = async (data: TFieldInterface) => {
  const result = await RepaymentsField.create(data);
  return result;
};

const getRepaymentsField = async () => {
  const result = await RepaymentsField.find();
  return result;
};

const updateRepayments = async (id: string, data: TFieldInterface) => {
  const result = await RepaymentsField.findByIdAndUpdate(id, data, { new: true });
  return result;
};

const deleteRepayments = async (id: string) => {
  const result = await RepaymentsField.findByIdAndDelete(id);
  return result;
};

export const RepaymentsFieldService = {
  addRepayments,
  getRepaymentsField,
  updateRepayments,
  deleteRepayments,
};
