import { Router } from 'express';
import {
  CreateFieldSchema,
  UpdateFieldSchema,
} from '../../../../shared/validation/commonZodValidation';
import { USER_ROLE } from '../../../constant';
import { auth } from '../../../middleware/auth';
import validateRequest from '../../../middleware/validation';
import { RepaymentsFieldController } from './repaymentsField.controller';

const router = Router();

router
  .post(
    '/add_field',
    auth(USER_ROLE.admin),
    validateRequest(CreateFieldSchema),
    RepaymentsFieldController.addUserField,
  )
  .get('/', auth(USER_ROLE.admin), RepaymentsFieldController.getRepaymentsField)
  .patch(
    '/',
    auth(USER_ROLE.admin),
    validateRequest(UpdateFieldSchema),
    RepaymentsFieldController.updateUserField,
  )
  .delete(
    '/:id',
    auth(USER_ROLE.admin),
    RepaymentsFieldController.deleteUserField,
  );

export const RepaymentsFieldRoutes = router;
