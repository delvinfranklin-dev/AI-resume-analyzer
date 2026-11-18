import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import apiRoutes from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (parent of server/)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });


const app = express();
const PORT = process.env.PORT || 5000;

// Security: Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again in a few minutes.' },
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true,
}));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Server Error]', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: 'Your file is larger than the 10 MB limit.' });
      return;
    }
    res.status(400).json({ error: `File upload error: ${err.message}` });
    return;
  }

  if (err.message && err.message.includes("This file type isn't supported")) {
    res.status(400).json({ error: "This file type isn't supported. Please upload PDF, DOCX, or TXT." });
    return;
  }

  res.status(500).json({
    error: "We couldn't complete your request right now. Please try again.",
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Resume Analyzer Server running on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`🤖 AI Provider: ${process.env.AI_PROVIDER || 'gemini'} (Model: ${process.env.AI_MODEL || 'default'})`);
});

export default app;
