export const promocionModel = {
  getActive: `
    SELECT *
    FROM vista_promociones
    WHERE estado = 'Activo'
    ORDER BY fecha DESC
  `
};
