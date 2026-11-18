import { Request, Response } from 'express';
import { matchJobWithAI } from '../services/ai/aiService.js';
import { db } from '../db/db.js';

export async function matchJobDescription(req: Request, res: Response): Promise<void> {
  try {
    const { analysis_id, resume_text, job_title, job_description } = req.body;

    if (!job_description || !job_description.trim()) {
      res.status(400).json({ error: 'Job description text is required.' });
      return;
    }

    let textToAnalyze = resume_text;

    if (!textToAnalyze && analysis_id) {
      const record = db.getById(analysis_id);
      if (record && record.raw_text) {
        textToAnalyze = record.raw_text;
      }
    }

    if (!textToAnalyze || textToAnalyze.trim().length < 20) {
      res.status(400).json({ error: 'Valid resume text or analysis ID is required.' });
      return;
    }

    const result = await matchJobWithAI(
      textToAnalyze,
      job_title || 'Target Role',
      job_description.trim()
    );

    res.json(result);
  } catch (err: any) {
    console.error('[JobMatchController] Error:', err);
    res.status(500).json({ error: 'Failed to match job description', details: err.message });
  }
}
