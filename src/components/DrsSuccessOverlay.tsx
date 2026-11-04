// src/components/DrsSuccessOverlay.tsx
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, ShieldCheck, Sparkles, Volume2, ArrowRight, X } from 'lucide-react';
import { soundEngine } from '../services/sound';

export interface DrsSuccessOverlayProps {
  isOpen: boolean;
  batsmanName?: string;
  bowlerName?: string;
  wicketType?: string;
  rolledDie?: number;
  autoDismissMs?: number;
  onClose: () => void;
}

export const DrsSuccessOverlay: React.FC<DrsSuccessOverlayProps> = ({
  isOpen,
  batsmanName = "Batter",
  bowlerName = "Bowler",
  wicketType = "LBW",
  rolledDie = 6,
  autoDismissMs = 5000,
  onClose
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isOpen) {
      setProgress(100);
      return;
    }

    // Play triumphant DRS electronic success sound
    soundEngine.playDrsSuccess();

    // Auto-dismiss countdown bar
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / autoDismissMs) * 100);
      setProgress(remainingPct);
      if (elapsed >= autoDismissMs) {
        clearInterval(interval);
        onClose();
      }
    }, 40);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, autoDismissMs, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="DRS Review Successful Announcement"
      data-testid="drs-success-overlay"
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      {/* Background Animated Neon Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[320px] h-[320px] sm:w-[520px] sm:h-[520px] rounded-full border-2 border-[#c3f400]/30 animate-neon-ring" />
        <div className="w-[240px] h-[240px] sm:w-[400px] sm:h-[400px] rounded-full border border-[#ccff00]/40 animate-neon-ring [animation-delay:0.5s]" />
        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#c3f400]/20 blur-3xl" />
      </div>

      {/* Main Broadcast Celebration Card */}
      <div
        className="w-full max-w-lg my-auto bg-[#151914] border-2 border-[#c3f400] rounded-3xl p-4 sm:p-6 shadow-2xl drs-neon-card flex flex-col relative overflow-hidden z-10 animate-view-entrance max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Shimmer laser top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#c3f400] to-transparent shadow-[0_0_12px_#c3f400]" />

        {/* Top Glow Ambient Streaks */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#c3f400]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#38bdf8]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Icon Button */}
        <button
          onClick={onClose}
          aria-label="Close DRS Review Overlay"
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[#232821] hover:bg-[#2e342c] text-[#9ba394] hover:text-white flex items-center justify-center transition-colors z-20 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header Badge */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#232821]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c3f400] animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-widest text-[#c3f400]">
              Third Umpire Telemetry
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#c3f400]/15 border border-[#c3f400]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#c3f400]" />
            <span className="text-[9.5px] font-black uppercase tracking-wider text-[#c3f400]">
              DRS Codex Sec 11
            </span>
          </div>
        </div>

        {/* Main Neon-Glow Headline Banner */}
        <div className="flex flex-col items-center text-center py-3 sm:py-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#c3f400]/10 border border-[#c3f400]/40 mb-2 shadow-[0_0_20px_rgba(195,244,0,0.35)]">
            <ShieldCheck className="w-7 h-7 text-[#c3f400]" />
          </div>

          <span className="text-[10.5px] sm:text-[11.5px] font-extrabold uppercase tracking-[0.25em] text-[#9ba394] mb-1">
            Official Appeal Decision
          </span>

          {/* Core User Request: 'Review Successful' message with neon-glow effect */}
          <h2
            data-testid="drs-review-successful-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-[#c3f400] animate-neon-pulse drs-text-neon leading-tight drop-shadow-[0_0_20px_rgba(195,244,0,0.85)]"
          >
            Review Successful
          </h2>

          <div className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c3f400]/20 border border-[#c3f400]/50 shadow-[0_0_15px_rgba(195,244,0,0.4)]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#c3f400]" />
            <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-wider text-white">
              Decision Overturned · Not Out
            </span>
          </div>

          <p className="text-[11.5px] sm:text-[12.5px] text-[#9ba394] mt-1.5 max-w-sm">
            Original field call <span className="line-through text-red-400 font-semibold">{wicketType}</span> has been overturned to a <strong className="text-white font-bold">Dot Ball (•)</strong>.
          </p>
        </div>

        {/* Die Roll & UltraEdge Telemetry Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-1.5">
          {/* Left: Die Roll Card */}
          <div className="p-2.5 rounded-2xl bg-[#101410] border border-[#2e342c] flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#c3f400] text-[#101410] flex items-center justify-center font-black text-2xl shadow-[0_0_18px_rgba(195,244,0,0.6)] shrink-0">
              {rolledDie}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9.5px] uppercase font-bold text-[#9ba394] tracking-wider">
                DRS 1-Die Result
              </span>
              <span className="text-[12.5px] font-black text-white">
                Die Roll: {rolledDie} (Overturn)
              </span>
              <span className="text-[9.5px] text-[#c3f400] font-semibold">
                Rule: Die 5 or 6 = Safe
              </span>
            </div>
          </div>

          {/* Right: Batter Crease Status */}
          <div className="p-2.5 rounded-2xl bg-[#101410] border border-[#2e342c] flex flex-col justify-center">
            <span className="text-[9.5px] uppercase font-bold text-[#9ba394] tracking-wider">
              Striker Reinstated
            </span>
            <span className="text-[12.5px] font-black text-[#c3f400] truncate">
              {batsmanName} survives!
            </span>
            <span className="text-[9.5px] text-slate-300">
              Bowling: {bowlerName} (Wicket erased)
            </span>
          </div>
        </div>

        {/* UltraEdge Waveform Simulation */}
        <div className="p-2.5 rounded-2xl bg-[#0b0f0b] border border-[#232821] flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10.5px]">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Volume2 className="w-3.5 h-3.5 text-[#c3f400]" />
              <span className="font-bold">UltraEdge™ Audio Waveform</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#c3f400]/20 text-[#c3f400] font-black text-[8.5px] uppercase tracking-wider">
              Spike Detected · Wood Contact
            </span>
          </div>

          {/* Audio Waveform Bars with Glow Center Spike */}
          <div className="h-9 w-full bg-[#121611] rounded-xl flex items-center justify-between px-3 relative overflow-hidden">
            <div className="w-1 h-2 bg-[#9ba394]/30 rounded-full" />
            <div className="w-1 h-3 bg-[#9ba394]/30 rounded-full" />
            <div className="w-1 h-2 bg-[#9ba394]/40 rounded-full" />
            <div className="w-1 h-4 bg-[#9ba394]/50 rounded-full" />
            <div className="w-1 h-3 bg-[#9ba394]/40 rounded-full" />
            {/* Center Neon Spike */}
            <div className="w-1.5 h-5 bg-[#c3f400] rounded-full shadow-[0_0_8px_#c3f400]" />
            <div className="w-2 h-8 bg-[#ccff00] rounded-full shadow-[0_0_14px_#c3f400] animate-pulse" />
            <div className="w-1.5 h-6 bg-[#c3f400] rounded-full shadow-[0_0_8px_#c3f400]" />
            {/* Decay */}
            <div className="w-1 h-4 bg-[#9ba394]/50 rounded-full" />
            <div className="w-1 h-2 bg-[#9ba394]/40 rounded-full" />
            <div className="w-1 h-3 bg-[#9ba394]/30 rounded-full" />
            <div className="w-1 h-1.5 bg-[#9ba394]/20 rounded-full" />
          </div>

          {/* Hawk-Eye Telemetry Strip */}
          <div className="grid grid-cols-3 gap-1 text-center text-[9.5px]">
            <div className="p-1 rounded bg-[#151914] text-slate-300">
              Pitch: <span className="text-[#c3f400] font-bold">In Line</span>
            </div>
            <div className="p-1 rounded bg-[#151914] text-slate-300">
              Impact: <span className="text-[#c3f400] font-bold">Bat Edge</span>
            </div>
            <div className="p-1 rounded bg-[#151914] text-slate-300">
              Verdict: <span className="text-[#c3f400] font-bold">Overturned</span>
            </div>
          </div>
        </div>

        {/* Action Button & Auto-dismiss Bar */}
        <div className="mt-3 flex flex-col gap-1.5">
          <button
            onClick={onClose}
            data-testid="drs-resume-match-button"
            className="w-full py-3 px-4 rounded-full bg-[#c3f400] hover:bg-[#d4ff1a] text-[#101410] text-[12.5px] font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(195,244,0,0.45)] hover:shadow-[0_0_35px_rgba(195,244,0,0.6)] active:scale-95 transition-all cursor-pointer"
          >
            <span>Resume Match · Continue Play</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Dismiss countdown progress strip */}
          <div className="w-full h-1 bg-[#232821] rounded-full overflow-hidden mt-0.5">
            <div
              className="h-full bg-[#c3f400] transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[9.5px] text-center text-[#9ba394]">
            Auto-resuming in {Math.ceil((progress / 100) * (autoDismissMs / 1000))}s (or tap anywhere)
          </span>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default DrsSuccessOverlay;
