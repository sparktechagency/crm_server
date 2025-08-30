import mongoose from 'mongoose';
import { TAuthUser } from '../../interface/authUser';
import LeadsAndClientsModel from '../leadsAndClients/leadsAndClients.model';
import Repayments from '../repayments/repayments.model';
import { StatisticHelper } from '../../helper/staticsHelper';

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

    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          isClient: '$isClient',
        },
        count: { $sum: 1 },
      },
    },

    {
      $group: {
        _id: '$_id.month',
        data: {
          $push: {
            role: '$_id.role',
            count: '$count',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        month: '$_id',
        data: 1,
      },
    },
    {
      $sort: { month: 1 },
    },
  ]);

  const formattedResult = StatisticHelper.formattedResult(
    result,
    'data',
    'count',
  );

  return formattedResult;
};

export const dashboardService = {
  fieldOfficerDashboardCount,
  totalLeadsChart,
};
