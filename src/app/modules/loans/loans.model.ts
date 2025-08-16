import { model, Schema } from "mongoose";
import { TLoan } from "./loans.interface";

const loanSchema = new Schema<TLoan>({
    loanUid: {
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
    isDeleted: {
        type: Boolean,
        default: false
    },

}, {
    timestamps: true
})

const Loan = model<TLoan>('Loan', loanSchema);

export default Loan;