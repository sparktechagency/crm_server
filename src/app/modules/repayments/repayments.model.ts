import { model, Schema } from "mongoose";
import { TRepayments } from "./repayments.interface";

const repaymentsSchema = new Schema<TRepayments>({
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
    applicationId: {
        type: Schema.Types.ObjectId,
        ref: 'LoanApplication',
    },
    month: {
        type: String,
        required: [true, 'Month is required'],
    },
    installmentAmount: {
        type: Number,
        required: [true, 'Installment amount is required'],
    },
    paidOn: {
        type: Date,
        required: [true, 'Paid on is required'],
    },
    penalty: {
        type: Number,
        required: [true, 'Penalty is required'],
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: ['paid', 'overdue'],
    },
    isConfirm: {
        type: Boolean,
        required: [true, 'Is confirm is required'],
        default: false
    },

}, {
    timestamps: true
})

const Repayments = model<TRepayments>('Repayments', repaymentsSchema);

export default Repayments;

