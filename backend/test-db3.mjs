import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
async function test() {
    try {
        const res = await pool.query('SELECT reserva_id, adultos, ninos, mascotas FROM reservas WHERE reserva_id = 112');
        console.log(res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
test();
