import pool from "../config/db.js";
import { termsModel } from "../model/terms.model.js";

export const getTerms = async (req, res) => {
  try {
    const result = await pool.query(termsModel.getTerms);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
