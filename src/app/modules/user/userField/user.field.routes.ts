import { Router } from 'express';
import { CreateFieldSchema } from '../../../../shared/validation/commonZodValidation';
import { USER_ROLE } from '../../../constant';
import { auth } from '../../../middleware/auth';
import validateRequest from '../../../middleware/validation';
import { UserFieldController } from './user.field.controller';

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
    auth(USER_ROLE.admin, USER_ROLE.hr),
    UserFieldController.getUsersFields,
  )
  .patch(
    '/update_field',
    auth(USER_ROLE.admin),
    // validateRequest(UpdateFieldSchema),
    UserFieldController.updateUserField,
  )
  .delete(
    '/delete_field/:id',
    auth(USER_ROLE.admin),
    UserFieldController.deleteUserField,
  );

export const UserFieldRoutes = router;
