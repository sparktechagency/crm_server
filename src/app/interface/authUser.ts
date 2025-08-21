import { TRole, TStatus } from '../modules/user/user.interface';

export type TAuthUser = {
  isAssignSpoke: boolean;
  _id: string;
  uid: string;
  email: string;
  phoneNumber: string;
  status: TStatus;
  role: TRole;
  isDeleted: boolean;
  customFields: {
    name: string;
    homeAddress: string;
    nid: string;
    [key: string]: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
  iat: number;
  exp: number;
};
