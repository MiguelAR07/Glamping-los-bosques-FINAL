export const cabin = {
    getCabins: `
        SELECT * FROM cabanas
        WHERE estado <> 'Inactivo'
    `,
    getCabinImgs: `
        SELECT * 
        FROM imagenes_cabana
        ORDER BY orden ASC, imagen_id ASC
    `,
}