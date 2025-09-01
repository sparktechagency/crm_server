/* eslint-disable @typescript-eslint/no-explicit-any */

import { TAuthUser } from '../../interface/authUser';
import Repayments from '../repayments/repayments.model';

export const commonPipeline: any[] = [
  {
    $group: {
      _id: {
        month: { $month: '$createdAt' },
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
];

export const getAggregateAmount = async (
  user: TAuthUser,
  matchCriteria: object,
  sumField: string,
) => {
  const result = await Repayments.aggregate([
    {
      $match: {
        ...matchCriteria,
      },
    },
    {
      $group: {
        _id: null,
        amount: {
          $sum: sumField,
        },
      },
    },
    {
      $project: {
        _id: 0,
        amount: 1,
      },
    },
  ]);

  return result.length > 0 ? result[0].amount : 0;
};
