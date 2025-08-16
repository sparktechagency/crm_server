import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import { UserController } from './user.controller';

const router = Router();

router
  .patch(
    '/actions/:id',
    auth(USER_ROLE.admin),
    UserController.updateUserActions,
  )

export const UserRoutes = router;
