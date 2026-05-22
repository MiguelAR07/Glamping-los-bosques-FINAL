export const customer = {
    createCustomer: `
        INSERT INTO clientes (nombre, email, contacto, numero_identificacion, pais_residencia, tipo_identificacion)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (numero_identificacion)
        DO UPDATE SET
            nombre = EXCLUDED.nombre,
            email = EXCLUDED.email,
            contacto = EXCLUDED.contacto
        RETURNING cliente_id
    `
}