import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
async function test() {
    try {
        const res = await pool.query('SELECT * FROM reservas ORDER BY reserva_id DESC LIMIT 3');
        console.log(res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
test();
