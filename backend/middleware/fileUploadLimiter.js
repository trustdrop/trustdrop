import multer from 'multer';
import path from 'path';

// Dossier de destination pour les uploads
const uploadDir = path.resolve('backend/uploads');

// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Nom unique : timestamp + original
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${base}_${Date.now()}${ext}`);
  }
});

// Types MIME autorisés
const allowedTypes = ['image/png', 'image/jpeg', 'video/mp4'];

// Middleware de filtrage
function fileFilter(req, file, cb) {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Type de fichier non autorisé. Seuls PNG, JPEG, MP4 sont acceptés.'), false);
  }
  cb(null, true);
}

// Limite de taille : 10 Mo
const limits = { fileSize: 10 * 1024 * 1024 };

// Export du middleware prêt à l'emploi
export const uploadPreuve = multer({ storage, fileFilter, limits }); 