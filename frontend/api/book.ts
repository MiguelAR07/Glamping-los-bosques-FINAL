import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Solo permitimos peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed', success: false });
  }

  const { reservationDetails, receiptImageBase64 } = req.body;

  if (!reservationDetails || !receiptImageBase64) {
    return res.status(400).json({ error: 'Faltan datos de la reserva o el comprobante', success: false });
  }

  // Configuración de las variables de entorno de Gmail
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailAppPassword) {
    console.error('Faltan variables de entorno GMAIL_USER o GMAIL_APP_PASSWORD');
    return res.status(500).json({ error: 'El servidor de correos no está configurado correctamente', success: false });
  }

  try {
    // 1. Configurar Nodemailer con Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    // 2. Extraer el base64 limpio (quitar el prefijo "data:image/png;base64,")
    const matches = receiptImageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let base64Data = receiptImageBase64;
    let mimeType = 'image/jpeg';
    let fileExtension = 'jpg';

    if (matches && matches.length === 3) {
      mimeType = matches[1];
      base64Data = matches[2];
      fileExtension = mimeType.split('/')[1] === 'pdf' ? 'pdf' : mimeType.split('/')[1];
    }

    // 3. Crear el diseño HTML del correo
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-w-xl; margin: 0 auto; color: #333;">
        <div style="background-color: #059669; padding: 20px; text-align: center; color: white;">
          <h2>🔔 ¡Nueva Solicitud de Reserva!</h2>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; background-color: #fafafa;">
          <p>Has recibido una nueva solicitud de reserva con comprobante adjunto. Por favor revisa tu cuenta bancaria y confirma con el cliente.</p>
          
          <h3 style="color: #059669; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Detalles del Cliente</h3>
          <ul>
            <li><strong>Nombre:</strong> ${reservationDetails.customerName}</li>
            <li><strong>Documento:</strong> ${reservationDetails.document}</li>
            <li><strong>Teléfono:</strong> ${reservationDetails.customerPhone}</li>
            <li><strong>Email:</strong> ${reservationDetails.customerEmail}</li>
          </ul>

          <h3 style="color: #059669; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Detalles de la Reserva</h3>
          <ul>
            <li><strong>Cabaña:</strong> ${reservationDetails.cabinName}</li>
            <li><strong>Plan:</strong> ${reservationDetails.planType}</li>
            <li><strong>Huéspedes:</strong> ${reservationDetails.guests}</li>
          </ul>

          <h3 style="color: #059669; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Resumen Financiero</h3>
          <ul>
            <li><strong>Total de la estadía:</strong> $${(Number(reservationDetails.total) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</li>
            <li style="font-size: 1.1em;"><strong>Anticipo pagado (50%):</strong> <strong style="color: #059669;">$${(Number(reservationDetails.deposit) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</strong></li>
          </ul>
        </div>
        <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
          El comprobante enviado por el cliente está adjunto a este correo.
        </p>
      </div>
    `;

    // 4. Configurar el correo a enviar
    const mailOptions = {
      from: `"Glamping Web Automatización" <${gmailUser}>`,
      to: gmailUser, // Enviarte el correo a ti mismo
      replyTo: reservationDetails.customerEmail, // Si le das a responder, le respondes al cliente
      subject: `🚨 NUEVA RESERVA: ${reservationDetails.customerName} - ${reservationDetails.cabinName}`,
      html: htmlContent,
      attachments: [
        {
          filename: `Comprobante-${reservationDetails.customerName.replace(/\s+/g, '-')}.${fileExtension}`,
          content: base64Data,
          encoding: 'base64',
          contentType: mimeType
        }
      ]
    };

    // 5. Enviar el correo
    await transporter.sendMail(mailOptions);

    // Opcional: Podríamos enviar un correo de confirmación al cliente aquí también si quisiéramos
    
    return res.status(200).json({ success: true, message: 'Reserva y comprobante enviados correctamente' });
    
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return res.status(500).json({ error: 'Hubo un problema al procesar y enviar el correo', success: false });
  }
}
