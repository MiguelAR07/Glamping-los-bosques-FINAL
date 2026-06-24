const payload = {
  cliente: {
    nombre: "Test Agent",
    email: "panelglampinglosbosques@gmail.com",
    tipo_identificacion: "CC",
    numero_identificacion: "123456789",
    pais_residencia: "Colombia",
    contacto: "3147822970"
  },
  reserva: {
    llegada: "2026-07-01",
    salida: "2026-07-03",
    por_pagar: 100000
  },
  paquete: {
    nombre: "Reserva - Test",
    cabana_id: 1,
    dias_estadia: 2,
    descripcion: "Test Paquete",
    tipo_id: 4
  },
  factura: {
    subtotal: 150000,
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
