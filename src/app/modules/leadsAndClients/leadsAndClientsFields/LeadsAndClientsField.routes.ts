import { Router } from 'express';
import { CreateFieldSchema } from '../../../../shared/validation/commonZodValidation';
import { USER_ROLE } from '../../../constant';
import { auth } from '../../../middleware/auth';
import validateRequest from '../../../middleware/validation';
import { LeadsAndClientsFieldController } from './LeadsAndClientsField.controller';

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
    '/',
    auth(USER_ROLE.admin),
    LeadsAndClientsFieldController.updateLeadsAndClientsField,
  )
  .delete(
    '/:id',
    auth(USER_ROLE.admin),
    LeadsAndClientsFieldController.deleteLeadsAndClientsField,
  );

export const LeadsAndClientsFieldRoutes = router;
