import { model, Schema } from 'mongoose';
import { LoanModel, TLoan } from './loans.interface';

const loanSchema = new Schema<TLoan, LoanModel>(
  {
    uid: {
      type: String,
      required: [true, 'Loan UID is required'],
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    features: {
      type: [String],
      required: [true, 'Features are required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

loanSchema.statics.findLastOne = async function () {
  return await this.findOne({})
    .select('uid')
    .sort({ createdAt: -1 })
    .limit(1)
    .lean();
};

const Loan = model<TLoan, LoanModel>('Loan', loanSchema);

export default Loan;
