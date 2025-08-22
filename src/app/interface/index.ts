/* eslint-disable @typescript-eslint/no-explicit-any */
import { USER_ROLE, USER_STATUS } from '../constant';

export type TUserRole = keyof typeof USER_ROLE;
export type TUserStatus = keyof typeof USER_STATUS;

export type TFieldInterface = {
  label: string;
  inputName: string;
  inputType: 'text' | 'number' | 'boolean' | 'date' | 'enum' | 'email' | 'file';
  required: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue: any;
  active: boolean;
};
