import { model, Schema } from 'mongoose';
import { TLoanApplication } from './loanApplication.interface';

const LoanApplicationSchema = new Schema<TLoanApplication>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'LeadsAndClients',
    },
    hubId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    spokeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    loanApplicationUid: {
      type: String,
      required: [true, 'Loan application UID is required'],
      unique: true,
    },
    applicantStatus: {
      type: String,
      required: [true, 'Applicant status is required'],
      enum: ['New', 'From Leads'],
      default: 'New',
    },
    typeofFinancingRequested: {
      type: String,
      required: [true, 'Type of financing requested is required'],
    },
    purposeOfFinancing: {
      type: String,
      required: [true, 'Purpose of financing is required'],
    },
    loanAmountRequested: {
      type: Number,
      required: [true, 'Loan amount requested is required'],
    },
    installMentAmount: {
      type: Number,
      required: [true, 'Installment amount is required'],
    },
    employmentStatus: {
      type: String,
      required: [true, 'Employment status is required'],
    },
    whereAreYouLocated: {
      type: String,
      required: [true, 'Where are you located is required'],
    },
    monthlyIncome: {
      type: Number,
      required: [true, 'Monthly income is required'],
    },
    endDate: { type: Date, required: [true, 'End date is required'] },
    startDate: { type: Date, required: [true, 'Start date is required'] },
    hubManagerApproval: {
      type: String,
      required: [true, 'Hub manager approval is required'],
      enum: ['approved', 'rejected', 'pending'],
      default: 'pending',
    },
    loanStatus: {
      type: String,
      required: [true, 'Loan status is required'],
      enum: ['approved', 'rejected', 'pending'],
      default: 'pending',
    },
    supervisorApproval: {
      type: String,
      required: [true, 'Supervisor approval is required'],
      enum: ['approved', 'rejected', 'pending'],
      default: 'pending',
    },
    preferredContact: {
      type: String,
      required: [true, 'Preferred contact is required'],
    },
    term: { type: String, required: [true, 'Term is required'] },
    nid: { type: String, required: [true, 'NID is required'] },
    leadUid: {
      type: String,
      required: [true, 'Lead UID is required'],
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

export const LoanApplication = model<TLoanApplication>(
  'LoanApplication',
  LoanApplicationSchema,
);

export default LoanApplication;
