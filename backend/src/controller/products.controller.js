import pool from "../config/db.js";
import { products } from '../model/products.model.js';

export const getProducts = async (req, res) => {
    try {
        const result = await pool.query(products.getProducts)

        res.json(result.rows)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};