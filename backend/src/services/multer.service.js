import multer from "multer";
import CloudinaryStorage from "multer-storage-cloudinary";
import cloudinary from "cloudinary";

// Cloudinary se configura automáticamente mediante CLOUDINARY_URL
cloudinary.v2.config();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // Pasamos el paquete raíz que contiene v2
  params: {
    folder: "comprobantes",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage: storage });

export default upload;