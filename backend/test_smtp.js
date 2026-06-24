import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'panelglampinglosbosques@gmail.com',
    pass: 'rewy rlvo bdwi qxqf'
  }
});

async function run() {
  try {
    const info = await transporter.sendMail({
      from: '"Test Glamping" <panelglampinglosbosques@gmail.com>',
      to: 'panelglampinglosbosques@gmail.com',
      subject: 'PRUEBA URGENTE ' + Date.now(),
      text: 'Este es un correo de prueba absoluta. Si lees esto, funciona.'
    });
    console.log('Mensaje enviado exitosamente:', info.messageId);
    console.log('Respuesta SMTP:', info.response);
  } catch (err) {
    console.error('Error fatal:', err);
  }
}

run();
