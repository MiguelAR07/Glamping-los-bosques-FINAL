import dotenv from 'dotenv';
dotenv.config();
import pool from './src/config/db.js';

async function test() {
  try {
    const res = await pool.query("SELECT * FROM promociones WHERE estado = 'activo'");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
test();
