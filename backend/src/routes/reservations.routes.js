import { Router } from "express";
import { createReservation, uploadPaymentReceipt } from "../controller/reservation.controller.js";
import { rulesCreateReservation } from '../validators/customer.rules.js';
import { validateRules } from "../middleware/validate.middleware.js";
import upload from "../services/multer.service.js";

const router = Router();

router.post('/', upload.single('comprobante'), rulesCreateReservation, validateRules, createReservation);
router.put('/:id/payment', upload.single('comprobante'), uploadPaymentReceipt);

export default router;