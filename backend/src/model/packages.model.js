export const packages = {
    getPackages: `
        SELECT * FROM paquetes
        WHERE estado = 'Activo'
    `,
    getTypes: `
        SELECT * FROM tipo_paquete
    `,
    createPackage: `
        INSERT INTO paquetes (cabana_id, dias_estadia, fecha_registro, descripcion, estado, tipo_id)
        VALUES ($1, $2, CURRENT_DATE, $3, 'Activo', $4)
        RETURNING *
    `
}