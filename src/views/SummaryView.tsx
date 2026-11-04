// src/views/SummaryView.tsx
import React, { useMemo } from 'react';
import { 
  ArrowLeft, Trophy, Award, Flame, Zap, BarChart2, Star, 
  Target, Shield, ChevronRight, Sparkles 
} from 'lucide-react';
import type { MatchState, PlayerOfTheMatch } from '../types';
import { calculatePlayerOfTheMatch } from '../components/VictoryModal';
import { WormChart } from '../components/WormChart';

interface SummaryViewProps {
  match: MatchState;
  onBack: () => void;
  onViewScorecard: () => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ match, onBack, onViewScorecard }) => {
  const inn1 = match.innings1;
  const inn2 = match.innings2;

  // Calculate official Player of the Match based on batting runs and bowling wickets
  const potm: PlayerOfTheMatch = useMemo(() => {
    return match.playerOfTheMatch || calculatePlayerOfTheMatch(match);
  }, [match]);

  const hasBattingStats = !!potm.batting && (potm.batting.balls > 0 || potm.batting.runs > 0);
  const hasBowlingStats = !!potm.bowling && (potm.bowling.overs > 0 || potm.bowling.wickets > 0);

  const getTeamEmoji = (code: string) => {
    switch (code) {
      case 'IND': return '🇮🇳';
      case 'PAK': return '🇵🇰';
      case 'AUS': return '🇦🇺';
      case 'ENG': return '🏴󠁧󠁢󠁥󠁮󠁧󠁿';
      case 'SA': return '🇿🇦';
      case 'NZ': return '🇳🇿';
      case 'WI': return '🌴';
      case 'SL': return '🇱🇰';
      case 'BAN': return '🇧🇩';
      case 'AFG': return '🇦🇫';
      default: return '🏏';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3.5 sm:px-4 py-5 sm:py-6 space-y-5 sm:space-y-6 select-none animate-fadeIn pb-28">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between border-b border-[#272b26] pb-3">
        <button
          onClick={onBack}
          className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Match Pitch</span>
        </button>

        <button
          onClick={onViewScorecard}
          className="px-4 py-1.5 rounded-full bg-[#1d211c] hover:bg-[#272b26] text-xs font-bold text-[#c3f400] border border-[#c3f400]/40 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          <span>Detailed Scorecard</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Match Result Banner */}
      <div className="bg-gradient-to-r from-[#141814] via-[#1c221b] to-[#141814] border-2 border-[#c3f400]/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c3f400]/10 text-[#c3f400] text-[11px] font-black uppercase tracking-wider mb-2 border border-[#c3f400]/20">
          <Trophy className="w-3.5 h-3.5" />
          <span>Match Summary · {match.ground} Ground · {match.format.replace('_', ' ')}</span>
        </div>
        
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
          {match.winDescription || `${match.teamA.code} vs ${match.teamB.code} Match in Progress`}
        </h1>

        {/* Scores side by side */}
        <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 text-sm">
          <div className="flex items-center gap-2 bg-[#0b0f0b]/80 px-3.5 py-1.5 rounded-2xl border border-white/5 w-full sm:w-auto justify-center">
            <span className="text-lg">{getTeamEmoji(inn1.team.code)}</span>
            <span className="font-bold text-white">{inn1.team.name}:</span>
            <span className="font-black font-mono text-white text-base">
              {inn1.score}/{inn1.wickets}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              ({inn1.completedOvers}.{inn1.ballsInCurrentOver} ov)
            </span>
          </div>

          <span className="text-slate-500 font-bold hidden sm:inline">VS</span>

          <div className="flex items-center gap-2 bg-[#0b0f0b]/80 px-3.5 py-1.5 rounded-2xl border border-[#c3f400]/20 w-full sm:w-auto justify-center">
            <span className="text-lg">{getTeamEmoji(inn2.team.code)}</span>
            <span className="font-bold text-white">{inn2.team.name}:</span>
            <span className="font-black font-mono text-[#c3f400] text-base">
              {inn2.score}/{inn2.wickets}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              ({inn2.completedOvers}.{inn2.ballsInCurrentOver} ov)
            </span>
            {match.targetRuns && (
              <span className="text-[10px] text-amber-300 font-mono bg-amber-400/10 px-1.5 py-0.5 rounded">
                Tgt {match.targetRuns}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* DEDICATED PLAYER OF THE MATCH HERO SPOTLIGHT CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1c180f] via-[#221c11] to-[#141814] border-2 border-amber-400/50 p-5 sm:p-6 shadow-[0_12px_40px_rgba(251,191,36,0.15)]">
        {/* Ambient golden glow behind trophy */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Badge Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-amber-400/20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400/25 to-amber-500/15 border border-amber-400/50 text-amber-300 shadow-sm">
            <Award className="w-4 h-4 text-amber-300" />
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">
              PLAYER OF THE MATCH
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-400/30 px-3 py-1 rounded-full shadow-inner">
              ★ {potm.fantasyPoints} Impact Rating
            </span>
            <span className="text-[10px] font-black text-[#101410] bg-[#c3f400] px-2.5 py-1 rounded-full uppercase tracking-wider">
              MVP HONORS
            </span>
          </div>
        </div>

        {/* Player Identity Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 text-[#101410] font-black text-2xl flex items-center justify-center shadow-lg border-2 border-amber-300">
                {potm.name.charAt(0)}
              </div>
              <span className="absolute -bottom-1 -right-1 text-base">
                {getTeamEmoji(potm.teamCode)}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {potm.name}
                </h3>
              </div>
              <div className="text-xs sm:text-sm text-amber-300 font-bold flex items-center gap-1.5 mt-0.5">
                <span>{potm.teamName}</span>
                <span className="text-slate-500">({potm.teamCode})</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 font-mono text-xs">{potm.role}</span>
              </div>
            </div>
          </div>

          {/* Standout Performance Summary Chip */}
          <div className="bg-[#101410]/80 border border-amber-400/30 rounded-2xl p-3 sm:text-right shrink-0">
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block mb-0.5">
              Standout Match Numbers
            </span>
            <div className="text-sm sm:text-base font-black text-[#c3f400] font-mono">
              {hasBattingStats && potm.batting && (
                <span>{potm.batting.runs}{potm.batting.notOut ? '*' : ''}r ({potm.batting.balls}b)</span>
              )}
              {hasBattingStats && hasBowlingStats && <span> &amp; </span>}
              {hasBowlingStats && potm.bowling && (
                <span>{potm.bowling.wickets}w/{potm.bowling.runsConceded}</span>
              )}
            </div>
          </div>
        </div>

        {/* DEDICATED STAT BADGES (Runs Scored & Wickets Taken) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-amber-400/20">
          {/* Batting Contribution Badge */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            hasBattingStats
              ? 'bg-[#182017] border-[#c3f400]/40 shadow-sm'
              : 'bg-[#141814] border-white/5 opacity-50'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#c3f400] flex items-center gap-1.5">
                <span className="text-sm">🏏</span>
                RUNS SCORED
              </span>
              {hasBattingStats && potm.batting && (
                <span className="text-[10px] font-mono font-bold bg-[#c3f400]/15 text-[#c3f400] px-2 py-0.5 rounded-full">
                  SR {potm.batting.strikeRate.toFixed(1)}
                </span>
              )}
            </div>

            {hasBattingStats && potm.batting ? (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white font-mono">
                    {potm.batting.runs}{potm.batting.notOut ? '*' : ''}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    runs off {potm.batting.balls} balls
                  </span>
                  {potm.batting.notOut && (
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 px-1.5 py-0.2 rounded">
                      Not Out
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-300 mt-1 flex items-center gap-2">
                  <span className="text-white font-bold">{potm.batting.fours}</span>
                  <span className="text-slate-400">fours ·</span>
                  <span className="text-white font-bold">{potm.batting.sixes}</span>
                  <span className="text-slate-400">sixes ·</span>
                  <span className="text-[#c3f400] font-mono font-bold">
                    {(potm.batting.fours * 4 + potm.batting.sixes * 6)} boundary runs
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-xs text-slate-500 italic">Did not bat in this match</span>
            )}
          </div>

          {/* Bowling Contribution Badge */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            hasBowlingStats
              ? 'bg-[#1b1c16] border-amber-400/40 shadow-sm'
              : 'bg-[#141814] border-white/5 opacity-50'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-300" />
                WICKETS TAKEN
              </span>
              {hasBowlingStats && potm.bowling && (
                <span className="text-[10px] font-mono font-bold bg-amber-400/15 text-amber-300 px-2 py-0.5 rounded-full">
                  Econ {potm.bowling.economy.toFixed(1)}
                </span>
              )}
            </div>

            {hasBowlingStats && potm.bowling ? (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white font-mono">
                    {potm.bowling.wickets}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    wickets for {potm.bowling.runsConceded} runs ({potm.bowling.overs} ov)
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1 flex items-center gap-2">
                  <span className="text-white font-bold">{potm.bowling.dots}</span>
                  <span className="text-slate-400">dot balls</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-amber-300 font-mono font-semibold">
                    {(potm.bowling.overs * 6)} deliveries bowled
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-xs text-slate-500 italic">Did not bowl in this match</span>
            )}
          </div>
        </div>

        {/* Narrative Headline & Impact Note */}
        <div className="mt-3 pt-3 border-t border-amber-400/20 text-xs">
          <p className="font-bold text-amber-200 flex items-center gap-1.5 text-xs sm:text-sm">
            <Flame className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{potm.headline}</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            {potm.summary}
          </p>
        </div>
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

export default SummaryView;
