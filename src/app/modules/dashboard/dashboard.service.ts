import mongoose from 'mongoose';
import { TAuthUser } from '../../interface/authUser';
import LeadsAndClientsModel from '../leadsAndClients/leadsAndClients.model';
import Repayments from '../repayments/repayments.model';
import { StatisticHelper } from '../../helper/staticsHelper';
import User from '../user/user.model';
import { USER_ROLE } from '../../constant';
import { commonPipeline } from './dashboard.utils';

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

export const dashboardService = {
  fieldOfficerDashboardCount,
  totalLeadsChart,
  hrDashboardCount,
};
