import { Router } from "express";
import { createReservation, uploadPaymentReceipt } from "../controller/reservation.controller.js";
import { rulesCreateReservation } from '../validators/customer.rules.js';
import { validateRules } from "../middleware/validate.middleware.js";
import upload from "../services/multer.service.js";

const router = Router();

router.get('/test-email', async (req, res) => {
  try {
    const adminEmail = process.env.EMAIL_USER || 'panelglampinglosbosques@gmail.com';
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ success: false, error: 'Falta BREVO_API_KEY' });
    }

    const payload = {
      sender: { name: 'Sistema Glamping Test', email: adminEmail },
      to: [{ email: adminEmail, name: 'Administrador' }],
      subject: 'Prueba desde Render API con Brevo',
      htmlContent: '<p>Funcionando correctamente desde Brevo API!</p>'
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(500).json({ success: false, error: errorData });
    }

    const data = await response.json();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, stack: err.stack });
  }
});

router.post('/', upload.single('comprobante'), rulesCreateReservation, validateRules, createReservation);
router.put('/:id/payment', upload.single('comprobante'), uploadPaymentReceipt);

export default router;