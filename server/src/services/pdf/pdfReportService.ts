import PDFDocument from 'pdfkit';
import { Response } from 'express';
import { StoredAnalysis } from '../../db/db.js';

export function streamPdfReport(analysis: StoredAnalysis, res: Response) {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  const cleanFilename = (analysis.filename || 'Resume').replace(/[^a-zA-Z0-9_-]/g, '_');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${cleanFilename}_Analysis_Report.pdf"`);

  doc.pipe(res);

  // Title banner
  doc.rect(40, 40, 515, 45).fill('#0267ca');
  doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text('AI RESUME ANALYSIS REPORT', 55, 52);
  doc.fontSize(9).font('Helvetica').text(`Document: ${analysis.filename}  |  Date: ${new Date(analysis.analyzed_at).toLocaleDateString()}`, 55, 70);

  doc.moveDown(3);

  // Scores
  const y = doc.y;
  doc.rect(40, y, 250, 40).fillAndStroke('#f8fafc', '#e2e8f0');
  doc.fillColor('#64748b').fontSize(8).font('Helvetica-Bold').text('OVERALL RESUME SCORE', 50, y + 8);
  doc.fillColor('#0f172a').fontSize(16).text(`${analysis.overall_score}/100`, 50, y + 20);

  doc.rect(305, y, 250, 40).fillAndStroke('#f8fafc', '#e2e8f0');
  doc.fillColor('#64748b').fontSize(8).font('Helvetica-Bold').text('ATS COMPATIBILITY ESTIMATE', 315, y + 8);
  doc.fillColor('#0267ca').fontSize(16).text(`${analysis.ats_score}% (${analysis.ats_analysis?.rating || 'Good'})`, 315, y + 20);

  doc.y = y + 55;

  // Profile Summary
  doc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text('Profile Assessment:');
  doc.moveDown(0.3);
  doc.fillColor('#334155').fontSize(9).font('Helvetica').text(analysis.profile_summary || 'N/A', { lineGap: 3 });

  doc.moveDown(1.5);

  // Key Highlights
  doc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text('Key Strengths:');
  doc.moveDown(0.3);
  analysis.strengths?.slice(0, 3).forEach((s: any) => {
    doc.fillColor('#166534').fontSize(9).font('Helvetica-Bold').text(`+ ${s.title}:`, { continued: true });
    doc.fillColor('#475569').font('Helvetica').text(` ${s.explanation}`, { lineGap: 2 });
  });

  doc.moveDown(1);

  doc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text('Areas That Need Improvement:');
  doc.moveDown(0.3);
  analysis.weaknesses?.slice(0, 3).forEach((w: any) => {
    doc.fillColor('#c2410c').fontSize(9).font('Helvetica-Bold').text(`! ${w.title}:`, { continued: true });
    doc.fillColor('#475569').font('Helvetica').text(` ${w.explanation} (Suggestion: ${w.suggestion})`, { lineGap: 2 });
  });

  doc.moveDown(1);

  // Recommended Job Roles
  doc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text('Recommended Job Roles:');
  doc.moveDown(0.3);
  analysis.job_recommendations?.slice(0, 4).forEach((j: any) => {
    doc.fillColor('#0267ca').fontSize(9).font('Helvetica-Bold').text(`${j.role} (${j.match_percentage}% Match):`, { continued: true });
    doc.fillColor('#475569').font('Helvetica').text(` ${j.reason}`, { lineGap: 2 });
  });

  doc.moveDown(1);

  // Action Plan
  doc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text('Action Plan (Top 5 Prioritized Steps):');
  doc.moveDown(0.3);
  analysis.action_plan?.slice(0, 5).forEach((p: any) => {
    doc.fillColor('#0f172a').fontSize(9).font('Helvetica-Bold').text(`${p.step}. ${p.title} [${p.priority} Priority]:`, { continued: true });
    doc.fillColor('#475569').font('Helvetica').text(` ${p.description}`, { lineGap: 2 });
  });

  // Footer note
  doc.fontSize(7).fillColor('#94a3b8').text(
    'Disclaimer: This analysis provides automated recommendations based on algorithmic parsing standards. Scores do not guarantee employment.',
    40,
    780,
    { align: 'center', width: 515 }
  );

  doc.end();
}
