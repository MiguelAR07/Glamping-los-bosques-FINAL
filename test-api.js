async function test() {
    try {
        const form = new FormData();
        form.append('cliente', JSON.stringify({
            nombre: 'Juan Perez',
            email: 'test@example.com',
            contacto: '1234567890',
            tipo_identificacion: 'CC',
            numero_identificacion: 'RES-1234',
            pais_residencia: 'CO'
        }));
        
        form.append('reserva', JSON.stringify({
            paquete_id: 1,
            llegada: new Date('2026-08-01T15:00:00Z').toISOString(),
            salida: new Date('2026-08-02T13:00:00Z').toISOString(),
            por_pagar: 0,
            adultos: 2,
            ninos: 0,
            mascotas: 0
        }));
        
        form.append('factura', JSON.stringify({
            subtotal: 1000,
            descuento: 0
        }));

        const res = await fetch('https://glamping-los-bosques-final1.onrender.com/api/reservations', {
            method: 'POST',
            body: form
        });
        
        const text = await res.text();
        console.log('STATUS:', res.status);
        console.log('RESPONSE:', text);
    } catch (e) {
        console.error('ERROR:', e.message);
    }
}
test();
