import pool from "../config/db.js";
import { reviews } from '../model/reviews.model.js';
import { appCache } from '../utils/cache.js';

export const getReviews = async (req, res) => {
    try {
        const cacheKey = 'reviews_list';
        const cached = appCache.get(cacheKey);
        if (cached) return res.status(200).json(cached);

        const result = await pool.query(reviews.getReviews);
        const data = { success: true, data: result.rows };
        
        appCache.set(cacheKey, data);
        res.status(200).json(data);
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
        
        // Invalidate cache since a new review was added
        appCache.delete('reviews_list');
        
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
