/* eslint-disable no-unused-vars */
import { Model, ObjectId } from 'mongoose';

export type TRole =
  | 'admin'
  | 'supervisor'
  | 'hr'
  | 'hubManager'
  | 'spokeManager'
  | 'fieldOfficer';
export type TStatus = 'active' | 'blocked' | 'deactivated';

export type TUser = {
  uid: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  image: string;
  address: string;
  nid: string;
  locationProfileHubId: ObjectId;
  locationSpokeId: ObjectId;
  myHubId: ObjectId;
  mySpokeId: ObjectId;
  cv: string;
  isDeleted: boolean;
  isAssignSpoke: boolean;
  role: TRole;
  status: TStatus;
  customFields: Map<string, unknown>;
};

export type TFindUserWithUid = {
  hubId?: string;
  spokeId?: string;
};

export interface UserModel extends Model<TUser> {
  isUserExist(id: string): Promise<TUser>;
  isMatchedPassword(password: string, hashPassword: string): Promise<boolean>;
  findLastOne(): Promise<TUser>;
}
