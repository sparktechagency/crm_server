import { TUserFields } from './user.field.interface';
import { UserField } from './userField.model';

const addUserField = async (data: TUserFields) => {
  const result = await UserField.create(data);
  return result;
};

const getUsersFields = async () => {
  const result = await UserField.find();
  return result;
};

const updateUserField = async (id: string, data: TUserFields) => {
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
