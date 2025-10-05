import httpStatus from 'http-status';
import { TAuthUser } from '../../interface/authUser';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { dashboardService } from './dashboard.service';

const fieldOfficerDashboardCount = catchAsync(async (req, res) => {
  const result = await dashboardService.fieldOfficerDashboardCount(
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Dashboard fetched successfully',
    data: result,
  });
});

const totalLeadsChart = catchAsync(async (req, res) => {
  const result = await dashboardService.totalLeadsChart(
    req.user as TAuthUser,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Dashboard fetched successfully',
    data: result,
  });
});

const hrDashboardCount = catchAsync(async (req, res) => {
  const result = await dashboardService.hrDashboardCount(
    req.user as TAuthUser,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Dashboard fetched successfully',
    data: result,
  });
});

const supervisorDashboardOverview = catchAsync(async (req, res) => {
  const result = await dashboardService.supervisorDashboardOverview(
    req.user as TAuthUser,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Supervisor dashboard fetched successfully',
    data: result,
  });
});

const hubManagerDashboardCount = catchAsync(async (req, res) => {
  const result = await dashboardService.hubManagerDashboardCount(
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'HUb manager dashboard count fetched successfully',
    data: result,
  });
});

const hubManagerCollectionReport = catchAsync(async (req, res) => {
  const result = await dashboardService.hubManagerCollectionReport(
    req.user as TAuthUser,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Hub manager collection report fetched successfully',
    data: result,
  });
});

const hubManagerLoanApprovalReport = catchAsync(async (req, res) => {
  const result = await dashboardService.hubManagerLoanApprovalReport(
    req.user as TAuthUser,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Hub manager loan approval report fetched successfully',
    data: result,
  });
});

const allFieldOfficerCollection = catchAsync(async (req, res) => {
  const result = await dashboardService.allFieldOfficerCollection(
    req.user as TAuthUser,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'all field officer collection fetched successfully',
    data: result,
  });
});

const spokeManagerCount = catchAsync(async (req, res) => {
  const result = await dashboardService.spokeManagerCount(
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Spoke manager count fetched successfully',
    data: result,
  });
});

const adminDashboardCount = catchAsync(async (req, res) => {
  const result = await dashboardService.adminDashboardCount(
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin dashboard count fetched successfully',
    data: result,
  });
});

const seeSpokeManageAnalytics = catchAsync(async (req, res) => {
  const result = await dashboardService.seeSpokeManageAnalytics(
    req.params.spokeId,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Spoke manager analytics fetched successfully',
    data: result,
  });
});

export const dashboardController = {
  fieldOfficerDashboardCount,
  totalLeadsChart,
  hrDashboardCount,
  supervisorDashboardOverview,
  hubManagerDashboardCount,
  hubManagerCollectionReport,
  hubManagerLoanApprovalReport,
  allFieldOfficerCollection,
  spokeManagerCount,
  adminDashboardCount,
  seeSpokeManageAnalytics,
};
