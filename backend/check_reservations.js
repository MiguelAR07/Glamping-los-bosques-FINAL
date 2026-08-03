import pool from './src/config/db.js';

async function main() {
  try {
    const res = await pool.query(`
      SELECT r.reserva_id, r.llegada, p.nombre, p.precio_promocional, c.nombre as cabana, f.subtotal 
      FROM reservas r 
      JOIN facturas f ON r.reserva_id = f.reserva_id 
      JOIN paquetes p ON r.paquete_id = p.paquete_id 
      JOIN cabanas c ON p.cabana_id = c.cabana_id 
      ORDER BY r.reserva_id DESC 
      LIMIT 5
    `);
    console.log(res.rows);
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

main();
