import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";
import routes from '../src/routes/index.js';

// Usar las rutas
app.use('/api', routes);

// Conectar a la base de datos de forma asíncrona pero que esté disponible
connectDB().catch(console.error);

// Exportar la aplicación para que Vercel la maneje como Serverless Function
export default app;
