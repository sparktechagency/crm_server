import { TAuthUser } from '../../interface/authUser';
import QueryBuilder from '../../QueryBuilder/queryBuilder';
import generateUID from '../../utils/generateUID';
import { IReturnTypeLeadsAndClients } from '../leadsAndClients/leadsAndClients.interface';
import { LeadsAndClientsService } from '../leadsAndClients/leadsAndClients.service';
import { TLoanApplication } from './loanApplication.interface';
import LoanApplication from './loanApplication.model';

import mongoose from "mongoose";

const createLoanApplication = async (
    user: TAuthUser,
    payload: Partial<TLoanApplication>,
) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const leadInfo = {
            name: payload.name,
            email: payload.email,
            phoneNumber: payload.phoneNumber,
            homeAddress: payload.homeAddress,
            image: payload.image,
        };

        let createLead: IReturnTypeLeadsAndClients;

        if (payload.applicantStatus === "New") {
            createLead =
                (await LeadsAndClientsService.createLeadsAndClients(
                    leadInfo,
                    user,
                    session // pass session
                )) as IReturnTypeLeadsAndClients;
        } else {
            createLead =
                (await LeadsAndClientsService.getLeadsUsingUId(
                    payload.leadUid as string,
                )) as IReturnTypeLeadsAndClients;
        }

        const loanApplicationInfo = {
            uid: await generateUID(LoanApplication, "Application"),
            clientId: createLead._id,
            hubId: user.hubId,
            spokeId: user.spokeId,
            fieldOfficerId: user._id,
            leadUid: createLead.uid,
            ...payload,
        };

        // Save loan application
        const loanApplication = await LoanApplication.create(
            [loanApplicationInfo],
            { session }
        );

        // ✅ Commit transaction
        await session.commitTransaction();
        session.endSession();

        return loanApplication[0];
    } catch (error) {
        // ❌ Rollback transaction
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};


const getAllLoanApplication = async (user: TAuthUser, query: Record<string, unknown>) => {
    const loanApplicationQuery = new QueryBuilder(
        LoanApplication.find({
            hubId: user.hubId,
            spokeId: user.spokeId,
            fieldOfficerId: user._id,
        }), query
    )

    const [result, meta] = await Promise.all([
        loanApplicationQuery.queryModel,
        loanApplicationQuery.countTotal(),
    ]);

    return { meta, result };
};

export const LoanApplicationService = {
    createLoanApplication,
    getAllLoanApplication
};
