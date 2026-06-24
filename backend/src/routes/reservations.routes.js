import { Router } from "express";
import { createReservation, uploadPaymentReceipt } from "../controller/reservation.controller.js";
import { rulesCreateReservation } from '../validators/customer.rules.js';
import { validateRules } from "../middleware/validate.middleware.js";
import upload from "../services/multer.service.js";

const router = Router();

router.get('/test-email', async (req, res) => {
  try {
    const adminEmail = process.env.EMAIL_USER || 'panelglampinglosbosques@gmail.com';
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: adminEmail,
        pass: process.env.EMAIL_PASS || 'rewy rlvo bdwi qxqf'
      }
    });
    const info = await transporter.sendMail({
      from: '"Sistema Glamping" <' + adminEmail + '>',
      to: adminEmail,
      subject: 'Prueba desde Render API',
      text: 'Funcionando correctamente'
    });
    res.json({ success: true, info });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, stack: err.stack });
  }
});

router.post('/', upload.single('comprobante'), rulesCreateReservation, validateRules, createReservation);
router.put('/:id/payment', upload.single('comprobante'), uploadPaymentReceipt);

export default router;