import pool from "../config/db.js";
import { cabin } from '../model/cabin.model.js';
import { appCache } from '../utils/cache.js';

export const getCabins = async (req, res) => {
    try {
        const cacheKey = 'cabins_list';
        const cached = appCache.get(cacheKey);
        if (cached) return res.json(cached);

        const result = await pool.query(cabin.getCabins);
        appCache.set(cacheKey, result.rows);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getCabinImages = async (req, res) => {
    try {
        const cacheKey = 'cabins_images';
        const cached = appCache.get(cacheKey);
        if (cached) return res.json(cached);

        const result = await pool.query(cabin.getCabinImgs);
        appCache.set(cacheKey, result.rows);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getCabinsFull = async (req, res) => {
    try {
        const cacheKey = 'cabins_full';
        const cached = appCache.get(cacheKey);
        if (cached) return res.json(cached);

        // Run both queries in parallel if not cached
        const [cabinsRes, imagesRes] = await Promise.all([
            pool.query(cabin.getCabins),
            pool.query(cabin.getCabinImgs)
        ]);

        const data = {
            cabins: cabinsRes.rows,
            images: imagesRes.rows
        };

        appCache.set(cacheKey, data);
        res.json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};