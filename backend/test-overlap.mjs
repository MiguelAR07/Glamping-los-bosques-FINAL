import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
async function test() {
    try {
        const cabana_id_check = 1;
        const llegada = '2030-01-01T15:00:00Z';
        const salida = '2030-01-05T13:00:00Z';
        const overlapCheck = await pool.query("SELECT r.reserva_id, r.llegada, r.salida, r.estado FROM reservas r JOIN paquetes p ON r.paquete_id = p.paquete_id WHERE p.cabana_id = $1 AND r.estado NOT IN ('Cancelado', 'Cancelada') AND (r.llegada < $3 AND r.salida > $2)", [cabana_id_check, llegada, salida]);
        console.log('OVERLAPS FOR 2030:', overlapCheck.rows);
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
test();
