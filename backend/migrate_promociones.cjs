const { Client } = require('pg');
const client = new Client('postgres://postgres:miguel2006@localhost:5432/glamping');

async function migrate() {
  await client.connect();
  
  try {
    await client.query("BEGIN");
    
    // 1. Add column
    await client.query("ALTER TABLE promociones ADD COLUMN IF NOT EXISTS dias_estadia INTEGER DEFAULT 1");
    
    // 2. Drop the old view if it exists
    await client.query("DROP VIEW IF EXISTS vista_promociones");
    
    // 3. Recreate the view with dias_estadia
    await client.query(`
      CREATE VIEW vista_promociones AS
      SELECT p.promocion_id AS id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.img_url,
        p.fecha_inicio,
        p.fecha_fin,
        p.fecha_registro AS fecha,
        p.estado,
        p.dias_estadia,
        COALESCE(( SELECT json_agg(json_build_object('id', c.cabana_id, 'nombre', c.nombre)) AS json_agg
               FROM (promociones_cabanas pc
                 JOIN cabanas c ON ((c.cabana_id = pc.cabana_id)))
              WHERE (pc.promocion_id = p.promocion_id)), '[]'::json) AS cabanas
       FROM promociones p;
    `);

    await client.query("COMMIT");
    console.log("Migration successful");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

migrate();
