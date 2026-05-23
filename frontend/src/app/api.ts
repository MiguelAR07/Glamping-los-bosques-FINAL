import { Cabin, Package, Product, Service, Reservation, BookingPayload } from './types'

const API_BASE_URL = `http://localhost:3000/api`; // ajusta según tu backend

// Fetch genérico tipado
async function fetchFromApi<T>(endpoint: string): Promise<T[]> {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`);
  if (!response.ok) throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
  const json = await response.json();
  return Array.isArray(json) ? json : (json.data ?? []);
}

// Funciones para obtener cada tipo de dato
export async function getCabins(): Promise<Cabin[]> {
  // 1. Hacemos fetch en paralelo de las cabañas y de todas las imágenes
  const [cabins, allImages] = await Promise.all([
    fetchFromApi<any>("cabins"),
    fetchFromApi<any>("cabins/images") // <-- Pon aquí el endpoint exacto de tu tabla Imagenes_Cabanas
  ]);

  return cabins.map((cabin) => {
    const currentCabinId = Number(cabin.cabana_id);

    // 2. Filtramos las imágenes que le pertenecen a ESTA cabaña en específico
    const cabinImages = allImages
      .filter((img: any) => Number(img.cabana_id) === currentCabinId)
      .map((img: any) => img.img_url); // Nos quedamos solo con el string de la URL

    return {
      id: String(cabin.cabana_id),
      nombre: cabin.nombre,
      descripcion: cabin.descripcion ?? "",
      
      // 3. Le pasamos el array de URLs que recolectamos. 
      // Si no tiene imágenes, le dejamos un array vacío para que no rompa el .map() del componente.
      img_url: cabinImages.length > 0 ? cabinImages : [],

      features: [],

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

    precio: Number(packages.precio),
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

    img_url: product.img_url ? [product.img_url] : [],
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

export interface PackageType {
  tipo_id: number;
  nombre: string;
}

export async function getPackageTypes(): Promise<PackageType[]> {
  return fetchFromApi<PackageType>("packages/types");
}