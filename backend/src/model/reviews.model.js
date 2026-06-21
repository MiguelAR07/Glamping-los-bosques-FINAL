export const reviews = {
    getReviews: `
        SELECT * FROM resenas
        ORDER BY fecha_creacion DESC
    `,
    createReview: `
        INSERT INTO resenas (nombre, texto, rating)
        VALUES ($1, $2, $3)
        RETURNING *
    `
}
