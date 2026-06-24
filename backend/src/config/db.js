import pg from 'pg';

const { Pool } = pg;

// Si la URL apunta a localhost, no usamos SSL (PostgreSQL local)
const isLocal = (process.env.DATABASE_URL || '').includes('localhost');

const config = {
  connectionString: process.env.DATABASE_URL,
  ...(isLocal ? {} : { ssl: { rejectUnauthorized: false } })
};

// Creamos una instancia del Pool (maneja múltiples conexiones de forma eficiente)
const pool = new Pool(config);

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL Conectado!');
    client.release();
  } catch (error) {
    console.error("⚠️ Error inicial conectándose a PostgreSQL, pero la piscina reintentará automáticamente:");
    console.error(error.message);
    // process.exit(1); // Eliminado para no tumbar el servidor en Render
  }
};

export default pool;