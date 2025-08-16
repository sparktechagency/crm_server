import { ObjectId } from 'mongoose';

type TType =
  | 'job-request'
  | 'job'
  | 'review'
  | 'payment'
  | 'company'
  | 'dispatcher'
  | 'driver'
  | 'approve'
  | 'company_request'
  | 'driver_request'
  | 'job_schedule'
  | 'payment_confirm';

export const NOTIFICATION_TYPE = {
  jobRequest: 'job-request',
  job: 'job',
  review: 'review',
  payment: 'payment',
  company: 'company',
  dispatcher: 'dispatcher',
  driver: 'driver',
  approve: 'approve',
  companyRequest: 'company_request',
  driverRequest: 'driver_request',
  jobSchedule: 'job_schedule',
  jobPayment: 'job_payment',
  paymentConfirm: 'payment_confirm',
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
