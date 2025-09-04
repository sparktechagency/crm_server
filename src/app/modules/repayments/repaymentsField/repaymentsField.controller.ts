import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { RepaymentsFieldService } from './repaymentsField.service';

const addUserField = catchAsync(async (req, res) => {
  const result = await RepaymentsFieldService.addRepayments(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User field added successfully',
    data: result,
  });
});

const getRepaymentsField = catchAsync(async (req, res) => {
  const result = await RepaymentsFieldService.getRepaymentsField();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User fields fetched successfully',
    data: result,
  });
});

const updateUserField = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RepaymentsFieldService.updateRepayments(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User field updated successfully',
    data: result,
  });
});

const deleteUserField = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RepaymentsFieldService.deleteRepayments(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User field deleted successfully',
    data: result,
  });
});

export const RepaymentsFieldController = {
  addUserField,
  getRepaymentsField,
  updateUserField,
  deleteUserField,
};
