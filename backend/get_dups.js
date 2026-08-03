import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres.pxzhqxrdajlcahkvadsj:GlampingDB2026@aws-1-us-east-1.pooler.supabase.com:6543/postgres'
});

async function main() {
  await client.connect();
  try {
    const pkgsRes = await client.query('SELECT paquete_id, cabana_id, tipo_id, precio_promocional FROM paquetes WHERE estado = \'Activo\'');
    const packages = pkgsRes.rows;
    
    const map = new Map();
    for (const p of packages) {
      const key = `${p.cabana_id}-${p.tipo_id}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    }
    
    const toKeep = [];
    const toDelete = [];
    
    for (const [key, list] of map.entries()) {
      if (list.length === 1) {
        toKeep.push(list[0].paquete_id);
      } else {
        const withPromo = list.filter(p => Number(p.precio_promocional || 0) > 0);
        let best = null;
        if (withPromo.length > 0) {
          best = withPromo.reduce((a, b) => a.paquete_id > b.paquete_id ? a : b);
        } else {
          best = list.reduce((a, b) => a.paquete_id > b.paquete_id ? a : b);
        }
        toKeep.push(best.paquete_id);
        
        for (const p of list) {
          if (p.paquete_id !== best.paquete_id) {
            toDelete.push(p.paquete_id);
          }
        }
      }
    }
    
    console.log('Total to keep:', toKeep.length);
    console.log('Total to delete:', toDelete.length);
    console.log('To Delete IDs:', toDelete.join(', '));
  } finally {
    await client.end();
  }
}
main().catch(console.error);
