import mongoose from 'mongoose';
import { TAuthUser } from '../../interface/authUser';
import AggregationQueryBuilder from '../../QueryBuilder/aggregationBuilder';
import Notification from './notification.model';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createNotification = async (payload: any) => {
  const notification = new Notification(payload);
  await notification.save();
  return notification;
};

const getNotifications = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  const notificationQuery = new AggregationQueryBuilder(query);

  const result = await notificationQuery
    .customPipeline([
      {
        $match: {
          receiverId: new mongoose.Types.ObjectId(String(user._id)),
        },
      },
    ])
    .paginate()
    .sort()
    .execute(Notification);

  const meta = await notificationQuery.countTotal(Notification);
  return { meta, result };
};

const getNotificationCount = async (user: TAuthUser) => {
  const result = await Notification.countDocuments({
    receiverId: user._id,
    isRead: false,
  }).countDocuments();
  return result;
};

const notificationAction = async (user: TAuthUser) => {
  const findNotification = await Notification.find({
    receiverId: user._id,
    isRead: false,
  });

  if (findNotification.length > 0) {
    Promise.all(
      findNotification.map(async (notification) => {
        notification.isRead = true;
        await notification.save();
      }),
    );
  }
};

export const NotificationService = {
  createNotification,
  getNotifications,
  getNotificationCount,
  notificationAction,
};
