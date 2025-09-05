import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { LocationProfileService } from './locationProfile.service';
import catchAsync from '../../utils/catchAsync';
import { TAuthUser } from '../../interface/authUser';

const createLocationProfile = catchAsync(async (req, res) => {
  const result = await LocationProfileService.createLocationProfile(
    req.body,
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Location profile created successfully',
    data: result,
  });
});

const getAllLocationProfile = catchAsync(async (req, res) => {
  const result = await LocationProfileService.getAllLocationProfile(
    req.user as TAuthUser,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Location profile fetched successfully',
    data: result,
  });
});

const updateLocationProfile = catchAsync(async (req, res) => {
  const result = await LocationProfileService.updateLocationProfile(
    req.params.id,
    req.body,
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Location profile updated successfully',
    data: result,
  });
});

const deleteLocationProfile = catchAsync(async (req, res) => {
  const result = await LocationProfileService.deleteLocationProfile(
    req.params.id,
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Location profile deleted successfully',
    data: result,
  });
});

export const LocationProfileController = {
  createLocationProfile,
  getAllLocationProfile,
  updateLocationProfile,
  deleteLocationProfile,
};
