import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import { UserController } from './user.controller';
import fileUpload from '../../utils/uploadImage';
import parseFormData from '../../middleware/parsedData';

const upload = fileUpload('./public/uploads/images/');

const router = Router();

router
  .post(
    '/create',
    auth(USER_ROLE.hr, USER_ROLE.admin),
    upload.fields([
      { name: 'image', maxCount: 1 },
      { name: 'cv', maxCount: 1 },
    ]),
    parseFormData,
    UserController.createFieldOfficer,
  )
  .get(
    '/',
    auth(
      USER_ROLE.hr,
      USER_ROLE.admin,
      USER_ROLE.hubManager,
      USER_ROLE.spokeManager,
    ),
    UserController.getUsersBaseOnRole,
  )
  .get('/all_managers', auth(USER_ROLE.admin), UserController.getAllManagers)
  .patch(
    '/assign_spoke',
    auth(USER_ROLE.hubManager),
    parseFormData,
    UserController.assignSpoke,
  )
  .patch(
    '/update_users/:id',
    auth(USER_ROLE.hubManager),
    upload.fields([
      { name: 'image', maxCount: 1 },
      { name: 'cv', maxCount: 1 },
    ]),
    parseFormData,
    UserController.updateUsers,
  )
  .patch(
    '/actions/:id',
    auth(USER_ROLE.admin),
    UserController.updateUserActions,
  )
  .delete(
    '/delete_users/:id',
    auth(USER_ROLE.hubManager, USER_ROLE.admin),
    UserController.deleteUsers,
  );

export const UserRoutes = router;
