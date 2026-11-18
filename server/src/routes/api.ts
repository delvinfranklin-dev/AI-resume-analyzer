import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { analyzeResume, analyzeSample } from '../controllers/resumeController.js';
import { matchJobDescription } from '../controllers/jobMatchController.js';
import { handleChatRequest } from '../controllers/chatController.js';
import {
  getAllAnalyses,
  getAnalysisById,
  deleteAnalysis,
  compareAnalyses,
} from '../controllers/historyController.js';
import { db } from '../db/db.js';
import { streamPdfReport } from '../services/pdf/pdfReportService.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Chatbot endpoints
router.post('/chat', handleChatRequest);
router.post('/chat/', handleChatRequest);

// Resume analysis endpoints
router.post('/resume/analyze', upload.single('resume'), analyzeResume);
router.post('/resume/upload', upload.single('resume'), analyzeResume);
router.post('/resume/sample/:sampleId', analyzeSample);

// Job Matcher
router.post('/resume/match-job', matchJobDescription);

// History & Comparison
router.get('/analysis', getAllAnalyses);
router.get('/analysis/compare', compareAnalyses);
router.get('/analysis/:id', getAnalysisById);
router.delete('/analysis/:id', deleteAnalysis);

// PDF generation endpoint
router.get('/analysis/:id/pdf', (req, res) => {
  const item = db.getById(req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Analysis not found' });
    return;
  }
  streamPdfReport(item, res);
});

export default router;
