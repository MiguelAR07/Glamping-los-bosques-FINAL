import https from 'https';

export const sendWhatsAppNotification = async (message) => {
  const phone = process.env.ADMIN_WHATSAPP_PHONE || "+573103599065";
  const apiKey = process.env.CALLMEBOT_API_KEY || "6655638";

  if (!phone || !apiKey) {
    console.warn("⚠️ No se puede enviar WhatsApp: Faltan credenciales en el archivo .env (ADMIN_WHATSAPP_PHONE o CALLMEBOT_API_KEY)");
    return;
  }

  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;
    
    https.get(url, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log(`✅ WhatsApp de notificación enviado al número ${phone}`);
      } else {
        console.error(`❌ Error enviando WhatsApp: Status ${res.statusCode}`);
      }
    }).on('error', (error) => {
      console.error("❌ Error enviando WhatsApp (Red):", error.message);
    });
  } catch (error) {
    console.error("❌ Error en sendWhatsAppNotification:", error.message);
  }
};
