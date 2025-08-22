import { Model, ObjectId } from 'mongoose';

export type LeadsAndClients = {
  uid: string;
  hubId: ObjectId;
  spokeId: ObjectId;
  fieldOfficerId: ObjectId;
  email: string;
  phoneNumber: string;
  isClient: boolean;
  isDeleted: boolean;
  customFields: Map<string, unknown>;
};

export interface ILeadsAndClients extends Model<LeadsAndClients> {
  findLastOne(): Promise<LeadsAndClients>;
}
