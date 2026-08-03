import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres.pxzhqxrdajlcahkvadsj:GlampingDB2026@aws-1-us-east-1.pooler.supabase.com:6543/postgres'
});

async function main() {
  await client.connect();
  try {
    const res = await client.query('SELECT paquete_id, cabana_id, tipo_id, nombre, precio_promocional, descripcion FROM paquetes WHERE estado = \'Activo\' ORDER BY cabana_id, tipo_id');
    console.table(res.rows);
  } finally {
    await client.end();
  }
}
main().catch(console.error);
