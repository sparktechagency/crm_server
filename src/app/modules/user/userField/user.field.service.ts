import { TUserFields } from './user.field.interface';
import { UserField } from './userField.model';

const addUserField = async (data: TUserFields) => {
  const result = await UserField.create(data);
  return result;
};

export const UserFieldService = {
  addUserField,
};
