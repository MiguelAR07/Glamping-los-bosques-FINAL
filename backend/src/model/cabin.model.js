export const cabin = {
    getCabins: `
        SELECT * FROM cabanas
        WHERE estado = 'Activo'
    `,
    getCabinImgs: `
        SELECT * 
        FROM imagenes_cabana
    `,
}