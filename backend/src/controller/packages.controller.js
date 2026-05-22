import pool from "../config/db.js";
import { packages } from '../model/packages.model.js';

export const getPackages = async (req, res) => {
    try {
        const result = await pool.query(packages.getPackages)

        res.json(result.rows)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

export const getTypes = async (req, res) => {
    try {
        const result = await pool.query(packages.getTypes)

        res.json(result.rows)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};