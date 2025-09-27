import { Model, ObjectId } from 'mongoose';
import { TStatus } from '../user/user.interface';

export type LeadsAndClients = {
  _id?: string;
  uid: string;
  hubId: ObjectId;
  spokeId: ObjectId;
  fieldOfficerId: ObjectId;
  email: string;
  phoneNumber: string;
  isClient: boolean;
  isDeleted: boolean;
  customFields: Map<string, unknown>;
  status: TStatus
};

export interface IReturnTypeLeadsAndClients extends LeadsAndClients {
  // _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface ILeadsAndClients extends Model<LeadsAndClients> {
  findLastOne(): Promise<LeadsAndClients>;
}
