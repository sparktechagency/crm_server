import { Router } from 'express';
import { NotificationRoutes } from '../modules/notification/notification.routes';
import { StaticContentRoutes } from '../modules/staticContent/staticContent.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { UserFieldRoutes } from '../modules/user/userField/user.field.routes';
import { HubManagerRoutes } from '../modules/hubManager/hubManager.routes';
const router = Router();

type TRoutes = {
  path: string;
  route: Router;
};

const routes: TRoutes[] = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/users_field',
    route: UserFieldRoutes,
  },
  {
    path: '/hub_manager',
    route: HubManagerRoutes,
  },
  {
    path: '/notification',
    route: NotificationRoutes,
  },
  {
    path: '/static_content',
    route: StaticContentRoutes,
  },
];

routes.forEach((item) => {
  router.use(item.path, item.route);
});

export default router;
