import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Clipboard,
  X,
  ShieldAlert,
  ArrowRight,
  FlaskConical,
  MessageSquare,
  Users,
  AlertCircle,
  Coffee,
  CheckCircle,
} from 'lucide-react';
import { detectSpeakers } from '../utils/parser';
import {
  ALL_SAMPLES,
  SAMPLE_COLLEGE_SPRINT,
  SampleConversation,
} from '../utils/samples';

interface InputScreenProps {
  transcript: string;
  onChangeTranscript: (text: string) => void;
  userName: string;
  onChangeUserName: (name: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onSelectSample: (sample: SampleConversation) => void;
  errorMessage?: string | null;
}

export const InputScreen: React.FC<InputScreenProps> = ({
  transcript,
  onChangeTranscript,
  userName,
  onChangeUserName,
  onAnalyze,
  isAnalyzing,
  onSelectSample,
  errorMessage,
}) => {
  const [speakers, setSpeakers] = useState<string[]>([]);
  const [pasteFeedback, setPasteFeedback] = useState(false);

  useEffect(() => {
    if (transcript.trim()) {
      setSpeakers(detectSpeakers(transcript));
    } else {
      setSpeakers([]);
    }
  }, [transcript]);

  const handleClipboardPaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          onChangeTranscript(text);
          setPasteFeedback(true);
          setTimeout(() => setPasteFeedback(false), 1500);
        }
      }
    } catch {
      // Browser permission denied or clipboard empty
    }
  };

  const handleClear = () => {
    onChangeTranscript('');
  };

  const charCount = transcript.length;
  const maxChars = 25000;

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto px-4 py-6 gap-6 animate-fade-in">
      {/* Atmospheric Glow Hero Banner */}
      <div className="relative w-full rounded-2xl bg-surface-container-low border border-surface-container-high/60 p-6 md:p-8 overflow-hidden shadow-xl">
        {/* Ambient Glows */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center gap-3">
          {/* Logo Container with Refractive Glow */}
          <div className="relative flex items-center justify-center p-2.5 rounded-2xl bg-surface-container border border-primary/30 shadow-[0_0_24px_-4px_rgba(16,185,129,0.35)]">
            <span className="material-symbols-outlined text-primary text-[36px]">
              mark_chat_unread
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <h1 className="font-headline font-bold text-2xl md:text-3xl text-on-surface tracking-tight">
              MissedIt AI
            </h1>
            <p className="font-body text-sm md:text-base text-on-surface-variant max-w-md">
              Catch up without reading everything. Instant briefing & actionable checklist for unread chats.
            </p>
          </div>

          {/* Trust Banner */}
          <div className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-surface-container border border-primary/20 shadow-[0_0_16px_-4px_rgba(16,185,129,0.18)]">
            <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0 animate-pulse">
              verified_user
            </span>
            <span className="text-xs font-semibold text-primary tracking-wide text-center">
              Processed locally on your device — No conversation data ever leaves your browser
            </span>
          </div>
        </div>
      </div>

      {/* Validation / Error banner if present */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-error-container/20 border border-error/30 text-error flex items-start gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-error">Input Validation Check</p>
            <p className="text-on-surface-variant leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Interactive Triage Workspace */}
      <div className="flex flex-col gap-4 w-full">
        {/* Optional Identification Field */}
        <div className="flex flex-col gap-2 w-full rounded-2xl bg-surface-container border border-surface-container-high/60 p-4 md:p-5 shadow-md">
          <div className="flex items-center justify-between">
            <label
              htmlFor="user-identity"
              className="font-headline text-sm font-semibold text-on-surface flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">
                account_circle
              </span>
              Your Name
              <span className="text-xs text-on-surface-variant font-normal lowercase">
                (optional)
              </span>
            </label>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
              Mentions filter
            </span>
          </div>

          <div className="relative">
            <input
              id="user-identity"
              type="text"
              value={userName}
              onChange={e => onChangeUserName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest border border-surface-container-high text-on-surface placeholder:text-outline text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>

          <p className="text-xs text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-outline text-[14px]">
              info
            </span>
            Used to pinpoint tasks directly assigned to you, questions asked to you, and @mentions.
          </p>
        </div>

        {/* Main Conversation Transcript Ingestion Box */}
        <div className="flex flex-col gap-2 w-full rounded-2xl bg-surface-container border border-surface-container-high/60 p-4 md:p-5 shadow-md">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span className="font-headline text-sm font-semibold text-on-surface">
                Conversation Transcript
              </span>
            </div>

            {/* Paste Button */}
            <button
              type="button"
              onClick={handleClipboardPaste}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container-high hover:bg-surface-bright text-primary text-xs font-semibold transition-all active:scale-95 shadow-sm border border-primary/20"
              title="Paste raw transcript from system clipboard"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>{pasteFeedback ? 'Pasted!' : 'Paste'}</span>
            </button>
          </div>

          {/* Textarea Area */}
          <div className="relative w-full rounded-xl bg-surface-container-lowest border border-surface-container-high/80 p-2 transition-all">
            <textarea
              id="raw-chat-input"
              rows={8}
              value={transcript}
              onChange={e => onChangeTranscript(e.target.value)}
              maxLength={maxChars}
              placeholder={`[10:14 AM] Jordan: Did everyone submit slide decks?
[10:16 AM] Alex Rivera: Pushed final metrics to Linear #402.
[10:19 AM] Taylor: Need blocker sign-off before deploy at 2 PM...`}
              className="w-full bg-transparent resize-y p-2 text-on-surface placeholder:text-outline/70 font-mono text-xs md:text-sm focus:outline-none leading-relaxed"
            />

            {/* Quick Clear Floating Pill */}
            {transcript && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center hover:text-on-surface hover:bg-surface-bright transition-all active:scale-90"
                title="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Live Metadata Indicators */}
          <div className="flex items-center justify-between pt-1 px-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-on-surface-variant font-medium">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Parser Ready</span>
              </div>
              <span className="text-outline">•</span>
              <span className="text-on-surface-variant flex items-center gap-1">
                <Users className="w-3 h-3 text-secondary" />
                {speakers.length} speaker{speakers.length === 1 ? '' : 's'} detected
              </span>
            </div>

            <span className="font-mono text-on-surface-variant text-[11px]">
              {charCount.toLocaleString()} / {maxChars.toLocaleString()} chars
            </span>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-col gap-2.5 w-full mt-1">
          {/* Primary Analyze Button */}
          <button
            type="button"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="group relative w-full h-12 py-3 px-6 rounded-xl bg-primary text-on-primary font-headline font-bold text-sm md:text-base flex items-center justify-center gap-2 shadow-[0_0_24px_-4px_rgba(16,185,129,0.35)] hover:bg-primary-fixed transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">
                  sync
                </span>
                <span>Extracting Intelligence Locally...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
                <span>Analyze Conversation</span>
                <ArrowRight className="w-4 h-4 ml-auto opacity-70 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Secondary Quick Load Canonical Sample */}
          <button
            type="button"
            onClick={() => onSelectSample(SAMPLE_COLLEGE_SPRINT)}
            className="w-full h-11 py-2 px-4 rounded-xl bg-surface-container border border-surface-container-high hover:bg-surface-container-high text-secondary font-medium text-xs md:text-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.99] shadow-sm"
          >
            <FlaskConical className="w-4 h-4" />
            <span>Try Sample Project Chat (College Team Sprint)</span>
          </button>
        </div>

        {/* Multi-Scenario Switcher */}
        <div className="w-full rounded-2xl bg-surface-container border border-surface-container-high/60 p-4 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-outline block">
            Or choose a test scenario:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {ALL_SAMPLES.map(sample => (
              <button
                key={sample.id}
                type="button"
                onClick={() => onSelectSample(sample)}
                className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-surface-container-high text-left transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">
                    {sample.id === 'casual-lunch' ? (
                      <Coffee className="w-3.5 h-3.5 text-primary" />
                    ) : sample.id === 'war-room' ? (
                      <AlertCircle className="w-3.5 h-3.5 text-error" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5 text-secondary" />
                    )}
                    <span className="truncate">{sample.name}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-1 leading-snug">
                    {sample.description}
                  </p>
                </div>
                <span className="text-[10px] text-primary font-medium mt-2 block">
                  Click to load →
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Privacy Sandbox Security Architecture */}
        <div className="w-full rounded-2xl bg-surface-container-low border border-surface-container-high/60 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0 text-primary">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-0.5 text-xs">
              <span className="font-headline font-semibold text-on-surface">
                Private Local Sandbox
              </span>
              <p className="text-on-surface-variant leading-relaxed">
                Deterministic rule-based heuristics executed 100% in your browser. Conversations are never uploaded, logged, indexed, or stored.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
