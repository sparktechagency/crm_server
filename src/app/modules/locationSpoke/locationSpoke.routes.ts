import { Router } from "express";
import { USER_ROLE } from "../../constant";
import { auth } from "../../middleware/auth";
import { LocationSpokeController } from "./locationSpoke.controller";

const router = Router()


router.post('/create', auth(USER_ROLE.admin), LocationSpokeController.createLocationSpoke);

export const LocationSpokeRoutes = router;
