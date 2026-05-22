import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
  const PLACE_ID = process.env.GOOGLE_PLACE_ID;

  if (!API_KEY || !PLACE_ID) {
    return res.status(500).json({ error: 'Faltan variables de entorno', success: false });
  }

  try {
    // Intentamos con la API NUEVA (v1) que es la que Google suele activar por defecto ahora
    const urlNew = `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=es`;
    
    const response = await fetch(urlNew, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'reviews,name,formattedAddress'
      }
    });

    const data = await response.json();

    if (data && data.reviews) {
      // Formatear las reseñas para que coincidan con nuestro diseño
      const formattedReviews = data.reviews.map((rev: any) => ({
        name: rev.authorAttribution?.displayName || 'Cliente',
        text: rev.text?.text || '',
        rating: rev.rating || 5,
        date: rev.relativePublishTimeDescription || 'Reciente',
        profile_photo_url: rev.authorAttribution?.photoUri || null
      }));

      return res.status(200).json({
        success: true,
        data: formattedReviews
      });
    }

    // Si la nueva falla, intentamos con la antigua por si acaso (fallback)
    const urlOld = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${API_KEY}&language=es`;
    const resOld = await fetch(urlOld);
    const dataOld = await resOld.json();

    if (dataOld.result && dataOld.result.reviews) {
      const formattedReviews = dataOld.result.reviews.map((rev: any) => ({
        name: rev.author_name,
        text: rev.text,
        rating: rev.rating,
        date: rev.relative_time_description,
        profile_photo_url: rev.profile_photo_url
      }));

      return res.status(200).json({
        success: true,
        data: formattedReviews
      });
    }

    return res.status(404).json({
      success: false,
      error: 'No se encontraron reseñas o la API devolvió un error',
      details: data
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
}
