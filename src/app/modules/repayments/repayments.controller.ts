import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RepaymentsService } from './repayments.service';
import { TAuthUser } from '../../interface/authUser';

const createRepayments = catchAsync(async (req, res) => {
  const result = await RepaymentsService.createRepayments(
    req.body,
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Repayments created successfully',
    data: result,
  });
});

export const RepaymentsController = {
  createRepayments,
};
