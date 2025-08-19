import { Router } from 'express';
import { UserFieldController } from './user.field.controller';

const router = Router();

router.post('/add_field', UserFieldController.addUserField);

export const UserFieldRoutes = router;
