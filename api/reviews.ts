export default async function handler(req: any, res: any) {
  // Configura CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
    const PLACE_ID = process.env.GOOGLE_PLACE_ID; // El usuario deberá configurarlo

    if (!API_KEY || !PLACE_ID) {
      return res.status(500).json({ 
        error: "Faltan las variables de entorno GOOGLE_PLACES_API_KEY o GOOGLE_PLACE_ID en Vercel." 
      });
    }

    // Usar la API de Place Details para obtener las reseñas (máximo 5)
    // Especificamos language=es para que las reseñas (si hay traducciones) o fechas lleguen en español
    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&language=es&key=${API_KEY}`;
    
    const response = await fetch(googleApiUrl);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error("Error from Google API:", data);
      return res.status(500).json({ error: `Error de Google API: ${data.status}` });
    }

    // Formatear las reseñas para que coincidan con la estructura del frontend
    const reviews = data.result.reviews || [];
    
    const formattedReviews = reviews.map((review: any) => {
      return {
        name: review.author_name,
        text: review.text,
        rating: review.rating,
        date: review.relative_time_description, // Ej: "Hace 2 meses"
        profile_photo_url: review.profile_photo_url
      };
    });

    // Caché para evitar agotar la cuota (Cache-Control: s-maxage=3600 -> 1 hora en caché)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    
    return res.status(200).json({
      success: true,
      data: formattedReviews
    });
    
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Error interno del servidor al obtener las reseñas." });
  }
}
