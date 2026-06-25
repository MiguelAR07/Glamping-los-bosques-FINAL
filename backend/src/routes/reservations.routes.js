import { Router } from "express";
import { createReservation, uploadPaymentReceipt } from "../controller/reservation.controller.js";
import { rulesCreateReservation } from '../validators/customer.rules.js';
import { validateRules } from "../middleware/validate.middleware.js";
import upload from "../services/multer.service.js";

const router = Router();

router.get('/test-email', async (req, res) => {
  try {
    const adminEmail = process.env.EMAIL_USER || 'panelglampinglosbosques@gmail.com';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const { data, error } = await resend.emails.send({
      from: `Sistema Glamping <${fromEmail}>`,
      to: adminEmail,
      subject: 'Prueba desde Render API con Resend',
      text: 'Funcionando correctamente'
    });

    if (error) {
      return res.status(500).json({ success: false, error });
    }
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, stack: err.stack });
  }
});

router.post('/', upload.single('comprobante'), rulesCreateReservation, validateRules, createReservation);
router.put('/:id/payment', upload.single('comprobante'), uploadPaymentReceipt);

export default router;