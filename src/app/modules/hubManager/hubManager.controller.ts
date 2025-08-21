import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { HubManagerService } from './hubManager.service';
import { TAuthUser } from '../../interface/authUser';

const allFieldOfficerRequest = catchAsync(async (req, res) => {
  const result = await HubManagerService.allFieldOfficerRequest(
    req.user as TAuthUser,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Field officer requests fetched successfully',
    data: result,
  });
});

export const HubManagerController = {
  allFieldOfficerRequest,
};
