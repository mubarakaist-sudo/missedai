import React, { useState } from 'react';
import {
  AnalysisResult,
  TaskItem,
} from '../types';
import {
  ArrowLeftRight,
  Trash2,
  Lock,
  ChevronDown,
  CheckCircle2,
  HelpCircle,
  Clock,
  Download,
  Share2,
  Info,
} from 'lucide-react';
import { exportDigestAsMarkdown, exportDigestAsJson } from '../utils/export';

interface DashboardScreenProps {
  result: AnalysisResult;
  userName: string;
  onSwitchChat: () => void;
  onClearChat: () => void;
  onToggleTask: (taskId: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  result,
  userName,
  onSwitchChat,
  onClearChat,
  onToggleTask,
}) => {
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});

  const toggleSource = (id: string) => {
    setExpandedSources(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleClearWithConfirm = () => {
    if (
      window.confirm(
        'Clear all parsed intelligence and in-memory conversation data? This will completely wipe the current session.'
      )
    ) {
      onClearChat();
    }
  };

  // Find top priority spotlight item (assigned to user or highest urgency)
  const spotlightItem: TaskItem | undefined =
    result.userTasks.find(t => t.urgency === 'high' && !t.isCompleted) ||
    result.urgentItems.find(t => !t.isCompleted) ||
    result.allTasks[0];

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 py-6 gap-6 animate-fade-in">
      {/* Ambient Micro-Stat & Control Bar */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-on-surface-variant font-medium">
              Analyzed {result.summary.totalMessages} msgs across{' '}
              {result.summary.totalSpeakers} participants in{' '}
              <span className="font-mono text-primary font-bold">
                {result.summary.executionTimeMs}ms
              </span>
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-surface-container-high px-2.5 py-0.5 rounded-full border border-surface-container-highest">
            <Lock className="w-3 h-3 text-primary" />
            <span className="font-mono text-[10px] text-on-surface-variant font-medium">
              On-Device Heuristics
            </span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-2.5 w-full">
          <button
            type="button"
            onClick={onSwitchChat}
            className="flex-1 flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-surface-container-high hover:bg-surface-bright active:scale-[0.98] transition-all text-on-surface text-xs md:text-sm font-semibold shadow-sm border border-surface-container-highest"
          >
            <ArrowLeftRight className="w-4 h-4 text-primary" />
            <span>Switch / Edit Chat</span>
          </button>

          <button
            type="button"
            onClick={() => exportDigestAsMarkdown(result, userName)}
            className="flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-xl bg-surface-container-high hover:bg-surface-bright active:scale-[0.98] transition-all text-on-surface text-xs font-semibold shadow-sm border border-surface-container-highest"
            title="Download formatted Markdown briefing"
          >
            <Download className="w-4 h-4 text-secondary" />
            <span className="hidden sm:inline">Markdown</span>
          </button>

          <button
            type="button"
            onClick={() => exportDigestAsJson(result)}
            className="flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl bg-surface-container-high hover:bg-surface-bright active:scale-[0.98] transition-all text-on-surface text-xs font-semibold shadow-sm border border-surface-container-highest"
            title="Download raw JSON report"
          >
            <Share2 className="w-3.5 h-3.5 text-on-surface-variant" />
            <span className="hidden sm:inline">JSON</span>
          </button>

          <button
            type="button"
            aria-label="Clear Conversation"
            onClick={handleClearWithConfirm}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-container-high hover:bg-error-container/30 hover:text-error active:scale-[0.98] transition-all text-on-surface-variant border border-surface-container-highest"
            title="Clear conversation and in-memory cache"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Compact Conversation Summary Card */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container border border-surface-container-high/80 p-5 md:p-6 shadow-xl">
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col space-y-3">
          {/* Subtitle & Badge */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[11px] uppercase text-primary font-bold tracking-wider block">
                Intelligence Briefing
              </span>
              <h1 className="font-headline font-bold text-xl md:text-2xl text-on-surface truncate mt-0.5">
                {result.summary.topicTitle}
              </h1>
            </div>
            <span className="flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-full bg-surface-container-highest text-secondary text-xs font-mono font-medium">
              {result.summary.totalSpeakers} Members
            </span>
          </div>

          {/* Heuristic Synthesized Summary */}
          <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
            {result.summary.conciseOverview}
          </p>

          {/* Quick Triage Stats Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container-low border border-surface-container-high/60 text-center">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-error animate-ping" />
                <span className="font-headline font-bold text-lg text-error">
                  {result.summary.stats.urgentCount}
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                Urgent Items
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container-low border border-surface-container-high/60 text-center">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-headline font-bold text-lg text-primary">
                  {result.summary.stats.assignedToUserCount}
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                For You
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container-low border border-surface-container-high/60 text-center">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="font-headline font-bold text-lg text-secondary">
                  {result.summary.stats.decisionsCount}
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                Decisions
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container-low border border-surface-container-high/60 text-center">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-tertiary-container" />
                <span className="font-headline font-bold text-lg text-tertiary-container">
                  {result.summary.stats.unresolvedQuestionsCount}
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                Follow-ups
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Perspective Persona Indicator */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">
            person_pin
          </span>
          <span className="text-sm font-headline font-semibold text-on-surface">
            Priorities for {userName || 'You'}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
          Targeted Role
        </span>
      </div>

      {/* Top Priority / Spotlight Card */}
      {spotlightItem && (
        <div
          className={`relative overflow-hidden rounded-2xl bg-surface-container-high border border-surface-container-highest p-5 md:p-6 shadow-xl transition-all duration-300 ${
            spotlightItem.isCompleted ? 'opacity-65' : ''
          }`}
        >
          {/* Urgent accent rail */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-1.5 ${
              spotlightItem.urgency === 'high'
                ? 'bg-error shadow-[0_0_12px_rgba(244,63,94,0.6)]'
                : 'bg-primary'
            }`}
          />

          <div className="flex flex-col space-y-3 pl-2">
            {/* Badges */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${
                  spotlightItem.urgency === 'high'
                    ? 'bg-error-container/40 text-error'
                    : 'bg-primary-container/20 text-primary'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    spotlightItem.urgency === 'high'
                      ? 'bg-error animate-ping'
                      : 'bg-primary'
                  }`}
                />
                <span>
                  {spotlightItem.urgency === 'high'
                    ? 'URGENT • TOP PRIORITY'
                    : 'ASSIGNED TO YOU'}
                </span>
              </div>

              {spotlightItem.deadline && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-mono">
                  <Clock className="w-3.5 h-3.5 text-tertiary" />
                  <span>{spotlightItem.deadline}</span>
                </div>
              )}
            </div>

            {/* Title & Interactive Completion Checkbox */}
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => onToggleTask(spotlightItem.id)}
                className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                  spotlightItem.isCompleted
                    ? 'bg-primary border-primary text-on-primary'
                    : 'bg-surface-container border-surface-container-highest hover:border-primary text-transparent'
                }`}
                title="Mark task completed for this session"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="min-w-0 flex-1">
                <p
                  className={`font-headline font-bold text-base md:text-lg text-on-surface leading-snug ${
                    spotlightItem.isCompleted
                      ? 'line-through text-on-surface-variant'
                      : ''
                  }`}
                >
                  {spotlightItem.title}
                </p>
                <p className="text-xs md:text-sm text-on-surface-variant mt-1 leading-relaxed">
                  {spotlightItem.description}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-on-surface-variant">
                  <span className="font-semibold text-primary">
                    Assignee: {spotlightItem.assignee}
                  </span>
                  <span>•</span>
                  <span>{spotlightItem.urgencyReason}</span>
                </div>
              </div>
            </div>

            {/* Expandable Verbatim Chat Citation */}
            <div className="pt-2 border-t border-surface-container-high/80">
              <button
                type="button"
                onClick={() => toggleSource(spotlightItem.id)}
                className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-fixed transition-colors"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    expandedSources[spotlightItem.id] ? 'rotate-180' : ''
                  }`}
                />
                <span>
                  {expandedSources[spotlightItem.id]
                    ? 'Hide verbatim source citation'
                    : 'Show verbatim source citation'}
                </span>
              </button>

              {expandedSources[spotlightItem.id] && (
                <div className="mt-2.5 p-3 rounded-xl bg-surface-container-lowest border border-dashed border-surface-container-highest text-xs font-mono text-on-surface-variant animate-fade-in space-y-1">
                  <div className="flex items-center gap-2 text-on-surface">
                    <span className="font-semibold text-primary">
                      {spotlightItem.sourceMessage.sender}
                    </span>
                    {spotlightItem.sourceMessage.timestamp && (
                      <span className="text-[11px] text-outline">
                        • {spotlightItem.sourceMessage.timestamp}
                      </span>
                    )}
                  </div>
                  <p className="italic text-on-surface">
                    “{spotlightItem.sourceMessage.text}”
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Team Action Checklist */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">
              checklist
            </span>
            <h2 className="font-headline font-bold text-base text-on-surface">
              Action Checklist & Deliverables ({result.allTasks.length})
            </h2>
          </div>
          <span className="text-xs font-mono text-on-surface-variant">
            {result.allTasks.filter(t => !t.isCompleted).length} pending
          </span>
        </div>

        <div className="space-y-2.5">
          {result.allTasks.map(task => (
            <div
              key={task.id}
              className={`rounded-2xl bg-surface-container border border-surface-container-high/70 p-4 transition-all duration-200 ${
                task.isCompleted ? 'opacity-60 bg-surface-container-low' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => onToggleTask(task.id)}
                    className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center border transition-all cursor-pointer ${
                      task.isCompleted
                        ? 'bg-primary border-primary text-on-primary'
                        : 'bg-surface-container-low border-surface-container-highest hover:border-primary text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-headline text-sm font-medium text-on-surface ${
                        task.isCompleted ? 'line-through text-outline' : ''
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-on-surface-variant flex-wrap">
                      <span className="text-secondary font-semibold">
                        {task.assignee}
                      </span>
                      <span>•</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          task.urgency === 'high'
                            ? 'bg-error-container/40 text-error'
                            : task.urgency === 'medium'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {task.urgency}
                      </span>
                      {task.deadline && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-primary text-[11px]">
                            {task.deadline}
                          </span>
                        </>
                      )}
                      {task.needsReview && (
                        <span className="px-1.5 py-0.2 rounded bg-surface-container-highest text-outline text-[10px]">
                          Needs review
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Toggle citation */}
                <button
                  type="button"
                  onClick={() => toggleSource(task.id)}
                  className="text-on-surface-variant hover:text-on-surface p-1 transition-colors"
                  title="Toggle verbatim source citation"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      expandedSources[task.id] ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Collapsed verbatim citation */}
              {expandedSources[task.id] && (
                <div className="mt-2.5 p-3 rounded-xl bg-surface-container-lowest border border-dashed border-surface-container-highest text-xs font-mono text-on-surface-variant animate-fade-in space-y-1">
                  <div className="flex items-center gap-2 text-on-surface">
                    <span className="text-secondary font-semibold">
                      [{task.sourceMessage.timestamp || 'No time'}] {task.sourceMessage.sender}:
                    </span>
                  </div>
                  <p className="italic text-on-surface">
                    “{task.sourceMessage.text}”
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Key Architecture & Flow Decisions */}
      {result.decisions.length > 0 && (
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2 px-1">
            <span className="material-symbols-outlined text-secondary text-[20px]">
              verified
            </span>
            <h2 className="font-headline font-bold text-base text-on-surface">
              Locked Decisions ({result.decisions.length})
            </h2>
          </div>

          <div className="rounded-2xl bg-surface-container border border-surface-container-high/70 p-5 space-y-4 shadow-sm">
            {result.decisions.map((decision, idx) => (
              <div key={decision.id} className="space-y-1.5">
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-headline text-sm font-semibold text-on-surface">
                      {decision.title}
                    </p>
                    {decision.rationale && (
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        <span className="text-outline font-medium">Rationale:</span>{' '}
                        {decision.rationale}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pl-7 text-xs font-mono text-on-surface-variant">
                  <span className="text-secondary font-semibold">
                    [{decision.timestamp || 'Team'}] {decision.decidedBy}:
                  </span>{' '}
                  <span className="italic text-on-surface">
                    “{decision.sourceMessage.text}”
                  </span>
                </div>

                {idx < result.decisions.length - 1 && (
                  <div className="w-full h-px bg-surface-container-high pt-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unresolved Questions & Follow-ups */}
      {result.unresolvedQuestions.length > 0 && (
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2 px-1">
            <HelpCircle className="w-5 h-5 text-tertiary-container" />
            <h2 className="font-headline font-bold text-base text-on-surface">
              Unresolved Questions ({result.unresolvedQuestions.length})
            </h2>
          </div>

          <div className="space-y-2.5">
            {result.unresolvedQuestions.map(q => (
              <div
                key={q.id}
                className="relative overflow-hidden rounded-2xl bg-surface-container border border-surface-container-high/70 p-4 md:p-5 shadow-sm"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary-container" />
                <div className="flex flex-col space-y-2 pl-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] uppercase font-bold text-tertiary-container tracking-wider">
                      Possible Follow-Up
                    </span>
                    <span className="font-mono text-on-surface-variant text-[11px]">
                      Awaiting confirmation
                    </span>
                  </div>

                  <p className="font-headline font-semibold text-sm md:text-base text-on-surface">
                    {q.question}
                  </p>

                  <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 font-mono text-xs text-on-surface-variant">
                    <span className="text-secondary font-semibold">
                      [{q.timestamp || 'Chat'}] {q.askedBy}:
                    </span>{' '}
                    <span className="italic text-on-surface">
                      “{q.sourceMessage.text}”
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority Disclaimer Note */}
      <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex items-start gap-2.5 text-xs text-on-surface-variant">
        <Info className="w-4 h-4 text-outline flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold text-on-surface">Note on priorities:</span> All findings, urgency labels, and deadlines are estimated locally via deterministic syntax analysis. Source messages are provided for every item to ensure verifiable truth.
        </p>
      </div>
    </div>
  );
};
