import { model, Schema } from 'mongoose';
import { TLoanApplication } from './loanApplication.interface';

const LoanApplicationSchema = new Schema<TLoanApplication>(
  {
    uid: {
      type: String,
      required: [true, 'Loan application UID is required'],
      unique: true,
    },
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
    fieldOfficerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Field officer id is required'],
    },
    leadUid: {
      type: String,
      required: [true, 'Lead UID is required'],
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
      enum: ['approved', 'rejected', 'pending', 'closed'],
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
    totalRepayment: {
      type: Number,
      required: [true, 'Total repayment is required'],
    },
    grossProfit: { type: Number, required: [true, 'Gross profit is required'] },
    term: { type: String, required: [true, 'Term is required'] },
    nid: { type: String, required: [true, 'NID is required'] },
  },
  {
    timestamps: true,
  },
);

LoanApplicationSchema.statics.findLastOne = async function () {
  return await this.findOne({}, null, { bypassMiddleware: true })
    .select('uid')
    .sort({ createdAt: -1 })
    .limit(1)
    .lean();
};

export const LoanApplication = model<TLoanApplication>(
  'LoanApplication',
  LoanApplicationSchema,
);

export default LoanApplication;
