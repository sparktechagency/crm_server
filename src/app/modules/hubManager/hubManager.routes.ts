import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';

const router = Router();

router.get('/all_spoke_manager', auth(USER_ROLE.hubManager));

export const HubManagerRoutes = router;
