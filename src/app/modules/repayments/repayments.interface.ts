import { ObjectId } from 'mongoose';

export type TRepayments = {
  applicationId: ObjectId;
  clientId: ObjectId;
  hubId: ObjectId;
  spokeId: ObjectId;
  month: string;
  installmentAmount: number;
  paidOn: Date;
  penalty: number;
  status: 'paid' | 'overdue';
  isConfirm: boolean;
};
