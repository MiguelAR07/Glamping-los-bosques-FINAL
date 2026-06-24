const payload = {
  cliente: {
    nombre: "Prueba Definitiva Vercel",
    email: "panelglampinglosbosques@gmail.com",
    tipo_identificacion: "CC",
    numero_identificacion: "999999999",
    pais_residencia: "Colombia",
    contacto: "3147822970"
  },
  reserva: {
    llegada: "2026-08-01",
    salida: "2026-08-03",
    por_pagar: 200000
  },
  paquete: {
    nombre: "Reserva - Test Definitivo",
    cabana_id: 1,
    dias_estadia: 2,
    descripcion: "Test Paquete",
    tipo_id: 4
  },
  factura: {
    subtotal: 300000,
    descuento: 0
  }
};

fetch("https://backend-landing-x76z.onrender.com/api/reservations", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
