import pool from "../config/db.js";
import { reviews } from '../model/reviews.model.js';

export const getReviews = async (req, res) => {
    try {
        const result = await pool.query(reviews.getReviews);
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createReview = async (req, res) => {
    try {
        const { nombre, texto, rating } = req.body;
        
        if (!nombre || !texto || !rating) {
            return res.status(400).json({ success: false, message: "Nombre, texto y rating son requeridos" });
        }

        const result = await pool.query(reviews.createReview, [nombre, texto, rating]);
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
