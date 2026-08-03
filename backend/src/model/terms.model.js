export const termsModel = {
  getTerms: `
    SELECT 
      id,
      titulo,
      contenido,
      categoria,
      orden,
      fecha_actualizacion
    FROM terminos_condiciones
    ORDER BY orden ASC, id ASC
  `
};
