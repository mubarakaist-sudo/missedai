import React from 'react';
import { ShieldCheck, LogIn } from 'lucide-react';
import { UserAccount } from '../types';

interface HeaderProps {
  currentUser: UserAccount | null;
  onOpenPrivacy: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenPrivacy,
  onOpenProfile,
  onOpenAuth,
}) => {
  // Generate user initials
  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AR';

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl pt-safe border-b border-surface-container-high/50 shadow-[0_1px_8px_rgba(0,0,0,0.3)]">
      <div className="h-16 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary-container/20 border border-primary/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
            <span className="material-symbols-outlined text-primary text-[20px]">
              mark_chat_unread
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-base md:text-lg text-on-surface tracking-tight leading-none">
              MissedIt AI
            </span>
            <span className="text-[10px] text-on-surface-variant font-medium tracking-wide hidden sm:inline">
              "What Did I Miss?"
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Privacy Trust Pill */}
          <button
            onClick={onOpenPrivacy}
            className="inline-flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-bright px-2.5 py-1 rounded-full border border-primary/20 shadow-[0_0_12px_-2px_rgba(16,185,129,0.25)] transition-all cursor-pointer group"
            title="Inspect 100% On-Device Privacy Sandbox"
          >
            <ShieldCheck className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-primary tracking-wide whitespace-nowrap">
              100% On-Device
            </span>
          </button>

          {/* User Account / Auth CTA */}
          {currentUser ? (
            <button
              onClick={onOpenProfile}
              aria-label="Account Profile"
              className="relative w-8 h-8 rounded-full bg-primary hover:bg-primary-fixed flex items-center justify-center flex-shrink-0 text-on-primary font-bold text-xs shadow-md transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
              title={`Logged in as ${currentUser.name} (${currentUser.fullPhoneNumber})`}
            >
              <span>{initials}</span>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-surface border border-surface-container" />
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary hover:bg-primary-fixed text-on-primary text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
