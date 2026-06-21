const { Client } = require('pg');
const c = new Client('postgres://postgres:miguel2006@localhost:5432/glamping');

async function run() {
    await c.connect();
    try {
        await c.query('DROP VIEW IF EXISTS vista_reservas CASCADE');
        await c.query(`
            CREATE VIEW vista_reservas AS 
            SELECT 
                r.reserva_id AS id, 
                tp.nombre || ' - ' || p.nombre AS paquete, 
                c.nombre AS cliente, 
                r.fecha_registro AS fecha, 
                r.llegada, 
                r.salida, 
                r.estado, 
                r.por_pagar AS "Pago restante", 
                r.factura_url AS comprobante_url, 
                COALESCE(
                    (SELECT string_agg(s.servicio || ' (' || sp.cantidad_personas || ' pax)', ', ') 
                     FROM servicios_por_paquete sp 
                     JOIN vista_servicios s ON sp.servicio_id = s.id 
                     WHERE sp.paquete_id = p.paquete_id), 
                    'Ninguno'
                ) AS "Servicios adicionales" 
            FROM reservas r 
            JOIN clientes c ON c.cliente_id = r.cliente_id 
            JOIN paquetes p ON p.paquete_id = r.paquete_id 
            JOIN tipo_paquete tp ON tp.tipo_id = p.tipo_id
        `);
        console.log('View updated');
    } catch (e) {
        console.error(e);
    } finally {
        await c.end();
    }
}

run();
