/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { LOAN_APPLICATION_STATUS, USER_ROLE } from '../../constant';
import { StatisticHelper } from '../../helper/staticsHelper';
import { TAuthUser } from '../../interface/authUser';
import LeadsAndClientsModel from '../leadsAndClients/leadsAndClients.model';
import LoanApplication from '../loanApplication/loanApplication.model';
import Repayments from '../repayments/repayments.model';
import User from '../user/user.model';
import { commonPipeline, getAggregateAmount } from './dashboard.utils';
import AggregationQueryBuilder from '../../QueryBuilder/aggregationBuilder';
import { filteringCalculation } from '../../utils/filteringCalculation';

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
  const [totalFieldOfficer, totalManagers, allSupervsor, fieldOfficerChart] =
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

      User.countDocuments({
        role: USER_ROLE.supervisor,
      }),

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
    allSupervsor,
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
  const [
    totalApplicationApprove,
    totalApplicationRejected,
    totalApplicationPending,
    allApplicationCount,
    totalApplication,
  ] = await Promise.all([
    LoanApplication.countDocuments({
      supervisorApproval: LOAN_APPLICATION_STATUS.approved,
    }),

    LoanApplication.countDocuments({
      supervisorApproval: LOAN_APPLICATION_STATUS.rejected,
    }),

    LoanApplication.countDocuments({
      supervisorApproval: LOAN_APPLICATION_STATUS.pending,
    }),

    LoanApplication.countDocuments({}),

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
    totalApplicationPending,
    allApplicationCount,
    totalApplicationChart: formattedResult,
  };
};

const hubManagerDashboardCount = async (user: TAuthUser) => {
  const userId = new mongoose.Types.ObjectId(String(user._id));

  // Run all async operations concurrently using Promise.all
  const [totalClients, totalLeads, totalApplication, totalCollection, totalOverdue, approvedApplication, rejectedApplication, pendingApplication] =
    await Promise.all([
      // Total clients
      LeadsAndClientsModel.countDocuments({
        hubId: userId,
        isClient: true,
      }),
      // Total clients
      LeadsAndClientsModel.countDocuments({
        hubId: userId,
        isClient: false,
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

       // Total approved applications
      LoanApplication.countDocuments({
        hubId: userId,
        hubManagerApproval: "approved"
      }),
       // Total rejected applications
      LoanApplication.countDocuments({
        hubId: userId,
        hubManagerApproval: "rejected"
      }),
      LoanApplication.countDocuments({
        hubId: userId,
        hubManagerApproval: "pending"
      }),
    ]);

  // Return the results, ensuring that collection and overdue have defaults if empty
  return {
    totalClients,
    totalLeads,
    totalApplication,
    approvedApplication, 
    rejectedApplication,
    pendingApplication,
    totalCollection:
      totalCollection.length > 0 ? totalCollection[0].total.toFixed(2) : 0,
    totalOverdue: totalOverdue.length > 0 ? totalOverdue[0].total : 0,
  };
};

const hubManagerCollectionReport = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  const { year } = query;
  const { startDate, endDate } = StatisticHelper.statisticHelper(
    year as string,
  );

  const userId =
    user.role === USER_ROLE.hubManager
      ? { hubId: new mongoose.Types.ObjectId(String(user._id)) }
      : user.role === USER_ROLE.spokeManager
        ? { spokeId: new mongoose.Types.ObjectId(String(user._id)) }
        : user.role === USER_ROLE.fieldOfficer
          ? {
              fieldOfficerId: new mongoose.Types.ObjectId(String(user._id)),
            }
          : {};

  const result = await Repayments.aggregate([
    {
      $match: {
        ...userId,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
        },
        totalInstallmentAmount: { $sum: '$installmentAmount' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.month',
        data: {
          $push: {
            totalInstallmentAmount: '$totalInstallmentAmount',
            count: '$totalInstallmentAmount',
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

const hubManagerLoanApprovalReport = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  const { year } = query;
  const { startDate, endDate } = StatisticHelper.statisticHelper(
    year as string,
  );

  let commonMatchStage = {};

  if (user.role === USER_ROLE.hubManager) {
    commonMatchStage = {
      hubId: new mongoose.Types.ObjectId(String(user._id)),
      hubManagerApproval: { $ne: 'pending' },
    };
  } else if (user.role === USER_ROLE.admin) {
    commonMatchStage = {
      loanStatus: { $ne: 'pending' },
    };
  } else if (user.role === USER_ROLE.fieldOfficer) {
    commonMatchStage = {
      fieldOfficerId: new mongoose.Types.ObjectId(String(user._id)),
      loanStatus: { $ne: 'pending' },
    };
  }

  const result = await LoanApplication.aggregate([
    {
      $match: {
        ...commonMatchStage,
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: '$hubManagerApproval',
        count: { $sum: 1 },
      },
    },
  ]);

  // Check if there is any result, otherwise set defaults
  const totalApplications = result.reduce((sum, item) => sum + item.count, 0);
  const statuses = ['approved', 'rejected'];
  const percentages = statuses.map((status) => {
    const statusItem = result.find((item) => item._id === status);
    const count = statusItem ? statusItem.count : 0;
    const percentage =
      totalApplications > 0
        ? ((count / totalApplications) * 100).toFixed(2)
        : 0;
    return {
      status,
      count,
      percentage,
    };
  });

  return percentages;
};

const allFieldOfficerCollection = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  const repaymentQuery = new AggregationQueryBuilder(query);

  const { filtering } = query;

  const filteringData = filteringCalculation(filtering as string);

  const userId =
    user.role === USER_ROLE.hubManager
      ? { hubId: new mongoose.Types.ObjectId(String(user._id)) }
      : user.role === USER_ROLE.spokeManager
        ? { spokeId: new mongoose.Types.ObjectId(String(user._id)) }
        : user.role === USER_ROLE.fieldOfficer
          ? {
              spokeId: new mongoose.Types.ObjectId(String(user.spokeId)),
            }
          : {};

  const result = await repaymentQuery
    .customPipeline([
      {
        $match: {
          ...userId,
          ...filteringData,
        },
      },
      {
        $project: {
          fieldOfficerId: 1,
          paidOn: { $dateToString: { format: '%Y-%m-%d', date: '$paidOn' } },
          installmentAmount: 1,
          status: 1,
        },
      },
      {
        $group: {
          _id: {
            fieldOfficerId: '$fieldOfficerId',
            paidOn: '$paidOn',
          },
          totalInstallmentAmount: { $sum: '$installmentAmount' },
          status: { $first: '$status' },
        },
      },
      {
        $group: {
          _id: '$_id.fieldOfficerId',
          dates: {
            $push: {
              date: '$_id.paidOn',
              totalInstallmentAmount: '$totalInstallmentAmount',
            },
          },
          status: { $first: '$status' },
          paidOn: { $first: '$_id.paidOn' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'fieldOfficer',
        },
      },
      {
        $unwind: {
          path: '$fieldOfficer',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          fieldOfficer: 1,
          dates: 1,
          status: 1,
          paidOn: 1,
        },
      },
      {
        $unwind: '$dates',
      },
      {
        $group: {
          _id: '$fieldOfficer._id',
          fieldOfficer: { $first: '$fieldOfficer' },
          totalInstallmentAmount: { $sum: '$dates.totalInstallmentAmount' },
          dates: { $push: '$dates' },
          status: { $first: '$status' },
          paidOn: { $first: '$paidOn' },
        },
      },
      {
        $project: {
          _id: 0,
          fieldOfficer: 1,
          paidOn: 1,
          totalInstallmentAmount: 1,
          status: 1,
        },
      },
    ])
    .filter(['fieldOfficerId', 'paidOn'])
    .sort()
    .paginate()
    .execute(Repayments);

  const meta = await repaymentQuery.countTotal(Repayments);

  return { meta, result };
};

const spokeManagerCount = async (user: TAuthUser) => {
  const todayDateRange = {
    $gte: new Date(new Date().setHours(0, 0, 0, 0)),
    $lte: new Date(new Date().setHours(23, 59, 59, 999)),
  };

  const userId =
    user.role === USER_ROLE.spokeManager
      ? {
          spokeId: new mongoose.Types.ObjectId(String(user._id)),
        }
      : user.role === USER_ROLE.fieldOfficer
        ? {
            fieldOfficerId: new mongoose.Types.ObjectId(String(user._id)),
          }
        : user.role === USER_ROLE.hubManager
          ? { hubId: new mongoose.Types.ObjectId(String(user._id)) }
          : {};

  const matchCriteria = {
    ...userId,
    createdAt: todayDateRange,
  };

  // Fetch both amounts in parallel to optimize time
  const [todayCollectionAmount, overdueAmount, allLeads, allCleints] =
    await Promise.all([
      getAggregateAmount(user, matchCriteria, '$installmentAmount'),
      getAggregateAmount(
        user,
        { ...matchCriteria, status: 'overdue' },
        '$penalty',
      ),
      LeadsAndClientsModel.countDocuments({
        spokeId: user._id,
      }),
      LeadsAndClientsModel.countDocuments({
        spokeId: user._id,
        isClient: true,
      }),
    ]);

  return {
    todayCollection: todayCollectionAmount,
    overdue: overdueAmount,
    allLeads,
    allCleints,
  };
};

const adminDashboardCount = async (user: TAuthUser) => {
  // Fetch aggregate amounts and counts in parallel to optimize execution time
  const [totalCollection, totalOverdue, totalApplication, totalClients] =
    await Promise.all([
      getAggregateAmount(user, {}, '$installmentAmount'),
      getAggregateAmount(user, { status: 'overdue' }, '$penalty'),
      LoanApplication.countDocuments({}),
      LeadsAndClientsModel.countDocuments({ isClient: true }),
    ]);

  return {
    totalCollection: totalCollection.toFixed(2),
    totalOverdue,
    totalApplication,
    totalClients,
  };
};

const seeSpokeManageAnalytics = async (userId: string) => {
  // Fetch both amounts in parallel to optimize time
  const [todayCollectionAmount, overdueAmount, fieldOfficers, clients] =
    await Promise.all([
      await Repayments.aggregate([
        {
          $match: {
            spokeId: new mongoose.Types.ObjectId(String(userId)),
          },
        },
        {
          $group: {
            _id: null,
            amount: {
              $sum: '$installmentAmount',
            },
          },
        },
        {
          $project: {
            _id: 0,
            amount: 1,
          },
        },
      ]),
      await Repayments.aggregate([
        {
          $match: {
            spokeId: new mongoose.Types.ObjectId(String(userId)),
            status: 'overdue',
          },
        },
        {
          $group: {
            _id: null,
            amount: {
              $sum: '$penalty',
            },
          },
        },
        {
          $project: {
            _id: 0,
            amount: 1,
          },
        },
      ]),
      User.countDocuments({
        role: USER_ROLE.fieldOfficer,
        spokeId: userId,
      }),
      LeadsAndClientsModel.countDocuments({
        spokeId: userId,
        isClient: true,
      }),
    ]);

  return {
    todayCollection:
      todayCollectionAmount.length > 0 ? todayCollectionAmount[0].amount : 0,
    overdue: overdueAmount.length > 0 ? overdueAmount[0].amount : 0,
    fieldOfficers,
    clients,
  };
};

export const dashboardService = {
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
