import { sendNewReservationEmail, sendClientConfirmationEmail } from './src/services/nodemailer.service.js';

async function testEmails() {
  console.log("Testing new reservation email...");
  await sendNewReservationEmail('Test User', '2026-07-01', '2026-07-03', 'Paquete Prueba');
  
  console.log("Testing client confirmation email...");
  await sendClientConfirmationEmail('panelglampinglosbosques@gmail.com', 'Test Client', '2026-07-01', '2026-07-03', 'Paquete Prueba', 100000, 50000);
  
  console.log("Done.");
}

testEmails();
