import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres.pxzhqxrdajlcahkvadsj:GlampingDB2026@aws-1-us-east-1.pooler.supabase.com:6543/postgres'
});

async function main() {
  await client.connect();
  try {
    const res = await client.query('SELECT pg_get_viewdef(\'vista_paquetes\', true)');
    console.log(res.rows[0].pg_get_viewdef);
  } finally {
    await client.end();
  }
}
main().catch(console.error);
