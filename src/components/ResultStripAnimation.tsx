// src/components/ResultStripAnimation.tsx
import React, { useEffect, useState } from 'react';
import type { OverDelivery } from '../types';

interface ResultStripAnimationProps {
  delivery: OverDelivery | null;
  animationsEnabled: boolean;
  onDismissMilestone?: () => void;
}

export interface Milestone {
  type: 'batsman' | 'bowler' | 'team';
  title: string;
  subtitle: string;
  tier: 50 | 100 | 150 | 200 | 3 | 5;
}

export const ResultStripAnimation: React.FC<ResultStripAnimationProps> = ({
  delivery,
  animationsEnabled
}) => {
  const [activeAnimation, setActiveAnimation] = useState<'runners' | 'four' | 'six' | null>(null);
  const [runsCount, setRunsCount] = useState<number>(1);

  // Check system prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!delivery || !animationsEnabled || prefersReducedMotion) {
      setActiveAnimation(null);
      return;
    }

    if (delivery.runsScored === 6 && !delivery.isWicket) {
      setActiveAnimation('six');
      const timer = setTimeout(() => setActiveAnimation(null), 3500);
      return () => clearTimeout(timer);
    } else if (delivery.runsScored === 4 && !delivery.isWicket) {
      setActiveAnimation('four');
      const timer = setTimeout(() => setActiveAnimation(null), 3200);
      return () => clearTimeout(timer);
    } else if ([1, 2, 3].includes(delivery.runsScored) && !delivery.isWicket && !delivery.extraType) {
      setRunsCount(delivery.runsScored);
      setActiveAnimation('runners');
      const timer = setTimeout(() => setActiveAnimation(null), 2800);
      return () => clearTimeout(timer);
    } else {
      setActiveAnimation(null);
    }
  }, [delivery, animationsEnabled, prefersReducedMotion]);

  if (!activeAnimation) return null;

  return (
    <div className="w-full overflow-hidden py-1 px-2 flex items-center justify-center animate-fadeIn select-none">
      {/* 1, 2, 3 Runs: Two batsmen running between wickets */}
      {activeAnimation === 'runners' && (
        <div className="w-full max-w-sm flex items-center justify-between relative h-10 px-6 bg-[#0b0f0b]/80 border border-white/10 rounded-2xl overflow-hidden">
          {/* Pitch crease line left */}
          <div className="w-1 h-6 bg-white/40 rounded-full" />

          {/* Running Batsmen Track */}
          <div className="relative flex-1 h-full mx-4 flex items-center">
            {/* Striker running left to right */}
            <div 
              className="absolute flex items-center gap-1 text-[11px] font-black text-[#c3f400] transition-all"
              style={{
                animation: `batsmanRunL2R ${runsCount === 1 ? '1.8s' : runsCount === 2 ? '2.4s' : '2.8s'} ease-in-out forwards`
              }}
            >
              <span>🏏</span>
              <span className="text-[9px] bg-[#c3f400] text-black px-1 rounded-full font-bold">1st</span>
            </div>

            {/* Non-striker running right to left */}
            <div 
              className="absolute flex items-center gap-1 text-[11px] font-black text-white transition-all"
              style={{
                animation: `batsmanRunR2L ${runsCount === 1 ? '1.8s' : runsCount === 2 ? '2.4s' : '2.8s'} ease-in-out forwards`
              }}
            >
              <span className="text-[9px] bg-white text-black px-1 rounded-full font-bold">2nd</span>
              <span>🏃</span>
            </div>
          </div>

          {/* Pitch crease line right */}
          <div className="w-1 h-6 bg-white/40 rounded-full" />

          <div className="absolute top-1 right-2 text-[9px] font-bold text-slate-400 font-mono">
            {runsCount} {runsCount === 1 ? 'Run Taken' : 'Runs Completed'}
          </div>
        </div>
      )}

      {/* FOUR: Umpire waves arm across chest */}
      {activeAnimation === 'four' && (
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-2xl bg-[#c3f400]/15 border border-[#c3f400]/40 shadow-[0_0_20px_rgba(195,244,0,0.25)] animate-slideUp">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#c3f400] text-black font-black text-sm">
            4
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-black text-white tracking-wide uppercase flex items-center gap-1.5">
              <span>FOUR RUNS!</span>
              <span className="text-sm animate-waveArm">🙋‍♂️</span>
            </span>
            <span className="text-[10px] text-[#c3f400] font-semibold">
              Umpire Signal: Arm wave across chest to boundary
            </span>
          </div>
        </div>
      )}

      {/* SIX: Umpire raises both arms straight up */}
      {activeAnimation === 'six' && (
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-2xl bg-amber-400/15 border border-amber-400/40 shadow-[0_0_20px_rgba(251,191,36,0.3)] animate-slideUp">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-amber-400 text-black font-black text-sm">
            6
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#c3f400] rounded-full animate-ping" />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-black text-amber-300 tracking-wide uppercase flex items-center gap-1.5">
              <span>MAXIMUM SIX!</span>
              <span className="text-sm animate-bounce">🙌</span>
            </span>
            <span className="text-[10px] text-amber-200/90 font-semibold">
              Umpire Signal: Both arms raised straight overhead
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Milestone Celebration Card (Section 6.4)
export const MilestoneCard: React.FC<{
  milestone: Milestone;
  animationsEnabled: boolean;
  onClose: () => void;
}> = ({ milestone, animationsEnabled, onClose }) => {
  return (
    <div 
      onClick={onClose}
      className="w-full max-w-md mx-auto my-1.5 p-3 rounded-2xl bg-gradient-to-r from-[#191d18] via-[#232821] to-[#191d18] border-2 border-amber-400/60 shadow-2xl flex items-center justify-between cursor-pointer animate-slideUp select-none"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-xl shadow-inner">
          {milestone.type === 'team' && '🏆'}
          {milestone.type === 'batsman' && '🏏'}
          {milestone.type === 'bowler' && '🎯'}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
              {milestone.title}
            </span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase">
              {milestone.tier} {milestone.type === 'bowler' ? 'WKTS' : 'RUNS'}
            </span>
          </div>
          <p className="text-[11px] text-slate-200 mt-0.5">
            {milestone.subtitle}
          </p>
        </div>
      </div>

      <div className="text-right">
        {animationsEnabled && (
          <span className="text-base animate-pulse">
            {milestone.tier >= 150 ? '🎆✨' : '🎉'}
          </span>
        )}
        <span className="text-[9px] text-slate-400 block">Tap to close</span>
      </div>
    </div>
  );
};
