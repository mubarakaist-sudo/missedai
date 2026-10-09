import React, { useState } from 'react';
import { Tag, Plus, X, Check, MessageSquare, CheckCircle2, LogOut, LogIn } from 'lucide-react';
import { UserAccount } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  userName: string;
  onUpdateUserName: (name: string) => void;
  aliases: string[];
  onUpdateAliases: (aliases: string[]) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  userName,
  onUpdateUserName,
  aliases,
  onUpdateAliases,
  onLogout,
  onOpenAuth,
}) => {
  const [tempName, setTempName] = useState(userName);
  const [newAlias, setNewAlias] = useState('');

  if (!isOpen) return null;

  const initials = userName
    ? userName
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AR';

  const handleAddAlias = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAlias.trim() && !aliases.includes(newAlias.trim())) {
      onUpdateAliases([...aliases, newAlias.trim()]);
      setNewAlias('');
    }
  };

  const handleRemoveAlias = (aliasToRemove: string) => {
    onUpdateAliases(aliases.filter(a => a !== aliasToRemove));
  };

  const handleSave = () => {
    onUpdateUserName(tempName.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-surface-container border border-surface-container-high p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Subtle Ambient Glow */}
        <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-surface-container-high relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-surface-container-high border border-primary/30 flex items-center justify-center text-primary font-headline font-bold text-base shadow-inner">
                {initials}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-primary ring-2 ring-surface-container" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline font-bold text-base text-on-surface">
                  {userName || 'User Account'}
                </h2>
                <span className="text-[10px] font-semibold text-secondary bg-secondary-container/40 px-2 py-0.5 rounded-full">
                  On-Device Pro
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Member of MissedIt AI Triage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-bright flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Verified WhatsApp Phone Box */}
        {currentUser ? (
          <div className="mt-4 rounded-xl bg-surface-container-low border border-surface-container-high p-3 flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-on-surface-variant">
                  Registered WhatsApp
                </span>
                <span className="font-mono text-xs font-semibold text-on-surface truncate">
                  {currentUser.fullPhoneNumber}
                </span>
              </div>
            </div>
            <div className="inline-flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded-full flex-shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-semibold text-primary">Verified</span>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-xl bg-surface-container-low border border-surface-container-high p-3 flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span>Browsing in Guest Mode</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="px-2.5 py-1 rounded-lg bg-primary text-on-primary text-xs font-semibold flex items-center gap-1 hover:bg-primary-fixed transition-colors"
            >
              <LogIn className="w-3 h-3" />
              <span>Sign In</span>
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="py-4 space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface block">
              Your Primary Name
            </label>
            <input
              type="text"
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full h-10 px-3 rounded-xl bg-surface-container-lowest border border-surface-container-high text-on-surface text-sm placeholder:text-outline focus:outline-none focus:border-primary transition-all"
            />
            <p className="text-[11px] text-on-surface-variant">
              MissedIt AI matches messages directly asking you questions or assigning tasks.
            </p>
          </div>

          {/* Mentions / Alias Chips */}
          <div className="space-y-2 pt-2 border-t border-surface-container-high">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-primary" />
                Personal Mention Triggers
              </label>
              <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">
                {aliases.length} active
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant">
              Messages referencing these aliases are flagged as high-priority personal items.
            </p>

            {/* Chips List */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {aliases.map((alias, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high border border-surface-container-highest text-xs text-on-surface font-medium"
                >
                  <span>{alias}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAlias(alias)}
                    className="hover:text-error text-on-surface-variant transition-colors ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Alias Form */}
            <form onSubmit={handleAddAlias} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newAlias}
                onChange={e => setNewAlias(e.target.value)}
                placeholder="Add alias (e.g. @arivera, Lex)"
                className="flex-1 h-9 px-3 rounded-lg bg-surface-container-lowest border border-surface-container-high text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={!newAlias.trim()}
                className="px-3 h-9 rounded-lg bg-surface-container-high hover:bg-surface-bright disabled:opacity-50 text-xs font-medium text-primary flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-surface-container-high flex items-center justify-between gap-2">
          {currentUser ? (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="text-xs text-error hover:underline flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-xs font-medium text-on-surface-variant transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-fixed flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
