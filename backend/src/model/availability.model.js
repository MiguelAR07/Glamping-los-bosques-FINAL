export const availability = {
    getBlockedDates: `
        SELECT 
            r.reserva_id AS id, 
            'reserva' as tipo, 
            r.llegada AS fecha_inicio, 
            r.salida AS fecha_fin, 
            p.cabana_id,
            r.estado
        FROM reservas r
        JOIN paquetes p ON r.paquete_id = p.paquete_id
        WHERE r.estado <> 'Cancelado'
        
        UNION ALL
        
        SELECT 
            fb.id, 
            'bloqueo' as tipo, 
            fb.fecha_inicio, 
            fb.fecha_fin, 
            fb.cabana_id,
            'Bloqueado' as estado
        FROM fechas_bloqueadas fb
    `
};
