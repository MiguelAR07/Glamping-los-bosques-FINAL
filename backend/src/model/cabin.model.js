export const cabin = {
    getCabins: `
        SELECT * FROM cabanas
        WHERE estado <> 'Inactivo'
          AND (
            nombre ILIKE '%palmas%' OR
            nombre ILIKE '%bamb%' OR
            nombre ILIKE '%roble%'
          )
    `,
    getCabinImgs: `
        SELECT * 
        FROM imagenes_cabana
    `,
}