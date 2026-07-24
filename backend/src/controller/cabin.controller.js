import pool from "../config/db.js";
import { cabin } from '../model/cabin.model.js';
import { appCache } from '../utils/cache.js';

const formatCabinPrices = (rows) => {
    return rows.map(c => {
        let pNoche = Number(c.precio_noche || 0);
        if (pNoche > 0 && pNoche < 1000) pNoche = pNoche * 1000;
        let pPromo = Number(c.precio_promocional || 0);
        if (pPromo > 0 && pPromo < 1000) pPromo = pPromo * 1000;
        return {
            ...c,
            precio_noche: pNoche,
            precio_promocional: pPromo
        };
    });
};

export const getCabins = async (req, res) => {
    try {
        const result = await pool.query(cabin.getCabins);
        res.json(formatCabinPrices(result.rows));
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
            cabins: formatCabinPrices(cabinsRes.rows),
            images: imagesRes.rows
        };

        res.json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};