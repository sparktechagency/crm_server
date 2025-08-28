import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { HubManagerRoutes } from '../modules/hubManager/hubManager.routes';
import { LeadsAndClientsRoutes } from '../modules/leadsAndClients/leadsAndClients.routes';
import { LeadsAndClientsFieldRoutes } from '../modules/leadsAndClients/leadsAndClientsFields/LeadsAndClientsField.routes';
import { LoanApplicationRoutes } from '../modules/loanApplication/loanApplication.routes';
import { LoansRoutes } from '../modules/loans/loans.routes';
import { LocationProfileRoutes } from '../modules/locationProfile/locationProfile.routes';
import { NotificationRoutes } from '../modules/notification/notification.routes';
import { StaticContentRoutes } from '../modules/staticContent/staticContent.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { UserFieldRoutes } from '../modules/user/userField/user.field.routes';
import { RepaymentsRoutes } from '../modules/repayments/repayments.routes';
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
  {
    path: '/loans',
    route: LoansRoutes,
  },
  {
    path: '/leads_and_clients',
    route: LeadsAndClientsRoutes,
  },
  {
    path: '/loan_application',
    route: LoanApplicationRoutes,
  },
  {
    path: '/location_profile',
    route: LocationProfileRoutes,
  },
  {
    path: '/repayments',
    route: RepaymentsRoutes,
  },

  // fields related routes
  {
    path: '/users_field',
    route: UserFieldRoutes,
  },
  {
    path: '/leads_and_clients_field',
    route: LeadsAndClientsFieldRoutes,
  },
];

routes.forEach((item) => {
  router.use(item.path, item.route);
});

export default router;
