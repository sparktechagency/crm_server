import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import { LeadsAndClientsController } from './leadsAndClients.controller';
import fileUpload from '../../utils/uploadImage';
import parseFormData from '../../middleware/parsedData';

const upload = fileUpload('./public/uploads/images/');

const router = Router();

router
  .post(
    '/create',
    auth(USER_ROLE.fieldOfficer),
    upload.single('image'),
    parseFormData,
    LeadsAndClientsController.createLeadsAndClients,
  )
  .get(
    '/',
    auth(USER_ROLE.fieldOfficer, USER_ROLE.hubManager),
    LeadsAndClientsController.getLeadsAndClients,
  )
  .get(
    '/all_clients',
    auth(USER_ROLE.fieldOfficer, USER_ROLE.hubManager),
    LeadsAndClientsController.getAllClients,
  )
  .patch(
    '/update/:id',
    auth(USER_ROLE.fieldOfficer),
    upload.single('image'),
    parseFormData,
    LeadsAndClientsController.updateLeadsOrClients,
  )
  .delete(
    '/delete/:id',
    auth(USER_ROLE.fieldOfficer, USER_ROLE.hubManager),
    LeadsAndClientsController.deleteLeadsOrClients,
  )
  .delete(
    '/delete_client/:id',
    auth(USER_ROLE.hubManager),
    LeadsAndClientsController.deleteClient,
  );

export const LeadsAndClientsRoutes = router;
