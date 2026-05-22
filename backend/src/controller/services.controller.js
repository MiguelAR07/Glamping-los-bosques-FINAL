import pool from "../config/db.js";
import { services } from '../model/services.model.js';

export const getServices = async (req, res) => {
    try {
        const result = await pool.query(services.getServices)

        res.json(result.rows)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};