import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import { LoanController } from './loans.controller';
import validateRequest from '../../middleware/validation';
import { CreateLoanSchema } from './loans.validation';

const router = Router();

router
  .post(
    '/create',
    auth(USER_ROLE.admin),
    validateRequest(CreateLoanSchema),
    LoanController.createLoan,
  )
  .get('/', auth(USER_ROLE.admin), LoanController.getAllLoan)
  .patch(
    '/:id',
    auth(USER_ROLE.admin),
    validateRequest(CreateLoanSchema),
    LoanController.updateLoan,
  )
  .delete('/:id', auth(USER_ROLE.admin), LoanController.deleteLoan);

export const LoansRoutes = router;
