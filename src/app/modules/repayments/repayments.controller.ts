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

const getAllRepayments = catchAsync(async (req, res) => {
  const result = await RepaymentsService.getAllRepayments(
    req.user as TAuthUser,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Repayments fetched successfully',
    data: result,
  });
});

const confirmRepayments = catchAsync(async (req, res) => {
  const result = await RepaymentsService.confirmRepayments(
    req.params.id,
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Repayments confirmed successfully',
    data: result,
  });
});

const deleteRepayments = catchAsync(async (req, res) => {
  const result = await RepaymentsService.deleteRepayments(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Repayments deleted successfully',
    data: result,
  });
});

export const RepaymentsController = {
  createRepayments,
  getAllRepayments,
  confirmRepayments,
  deleteRepayments,
};
