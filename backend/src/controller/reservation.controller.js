import pool from "../config/db.js";

import { reservation } from '../model/reservation.model.js';
import { packages } from "../model/packages.model.js";
import { customer } from "../model/customer.model.js";
import { invoice } from "../model/invoice.model.js";

// tomar los datos del paquete y del cliente y generar la reserva
export const createReservation = async (req, res) => {
    try {
        let { cliente, reserva, factura, paquete } = req.body;
        if (typeof cliente === "string") cliente = JSON.parse(cliente);
        if (typeof reserva === "string") reserva = JSON.parse(reserva);
        if (typeof factura === "string") factura = JSON.parse(factura);
        if (typeof paquete === "string") paquete = JSON.parse(paquete);
        
        await pool.query("BEGIN");

        const customerResult = await pool.query(customer.createCustomer, [
            cliente.nombre,
            cliente.email,
            cliente.contacto,
            cliente.numero_identificacion,
            cliente.pais_residencia,
            cliente.tipo_identificacion
        ]);

        let nuevo_paquete_id;

        if (paquete && Object.keys(paquete).length > 0) {
            // Validar que la cabaña exista
            const cabinCheck = await pool.query("SELECT 1 FROM cabanas WHERE cabana_id = $1", [paquete.cabana_id]);
            if (cabinCheck.rowCount === 0) {
                throw new Error(`La cabaña seleccionada (ID: ${paquete.cabana_id}) no existe.`);
            }

            // Validar que el tipo de paquete exista
            const typeCheck = await pool.query("SELECT 1 FROM tipo_paquete WHERE tipo_id = $1", [paquete.tipo_id]);
            if (typeCheck.rowCount === 0) {
                throw new Error(`El tipo de paquete seleccionado (ID: ${paquete.tipo_id}) no existe.`);
            }

            // Crear el paquete
            const packageResult = await pool.query(packages.createPackage, [
                paquete.cabana_id,
                paquete.dias_estadia,
                paquete.descripcion,
                paquete.tipo_id
            ]);

            if (packageResult.rowCount === 0) {
                throw new Error("No se pudo crear el paquete.");
            }

            nuevo_paquete_id = packageResult.rows[0].paquete_id;
        } else if (reserva && reserva.paquete_id) {
            // Validar que el paquete existente exista y esté activo
            const packageCheck = await pool.query("SELECT 1 FROM paquetes WHERE paquete_id = $1 AND estado = 'Activo'", [reserva.paquete_id]);
            if (packageCheck.rowCount === 0) {
                throw new Error("El paquete seleccionado no existe o no está activo.");
            }
            nuevo_paquete_id = reserva.paquete_id;
        } else {
            throw new Error("Se debe especificar un paquete existente (paquete_id) o los datos para crear uno nuevo.");
        }

        const nuevo_cliente_id = customerResult.rows[0].cliente_id;

        const facturaUrl = req.file ? req.file.path : null;

        const reservationResult = await pool.query(reservation.createReservation, [
            reserva.llegada,    // $1
            reserva.salida,     // $2
            nuevo_cliente_id,    // $3
            nuevo_paquete_id,    // $4
            reserva.por_pagar,   // $5
            facturaUrl          // $6
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

// cargar el comprobante de pago para la factura de la reserva
export const uploadPaymentReceipt = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Por favor, sube un comprobante de pago."
            });
        }

        const facturaUrl = req.file.path || req.file.secure_url || req.file.url;

        await pool.query("BEGIN");

        const result = await pool.query(reservation.updatePaymentReceipt, [
            facturaUrl,
            id
        ]);

        if (result.rowCount === 0) {
            throw new Error("La reserva especificada no existe.");
        }

        await pool.query("COMMIT");

        res.status(200).json({
            success: true,
            reserva: result.rows[0],
            mensaje: "Comprobante de pago cargado con éxito"
        });
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error al cargar comprobante:", error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};