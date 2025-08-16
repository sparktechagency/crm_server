import { ObjectId } from 'mongoose';

export type LeadsAndClients = {
  leadClientUid: string;
  hubId: ObjectId;
  spokeId: ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  image: string;
  address: string;
  isClient: boolean;
  isDeleted: boolean;
};
