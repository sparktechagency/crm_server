import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import { NotificationController } from './notification.controller';

const router = Router();

router
  .get(
    '/',
    auth(
      USER_ROLE.fieldOfficer,
      USER_ROLE.hubManager,
      USER_ROLE.supervisor,
      USER_ROLE.hr,
      USER_ROLE.spokeManager,
      USER_ROLE.admin,
    ),
    NotificationController.getNotifications,
  )
  .get(
    '/notification_count',
    auth(
      USER_ROLE.fieldOfficer,
      USER_ROLE.hubManager,
      USER_ROLE.supervisor,
      USER_ROLE.hr,
      USER_ROLE.spokeManager,
      USER_ROLE.admin,
    ),
    NotificationController.getNotificationCount,
  )
  .patch(
    '/action/',
    auth(
      USER_ROLE.fieldOfficer,
      USER_ROLE.hubManager,
      USER_ROLE.supervisor,
      USER_ROLE.hr,
      USER_ROLE.spokeManager,
      USER_ROLE.admin,
    ),
    NotificationController.notificationAction,
  );

export const NotificationRoutes = router;
