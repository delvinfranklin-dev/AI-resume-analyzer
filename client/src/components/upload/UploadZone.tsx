import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertCircle, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { SAMPLE_RESUMES, SampleResume } from '../../utils/sampleResumes';

interface UploadZoneProps {
  onAnalyzeFile: (file: File) => void;
  onSelectSample: (sampleId: string) => void;
  isLoading: boolean;
}

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'];

export const UploadZone: React.FC<UploadZoneProps> = ({
  onAnalyzeFile,
  onSelectSample,
  isLoading,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (file: File) => {
    setErrorMsg(null);

    // Check size
    if (file.size === 0) {
      setErrorMsg("We couldn't find readable text in this file. Please upload another version of your resume.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setErrorMsg('Your file is larger than the 10 MB limit.');
      return;
    }

    // Check extension
    const name = file.name.toLowerCase();
    const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
    if (!hasValidExt) {
      setErrorMsg("This file type isn't supported. Please upload PDF, DOCX, or TXT.");
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setErrorMsg(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleAnalyzeClick = () => {
    if (selectedFile) {
      onAnalyzeFile(selectedFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
          Upload Your Resume
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Upload your resume in PDF, DOCX, or TXT format for an instant, confidential AI audit.
        </p>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{errorMsg}</p>
            <p className="text-xs text-rose-600 mt-0.5">Please check your document and try again.</p>
          </div>
        </div>
      )}

      {/* Dropzone Card */}
      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-brand-500 bg-brand-50/70 scale-[1.01]'
              : 'border-slate-300 bg-white hover:border-brand-400 hover:bg-slate-50/70 shadow-sm'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleChange}
            className="hidden"
            id="resume-file-input"
          />

          <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-800">
            Upload your resume
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Drag & drop your resume here or{' '}
            <span className="text-brand-600 font-semibold underline decoration-brand-300 underline-offset-2 hover:text-brand-700">
              Browse Files
            </span>
          </p>

          <div className="mt-6 inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
            <span>Supported formats: PDF, DOCX, TXT</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Maximum size: 10 MB</span>
          </div>
        </div>
      ) : (
        /* File Card when selected */
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-6">
            <div className="flex items-center gap-3.5 truncate">
              <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="truncate text-left">
                <p className="font-semibold text-slate-900 text-sm truncate max-w-xs sm:max-w-md">
                  {selectedFile.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span>{formatFileSize(selectedFile.size)}</span>
                  <span>•</span>
                  <span className="uppercase">{selectedFile.name.split('.').pop()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleRemove}
              disabled={isLoading}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Remove file"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              onClick={handleRemove}
              disabled={isLoading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAnalyzeClick}
              disabled={isLoading}
              id="start-analyze-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <span>Analyze Resume</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Instant Sample Resumes Section */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Or test with curated sample profiles
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_RESUMES.map((sample: SampleResume) => (
            <button
              key={sample.id}
              disabled={isLoading}
              onClick={() => onSelectSample(sample.id)}
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-brand-300 hover:bg-brand-50/40 text-left transition-all group disabled:opacity-50 shadow-sm"
            >
              <p className="font-bold text-sm text-slate-900 group-hover:text-brand-700">
                {sample.name}
              </p>
              <p className="text-xs text-brand-600 font-medium mt-0.5">
                {sample.role}
              </p>
              <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                {sample.summary}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
