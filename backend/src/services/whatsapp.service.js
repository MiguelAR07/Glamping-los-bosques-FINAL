export const sendWhatsAppNotification = async (message) => {
  const phone = process.env.ADMIN_WHATSAPP_PHONE;
  const apiKey = process.env.CALLMEBOT_API_KEY;

  if (!phone || !apiKey) {
    console.warn("⚠️ No se puede enviar WhatsApp: Faltan credenciales en el archivo .env (ADMIN_WHATSAPP_PHONE o CALLMEBOT_API_KEY)");
    return;
  }

  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;
    
    // Ejecutar petición GET asíncrona sin bloquear
    const response = await fetch(url);
    
    if (response.ok) {
      console.log(`✅ WhatsApp de notificación enviado al número ${phone}`);
    } else {
      console.error(`❌ Error enviando WhatsApp: Status ${response.status}`);
    }
  } catch (error) {
    console.error("❌ Error en sendWhatsAppNotification:", error.message);
  }
};
