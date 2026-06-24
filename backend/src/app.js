import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir la carpeta 'public' estática
app.use('/public', express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.send("PostgreSQL corriendo");
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString(), version: '1.0.1' });
});

export default app;