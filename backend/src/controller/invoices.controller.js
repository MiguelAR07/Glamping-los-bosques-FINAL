import pool from "../config/db.js";
import { invoice } from "../model/invoice.model.js";

export const createInvoice = async (req, res) => {
    try {
        const {
            reserva_id,
            fecha_factura,
            subtotal,
            descuento
        } = req.body;

        await pool.query("BEGIN");

        const result = await pool.query(invoice.createInvoice, [
            reserva_id,
            fecha_factura,
            subtotal,
            descuento
        ]);

        await pool.query("COMMIT");

        res.json(result.rows[0])
    } catch (error) {
        await pool.query("ROLLBACK");
        res.status(500).json({message: error.message})
    }
}