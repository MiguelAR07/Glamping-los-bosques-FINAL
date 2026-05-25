export const reviews = {
    getReviews: `
        SELECT * FROM resenas
        WHERE estado = 'Activo'
        ORDER BY fecha DESC
    `,
    createReview: `
        INSERT INTO resenas (nombre, texto, rating)
        VALUES ($1, $2, $3)
        RETURNING *
    `
}
