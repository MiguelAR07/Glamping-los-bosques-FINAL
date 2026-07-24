export const packages = {
    getPackages: `
        SELECT p.paquete_id, p.cabana_id, p.dias_estadia, p.descripcion, p.estado, p.tipo_id, p.nombre, p.img_url,
          CASE
            WHEN p.precio_promocional > 0 THEN p.precio_promocional
            ELSE c.precio_noche * p.dias_estadia
          END AS precio
        FROM paquetes p
        JOIN cabanas c ON c.cabana_id = p.cabana_id
        WHERE p.estado = 'Activo'
    `,
    getTypes: `
        SELECT tipo_id, nombre
        FROM tipo_paquete
        ORDER BY tipo_id
    `,
    createPackage: `
        INSERT INTO paquetes (cabana_id, dias_estadia, fecha_registro, descripcion, estado, tipo_id, nombre)
        VALUES ($1, $2, CURRENT_DATE, $3, 'Activo', $4, $5)
        RETURNING *
    `
}