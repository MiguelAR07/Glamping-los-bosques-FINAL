import multer from "multer";
import CloudinaryStorage from "multer-storage-cloudinary";
import cloudinary from "cloudinary";

// Configurar explícitamente en caso de que CLOUDINARY_URL falte en Render
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "di1xs8vma",
  api_key: process.env.CLOUDINARY_API_KEY || "988922896642611",
  api_secret: process.env.CLOUDINARY_API_SECRET || "kXxV0xd010GemNIuNVaIF8gAIP0"
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // Pasamos el paquete raíz que contiene v2
  params: {
    folder: "comprobantes",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
  },
});

const upload = multer({ storage: storage });

export default upload;