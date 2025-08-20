import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import { TAuthUser } from '../../interface/authUser';
import { MulterFile } from '../../utils/uploadImage';

const createFieldOfficer = catchAsync(async (req, res) => {
  const fields = ['image', 'cv'];

  const files = req.files as { [fieldname: string]: MulterFile[] };

  for (const field of fields) {
    if (files[field]) {
      req.body[field] = files[field][0].path;
    }
  }

  const result = await UserService.createUsers(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Field officer created successfully',
    data: result,
  });
});

const updateUserActions = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  const result = await UserService.updateUserActions(
    id,
    action,
    req.user as TAuthUser,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User updated successfully',
    data: result,
  });
});

export const UserController = {
  updateUserActions,
  createFieldOfficer,
};
