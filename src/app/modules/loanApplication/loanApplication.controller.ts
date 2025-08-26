import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LoanApplicationService } from './loanApplication.service';
import { TAuthUser } from '../../interface/authUser';

const createLoanApplication = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.image = req.file.path;
  }

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
  const result = await LoanApplicationService.getAllLoanApplication(
    req.user as TAuthUser,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Loan application fetched successfully',
    data: result,
  });
});

const updateLoanApplication = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.image = req.file.path;
  }
  const result = await LoanApplicationService.updateLoanApplication(
    req.params.id,
    req.body,
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Loan application updated successfully',
    data: result,
  });
});

const loanApplicationAction = catchAsync(async (req, res) => {
  const result = await LoanApplicationService.loanApplicationAction(
    req.body,
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Loan application ${req.body.action} successfully`,
    data: result,
  });
});



export const LoanApplicationController = {
  createLoanApplication,
  getAllLoanApplication,
  updateLoanApplication,
  loanApplicationAction
};
