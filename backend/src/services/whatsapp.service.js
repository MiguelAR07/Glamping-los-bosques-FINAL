import https from 'https';

export const sendWhatsAppNotification = async (message, targetPhone = null) => {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const rawPhone = targetPhone || process.env.ADMIN_WHATSAPP_PHONE || "573103599065";
  let cleanPhone = String(rawPhone).replace(/\D/g, '');
  
  // Agregar código de país de Colombia (57) automáticamente si el número tiene 10 dígitos (formato local)
  if (cleanPhone.length === 10) {
    cleanPhone = '57' + cleanPhone;
  }

  if (!token || !phoneId) {
    console.warn("⚠️ Meta WhatsApp API no está configurada. Variables faltantes:", !token ? "WHATSAPP_TOKEN" : "", !phoneId ? "WHATSAPP_PHONE_ID" : "");
    return;
  }

  try {
    const url = `https://graph.facebook.com/v19.0/${phoneId}/messages`;
    
    // Usar template aprobado por Meta para poder enviar fuera de la ventana de 24 horas
    const body = JSON.stringify({
      messaging_product: "whatsapp",
      to: cleanPhone,
      type: "template",
      template: {
        name: "hello_world",
        language: { code: "en_US" }
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
          console.log(`✅ WhatsApp enviado a ${cleanPhone}`);
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
