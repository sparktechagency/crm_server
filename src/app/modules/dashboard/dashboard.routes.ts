import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import { dashboardController } from './dashboard.controller';

const router = Router();

router
  .get(
    '/field_officer_dashboard_count',
    auth(USER_ROLE.fieldOfficer),
    dashboardController.fieldOfficerDashboardCount,
  )
  .get(
    '/leads_chart',
    auth(USER_ROLE.fieldOfficer),
    dashboardController.totalLeadsChart,
  )
  .get(
    '/hr_dashboard_overview',
    auth(USER_ROLE.hr),
    dashboardController.hrDashboardCount,
  )
  .get(
    '/supervisor_dashboard_overview',
    auth(USER_ROLE.supervisor),
    dashboardController.supervisorDashboardOverview,
  )
  .get(
    '/hub_manager_dashboard_count',
    auth(USER_ROLE.hubManager),
    dashboardController.hubManagerDashboardCount,
  )
  .get(
    '/collection_report',
    auth(USER_ROLE.hubManager, USER_ROLE.spokeManager, USER_ROLE.admin),
    dashboardController.hubManagerCollectionReport,
  )
  .get(
    '/loan_approval_report',
    auth(USER_ROLE.hubManager, USER_ROLE.admin),
    dashboardController.hubManagerLoanApprovalReport,
  )
  .get(
    '/all_field_officer_collection',
    auth(USER_ROLE.hubManager, USER_ROLE.spokeManager, USER_ROLE.admin),
    dashboardController.allFieldOfficerCollection,
  )
  .get(
    '/spoke_manager_count',
    auth(USER_ROLE.spokeManager),
    dashboardController.spokeManagerCount,
  )
  .get(
    '/admin_dashboard_count',
    auth(USER_ROLE.admin),
    dashboardController.adminDashboardCount,
  );

export const DashboardRoutes = router;
