export const packages = {
    getPackages: `
        SELECT * FROM paquetes
        WHERE estado = 'Activo'
    `,
    getTypes: `
        SELECT DISTINCT tp.tipo_id, tp.nombre 
        FROM tipo_paquete tp
        JOIN paquetes p ON p.tipo_id = tp.tipo_id
        WHERE p.estado <> 'Inactivo'
        ORDER BY tp.tipo_id
    `,
    createPackage: `
        INSERT INTO paquetes (cabana_id, dias_estadia, fecha_registro, descripcion, estado, tipo_id)
        VALUES ($1, $2, CURRENT_DATE, $3, 'Activo', $4)
        RETURNING *
    `
}