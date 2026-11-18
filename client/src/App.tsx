import { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Hero } from './components/landing/Hero';
import { FeaturesSection } from './components/landing/FeaturesSection';
import { VisualPreview } from './components/landing/VisualPreview';
import { UploadZone } from './components/upload/UploadZone';
import { AnalysisLoader } from './components/upload/AnalysisLoader';
import { DashboardView } from './components/dashboard/DashboardView';
import { JobMatcherView } from './components/job-matcher/JobMatcherView';
import { ResumeComparisonView } from './components/comparison/ResumeComparisonView';
import { HistoryView } from './components/history/HistoryView';
import { ResumeAnalysis } from './types';
import { uploadAndAnalyzeResume, analyzeSampleResume, getAnalysisHistory, deleteAnalysis } from './services/api';
import { generatePdfReport } from './utils/pdfGenerator';
import { ResumeChatbot } from './components/chat/ResumeChatbot';

export function App() {
  const [currentTab, setCurrentTab] = useState<'landing' | 'upload' | 'dashboard' | 'job-matcher' | 'compare' | 'history'>('landing');
  const [activeAnalysis, setActiveAnalysis] = useState<ResumeAnalysis | null>(null);
  const [history, setHistory] = useState<ResumeAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingFileName, setAnalyzingFileName] = useState('');
  const [targetRoleForMatcher, setTargetRoleForMatcher] = useState('');
  const [loadingSample, setLoadingSample] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getAnalysisHistory();
      setHistory(data);
      if (data.length > 0 && !activeAnalysis) {
        setActiveAnalysis(data[0]);
      }
    } catch (err) {
      console.warn('Could not load history:', err);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true);
    setAnalyzingFileName(file.name);
    setGlobalError(null);

    try {
      const result = await uploadAndAnalyzeResume(file);
      setActiveAnalysis(result);
      setHistory((prev) => [result, ...prev.filter((item) => item.id !== result.id)]);
      setCurrentTab('dashboard');
    } catch (err: any) {
      setGlobalError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSampleSelect = async (sampleId: string) => {
    setLoadingSample(true);
    setIsAnalyzing(true);
    setAnalyzingFileName(`Sample_${sampleId}.pdf`);
    setGlobalError(null);

    try {
      const result = await analyzeSampleResume(sampleId);
      setActiveAnalysis(result);
      setHistory((prev) => [result, ...prev.filter((item) => item.id !== result.id)]);
      setCurrentTab('dashboard');
    } catch (err: any) {
      setGlobalError(err.message || 'Failed to load sample resume.');
    } finally {
      setIsAnalyzing(false);
      setLoadingSample(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAnalysis(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      if (activeAnalysis?.id === id) {
        const remaining = history.filter((item) => item.id !== id);
        setActiveAnalysis(remaining.length > 0 ? remaining[0] : null);
        if (remaining.length === 0 && currentTab === 'dashboard') {
          setCurrentTab('upload');
        }
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleOpenAnalysis = (analysis: ResumeAnalysis) => {
    setActiveAnalysis(analysis);
    setCurrentTab('dashboard');
  };

  const handleSelectRoleForMatch = (role: string) => {
    setTargetRoleForMatcher(role);
    setCurrentTab('job-matcher');
  };

  const handleDownloadPdf = (analysisToDownload?: ResumeAnalysis) => {
    const target = analysisToDownload || activeAnalysis;
    if (target) {
      generatePdfReport(target);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        hasAnalysis={!!activeAnalysis}
      />

      {/* Global Error Notice */}
      {globalError && (
        <div className="max-w-4xl mx-auto mt-4 px-4 w-full">
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between">
            <span>{globalError}</span>
            <button
              onClick={() => setGlobalError(null)}
              className="text-rose-600 hover:text-rose-900 font-bold ml-4"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content Areas */}
      <main className="flex-1">
        {isAnalyzing ? (
          <div className="py-20 px-4">
            <AnalysisLoader fileName={analyzingFileName} />
          </div>
        ) : (
          <>
            {currentTab === 'landing' && (
              <>
                <Hero
                  onAnalyzeClick={() => setCurrentTab('upload')}
                  onSampleSelect={handleSampleSelect}
                  onSeeHowItWorks={() => {
                    const el = document.getElementById('features-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  loadingSample={loadingSample}
                />
                <FeaturesSection />
                <VisualPreview />
              </>
            )}

            {currentTab === 'upload' && (
              <UploadZone
                onAnalyzeFile={handleFileUpload}
                onSelectSample={handleSampleSelect}
                isLoading={isAnalyzing || loadingSample}
              />
            )}

            {currentTab === 'dashboard' && (
              activeAnalysis ? (
                <DashboardView
                  analysis={activeAnalysis}
                  onDownloadPdf={() => handleDownloadPdf()}
                  onOpenJobMatcher={() => setCurrentTab('job-matcher')}
                  onSelectRoleForMatch={handleSelectRoleForMatch}
                />
              ) : (
                <div className="py-20 text-center">
                  <p className="text-sm text-slate-500 mb-4">No active analysis loaded.</p>
                  <button
                    onClick={() => setCurrentTab('upload')}
                    className="px-5 py-2.5 rounded-xl font-semibold text-white bg-brand-600"
                  >
                    Upload Resume
                  </button>
                </div>
              )
            )}

            {currentTab === 'job-matcher' && (
              <JobMatcherView
                currentAnalysis={activeAnalysis}
                initialRoleTitle={targetRoleForMatcher}
                onNavigateToUpload={() => setCurrentTab('upload')}
              />
            )}

            {currentTab === 'compare' && (
              <ResumeComparisonView
                history={history}
                onSelectAnalysis={handleOpenAnalysis}
                onNavigateToUpload={() => setCurrentTab('upload')}
              />
            )}

            {currentTab === 'history' && (
              <HistoryView
                history={history}
                onOpenAnalysis={handleOpenAnalysis}
                onDeleteAnalysis={handleDelete}
                onDownloadPdf={handleDownloadPdf}
                onNavigateToUpload={() => setCurrentTab('upload')}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Resume Assistant Chatbot */}
      <ResumeChatbot activeAnalysis={activeAnalysis} />
    </div>
  );
}

export default App;
