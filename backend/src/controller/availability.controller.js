import pool from "../config/db.js";
import { availability } from "../model/availability.model.js";

export const getBlockedDates = async (req, res) => {
    try {
        const result = await pool.query(availability.getBlockedDates);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
