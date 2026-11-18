import jsPDF from 'jspdf';
import { ResumeAnalysis } from '../types';

export function generatePdfReport(analysis: ResumeAnalysis) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // Header Banner
  doc.setFillColor(12, 133, 235); // Brand blue
  doc.rect(margin, y, contentWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('AI RESUME ANALYSIS REPORT', margin + 6, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`File: ${analysis.filename}  |  Generated: ${new Date(analysis.analyzed_at).toLocaleDateString()}`, margin + 6, y + 18);

  y += 32;

  // Scores Overview Cards
  const cardWidth = (contentWidth - 8) / 2;
  
  // Card 1: Overall Score
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, cardWidth, 28, 2, 2, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('OVERALL RESUME SCORE', margin + 6, y + 8);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(18);
  doc.text(`${analysis.overall_score}/100`, margin + 6, y + 20);

  // Card 2: ATS Score
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin + cardWidth + 8, y, cardWidth, 28, 2, 2, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('ATS COMPATIBILITY ESTIMATE', margin + cardWidth + 14, y + 8);

  doc.setTextColor(2, 103, 202);
  doc.setFontSize(18);
  doc.text(`${analysis.ats_score}% (${analysis.ats_analysis.rating || 'Good'})`, margin + cardWidth + 14, y + 20);

  y += 36;

  // Profile Summary
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Profile Summary', margin, y);
  y += 5;

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const summaryLines = doc.splitTextToSize(analysis.profile_summary || 'No summary provided.', contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4.5 + 6;

  // Key Highlights
  doc.setFillColor(240, 249, 255);
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');

  doc.setTextColor(3, 82, 163);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('TOP STRENGTH:', margin + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(doc.splitTextToSize(analysis.top_strength || 'Strong skill coverage', contentWidth - 30), margin + 30, y + 6);

  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.text('MAIN IMPROVEMENT:', margin + 4, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(doc.splitTextToSize(analysis.main_improvement || 'Include measurable metrics', contentWidth - 40), margin + 38, y + 14);

  y += 26;

  // Strengths & Weaknesses
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Strengths & Areas For Improvement', margin, y);
  y += 6;

  // Strengths
  analysis.strengths.slice(0, 3).forEach((s) => {
    doc.setTextColor(22, 101, 52); // green
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`[+] ${s.title}`, margin, y);
    y += 4;
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    const expLines = doc.splitTextToSize(s.explanation, contentWidth - 5);
    doc.text(expLines, margin + 4, y);
    y += expLines.length * 4 + 3;
  });

  // Weaknesses
  analysis.weaknesses.slice(0, 3).forEach((w) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setTextColor(194, 65, 12); // amber/red
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`[!] ${w.title}`, margin, y);
    y += 4;
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(`${w.explanation} Suggestion: ${w.suggestion}`, contentWidth - 5);
    doc.text(lines, margin + 4, y);
    y += lines.length * 4 + 3;
  });

  if (y > 230) {
    doc.addPage();
    y = 20;
  } else {
    y += 6;
  }

  // Job Role Recommendations
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Recommended Job Roles', margin, y);
  y += 6;

  analysis.job_recommendations.slice(0, 4).forEach((job) => {
    doc.setTextColor(2, 103, 202);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`${job.role} (${job.match_percentage}% Match)`, margin, y);
    y += 4;
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    const reasonLines = doc.splitTextToSize(job.reason, contentWidth - 5);
    doc.text(reasonLines, margin + 4, y);
    y += reasonLines.length * 4 + 3;
  });

  // Action Plan
  if (y > 230) {
    doc.addPage();
    y = 20;
  } else {
    y += 6;
  }

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Priority Action Plan', margin, y);
  y += 6;

  analysis.action_plan.slice(0, 5).forEach((item) => {
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.step}. ${item.title} [Priority: ${item.priority}]`, margin, y);
    y += 4;
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    const dLines = doc.splitTextToSize(item.description, contentWidth - 5);
    doc.text(dLines, margin + 4, y);
    y += dLines.length * 4 + 3;
  });

  // Footer Disclaimer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Note: This report provides AI-powered advisory insights and estimated ATS compatibility. Scores do not guarantee hiring outcomes.',
    margin,
    285
  );

  // Save the PDF
  const cleanName = analysis.filename.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${cleanName}_Analysis_Report.pdf`);
}
