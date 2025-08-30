import { ObjectId } from 'mongoose';

export type TRepayments = {
  // relational fields
  applicationId: ObjectId;
  clientId: ObjectId;
  hubId: ObjectId;
  spokeId: ObjectId;
  fieldOfficerId: ObjectId;

  // non-relational fields
  clientUid: string;
  loanUid: string;
  month: string;
  installmentAmount: number;
  dueDate: Date;
  paidOn: Date;
  penalty: number;
  status: 'paid' | 'overdue';
  isConfirm: boolean;
};
