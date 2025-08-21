import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { UserFieldService } from './user.field.service';

const addUserField = catchAsync(async (req, res) => {
  const result = await UserFieldService.addUserField(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User field added successfully',
    data: result,
  });
});

const getUsersFields = catchAsync(async (req, res) => {
  const result = await UserFieldService.getUsersFields();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User fields fetched successfully',
    data: result,
  });
});

const updateUserField = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserFieldService.updateUserField(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User field updated successfully',
    data: result,
  });
});

const deleteUserField = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserFieldService.deleteUserField(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User field deleted successfully',
    data: result,
  });
});

export const UserFieldController = {
  addUserField,
  getUsersFields,
  updateUserField,
  deleteUserField,
};
