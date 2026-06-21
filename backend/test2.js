import pg from 'pg';
const pool = new pg.Pool({connectionString: 'postgres://postgres:miguel2006@localhost:5432/glamping'});

async function run() {
  try {
    const res = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
    console.log("TABLES:", res.rows.map(r=>r.table_name));
  } finally {
    pool.end();
  }
}
run();
