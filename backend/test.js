import pg from 'pg';
const pool = new pg.Pool({connectionString: 'postgres://postgres:miguel2006@localhost:5432/glamping'});

async function run() {
  try {
    const res = await pool.query(`SELECT proname, prosrc FROM pg_proc WHERE prosrc ILIKE '%productos_por_paquete%'`);
    console.log("FUNCTIONS:", res.rows);
    
    const res2 = await pool.query(`SELECT trigger_name, action_statement FROM information_schema.triggers WHERE event_object_table IN ('reservas', 'facturas', 'paquetes')`);
    console.log("TRIGGERS:", res2.rows);
  } finally {
    pool.end();
  }
}
run();
