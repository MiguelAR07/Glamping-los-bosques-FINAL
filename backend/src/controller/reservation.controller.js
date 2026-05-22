import pool from "../config/db.js";

import { reservation } from '../model/reservation.model.js';
import { packages } from "../model/packages.model.js";
import { customer } from "../model/customer.model.js";
import { invoice } from "../model/invoice.model.js";

// tomar los datos del paquete y del cliente y generar la reserva
export const createReservation = async (req, res) => {
    try {
        const { cliente, reserva, factura, paquete } = req.body;
        
        await pool.query("BEGIN");

        const customerResult = await pool.query(customer.createCustomer, [
            cliente.nombre,
            cliente.email,
            cliente.contacto,
            cliente.numero_identificacion,
            cliente.pais_residencia,
            cliente.tipo_identificacion
        ]);

        const packageResult = await pool.query(packages.createPackage, [
            paquete.cabana_id,
            paquete.dias_estadia,
            paquete.descripcion,
            paquete.tipo_id
        ]);

        const nuevo_cliente_id = customerResult.rows[0].cliente_id;
        const nuevo_paquete_id = packageResult.rows[0].paquete_id;

        const reservationResult = await pool.query(reservation.createReservation, [
            reserva.llegada,    // $1
            reserva.salida,     // $2
            nuevo_cliente_id,    // $3
            nuevo_paquete_id,    // $4
            reserva.por_pagar      // $5
        ])

        if (reservationResult.rowCount === 0) {
            throw new Error("El paquete seleccionado no existe o no está activo.");
        }

        const nueva_reserva_id = reservationResult.rows[0].reserva_id;

        const invoiceResult = await pool.query(invoice.createInvoice, [
            factura.subtotal,
            factura.descuento || 0,
            nueva_reserva_id
        ]);

        await pool.query("COMMIT");

        res.status(201).json({
            success: true,
            reserva_id: reservationResult.rows[0].reserva_id,
            factura_id: invoiceResult.rows[0].factura_id,
            mensaje: "Reserva y factura generadas con éxito"
        });
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error en transacción:", error.message);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};