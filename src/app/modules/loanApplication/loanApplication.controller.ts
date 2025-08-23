import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LoanApplicationService } from './loanApplication.service';
import { TAuthUser } from '../../interface/authUser';

const createLoanApplication = catchAsync(async (req, res) => {
  const result = await LoanApplicationService.createLoanApplication(
    req.user as TAuthUser,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Loan application created successfully',
    data: result,
  });
});

const getAllLoanApplication = catchAsync(async (req, res) => {
  const result = await LoanApplicationService.getAllLoanApplication(req.user as TAuthUser, req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Loan application fetched successfully',
    data: result,
  });
});

export const LoanApplicationController = {
    createLoanApplication,
    getAllLoanApplication
};
