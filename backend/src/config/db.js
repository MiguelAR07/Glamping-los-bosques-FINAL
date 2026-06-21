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
    // Intentamos obtener un cliente para verificar la conexión
    const client = await pool.connect();
    console.log('PostgreSQL Conectado!');
    client.release(); // Importante liberar el cliente de prueba
  } catch (error) {
    console.error("Error Conectandose a PostgreSQL!");
    console.error(error.message);
    process.exit(1);
  }
};

export default pool;