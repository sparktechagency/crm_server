import { model, Schema } from 'mongoose';
import { TRepayments } from './repayments.interface';

const repaymentsSchema = new Schema<TRepayments>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'LeadsAndClients',
      required: [true, 'Client id is required'],
    },
    hubId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Hub id is required'],
    },
    spokeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Spoke id is required'],
    },
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'LoanApplication',
      required: [true, 'Application id is required'],
    },
    fieldOfficerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Field officer id is required'],
    },
    month: {
      type: String,
      required: [true, 'Month is required'],
    },
    installmentAmount: {
      type: Number,
      required: [true, 'Installment amount is required'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    paidOn: {
      type: Date,
      required: [true, 'Paid on is required'],
    },
    penalty: {
      type: Number,
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['paid', 'overdue'],
      default: 'paid',
    },
    isConfirm: {
      type: Boolean,
      required: [true, 'Is confirm is required'],
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Repayments = model<TRepayments>('Repayments', repaymentsSchema);

export default Repayments;
