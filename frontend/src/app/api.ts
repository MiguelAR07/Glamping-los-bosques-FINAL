import { Cabin, Package, Product, Service, Reservation, BookingPayload, PlanType } from './types'

let baseEnv = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "https://backend-landing-x76z.onrender.com";
if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1" && baseEnv.includes("localhost")) {
  baseEnv = "https://backend-landing-x76z.onrender.com";
}
export const API_BASE_URL = baseEnv.endsWith('/api') ? baseEnv : `${baseEnv}/api`;

// Fetch genérico tipado
async function fetchFromApi<T>(endpoint: string): Promise<T[]> {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`);
  if (!response.ok) throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
  const json = await response.json();
  return Array.isArray(json) ? json : (json.data ?? []);
}

export async function getCabinsFull(): Promise<Cabin[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/cabins/full`);
    if (!response.ok) throw new Error(`Error fetching cabins/full: ${response.statusText}`);
    
    const { cabins, images: allImages } = await response.json();
    
    return cabins.map((cabin: any) => {
      const currentCabinId = Number(cabin.cabana_id);

      const cleanUrl = (url: string) => url ? url.replace('http://localhost:3000', API_BASE_URL.replace('/api', '')) : '';

      const cabinImages = allImages
        .filter((img: any) => Number(img.cabana_id) === currentCabinId)
        .map((img: any) => cleanUrl(img.img_url));

      let extractedFeatures: string[] = [];
      let descText = cabin.descripcion ?? "";
      if (descText.includes("Incluye:")) {
        const parts = descText.split("Incluye:");
        descText = parts[0].trim();
        extractedFeatures = parts[1].split(",").map((f: string) => f.trim());
      }

      const mainImage = cabin.img_url ? [cleanUrl(cabin.img_url)] : [];
      
      // Remove duplicates in case mainImage is also inside cabinImages
      const uniqueImages = new Set();
      const allCabinImages = [];
      
      // Agregamos primero las imagenes_cabana que YA ESTÁN ordenadas por el backend
      for (const img of cabinImages) {
        if (!uniqueImages.has(img)) {
          uniqueImages.add(img);
          allCabinImages.push(img);
        }
      }
      
      // Si no había imágenes, o si falta la principal, la agregamos al final (como fallback)
      if (mainImage.length > 0 && !uniqueImages.has(mainImage[0])) {
         allCabinImages.push(mainImage[0]);
      }
        
      return {
        id: String(cabin.cabana_id),
        nombre: cabin.nombre,
        descripcion: descText,
        img_url: allCabinImages,
        features: extractedFeatures,
        precio_noche: Number(cabin.precio_noche ?? 0),
        plans: {
          occasional: Number(cabin.precio_noche ?? 0),
          week: Number(cabin.precio_noche ?? 0),
          weekend: Number(cabin.precio_noche ?? 0),
          sun_day: Number(cabin.precio_noche ?? 0),
        },
        maxGuests: Number(cabin.capacidad_personas ?? 0),
        additionalPersonPrice: 70000,
      };
    });
  } catch (error) {
    console.error("Error fetching getCabinsFull:", error);
    return [];
  }
}

// Keep the old function for backwards compatibility but make it use the new combined endpoint
export async function getCabins(): Promise<Cabin[]> {
  return getCabinsFull();
}

export async function getServices(): Promise<Service[]> {
  const services = await fetchFromApi<any>("services");

  return services.map((service) => ({
    id: String(service.servicio_id),

    nombre: service.nombre,

    precio: Number(service.precio),

    descripcion: service.descripcion,
  }));
}

export async function getPackages(): Promise<Package[]> {
  const packages = await fetchFromApi<any>("packages");

  return packages.map((packages) => ({
    id: String(packages.paquete_id),

    cabana_id: String(packages.cabana_id),

    dias_estadia: packages.dias_estadia,

    descripcion: packages.descripcion,

    precio: Number(packages.precio || packages.precio_promocional || 0),
    
    tipo_id: String(packages.tipo_id),
  }));
}

export async function getPackageTypes(): Promise<PlanType[]> {
  const types = await fetchFromApi<any>("packages/types");

  return types.map((type: any) => ({
    id: type.tipo_id,
    nombre: type.nombre,
  }));
}

export async function getProducts(): Promise<Product[]> {
  const product = await fetchFromApi<any>("products");

  return product.map((product) => ({
    id: String(product.producto_id),

    nombre: product.nombre,

    tipo: product.tipo,

    precio: Number(product.precio),

    descripcion: product.descripcion,

    img_url: product.img_url ? [product.img_url.replace('http://localhost:3000', API_BASE_URL.replace('/api', ''))] : [],
  }));
}

export async function getReservations(): Promise<Reservation[]> {
  const reservations = await fetchFromApi<any>("reservations");

  return reservations.map((reservation) => ({
    id: String(reservation.reserva_id),

    paquete_id: String(reservation.paquete_id),

    cliente_id: String(reservation.cliente_id),

    llegada: reservation.llegada,

    salida: reservation.salida,

    por_pagar: Number(reservation.por_pagar),
  }));
}

export async function createCustomer(customerData: any) {
  const response = await fetch(`${API_BASE_URL}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al crear el cliente');
  }

  return await response.json();
}

export async function createReservation(payload: BookingPayload) {
  const response = await fetch(`${API_BASE_URL}/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function createInvoice(payload: BookingPayload) {
  const response = await fetch(`${API_BASE_URL}/invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al procesar la factura");
  }

  return await response.json();
}

export async function getReviews() {
  const response = await fetch(`${API_BASE_URL}/reviews`);
  if (!response.ok) throw new Error('Error fetching reviews');
  return await response.json();
}

export async function createReview(data: { nombre: string, texto: string, rating: number }) {
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al crear reseña");
  }

  return await response.json();
}

export async function getBlockedDates() {
  const response = await fetch(`${API_BASE_URL}/availability`);
  if (!response.ok) return [];
  return await response.json();
}

// === PREFETCHING ===
// Estas promesas se inician inmediatamente cuando se carga el módulo (al abrir la página)
// reduciendo drásticamente el tiempo de espera.
export const prefetchCabinsPromise = getCabinsFull().catch(err => {
  console.error("Prefetch cabins failed:", err);
  return [];
});

export const prefetchReviewsPromise = getReviews().catch(err => {
  console.error("Prefetch reviews failed:", err);
  return { success: false, data: [] };
});