export const reservation = {
    createReservation: `
        INSERT INTO reservas (paquete_id, cliente_id, fecha_registro, llegada, salida, por_pagar)
        SELECT
            p.paquete_id,
            c.cliente_id,
            CURRENT_TIMESTAMP,
            $1, -- llegada
            $2, -- salida
            $5  -- por_pagar
        FROM paquetes p, clientes c
        WHERE c.cliente_id = $3
          AND p.paquete_id = $4
          AND p.estado = 'Activo'
        RETURNING *;
    `
}