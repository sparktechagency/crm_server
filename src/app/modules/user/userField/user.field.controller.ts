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

export const UserFieldController = {
  addUserField,
};
