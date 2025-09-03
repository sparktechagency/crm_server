import { ObjectId } from 'mongoose';

type TType =
  | 'new_lead_added'
  | 'new_application_added'
  | 'loan_reminder'
  | 'user_created'
  | 'repayment';

export const NOTIFICATION_TYPE = {
  NEW_LEAD_ADDED: 'new_lead_added',
  NEW_APPLICATION_ADDED: 'new_application_added',
  LOAN_REMINDER: 'loan_reminder',
  USER_CREATED: 'user_created',
  REPAYMENT: 'repayment',
} as const;

export type TNotification = {
  senderId: ObjectId;
  receiverId: ObjectId;
  linkId: ObjectId;
  role: string;
  type: TType;
  message: string;
  isRead?: boolean;
};
