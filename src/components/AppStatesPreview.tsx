import React, { useState } from 'react';
import {
  RefreshCw,
  Inbox,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Coffee,
  Check,
} from 'lucide-react';
import { SAMPLE_COLLEGE_SPRINT, SAMPLE_CASUAL_LUNCH, SampleConversation } from '../utils/samples';

interface AppStatesPreviewProps {
  onLoadSample: (sample: SampleConversation) => void;
  onGoToInput: () => void;
}

export const AppStatesPreview: React.FC<AppStatesPreviewProps> = ({
  onLoadSample,
  onGoToInput,
}) => {
  const [activeState, setActiveState] = useState<'loading' | 'empty' | 'error' | 'clear'>('loading');

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto px-4 py-6 gap-6 animate-fade-in">
      {/* Segmented Selector */}
      <div className="w-full bg-surface-container-low p-1.5 rounded-2xl border border-surface-container-high/60 shadow-sm flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveState('loading')}
          className={`flex-1 min-w-[76px] py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeState === 'loading'
              ? 'bg-surface-container-highest text-primary shadow-sm border border-primary/20'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${activeState === 'loading' ? 'animate-spin' : ''}`} />
          <span>Analyzing</span>
        </button>

        <button
          onClick={() => setActiveState('empty')}
          className={`flex-1 min-w-[76px] py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeState === 'empty'
              ? 'bg-surface-container-highest text-primary shadow-sm border border-primary/20'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Empty</span>
        </button>

        <button
          onClick={() => setActiveState('error')}
          className={`flex-1 min-w-[76px] py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeState === 'error'
              ? 'bg-surface-container-highest text-primary shadow-sm border border-primary/20'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Error</span>
        </button>

        <button
          onClick={() => setActiveState('clear')}
          className={`flex-1 min-w-[76px] py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeState === 'clear'
              ? 'bg-surface-container-highest text-primary shadow-sm border border-primary/20'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>All Clear</span>
        </button>
      </div>

      {/* STATE 1: Analyzing / Loading */}
      {activeState === 'loading' && (
        <div className="flex flex-col w-full space-y-4 animate-fade-in">
          <div className="w-full bg-surface-container border border-surface-container-high rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-36 h-36 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                </span>
                <span className="font-headline font-bold text-base md:text-lg text-on-surface">
                  Analyzing 142 messages...
                </span>
              </div>
              <span className="text-xs font-bold text-primary bg-primary-container/20 px-2.5 py-0.5 rounded-full">
                68%
              </span>
            </div>

            <p className="text-xs md:text-sm text-on-surface-variant mb-4">
              Synthesizing decisions, pending blockers, and explicit action items from Linear & Slack thread.
            </p>

            {/* Progress Gauge */}
            <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden mb-5">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(78,222,163,0.6)]"
                style={{ width: '68%' }}
              />
            </div>

            {/* Stepwise Milestones */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 text-xs">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span className="text-on-surface font-medium">
                    Tokenizing local conversation stream
                  </span>
                </div>
                <span className="font-mono text-on-surface-variant text-[11px]">Done</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 text-xs">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span className="text-on-surface font-medium">
                    Detecting participants & mentions
                  </span>
                </div>
                <span className="font-mono text-on-surface-variant text-[11px]">Done</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-high border border-primary/30 text-xs shadow-[0_0_16px_rgba(78,222,163,0.1)]">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-primary animate-spin" />
                  <span className="text-primary font-semibold">
                    Synthesizing decisions & deadlines
                  </span>
                </div>
                <span className="font-mono text-primary font-semibold text-[11px] animate-pulse">
                  Running
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 text-xs opacity-60">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border border-outline inline-block" />
                  <span className="text-on-surface-variant">
                    Triage priority classification
                  </span>
                </div>
                <span className="font-mono text-on-surface-variant text-[11px]">Queued</span>
              </div>
            </div>

            {/* Privacy Isolation Pill */}
            <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-surface-container-lowest text-on-surface-variant text-xs border border-surface-container-high/50">
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span>100% on-device WebAssembly • Zero cloud transfer</span>
            </div>
          </div>
        </div>
      )}

      {/* STATE 2: Helpful Empty Baseline State */}
      {activeState === 'empty' && (
        <div className="flex flex-col w-full space-y-4 animate-fade-in">
          <div className="w-full bg-surface-container border border-surface-container-high rounded-2xl p-6 md:p-8 flex flex-col items-center text-center shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-surface-container-high border border-surface-container-highest flex items-center justify-center mb-4 shadow-sm relative">
              <Inbox className="w-8 h-8 text-primary" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full" />
            </div>

            <h3 className="font-headline font-bold text-xl text-on-surface mb-1">
              Ready for Unread Logs
            </h3>
            <p className="text-xs md:text-sm text-on-surface-variant max-w-sm mb-6">
              Paste exports from WhatsApp, Slack, Discord, or Linear. MissedIt AI analyzes everything locally in seconds.
            </p>

            <button
              onClick={onGoToInput}
              className="w-full py-3 px-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low border border-dashed border-primary/40 flex flex-col items-center justify-center mb-5 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-1">
                <span>Tap to Open Workspace & Paste</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
              <span className="text-xs text-on-surface-variant">
                Auto-detects timestamps & author signatures
              </span>
            </button>

            {/* Sample Chips */}
            <div className="w-full text-left">
              <span className="text-[11px] font-semibold text-outline uppercase tracking-wider block mb-2">
                Try sample scenarios:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => onLoadSample(SAMPLE_COLLEGE_SPRINT)}
                  className="w-full bg-surface-container-high hover:bg-surface-bright p-3 rounded-xl text-left border border-surface-container-highest transition-colors flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-secondary text-[22px]">
                    group_work
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-on-surface truncate">
                      College Capstone Sprint
                    </div>
                    <div className="text-[11px] text-on-surface-variant truncate">
                      4 members • Deadlines & tasks
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => onLoadSample(SAMPLE_CASUAL_LUNCH)}
                  className="w-full bg-surface-container-high hover:bg-surface-bright p-3 rounded-xl text-left border border-surface-container-highest transition-colors flex items-center gap-3"
                >
                  <Coffee className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-on-surface truncate">
                      Social Lunch & Coffee
                    </div>
                    <div className="text-[11px] text-on-surface-variant truncate">
                      Casual chat • Zero false alarms
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATE 3: Friendly Error State */}
      {activeState === 'error' && (
        <div className="flex flex-col w-full space-y-4 animate-fade-in">
          <div className="w-full bg-surface-container border border-surface-container-high rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-error-container/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-error-container/30 border border-error/30 flex items-center justify-center flex-shrink-0 text-error">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-base text-error">
                  Unable to parse conversation
                </h3>
                <div className="text-xs text-on-surface-variant">
                  Validation Check: Insufficient Dialogue
                </div>
              </div>
            </div>

            <p className="text-xs md:text-sm text-on-surface mb-4 leading-relaxed">
              The pasted text doesn't look like a chat log or contains fewer than 2 distinct messages. MissedIt requires conversation patterns to extract actionable insights.
            </p>

            {/* Syntax Helper Box */}
            <div className="w-full bg-surface-container-lowest border border-surface-container-high rounded-xl p-3 mb-4">
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <span className="font-semibold text-outline">Expected Format Example:</span>
                <span className="font-mono text-primary font-bold">Accepted</span>
              </div>
              <div className="bg-surface-container-high p-2.5 rounded-lg font-mono text-xs text-on-surface space-y-1">
                <div className="text-on-surface-variant">
                  [10:14 AM] Jordan: Deploying release v2.4 today
                </div>
                <div className="text-on-surface-variant">
                  [10:15 AM] Sarah: Can you ping QA when live?
                </div>
              </div>
            </div>

            {/* Quick Fixes */}
            <div className="w-full bg-surface-container-low rounded-xl p-3 mb-4 space-y-1.5 text-xs text-on-surface-variant">
              <span className="font-semibold text-on-surface block">Quick Fixes:</span>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-primary" />
                <span>Ensure timestamps or sender colons (e.g. "Jordan:") are preserved</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-primary" />
                <span>Paste full chat threads rather than single standalone sentences</span>
              </div>
            </div>

            <button
              onClick={() => onLoadSample(SAMPLE_COLLEGE_SPRINT)}
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary-fixed text-on-primary font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_16px_rgba(78,222,163,0.3)]"
            >
              <span>Load Sample College Sprint</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STATE 4: All Clear! Zero Blockers */}
      {activeState === 'clear' && (
        <div className="flex flex-col w-full space-y-4 animate-fade-in">
          <div className="w-full bg-surface-container border border-surface-container-high rounded-2xl p-6 md:p-8 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

            {/* Celebratory Checkmark Icon */}
            <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-4 relative shadow-lg">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-25" />
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(78,222,163,0.5)]">
                <CheckCircle2 className="w-8 h-8 text-on-primary" />
              </div>
            </div>

            <h3 className="font-headline font-bold text-xl md:text-2xl text-on-surface mb-1">
              All Clear! Zero Blockers
            </h3>
            <p className="text-xs md:text-sm text-on-surface-variant mb-5 max-w-sm">
              We scanned 38 casual messages from{' '}
              <span className="text-on-surface font-semibold">#lunch-hangout</span>. Everyone is in sync with zero pending deadlines or unassigned asks.
            </p>

            {/* Stats Grid */}
            <div className="w-full grid grid-cols-3 gap-2 p-3 bg-surface-container-low border border-surface-container-high rounded-xl mb-6">
              <div className="flex flex-col items-center p-1">
                <span className="font-headline font-bold text-lg text-primary">0</span>
                <span className="text-[11px] text-on-surface-variant">Urgent Items</span>
              </div>
              <div className="flex flex-col items-center p-1">
                <span className="font-headline font-bold text-lg text-on-surface">38</span>
                <span className="text-[11px] text-on-surface-variant">Messages Read</span>
              </div>
              <div className="flex flex-col items-center p-1">
                <span className="font-headline font-bold text-lg text-secondary">5</span>
                <span className="text-[11px] text-on-surface-variant">People Synced</span>
              </div>
            </div>

            <button
              onClick={onGoToInput}
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary-fixed text-on-primary font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_16px_rgba(78,222,163,0.3)]"
            >
              <span>Analyze Another Chat</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
