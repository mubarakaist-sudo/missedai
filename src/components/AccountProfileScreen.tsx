import React, { useState } from 'react';
import {
  MessageSquare,
  CheckCircle2,
  Tag,
  Plus,
  X,
  Bell,
  LogOut,
  Shield,
  Layers,
  ArrowRightLeft,
} from 'lucide-react';
import { UserAccount } from '../types';
import { updateStoredUserAliases } from '../utils/userDatabase';

interface AccountProfileScreenProps {
  user: UserAccount;
  onLogout: () => void;
  onSwitchAccount: () => void;
  onUpdateAliases: (aliases: string[]) => void;
}

export const AccountProfileScreen: React.FC<AccountProfileScreenProps> = ({
  user,
  onLogout,
  onSwitchAccount,
  onUpdateAliases,
}) => {
  const [newAlias, setNewAlias] = useState('');
  const [aliases, setAliases] = useState<string[]>(user.aliases || [user.name, user.name.split(' ')[0]]);
  const [instantSummary, setInstantSummary] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);

  // Initials
  const initials = user.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AR';

  const handleAddAlias = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newAlias.trim();
    if (trimmed && !aliases.includes(trimmed)) {
      const updated = [...aliases, trimmed];
      setAliases(updated);
      onUpdateAliases(updated);
      updateStoredUserAliases(user.id, updated);
      setNewAlias('');
    }
  };

  const handleRemoveAlias = (aliasToRemove: string) => {
    const updated = aliases.filter(a => a !== aliasToRemove);
    setAliases(updated);
    onUpdateAliases(updated);
    updateStoredUserAliases(user.id, updated);
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 py-6 gap-5 animate-fade-in">
      {/* 1. Profile Identity Card */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container border border-surface-container-high/80 p-5 md:p-6 shadow-xl">
        {/* Subtle Ambient Glow */}
        <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 mb-4 relative z-10">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Avatar with Active Pulse Ring */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-surface-container-high border border-primary/40 flex items-center justify-center text-primary font-headline font-bold text-lg shadow-inner">
                {initials}
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-primary ring-2 ring-surface-container" />
            </div>

            <div className="min-w-0 flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="font-headline font-bold text-lg text-on-surface truncate">
                  {user.name}
                </h2>
              </div>
              <p className="text-xs text-on-surface-variant truncate">
                Product Lead & Team Member
              </p>
              <span className="text-[11px] text-outline mt-0.5 font-medium">
                Member since {user.createdAt || 'Recent'}
              </span>
            </div>
          </div>

          {/* Plan Pill */}
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary-container/40 text-secondary text-xs font-semibold whitespace-nowrap flex-shrink-0 border border-secondary/30">
            On-Device Pro
          </span>
        </div>

        {/* Verified WhatsApp Identifier Box */}
        <div className="rounded-xl bg-surface-container-low border border-surface-container-high p-3 flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 text-primary">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-on-surface-variant">
                Registered WhatsApp
              </span>
              <span className="font-mono text-xs md:text-sm text-on-surface font-semibold tracking-tight truncate">
                {user.fullPhoneNumber}
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-surface-container-high px-2.5 py-1 rounded-full flex-shrink-0 border border-primary/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-semibold text-primary">Verified</span>
          </div>
        </div>
      </div>

      {/* 2. Personal Mention Triggers */}
      <div className="rounded-2xl bg-surface-container border border-surface-container-high/80 p-5 shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" />
            <h3 className="font-headline font-semibold text-sm text-on-surface">
              Personal Mention Triggers
            </h3>
          </div>
          <span className="text-[11px] text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
            {aliases.length} Active
          </span>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          MissedIt scans localized chat logs and flags any messages referencing these handles as high-priority tasks assigned to you.
        </p>

        {/* Chip List */}
        <div className="flex flex-wrap gap-2 pt-1">
          {aliases.map((alias, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high border border-surface-container-highest text-on-surface text-xs font-semibold group"
            >
              <span>{alias}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <button
                type="button"
                onClick={() => handleRemoveAlias(alias)}
                className="hover:text-error text-on-surface-variant transition-colors ml-1"
                title="Remove alias"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Alias Form */}
        <form onSubmit={handleAddAlias} className="flex gap-2 pt-2 border-t border-surface-container-high/60">
          <input
            type="text"
            value={newAlias}
            onChange={e => setNewAlias(e.target.value)}
            placeholder="Add handle (e.g. @alexr, Lead, Lex)"
            className="flex-1 h-9 px-3 rounded-xl bg-surface-container-lowest border border-surface-container-high text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={!newAlias.trim()}
            className="px-3.5 h-9 rounded-xl bg-primary hover:bg-primary-fixed disabled:opacity-40 text-on-primary text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Alias</span>
          </button>
        </form>
      </div>

      {/* 3. Notification & Triage Settings */}
      <div className="rounded-2xl bg-surface-container border border-surface-container-high/80 p-5 shadow-md flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <h3 className="font-headline font-semibold text-sm text-on-surface">
            Notification & Triage Preferences
          </h3>
        </div>

        {/* Toggle 1 */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-on-surface">
              WhatsApp Instant Catch-Up Summaries
            </span>
            <span className="text-[11px] text-on-surface-variant">
              Auto-generate morning daily catch-up digest
            </span>
          </div>
          <button
            type="button"
            onClick={() => setInstantSummary(!instantSummary)}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
              instantSummary ? 'bg-primary' : 'bg-surface-container-high'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-on-primary-container shadow-md transition-transform ${
                instantSummary ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle 2 */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-surface-container-high/60">
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-on-surface">
              Deadline & Blocker Alerts
            </span>
            <span className="text-[11px] text-on-surface-variant">
              Highlight time-sensitive action items in spotlight feed
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDeadlineAlerts(!deadlineAlerts)}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
              deadlineAlerts ? 'bg-primary' : 'bg-surface-container-high'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-on-primary-container shadow-md transition-transform ${
                deadlineAlerts ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 4. Connected Intelligence Sources */}
      <div className="rounded-2xl bg-surface-container border border-surface-container-high/80 p-5 shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <h3 className="font-headline font-semibold text-sm text-on-surface">
              Connected Channels
            </h3>
          </div>
          <span className="text-[11px] text-outline font-medium">2 Active</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="rounded-xl bg-surface-container-low border border-surface-container-high p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-on-surface truncate">
                  WhatsApp Web Export
                </p>
                <p className="text-[11px] text-on-surface-variant truncate">
                  Synced locally • Active device
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
              Active
            </span>
          </div>

          <div className="rounded-xl bg-surface-container-low border border-surface-container-high p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-on-surface truncate">
                  Client Sandbox Vault
                </p>
                <p className="text-[11px] text-on-surface-variant truncate">
                  Zero cloud transfer • In-Memory RAM
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold">
              Protected
            </span>
          </div>
        </div>
      </div>

      {/* 5. Account Actions: Switch Account & Log Out */}
      <div className="flex items-center gap-2.5 pt-2">
        <button
          type="button"
          onClick={onSwitchAccount}
          className="flex-1 py-3 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high border border-surface-container-high text-xs font-semibold text-on-surface flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <ArrowRightLeft className="w-4 h-4 text-primary" />
          <span>Switch Account</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="flex-1 py-3 px-4 rounded-xl bg-error-container/20 hover:bg-error-container/35 border border-error/30 text-xs font-semibold text-error flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};
