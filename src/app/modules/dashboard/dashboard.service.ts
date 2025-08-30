import mongoose from 'mongoose';
import { TAuthUser } from '../../interface/authUser';
import LeadsAndClientsModel from '../leadsAndClients/leadsAndClients.model';
import Repayments from '../repayments/repayments.model';
import { StatisticHelper } from '../../helper/staticsHelper';
import User from '../user/user.model';
import { LOAN_APPLICATION_STATUS, USER_ROLE } from '../../constant';
import { commonPipeline } from './dashboard.utils';
import LoanApplication from '../loanApplication/loanApplication.model';

const fieldOfficerDashboardCount = async (user: TAuthUser) => {
  const userId = new mongoose.Types.ObjectId(String(user._id));

  const [totalLeads, totalClients, totalRepaymentsAmount, totalApplication] =
    await Promise.all([
      LeadsAndClientsModel.countDocuments({ fieldOfficerId: userId }),
      LeadsAndClientsModel.countDocuments({
        fieldOfficerId: userId,
        isClient: true,
      }),
      Repayments.aggregate([
        { $match: { fieldOfficerId: userId } },
        { $group: { _id: null, total: { $sum: '$installmentAmount' } } },
        { $project: { _id: 0, total: 1 } },
      ]),
      Repayments.countDocuments({ fieldOfficerId: userId }),
    ]);

  return {
    totalLeads,
    totalClients,
    totalRepaymentsAmount:
      totalRepaymentsAmount.length > 0 ? totalRepaymentsAmount[0].total : 0,
    totalApplication,
  };
};

const totalLeadsChart = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  const { year } = query;
  const { startDate, endDate } = StatisticHelper.statisticHelper(
    year as string,
  );

  const result = await LeadsAndClientsModel.aggregate([
    {
      $match: {
        $and: [
          {
            fieldOfficerId: new mongoose.Types.ObjectId(String(user._id)),
            isClient: false,
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        ],
      },
    },
    ...commonPipeline,
  ]);

  const formattedResult = StatisticHelper.formattedResult(
    result,
    'data',
    'count',
  );

  return formattedResult;
};

const hrDashboardCount = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  const { year } = query;
  const { startDate, endDate } = StatisticHelper.statisticHelper(
    year as string,
  );

  // Run all queries concurrently
  const [totalFieldOfficer, totalManagers, fieldOfficerChart] =
    await Promise.all([
      // Total Field Officers
      User.countDocuments({
        role: USER_ROLE.fieldOfficer,
      }),

      // Total Managers (Hub and Spoke)
      User.aggregate([
        {
          $match: {
            role: { $in: [USER_ROLE.hubManager, USER_ROLE.spokeManager] },
          },
        },
        {
          $count: 'totalManagers',
        },
      ]),

      // Field Officer Chart Data
      User.aggregate([
        {
          $match: {
            role: USER_ROLE.fieldOfficer,
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        ...commonPipeline,
      ]),
    ]);

  // Format the result for the field officer chart
  const formattedResult = StatisticHelper.formattedResult(
    fieldOfficerChart,
    'data',
    'count',
  );

  // Return the aggregated data
  return {
    totalFieldOfficer,
    totalManagers:
      totalManagers.length > 0 ? totalManagers[0].totalManagers : 0,
    formattedResult,
  };
};

const supervisorDashboardOverview = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  const { year } = query;
  const { startDate, endDate } = StatisticHelper.statisticHelper(
    year as string,
  );

  // Run all async operations concurrently
  const [totalApplicationApprove, totalApplicationRejected, totalApplication] =
    await Promise.all([
      LoanApplication.countDocuments({
        supervisorApproval: LOAN_APPLICATION_STATUS.approved,
      }),

      LoanApplication.countDocuments({
        supervisorApproval: LOAN_APPLICATION_STATUS.rejected,
      }),

      LoanApplication.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        ...commonPipeline,
      ]),
    ]);

  // Format the aggregated result
  const formattedResult = StatisticHelper.formattedResult(
    totalApplication,
    'data',
    'count',
  );

  // Return the results
  return {
    totalApplicationApprove,
    totalApplicationRejected,
    totalApplicationChart: formattedResult,
  };
};

const hubManagerDashboardCount = async (user: TAuthUser) => {
  const userId = new mongoose.Types.ObjectId(String(user._id));

  // Run all async operations concurrently using Promise.all
  const [totalClients, totalApplication, totalCollection, totalOverdue] =
    await Promise.all([
      // Total clients
      LeadsAndClientsModel.countDocuments({
        hubId: userId,
        isClient: true,
      }),

      // Total applications
      LoanApplication.countDocuments({
        hubId: userId,
      }),

      // Total collection (aggregate the installment amounts)
      Repayments.aggregate([
        { $match: { hubId: userId } },
        { $group: { _id: null, total: { $sum: '$installmentAmount' } } },
        { $project: { _id: 0, total: 1 } },
      ]),

      // Total overdue (aggregate the penalties)
      Repayments.aggregate([
        { $match: { hubId: userId, status: 'overdue' } },
        { $group: { _id: null, total: { $sum: '$penalty' } } },
        { $project: { _id: 0, total: 1 } },
      ]),
    ]);

  // Return the results, ensuring that collection and overdue have defaults if empty
  return {
    totalClients,
    totalApplication,
    totalCollection: totalCollection.length > 0 ? totalCollection[0].total : 0,
    totalOverdue: totalOverdue.length > 0 ? totalOverdue[0].total : 0,
  };
};

const hubManagerCollectionReport = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  return user;
};

export const dashboardService = {
  fieldOfficerDashboardCount,
  totalLeadsChart,
  hrDashboardCount,
  supervisorDashboardOverview,
  hubManagerDashboardCount,
  hubManagerCollectionReport,
};
