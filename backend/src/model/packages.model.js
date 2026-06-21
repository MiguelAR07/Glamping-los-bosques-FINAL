export const packages = {
    getPackages: `
        SELECT * FROM paquetes
        WHERE estado = 'Activo'
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