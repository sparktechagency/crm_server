import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { cacheData, getCachedData } from '../../../redis';
import { TAuthUser } from '../../interface/authUser';
import AggregationQueryBuilder from '../../QueryBuilder/aggregationBuilder';
import AppError from '../../utils/AppError';
import { minuteToSecond } from '../../utils/minitToSecond';
import { TMeta } from '../../utils/sendResponse';
import { IRepaymentsDates } from '../loanApplication/loanApplication.interface';
import LoanApplication from '../loanApplication/loanApplication.model';
import { TRepayments } from './repayments.interface';
import Repayments from './repayments.model';
import { calculatePenalty, findClientAndLoan } from './repayments.utils';

const createRepayments = async (payload: TRepayments, user: TAuthUser) => {
    const { client: findClient, loan: findLoan } = await findClientAndLoan(
        payload.clientUid,
        payload.loanUid,
    );

    const loanRepaymentsMonth = findLoan.repaymentsDates.find(
        (item) => item.month === payload.month,
    ) as IRepaymentsDates;

    const findRepayments = await Repayments.findOne({
        applicationId: findLoan._id,
        clientId: findClient._id,
        month: payload.month,
    });

    if (findRepayments) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Repayment already exists');
    }

    const penalty = calculatePenalty(loanRepaymentsMonth);
    
    const repaymentData = {
        ...payload,
        installmentAmount: findLoan.installMentAmount,
        clientId: findClient._id,
        applicationId: findLoan._id,
        hubId: user.hubId,
        spokeId: user.spokeId,
        penalty: 0,
        fieldOfficerId: user._id,
        status: penalty > 0 ? 'overdue' : 'paid',
        paidOn: new Date(),
        dueDate: new Date(loanRepaymentsMonth.dueDate),
    };

    // Create repayment and update loan status in a single batch operation
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const [result, updateLoan] = await Promise.all([
        Repayments.create(repaymentData),
        LoanApplication.findOneAndUpdate(
            {
                _id: findLoan._id,
                'repaymentsDates._id': loanRepaymentsMonth?._id,
            },
            { $set: { 'repaymentsDates.$.status': 'paid' } },
            { new: true },
        ),
    ]);

    return result;
};

const getAllRepayments = async (
    user: TAuthUser,
    query: Record<string, unknown>,
) => {

    const repaymentQuery = new AggregationQueryBuilder(query);

    const cacheKey = `getAllRepayments-${user._id}`;
    const cached = await getCachedData<{ meta: TMeta; result: TRepayments[] }>(
        cacheKey,
    );
    if (cached) {
        console.log('🚀 Serving from Redis cache');
        return cached;
    }

    const result = await repaymentQuery
        .customPipeline([
            {
                $match: {
                    fieldOfficerId: new mongoose.Types.ObjectId(String(user._id)),
                    hubId: new mongoose.Types.ObjectId(String(user.hubId)),
                    spokeId: new mongoose.Types.ObjectId(String(user.spokeId)),
                },
            },
            {
                $lookup: {
                    from: 'leadsandclients',
                    localField: 'clientId',
                    foreignField: '_id',
                    as: 'client',
                },
            },
            {
                $unwind: {
                    path: '$client',
                    preserveNullAndEmptyArrays: true,
                },
            }
        ])
        .sort()
        .search(['client.customFields.name', 'email',])
        .paginate()
        .execute(Repayments);


    const meta = await repaymentQuery.countTotal(Repayments);

    const time = minuteToSecond(5);
    await cacheData(cacheKey, { meta, result }, time);
    return { meta, result };

};

export const RepaymentsService = {
    createRepayments,
    getAllRepayments,
};
