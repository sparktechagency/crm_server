import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LeadsAndClientsService } from './leadsAndClients.service';
import { TAuthUser } from '../../interface/authUser';

const createLeadsAndClients = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.image = req.file.path;
  }

  const result = await LeadsAndClientsService.createLeadsAndClients(
    req.body,
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Leads and clients created successfully',
    data: result,
  });
});

const getLeadsAndClients = catchAsync(async (req, res) => {
  const result = await LeadsAndClientsService.getAllLeadsAndClients(
    req.user as TAuthUser,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Leads and clients fetched successfully',
    data: result,
  });
});

const updateLeadsOrClients = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.image = req.file.path;
  }

  const result = await LeadsAndClientsService.updateLeadsOrClients(
    req.params.id,
    req.body,
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Leads and clients updated successfully',
    data: result,
  });
});

const deleteLeadsOrClients = catchAsync(async (req, res) => {
  const result = await LeadsAndClientsService.deleteLeadsAndClient(
    req.params.id,
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Leads and clients deleted successfully',
    data: result,
  });
});

const getAllClients = catchAsync(async (req, res) => {
  const result = await LeadsAndClientsService.getAllClients(
    req.user as TAuthUser,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Clients fetched successfully',
    data: result,
  });
});

const deleteClient = catchAsync(async (req, res) => {
  const result = await LeadsAndClientsService.deleteClient(
    req.params.id,
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Client deleted successfully',
    data: result,
  });
});

const updateUserActions = catchAsync(async (req, res) => {
  const result = await LeadsAndClientsService.updateUserActions(
    req.params.id,
    req.body,
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User actions updated successfully',
    data: result,
  });
});

export const LeadsAndClientsController = {
  createLeadsAndClients,
  getLeadsAndClients,
  updateLeadsOrClients,
  deleteLeadsOrClients,
  getAllClients,
  deleteClient,
  updateUserActions,
};
