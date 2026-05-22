export const invoice = {
    createInvoice: `
        INSERT INTO facturas (reserva_id, fecha_factura, subtotal, descuento)
        SELECT
            r.reserva_id,
            CURRENT_DATE,
            $1,
            $2
        FROM reservas r
        WHERE r.reserva_id = $3
            AND r.estado = 'Activo'
        RETURNING *;
    `
}