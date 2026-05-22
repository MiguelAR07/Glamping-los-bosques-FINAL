export const products = {
    getProducts: `
        SELECT * FROM productos
        WHERE estado = 'Activo'
    `
}