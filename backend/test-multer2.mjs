async function test() {
    try {
        const fetch = globalThis.fetch;
        const form = new FormData();
        form.append('cliente', JSON.stringify({
            nombre: 'Prueba Local',
            email: 'prueba@local.com',
            contacto: '3001234567',
            tipo_identificacion: 'CC',
            numero_identificacion: '111222333',
            pais_residencia: 'Colombia'
        }));
        
        form.append('reserva', JSON.stringify({
            paquete_id: 10,
            llegada: new Date('2032-02-14T15:00:00Z').toISOString(),
            salida: new Date('2032-02-16T13:00:00Z').toISOString(),
            por_pagar: 0,
            adultos: 2,
            ninos: 0,
            mascotas: 0
        }));

        form.append('factura', JSON.stringify({
            subtotal: 100000,
            descuento: 0
        }));

        // Dummy PNG file
        const blob = new Blob([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 10, 73, 68, 65, 84, 120, 156, 99, 0, 1, 0, 0, 5, 0, 1, 13, 10, 45, 180, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130])], { type: 'image/png' });
        form.append('comprobante', blob, 'test.png');

        console.log('Sending POST to Render API with PNG...');
        const res = await fetch('https://glamping-los-bosques-final1.onrender.com/api/reservations', {
            method: 'POST',
            body: form
        });
        
        const text = await res.text();
        console.log('STATUS:', res.status);
        console.log('RESPONSE:', text);
    } catch (e) {
        console.error('FETCH ERROR:', e);
    }
}
test();
