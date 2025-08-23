import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LoanService } from './loans.service';

const createLoan = catchAsync(async (req, res) => {
  const result = await LoanService.createLoan(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Loan created successfully',
    data: result,
  });
});

const getAllLoan = catchAsync(async (req, res) => {
  const result = await LoanService.getAllLoan();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Loan fetched successfully',
    data: result,
  });
});

const updateLoan = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await LoanService.updateLoan(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Loan updated successfully',
    data: result,
  });
});

const deleteLoan = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await LoanService.deleteLoan(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Loan deleted successfully',
    data: result,
  });
});

export const LoanController = {
  createLoan,
  getAllLoan,
  updateLoan,
  deleteLoan,
};
