import multer from 'multer';
import path from 'path';
import { Request } from 'express';

const storage = multer.memoryStorage();

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
  'application/octet-stream', // Fallback for some OS/browsers
];

export const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10 MB
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return cb(new Error("This file type isn't supported. Please upload PDF, DOCX, or TXT."));
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype) && !ALLOWED_EXTENSIONS.includes(ext)) {
      return cb(new Error("This file type isn't supported. Please upload PDF, DOCX, or TXT."));
    }

    cb(null, true);
  },
});
