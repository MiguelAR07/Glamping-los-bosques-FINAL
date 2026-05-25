export const cabin = {
    getCabins: `
        SELECT * FROM cabanas
        WHERE estado <> 'Inactivo'
    `,
    getCabinImgs: `
        SELECT * 
        FROM imagenes_cabana
    `,
}