import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import { RepaymentsController } from './repayments.controller';
import validateRequest from '../../middleware/validation';
import { RepaymentsValidation } from './repayments.validation';

const router = Router();

router
  .post(
    '/create',
    auth(USER_ROLE.fieldOfficer),
    validateRequest(RepaymentsValidation.createRepaymentsSchema),
    RepaymentsController.createRepayments,
  )
  .get(
    '/',
    auth(USER_ROLE.fieldOfficer, USER_ROLE.admin),
    RepaymentsController.getAllRepayments,
  )
  .patch(
    '/confirm/:id',
    auth(USER_ROLE.fieldOfficer),
    RepaymentsController.confirmRepayments,
  )
  .delete(
    '/delete/:id',
    auth(USER_ROLE.admin),
    RepaymentsController.deleteRepayments,
  );

export const RepaymentsRoutes = router;
