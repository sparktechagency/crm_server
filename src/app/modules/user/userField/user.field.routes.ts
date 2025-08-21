import { Router } from 'express';
import { UserFieldController } from './user.field.controller';
import { auth } from '../../../middleware/auth';
import { USER_ROLE } from '../../../constant';
import validateRequest from '../../../middleware/validation';
import {
  CreateFieldSchema,
  UpdateFieldSchema,
} from '../../../../shared/validation/commonZodValidation';

const router = Router();

router
  .post(
    '/add_field',
    auth(USER_ROLE.admin),
    validateRequest(CreateFieldSchema),
    UserFieldController.addUserField,
  )
  .get(
    '/get_users_fields',
    auth(USER_ROLE.admin),
    UserFieldController.getUsersFields,
  )
  .patch(
    '/update_field/:id',
    auth(USER_ROLE.admin),
    validateRequest(UpdateFieldSchema),
    UserFieldController.updateUserField,
  )
  .delete(
    '/delete_field/:id',
    auth(USER_ROLE.admin),
    UserFieldController.deleteUserField,
  );

export const UserFieldRoutes = router;
