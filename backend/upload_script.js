import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Extract api_key, api_secret, cloud_name from URL
const cloudinaryUrl = new URL(process.env.CLOUDINARY_URL);
cloudinary.config({
  cloud_name: cloudinaryUrl.hostname,
  api_key: cloudinaryUrl.username,
  api_secret: cloudinaryUrl.password
});

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  // 1. Video already uploaded. URL: https://res.cloudinary.com/di1xs8vma/video/upload/v1779983021/glamping/hero-video.mp4

  // 2. Fetch cabins
  const cabanasRes = await pool.query('SELECT cabana_id as id, nombre FROM cabanas;');
  const cabanas = cabanasRes.rows;
  console.log('Cabanas in DB:', cabanas);

  const cabinsDirs = ['bambu'];
  for (const dir of cabinsDirs) {
    const cabana = cabanas.find(c => c.nombre.toLowerCase().includes('bamb'));
    if (!cabana) {
      console.log(`Cabana ${dir} not found in DB!`);
      continue;
    }
    const cabanaId = cabana.id;
    
    console.log(`Processing ${dir} (ID: ${cabanaId})`);
    
    // Delete existing images in DB
    await pool.query('DELETE FROM imagenes_cabana WHERE cabana_id = $1', [cabanaId]);
    console.log(`Deleted old images for ${dir}`);

    const files = fs.readdirSync(`../cabins/${dir}`);
    for (const file of files) {
      const filePath = path.join(`../cabins/${dir}`, file);
      console.log(`Uploading ${filePath}...`);
      const imgResult = await cloudinary.uploader.upload(filePath, {
        folder: `glamping/cabins/${dir}`,
        overwrite: true
      });
      console.log(`Uploaded: ${imgResult.secure_url}`);
      
      // Insert to DB
      await pool.query('INSERT INTO imagenes_cabana (img_url, cabana_id) VALUES ($1, $2)', [imgResult.secure_url, cabanaId]);
    }
  }

  console.log('Done!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
