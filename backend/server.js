import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import routes from './src/routes/index.js';

app.use('/api', routes);

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error('EXPRESS ERROR:', err);
    res.status(500).json({ success: false, error: err.message || "Error interno del servidor", detalle: err });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    connectDB();
    console.log(`Servidor corriendo en puerto ${PORT}`)
});