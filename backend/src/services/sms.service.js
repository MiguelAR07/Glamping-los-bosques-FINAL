export const sendSmsNotification = async (message, targetPhone) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromPhone) {
    console.warn("⚠️ Twilio no está configurado (Faltan variables de entorno). No se enviará el SMS.");
    return;
  }

  // Limpiar el número y asegurar el formato E.164 (+57...)
  let cleanPhone = String(targetPhone).replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = '+57' + cleanPhone; // Asumir Colombia por defecto
  } else if (!cleanPhone.startsWith('+')) {
    cleanPhone = '+' + cleanPhone;
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const token = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const bodyParams = new URLSearchParams({
      To: cleanPhone,
      From: fromPhone,
      Body: message
    });

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: bodyParams
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(`❌ Error en Twilio SMS (${res.status}):`, data.message);
      return;
    }

    console.log(`✅ SMS enviado exitosamente a ${cleanPhone} (SID: ${data.sid})`);
  } catch (error) {
    console.error("❌ Error inesperado enviando SMS con Twilio:", error.message);
  }
};
