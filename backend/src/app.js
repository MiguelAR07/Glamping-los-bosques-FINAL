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

export default app;