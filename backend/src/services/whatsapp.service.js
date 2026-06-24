import https from 'https';

export const sendWhatsAppNotification = async (message, targetPhone = null) => {
  const token = process.env.WHATSAPP_TOKEN || "EAAOvP0dmtNEBR5ZABsh8xj6AF3kursZAV4oAU5M4CbbvpSsyDPYTZA4voaEtPYEGBYnNL9tsxIEejA1JPyGwlRZCBnbWXt8VCxFQZCe585jICtdz0RyddrvoXy74y27LFYpXHZB0vOlRjh6iOSZBqXVvZCzjiUM6Ojr9RA8FV9UdsdHFNLGZBkYvlrYZCTVUhS8J2qwGRT17h35VZAgAmdjO7CH3jsg4bORicAHsk3sN8J90twSFB3Tdsek5eAP0JxAmSUW74vLpOaGZCxOdhsPwZAiY2";
  const phoneId = process.env.WHATSAPP_PHONE_ID || "1084740744732269";
  const rawPhone = targetPhone || process.env.ADMIN_WHATSAPP_PHONE || "573103599065";
  let cleanPhone = String(rawPhone).replace(/\D/g, '');
  
  // Agregar código de país de Colombia (57) automáticamente si el número tiene 10 dígitos (formato local)
  if (cleanPhone.length === 10) {
    cleanPhone = '57' + cleanPhone;
  }

  if (!token || !phoneId) {
    console.warn("⚠️ Meta WhatsApp API no está configurada.");
    return;
  }

  try {
    const url = `https://graph.facebook.com/v19.0/${phoneId}/messages`;
    
    // ATENCIÓN: Si estamos en modo de prueba o fuera de la ventana de 24h,
    // debemos usar un template (plantilla).
    const body = JSON.stringify({
      messaging_product: "whatsapp",
      to: cleanPhone,
      type: "template",
      template: {
        name: "reserva_confirmada",
        language: { code: "es" }
      }
    });

    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ WhatsApp de Meta enviado a ${cleanPhone}`);
        } else {
          console.error(`❌ Error Meta WhatsApp (${res.statusCode}):`, data);
        }
      });
    });

    req.on('error', (error) => {
      console.error("❌ Error enviando WhatsApp (Red):", error.message);
    });

    req.write(body);
    req.end();
  } catch (error) {
    console.error("❌ Error en sendWhatsAppNotification:", error.message);
  }
};
