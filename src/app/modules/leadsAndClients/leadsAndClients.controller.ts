import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LeadsAndClientsService } from './leadsAndClients.service';
import { TAuthUser } from '../../interface/authUser';

const createLeadsAndClients = catchAsync(async (req, res) => {

    if (req.file) {
        req.body.image = req.file.path
    }

    const result = await LeadsAndClientsService.createLeadsAndClients(req.body, req.user as TAuthUser);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Leads and clients created successfully',
        data: result,
    });
});

export const LeadsAndClientsController = {
    createLeadsAndClients,
};
