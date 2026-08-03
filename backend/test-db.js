import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
async function test() {
    try {
        const res = await pool.query("SELECT paquete_id, nombre, cabana_id, estado FROM paquetes WHERE estado = 'Activo'");
        console.log('ACTIVE PACKAGES:', res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
test();
