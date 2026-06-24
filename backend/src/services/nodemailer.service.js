import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'panelglampinglosbosques@gmail.com',
    pass: process.env.EMAIL_PASS || 'rewy rlvo bdwi qxqf'
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000
});

export const sendNewReservationEmail = async (clienteNombre, llegada, salida, paqueteNombre) => {
  try {
    const adminEmail = process.env.EMAIL_USER || 'panelglampinglosbosques@gmail.com';
    
    await transporter.sendMail({
      from: '"Sistema Glamping" <glampinglosbosques9@gmail.com>',
      to: adminEmail,
      subject: '🔔 ¡Nueva Reserva Recibida!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
          <h1 style="color: #059669; text-align: center;">¡Nueva Reserva!</h1>
          <p>Hola Administrador,</p>
          <p>Se ha recibido una nueva reserva desde la página web (Landing).</p>
          
          <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #166534;">Detalles:</h3>
            <ul style="list-style: none; padding-left: 0;">
              <li>👤 <strong>Cliente:</strong> ${clienteNombre}</li>
              <li>📅 <strong>Llegada:</strong> ${llegada}</li>
              <li>📅 <strong>Salida:</strong> ${salida}</li>
              <li>🏕️ <strong>Paquete/Cabaña:</strong> ${paqueteNombre || 'N/A'}</li>
            </ul>
          </div>
          
          <p>Por favor revisa el panel de control para validar el comprobante de pago de esta reserva.</p>
        </div>
      `
    });
    console.log('✅ Email de nueva reserva enviado al administrador.');
  } catch (error) {
    console.error('❌ Error enviando email de nueva reserva:', error);
  }
};

export const sendClientConfirmationEmail = async (clienteEmail, clienteNombre, llegada, salida, paqueteNombre, subtotal, por_pagar) => {
  try {
    const deposito = subtotal - por_pagar;
    
    await transporter.sendMail({
      from: '"Glamping Los Bosques" <glampinglosbosques9@gmail.com>',
      to: clienteEmail,
      subject: '🏕️ Confirmación de Reserva - Glamping Los Bosques',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
          <h1 style="color: #059669; text-align: center;">¡Gracias por tu reserva, ${clienteNombre}!</h1>
          <p>Hemos recibido tu solicitud de reserva con éxito. Por favor, asegúrate de subir tu comprobante de pago para que un administrador pueda confirmar tu estadía.</p>
          
          <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #166534;">Tus Detalles de Reserva:</h3>
            <ul style="list-style: none; padding-left: 0;">
              <li>🏕️ <strong>Plan:</strong> ${paqueteNombre || 'Reserva Glamping'}</li>
              <li>📅 <strong>Llegada:</strong> ${new Date(llegada).toLocaleDateString('es-CO')}</li>
              <li>📅 <strong>Salida:</strong> ${new Date(salida).toLocaleDateString('es-CO')}</li>
              <li>💰 <strong>Total de estadía:</strong> $${subtotal.toLocaleString('es-CO')}</li>
              <li>💳 <strong>Anticipo (50%):</strong> $${deposito.toLocaleString('es-CO')}</li>
              <li>💵 <strong>Saldo por pagar al ingreso:</strong> $${por_pagar.toLocaleString('es-CO')}</li>
            </ul>
          </div>
          
          <p>Te esperamos pronto para que disfrutes de una experiencia inolvidable en la naturaleza.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="margin-bottom: 10px; color: #166534; font-weight: bold;">¿Tienes alguna pregunta o necesitas ayuda?</p>
            <a href="https://wa.me/573103599065" style="background-color: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              💬 Contáctanos por WhatsApp
            </a>
          </div>

          <p style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
            Glamping Los Bosques<br>
            Este es un correo automático, por favor no respondas a esta dirección.
          </p>
        </div>
      `
    });
    console.log('✅ Email de confirmación enviado al cliente.');
  } catch (error) {
    console.error('❌ Error enviando email de confirmación al cliente:', error);
  }
};
