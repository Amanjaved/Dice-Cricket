// src/views/SummaryView.tsx
import React from 'react';
import { ArrowLeft, Trophy, Award, Flame, Zap, BarChart2 } from 'lucide-react';
import type { MatchState } from '../types';
import { WormChart } from '../components/WormChart';

interface SummaryViewProps {
  match: MatchState;
  onBack: () => void;
  onViewScorecard: () => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ match, onBack, onViewScorecard }) => {
  const inn1 = match.innings1;
  const inn2 = match.innings2;

  // Determine Player of the Match
  const allBatting = [...inn1.battingCard, ...inn2.battingCard];
  const allBowling = [...inn1.bowlingFigures, ...inn2.bowlingFigures];

  let bestPlayerName = inn1.battingCard[0]?.player.name || "Match Performer";
  let bestScore = 0;

  allBatting.forEach(b => {
    const pts = b.runs * 1.5 + b.sixes * 4 + b.fours * 2;
    if (pts > bestScore) {
      bestScore = pts;
      bestPlayerName = b.player.name;
    }
  });

  allBowling.forEach(b => {
    const pts = b.wickets * 25 + b.dots * 2 - b.runsConceded * 0.5;
    if (pts > bestScore) {
      bestScore = pts;
      bestPlayerName = b.player.name;
    }
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6 select-none animate-fadeIn pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#272b26] pb-3">
        <button
          onClick={onBack}
          className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Match</span>
        </button>

        <button
          onClick={onViewScorecard}
          className="px-4 py-1.5 rounded-full bg-[#1d211c] hover:bg-[#272b26] text-xs font-bold text-[#c3f400] border border-[#c3f400]/30 transition-colors"
        >
          Detailed Scorecard →
        </button>
      </div>

      {/* Match Result Banner */}
      <div className="bg-gradient-to-r from-[#141814] via-[#1c221b] to-[#141814] border-2 border-[#c3f400]/40 rounded-3xl p-6 shadow-2xl text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c3f400]/10 text-[#c3f400] text-xs font-black uppercase tracking-wider mb-2">
          <Trophy className="w-3.5 h-3.5" />
          <span>Match Summary · {match.ground} Ground</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          {match.winDescription || `${match.teamA.code} vs ${match.teamB.code} Match in Progress`}
        </h1>
        <div className="mt-4 flex flex-wrap justify-center items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: inn1.team.color }} />
            <span className="font-bold text-white">{inn1.team.name}:</span>
            <span className="font-black font-mono text-white">{inn1.score}/{inn1.wickets} ({inn1.completedOvers}.{inn1.ballsInCurrentOver} ov)</span>
          </div>
          <span className="text-slate-600 font-bold">vs</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: inn2.team.color }} />
            <span className="font-bold text-white">{inn2.team.name}:</span>
            <span className="font-black font-mono text-[#c3f400]">{inn2.score}/{inn2.wickets} ({inn2.completedOvers}.{inn2.ballsInCurrentOver} ov)</span>
          </div>
        </div>
      </div>

      {/* Player of the Match Card */}
      <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-5 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
            <Award className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-amber-300">
              Player of the Match
            </div>
            <div className="text-lg font-black text-white">{bestPlayerName}</div>
            <div className="text-xs text-slate-400">Match-defining impact performance</div>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-[#c3f400] bg-[#c3f400]/10 px-3 py-1 rounded-full">
          MVP Honors
        </span>
      </div>

      {/* Interactive Worm Chart (Stitch: match_summary_worm_chart) */}
      <WormChart
        innings1={inn1}
        innings2={inn2.deliveries.length > 0 ? inn2 : undefined}
        totalOvers={match.format === '5_overs' ? 5 : 10}
      />
    </div>
  );
};
