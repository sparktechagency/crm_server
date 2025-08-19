/* eslint-disable @typescript-eslint/no-explicit-any */
export type TUserFields = {
  label: string;
  inputName: string;
  inputType: 'text' | 'number' | 'boolean' | 'date' | 'enum' | 'email' | 'file';
  required: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue: any;
  active: boolean;
};
