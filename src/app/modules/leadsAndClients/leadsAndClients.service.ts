import { TAuthUser } from '../../interface/authUser';
import generateUID from '../../utils/generateUID';
import LeadsAndClientsModel from './leadsAndClients.model';

const createLeadsAndClients = async (payload: Record<string, unknown>, user: TAuthUser) => {

    const { email, phoneNumber, ...rest } = payload

    const leadClientData = {
        uid: await generateUID(LeadsAndClientsModel, 'ID'),
        email,
        phoneNumber,
        hubId: user.hubId,
        spokeId: user.spokeId,
        fieldOfficerId: user._id,
        customFields: {
            ...rest,
        },
    }

    const result = await LeadsAndClientsModel.create(leadClientData)
    return result
};


const getAllLeadsAndClients = async (user: TAuthUser, query: Record<string, unknown>) => {
    const result = await LeadsAndClientsModel.find()
    return result
}

export const LeadsAndClientsService = {
    createLeadsAndClients,
    getAllLeadsAndClients
};
