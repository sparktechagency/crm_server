import { Router } from 'express';
import { LeadsAndClientsFieldController } from './LeadsAndClientsField.controller';
import { auth } from '../../../middleware/auth';
import { USER_ROLE } from '../../../constant';
import {
  CreateFieldSchema,
  UpdateFieldSchema,
} from '../../../../shared/validation/commonZodValidation';
import validateRequest from '../../../middleware/validation';

const router = Router();

router
  .post(
    '/add_field',
    auth(USER_ROLE.admin),
    validateRequest(CreateFieldSchema),
    LeadsAndClientsFieldController.addLeadsAndClientsField,
  )
  .get(
    '/',
    auth(USER_ROLE.admin),
    LeadsAndClientsFieldController.getLeadsAndClientsFields,
  )
  .patch(
    '/:id',
    auth(USER_ROLE.admin),
    validateRequest(UpdateFieldSchema),
    LeadsAndClientsFieldController.updateLeadsAndClientsField,
  )
  .delete(
    '/:id',
    auth(USER_ROLE.admin),
    LeadsAndClientsFieldController.deleteLeadsAndClientsField,
  );

export const LeadsAndClientsFieldRoutes = router;
