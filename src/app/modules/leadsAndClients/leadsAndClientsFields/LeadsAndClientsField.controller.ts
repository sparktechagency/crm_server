import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { LeadsAndClientsFieldService } from './LeadsAndClientsField.service';

const addLeadsAndClientsField = catchAsync(async (req, res) => {
  const result = await LeadsAndClientsFieldService.addLeadsAndClientsField(
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User field added successfully',
    data: result,
  });
});

const getLeadsAndClientsFields = catchAsync(async (req, res) => {
  const result = await LeadsAndClientsFieldService.getLeadsAndClientsFields();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User fields fetched successfully',
    data: result,
  });
});

const updateLeadsAndClientsField = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await LeadsAndClientsFieldService.updateLeadsAndClientsField(
    id,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User field updated successfully',
    data: result,
  });
});

const deleteLeadsAndClientsField = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await LeadsAndClientsFieldService.deleteLeadsAndClientsField(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User field deleted successfully',
    data: result,
  });
});

export const LeadsAndClientsFieldController = {
  addLeadsAndClientsField,
  getLeadsAndClientsFields,
  updateLeadsAndClientsField,
  deleteLeadsAndClientsField,
};
