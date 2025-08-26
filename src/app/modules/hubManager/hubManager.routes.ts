import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import { HubManagerController } from './hubManager.controller';

const router = Router();

router.get(
  '/field_officer_request',
  auth(USER_ROLE.hubManager, USER_ROLE.admin),
  HubManagerController.allFieldOfficerRequest,
);

export const HubManagerRoutes = router;
