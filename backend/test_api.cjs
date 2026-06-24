const https = require('https');

const data = JSON.stringify({
  cliente: {
    nombre: "Test Agent",
    email: "panelglampinglosbosques@gmail.com",
    tipo_identificacion: "CC",
    numero_identificacion: "123456789",
    contacto: "3147822970"
  },
  reserva: {
    llegada: "2026-07-01",
    salida: "2026-07-03",
    id_cabana: 1,
    paquete_id: "Basico",
    anticipo: 50000,
    por_pagar: 100000,
    metodo_pago: "transferencia"
  },
  factura: {
    subtotal: 150000,
    impuestos: 0,
    total: 150000
  }
});

const options = {
  hostname: 'backend-landing-x76z.onrender.com',
  port: 443,
  path: '/api/reservations',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
