import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import { LocationProfileController } from './locationProfile.controller';
import validateRequest from '../../middleware/validation';
import { LocationProfileValidation } from './locationProfile.validation';

const router = Router();

router
  .post(
    '/create',
    auth(USER_ROLE.admin),
    validateRequest(LocationProfileValidation.CreateLocationProfileSchema),
    LocationProfileController.createLocationProfile,
  )
  .get(
    '/',
    auth(USER_ROLE.admin),
    LocationProfileController.getAllLocationProfile,
  )
  .patch(
    '/:id',
    auth(USER_ROLE.admin),
    validateRequest(LocationProfileValidation.EditLocationProfileSchema),
    LocationProfileController.updateLocationProfile,
  )
  .delete(
    '/:id',
    auth(USER_ROLE.admin),
    LocationProfileController.deleteLocationProfile,
  );

export const LocationProfileRoutes = router;
