import pool from "../config/db.js";
import { cabin } from '../model/cabin.model.js';
import { appCache } from '../utils/cache.js';

export const getCabins = async (req, res) => {
    try {
        const result = await pool.query(cabin.getCabins);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getCabinImages = async (req, res) => {
    try {
        const result = await pool.query(cabin.getCabinImgs);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getCabinsFull = async (req, res) => {
    try {
        const [cabinsRes, imagesRes] = await Promise.all([
            pool.query(cabin.getCabins),
            pool.query(cabin.getCabinImgs)
        ]);

        const data = {
            cabins: cabinsRes.rows,
            images: imagesRes.rows
        };

        res.json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};