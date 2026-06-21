import pool from "../config/db.js";
import { promocionModel } from "../model/promocion.model.js";

export const getPromociones = async (req, res) => {
  try {
    const result = await pool.query(promocionModel.getActive);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
