import { TFieldInterface } from '../../../../shared/validation/commonZodValidation';
import { UserField } from './userField.model';

const addUserField = async (data: TFieldInterface) => {
  const result = await UserField.create(data);
  return result;
};

const getUsersFields = async () => {
  const result = await UserField.find();
  return result;
};

const updateUserField = async (id: string, data: TFieldInterface) => {
  const result = await UserField.findByIdAndUpdate(id, data, { new: true });
  return result;
};

const deleteUserField = async (id: string) => {
  const result = await UserField.findByIdAndDelete(id);
  return result;
};

export const UserFieldService = {
  addUserField,
  getUsersFields,
  updateUserField,
  deleteUserField,
};
