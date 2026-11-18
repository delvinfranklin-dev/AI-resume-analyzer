import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Trash2,
  Sparkles,
  Bot,
  User,
  FileText,
  AlertCircle,
  Minimize2,
  CheckCircle2,
} from 'lucide-react';
import { ResumeAnalysis, ChatMessage } from '../../types';
import { sendChatMessage } from '../../services/api';

interface ResumeChatbotProps {
  activeAnalysis: ResumeAnalysis | null;
}

const SUGGESTED_QUESTIONS = [
  'How can I improve my resume?',
  'Is my resume ATS-friendly?',
  'What skills am I missing?',
  'What jobs suit my profile?',
  'Improve my professional summary',
  'Give me interview questions',
];

export const ResumeChatbot: React.FC<ResumeChatbotProps> = ({ activeAnalysis }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [createWelcomeMessage(activeAnalysis)];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // When active resume changes, update welcome or notify
  const prevResumeIdRef = useRef<string | undefined>(activeAnalysis?.id);
  useEffect(() => {
    if (activeAnalysis && activeAnalysis.id !== prevResumeIdRef.current) {
      prevResumeIdRef.current = activeAnalysis.id;
      setMessages((prev) => [
        ...prev,
        {
          id: `resume-update-${Date.now()}`,
          role: 'assistant',
          content: `📄 **New Resume Connected**: I'm now referencing **${activeAnalysis.filename}** (Score: **${activeAnalysis.overall_score}/100**, ATS: **${activeAnalysis.ats_score}/100**). You can ask me specific questions about this resume!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [activeAnalysis]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputValue).trim();
    if (!messageContent || isLoading) return;

    setErrorMessage(null);
    setInputValue('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages
        .filter((m) => m.id !== 'welcome' && !m.id.startsWith('resume-update-'))
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await sendChatMessage({
        message: messageContent,
        resume_context: activeAnalysis,
        conversation_history: conversationHistory,
      });

      const assistantMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: res.response || "I didn't receive a response. Please try asking again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to connect to the assistant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([createWelcomeMessage(activeAnalysis)]);
    setErrorMessage(null);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            id="open-resume-assistant-btn"
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-700 hover:from-brand-500 hover:to-indigo-600 text-white font-medium rounded-full shadow-xl shadow-brand-900/25 hover:shadow-2xl hover:shadow-brand-600/30 transition-all duration-300 transform hover:-translate-y-0.5"
            aria-label="Open Resume Assistant"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-white animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-brand-700" />
            </div>
            <span className="text-sm font-semibold tracking-wide hidden sm:inline">
              Resume Assistant
            </span>
            {activeAnalysis && (
              <span className="hidden md:inline-flex items-center text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                Active
              </span>
            )}
          </button>
        )}
      </div>

      {/* Floating Chat Window Modal */}
      {isOpen && (
        <div
          id="resume-assistant-window"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[88vh] flex flex-col bg-white rounded-2xl shadow-2xl shadow-slate-950/20 border border-slate-200/90 overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 text-white border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center shadow-md shadow-brand-500/20 shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-slate-900" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold tracking-tight text-white truncate">
                    Resume Assistant
                  </h3>
                  <span className="text-[10px] bg-brand-500/30 text-brand-300 font-semibold px-1.5 py-0.2 rounded border border-brand-400/30">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 truncate">
                  {activeAnalysis
                    ? `📄 ${activeAnalysis.filename.length > 18 ? activeAnalysis.filename.slice(0, 18) + '...' : activeAnalysis.filename} (${activeAnalysis.ats_score} ATS)`
                    : 'Career, ATS & Interview Guide'}
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                onClick={handleClearChat}
                title="Clear conversation"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-lg transition-colors"
                aria-label="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Resume Context Banner */}
          <div className="bg-brand-50/70 border-b border-brand-100 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-brand-900 shrink-0">
            <div className="flex items-center gap-1.5 truncate">
              {activeAnalysis ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">
                    Resume connected: <strong className="font-semibold">{activeAnalysis.filename}</strong>
                  </span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span>No resume active. Answering in General Mode.</span>
                </>
              )}
            </div>
            {activeAnalysis && (
              <span className="ml-2 font-bold px-1.5 py-0.5 rounded text-[10px] bg-brand-200/70 text-brand-900 shrink-0">
                Score: {activeAnalysis.overall_score}/100
              </span>
            )}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/40 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none'
                  }`}
                >
                  <FormattedMessageContent content={msg.content} isUser={msg.role === 'user'} />
                  <div
                    className={`text-[9px] mt-1.5 text-right select-none ${
                      msg.role === 'user' ? 'text-white/70' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading typing bubble */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-white text-slate-500 border border-slate-200/80 rounded-2xl rounded-bl-none px-3.5 py-2 text-[11px] flex items-center gap-1.5 shadow-sm">
                  <span className="font-medium text-slate-600">Resume Assistant is thinking</span>
                  <span className="inline-flex gap-0.5">
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" />
                  </span>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{errorMessage}</span>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-rose-500 hover:text-rose-800 font-bold ml-1"
                >
                  ✕
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips (when input is clean) */}
          <div className="px-3 py-2 bg-slate-50 border-t border-slate-200/70 overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Prompts:
            </span>
            {SUGGESTED_QUESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => handleSendMessage(suggestion)}
                className="text-[11px] whitespace-nowrap bg-white hover:bg-brand-50 hover:text-brand-700 hover:border-brand-300 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs transition-colors shrink-0 disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  activeAnalysis
                    ? 'Ask about this resume, ATS, or jobs...'
                    : 'Ask about resumes, ATS, or interview prep...'
                }
                disabled={isLoading}
                maxLength={2000}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:bg-slate-50 text-slate-800 placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:hover:bg-brand-600 text-white font-medium shadow-sm transition-all shrink-0 flex items-center justify-center"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

function createWelcomeMessage(activeAnalysis: ResumeAnalysis | null): ChatMessage {
  if (activeAnalysis) {
    return {
      id: 'welcome',
      role: 'assistant',
      content: `👋 Hi! I'm your **Resume Assistant**.\n\nI have loaded your active analysis for **${activeAnalysis.filename}** (Score: **${activeAnalysis.overall_score}/100**, ATS: **${activeAnalysis.ats_score}/100**).\n\nYou can ask me:\n• *"How can I improve my resume?"*\n• *"What skills am I missing?"*\n• *"Is my resume ATS-friendly?"*\n• *"What jobs suit my profile?"*\n• *"Give me interview questions based on my projects"*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  return {
    id: 'welcome',
    role: 'assistant',
    content: `👋 Hi! I'm your **Resume Assistant**.\n\nI can help you build an ATS-friendly resume, optimize your bullet points, identify missing skills, and prepare for interviews.\n\nFeel free to ask any question or click a suggested prompt below. Uploading a resume will automatically give me tailored context!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

/**
 * Helper to render clean markdown-like text (bold, bullet points, numbered lists, linebreaks)
 */
const FormattedMessageContent: React.FC<{ content: string; isUser: boolean }> = ({ content, isUser }) => {
  if (isUser) {
    return <p className="whitespace-pre-wrap">{content}</p>;
  }

  const lines = content.split('\n');

  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Bullet point lines: •, *, -
        if (/^[•*-]\s+/.test(trimmed)) {
          const bulletText = trimmed.replace(/^[•*-]\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1">
              <span className="text-brand-500 font-bold shrink-0 mt-0.5">•</span>
              <span className="flex-1">
                <RenderInlineFormatting text={bulletText} />
              </span>
            </div>
          );
        }

        // Numbered lists: 1. 2.
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1">
              <span className="text-brand-600 font-bold shrink-0 text-[11px]">{numMatch[1]}.</span>
              <span className="flex-1">
                <RenderInlineFormatting text={numMatch[2]} />
              </span>
            </div>
          );
        }

        // Blockquotes: > text
        if (trimmed.startsWith('>')) {
          return (
            <div key={idx} className="border-l-2 border-brand-400 pl-2 italic text-slate-600 my-1">
              <RenderInlineFormatting text={trimmed.replace(/^>\s*/, '')} />
            </div>
          );
        }

        return (
          <p key={idx}>
            <RenderInlineFormatting text={line} />
          </p>
        );
      })}
    </div>
  );
};

const RenderInlineFormatting: React.FC<{ text: string }> = ({ text }) => {
  // Parse **bold** markers
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
    </>
  );
};
