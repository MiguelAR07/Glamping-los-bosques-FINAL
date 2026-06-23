import { pool } from '../config/db.js';

export const getCuentasBancariasActivas = async (req, res) => {
  try {
    const query = `
      SELECT banco, tipo_cuenta, numero_cuenta, titular
      FROM cuentas_bancarias
      WHERE estado = true
      ORDER BY id ASC
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener cuentas bancarias activas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
