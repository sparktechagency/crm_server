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
  .patch(
    '/actions/:id',
    auth(USER_ROLE.admin),
    UserController.updateUserActions,
  );

export const UserRoutes = router;
