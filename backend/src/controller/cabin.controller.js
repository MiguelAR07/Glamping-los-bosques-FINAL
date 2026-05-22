import pool from "../config/db.js";
import { cabin } from '../model/cabin.model.js';

export const getCabins = async (req, res) => {
    try {
        const result = await pool.query(cabin.getCabins)

        res.json(result.rows)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

export const getCabinImages = async (req, res) => {
    try {
        const result = await pool.query(cabin.getCabinImgs)

        res.json(result.rows)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};