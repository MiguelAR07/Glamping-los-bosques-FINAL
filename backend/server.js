import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import routes from './src/routes/index.js';
import https from 'https';

app.use('/api', routes);

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error('EXPRESS ERROR:', err);
    res.status(500).json({ success: false, error: err.message || "Error interno del servidor", detalle: err });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    connectDB();
    console.log(`Servidor corriendo en puerto ${PORT}`);
    
    // Keep-alive ping every 14 minutes (840000 ms) to prevent Render sleep
    setInterval(() => {
        const url = process.env.RENDER_EXTERNAL_URL 
            ? `${process.env.RENDER_EXTERNAL_URL}/health`
            : `http://localhost:${PORT}/health`;
            
        console.log(`[Keep-alive] Ping to ${url}`);
        
        if (url.startsWith('https')) {
            https.get(url).on('error', (err) => console.error('Keep-alive error:', err.message));
        } else {
            fetch(url).catch(err => console.error('Keep-alive error:', err.message));
        }
    }, 840000);
});