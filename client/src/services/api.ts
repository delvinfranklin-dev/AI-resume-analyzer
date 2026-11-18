import {
  ResumeAnalysis,
  JobMatchRequest,
  JobMatchResult,
  ResumeComparisonResult,
  ChatRequest,
  ChatResponse,
} from '../types';

const API_BASE = '/api';

export async function sendChatMessage(req: ChatRequest): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    let errorMsg = 'Failed to get response from assistant';
    try {
      const err = await response.json();
      errorMsg = err.error || err.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
}


export async function uploadAndAnalyzeResume(
  file: File,
  onProgress?: (stage: string) => void
): Promise<ResumeAnalysis> {
  const formData = new FormData();
  formData.append('resume', file);

  if (onProgress) onProgress('Uploading file to secure server...');

  const response = await fetch(`${API_BASE}/resume/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorMsg = 'Failed to analyze resume';
    try {
      const errData = await response.json();
      errorMsg = errData.error || errData.message || errorMsg;
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export async function analyzeSampleResume(sampleId: string): Promise<ResumeAnalysis> {
  const response = await fetch(`${API_BASE}/resume/sample/${sampleId}`, {
    method: 'POST',
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Failed to load sample' }));
    throw new Error(err.error || 'Failed to load sample');
  }

  return response.json();
}

export async function matchJobDescription(req: JobMatchRequest): Promise<JobMatchResult> {
  const response = await fetch(`${API_BASE}/resume/match-job`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Job matching failed' }));
    throw new Error(err.error || 'Job matching failed');
  }

  return response.json();
}

export async function getAnalysisHistory(): Promise<ResumeAnalysis[]> {
  const response = await fetch(`${API_BASE}/analysis`);
  if (!response.ok) {
    throw new Error('Failed to fetch history');
  }
  return response.json();
}

export async function getAnalysisById(id: string): Promise<ResumeAnalysis> {
  const response = await fetch(`${API_BASE}/analysis/${id}`);
  if (!response.ok) {
    throw new Error('Analysis not found');
  }
  return response.json();
}

export async function deleteAnalysis(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/analysis/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete analysis');
  }
  return response.json();
}

export async function compareResumes(idA: string, idB: string): Promise<ResumeComparisonResult> {
  const response = await fetch(`${API_BASE}/analysis/compare?a=${idA}&b=${idB}`);
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Comparison failed' }));
    throw new Error(err.error || 'Comparison failed');
  }
  return response.json();
}
