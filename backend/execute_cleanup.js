import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres.pxzhqxrdajlcahkvadsj:GlampingDB2026@aws-1-us-east-1.pooler.supabase.com:6543/postgres'
});

async function main() {
  await client.connect();
  try {
    console.log('--- INICIANDO LIMPIEZA DE BASE DE DATOS ---');
    
    // 1. Limpiar reservas, facturas, pagos, reembolsos y reiniciar secuencias
    console.log('Ejecutando TRUNCATE en Reservas con RESTART IDENTITY y CASCADE...');
    await client.query('TRUNCATE TABLE reservas RESTART IDENTITY CASCADE;');
    console.log('✅ Reservas y datos asociados eliminados. Secuencias reiniciadas.');
    
    // Como Facturas y Pagos se borran en cascada pero no son parte del IDENTITY de reservas, 
    // sus secuencias podrían no reiniciarse con el cascade de la tabla padre.
    // Vamos a reiniciarlas manualmente por seguridad.
    console.log('Reiniciando secuencias de facturas y pagos manualmente...');
    await client.query('ALTER SEQUENCE facturas_factura_id_seq RESTART WITH 1;');
    await client.query('ALTER SEQUENCE pagos_pago_id_seq RESTART WITH 1;');
    console.log('✅ Secuencias de facturas y pagos reiniciadas.');

    // 2. Limpiar paquetes duplicados
    console.log('Identificando paquetes duplicados...');
    const pkgsRes = await client.query('SELECT paquete_id, cabana_id, tipo_id, precio_promocional FROM paquetes');
    const packages = pkgsRes.rows;
    
    const map = new Map();
    for (const p of packages) {
      const key = `${p.cabana_id}-${p.tipo_id}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    }
    
    const toDelete = [];
    
    for (const [key, list] of map.entries()) {
      if (list.length > 1) {
        const withPromo = list.filter(p => Number(p.precio_promocional || 0) > 0);
        let best = null;
        if (withPromo.length > 0) {
          best = withPromo.reduce((a, b) => a.paquete_id > b.paquete_id ? a : b);
        } else {
          best = list.reduce((a, b) => a.paquete_id > b.paquete_id ? a : b);
        }
        
        for (const p of list) {
          if (p.paquete_id !== best.paquete_id) {
            toDelete.push(p.paquete_id);
          }
        }
      }
    }
    
    if (toDelete.length > 0) {
      console.log(`Eliminando ${toDelete.length} paquetes duplicados obsoletos...`);
      // Como puede haber restricciones de foráneas en servicios_por_paquete etc,
      // usaremos eliminación estándar (asumiendo que las ON DELETE CASCADE están configuradas)
      // Si falla por foreign key constraints, primero eliminamos las dependencias
      try {
         await client.query('DELETE FROM servicios_por_paquete WHERE paquete_id = ANY($1::int[])', [toDelete]).catch(() => console.log('No servicios_por_paquete table, skipping.'));
         await client.query('DELETE FROM paquetes WHERE paquete_id = ANY($1::int[])', [toDelete]);
         console.log('✅ Paquetes duplicados eliminados correctamente.');
      } catch (err) {
         console.error('Error al eliminar paquetes duplicados:', err.message);
      }
    } else {
      console.log('No hay paquetes duplicados para eliminar.');
    }
    
    console.log('--- LIMPIEZA COMPLETADA EXITOSAMENTE ---');
    
  } catch (error) {
    console.error('ERROR DURANTE LA LIMPIEZA:', error);
  } finally {
    await client.end();
  }
}
main().catch(console.error);
