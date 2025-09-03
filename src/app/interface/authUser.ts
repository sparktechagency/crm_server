/* eslint-disable @typescript-eslint/no-explicit-any */
import { TRole, TStatus } from '../modules/user/user.interface';

export type TAuthUser = {
  _id: string;
  uid: string;
  email: string;
  phoneNumber: string;
  hubId: string;
  hubUid: string;
  status: TStatus;
  role: TRole;
  isDeleted: boolean;
  isAssignSpoke: boolean;
  customFields: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  __v: number;
  spokeId?: string;
  spokeUid?: string;
  iat: number;
  exp: number;
  adminId: string;
};
