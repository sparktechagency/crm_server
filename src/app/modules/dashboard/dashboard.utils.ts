/* eslint-disable @typescript-eslint/no-explicit-any */

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
