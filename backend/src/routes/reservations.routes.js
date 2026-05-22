import { Router } from "express";
import { createReservation } from "../controller/reservation.controller.js";
import { rulesCreateReservation } from '../validators/customer.rules.js';
import { validateRules } from "../middleware/validate.middleware.js";

const router = Router();

router.post('/', rulesCreateReservation, validateRules, createReservation);

export default router;