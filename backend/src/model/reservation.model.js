export const reservation = {
    createReservation: `
        INSERT INTO reservas (paquete_id, cliente_id, fecha_registro, llegada, salida, estado, por_pagar, factura_url)
        SELECT
            p.paquete_id,
            c.cliente_id,
            CURRENT_TIMESTAMP,
            $1, -- llegada
            $2, -- salida
            'Por validar',
            $5, -- por_pagar
            $6  -- factura_url, comprobante de pago
        FROM paquetes p, clientes c
        WHERE c.cliente_id = $3
          AND p.paquete_id = $4
          AND p.estado = 'Activo'
        RETURNING *;
    `,
    updatePaymentReceipt: `
        UPDATE reservas
        SET factura_url = $1,
            estado = 'Por validar'
        WHERE reserva_id = $2
        RETURNING *;
    `
}