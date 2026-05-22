export const services = {
    getServices: `
        SELECT * FROM servicios
        WHERE estado = 'Activo'
    `
}