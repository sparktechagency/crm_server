import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import { TAuthUser } from '../../interface/authUser';
import { MulterFile } from '../../utils/uploadImage';

const createUsers = catchAsync(async (req, res) => {
  const fields = ['image', 'cv'];

  const files = req.files as { [fieldname: string]: MulterFile[] };

  for (const field of fields) {
    if (files[field]) {
      req.body[field] = files[field][0].path;
    }
  }

  const result = await UserService.createUsers(req.body, req.user as TAuthUser);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User created successfully',
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

const getUsersBaseOnRole = catchAsync(async (req, res) => {
  const result = await UserService.getUsersBaseOnRole(
    req.user as TAuthUser,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users fetched successfully',
    data: result,
  });
});

const assignSpoke = catchAsync(async (req, res) => {
  const result = await UserService.assignSpoke(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Spoke assigned successfully',
    data: result,
  });
});

const updateUsers = catchAsync(async (req, res) => {
  const fields = ['image', 'cv'];

  const files = req.files as { [fieldname: string]: MulterFile[] };

  for (const field of fields) {
    if (files[field]) {
      req.body[field] = files[field][0].path;
    }
  }

  const result = await UserService.updateUsers(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User updated successfully',
    data: result,
  });
});

const deleteUsers = catchAsync(async (req, res) => {
  const result = await UserService.deleteUsers(
    req.params.id,
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User deleted successfully',
    data: result,
  });
});

const getAllManagers = catchAsync(async (req, res) => {
  const result = await UserService.getAllManagers(
    req.user as TAuthUser,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Managers fetched successfully',
    data: result,
  });
});

const getFieldOfficerRecord = catchAsync(async (req, res) => {
  const result = await UserService.getFieldOfficerRecord(
    req.user as TAuthUser,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Field officer record fetched successfully',
    data: result,
  });
});

const getProfile = catchAsync(async (req, res) => {
  const result = await UserService.getProfile(req.user as TAuthUser);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Profile fetched successfully',
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const fields = ['image', 'cv'];

  const files = req.files as { [fieldname: string]: MulterFile[] };

  for (const field of fields) {
    if (files[field]) {
      req.body[field] = files[field][0].path;
    }
  }
  const result = await UserService.updateProfile(
    req.user as TAuthUser,
    req.body,
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
  createUsers,
  getUsersBaseOnRole,
  assignSpoke,
  updateUsers,
  deleteUsers,
  getAllManagers,
  getFieldOfficerRecord,
  getProfile,
  updateProfile,
};
