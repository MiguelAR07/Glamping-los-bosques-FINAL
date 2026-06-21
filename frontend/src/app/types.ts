export type Cabin = {
  id: string;
  nombre: string;
  descripcion: string;
  img_url: string[];
  features: string[];
  precio_noche: number;
  plans: {
    occasional: number,
    week: number,
    weekend: number,
    sun_day: number
  };
  maxGuests: number;
  additionalPersonPrice: number;
};

export type Service = {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
};

export type PlanType = {
  id: number;
  nombre: string;
  dias_estadia?: number;
};

export type Package = {
  id: string;
  cabana_id: string;
  dias_estadia: number;
  descripcion: string;
  precio: number;
};

export type Product = {
  id: string;
  nombre: string;
  tipo: string;
  precio: number;
  descripcion: string;
  img_url: string[];
};

export type Reservation = {
  id: string;
  paquete_id: string;
  cliente_id: string;
  llegada: string | Date;
  salida: string | Date;
  por_pagar: Number;
};

export type Invoices = {
  id: string;
  reserva_id: string;
  fecha_factura: string | Date;
  subtotal: Number;
  descuento: Number;
};

export interface BookingPayload {
  cliente: {
    nombre: string;
    email: string;
    contacto: string;
    tipo_identificacion: string;
    numero_identificacion: string;
    pais_residencia: string;
  };
  reserva: {
    paquete_id: number | string;
    cliente_id: number | string;
    plan_type?: string;
    llegada: string;
    salida: string;
    por_pagar: number;
  };
  factura: {
    reserva_id: number | string;
    subtotal: number;
    descuento: number;
  };
  paquete: {
    nombre: string;
    cabana_id: number;
    dias_estadia: number;
    descripcion: string;
    tipo_id: number;
  };
  servicios?: {
    servicio_id: number;
    cantidad_personas: number;
  }[];
}