import { Request, Response } from 'express';
import { db } from '../db/db.js';

export function getAllAnalyses(req: Request, res: Response): void {
  try {
    const list = db.getAll();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve analysis history', details: err.message });
  }
}

export function getAnalysisById(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const item = db.getById(id);
    if (!item) {
      res.status(404).json({ error: 'Analysis not found' });
      return;
    }
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve analysis', details: err.message });
  }
}

export function deleteAnalysis(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const success = db.delete(id);
    if (!success) {
      res.status(404).json({ error: 'Analysis not found or already deleted' });
      return;
    }
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete analysis', details: err.message });
  }
}

export function compareAnalyses(req: Request, res: Response): void {
  try {
    const idA = req.query.a as string;
    const idB = req.query.b as string;

    if (!idA || !idB) {
      res.status(400).json({ error: 'Both query parameters "a" and "b" (analysis IDs) are required.' });
      return;
    }

    const itemA = db.getById(idA);
    const itemB = db.getById(idB);

    if (!itemA || !itemB) {
      res.status(404).json({ error: 'One or both analyses not found for comparison.' });
      return;
    }

    const scoreDiff = itemB.overall_score - itemA.overall_score;
    const atsDiff = itemB.ats_score - itemA.ats_score;

    const extractSkills = (item: any) => {
      return new Set<string>([
        ...(item.skills?.technical || []),
        ...(item.skills?.programming_languages || []),
        ...(item.skills?.frameworks || []),
        ...(item.skills?.databases || []),
        ...(item.skills?.cloud || []),
      ]);
    };

    const setA = extractSkills(itemA);
    const setB = extractSkills(itemB);

    const added = Array.from(setB).filter((x) => !setA.has(x));
    const removed = Array.from(setA).filter((x) => !setB.has(x));

    res.json({
      resume_a: {
        id: itemA.id,
        filename: itemA.filename,
        overall_score: itemA.overall_score,
        ats_score: itemA.ats_score,
      },
      resume_b: {
        id: itemB.id,
        filename: itemB.filename,
        overall_score: itemB.overall_score,
        ats_score: itemB.ats_score,
      },
      score_diff: scoreDiff,
      ats_diff: atsDiff,
      skills_diff: {
        added,
        removed,
      },
      key_takeaways: [
        scoreDiff > 0
          ? `Version B improved overall score by +${scoreDiff} points.`
          : scoreDiff < 0
          ? `Version B decreased overall score by ${scoreDiff} points.`
          : 'Overall score remained identical between versions.',
        atsDiff > 0
          ? `ATS compatibility estimate increased by +${atsDiff}%.`
          : atsDiff < 0
          ? `ATS compatibility decreased by ${atsDiff}%.`
          : 'ATS compatibility rating is unchanged.',
        added.length > 0 ? `Detected ${added.length} newly added skills.` : 'No new skills added.',
      ],
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to compare resumes', details: err.message });
  }
}
