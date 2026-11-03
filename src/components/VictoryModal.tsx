// src/components/VictoryModal.tsx
import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import type { MatchState, PlayerOfTheMatch, Team } from '../types';
import { soundEngine } from '../services/sound';
import { 
  Trophy, Award, ArrowRight, BarChart3, RotateCcw, Sparkles, 
  ChevronRight, Flame, Shield, X, CheckCircle2 
} from 'lucide-react';

interface VictoryModalProps {
  match: MatchState;
  onViewScorecard: () => void;
  onViewSummary?: () => void;
  onClose: () => void;
}

/**
 * Calculates the official Player of the Match based on batting & bowling impact formulas.
 */
export function calculatePlayerOfTheMatch(match: MatchState): PlayerOfTheMatch {
  const winnerTeamId = match.winnerTeamId || (
    match.innings2.score >= (match.targetRuns || 0)
      ? match.innings2.team.id
      : match.innings1.team.id
  );

  type Candidate = {
    name: string;
    teamName: string;
    teamCode: string;
    role: string;
    batting?: { runs: number; balls: number; fours: number; sixes: number; notOut: boolean; strikeRate: number };
    bowling?: { wickets: number; runsConceded: number; overs: number; dots: number; economy: number };
    points: number;
  };

  const candidateMap = new Map<string, Candidate>();

  // Process Innings 1 Batting
  match.innings1.battingCard.forEach(b => {
    if (b.balls > 0 || b.runs > 0) {
      let pts = b.runs * 1.0;
      if (b.runs >= 50) pts += 25;
      else if (b.runs >= 30) pts += 15;
      if (b.runs >= 20 && b.strikeRate >= 170) pts += 8;
      pts += b.sixes * 2 + b.fours * 1;
      if (!b.isOut) pts += 6;

      candidateMap.set(b.player.name, {
        name: b.player.name,
        teamName: match.innings1.team.name,
        teamCode: match.innings1.team.code,
        role: b.player.role,
        batting: {
          runs: b.runs,
          balls: b.balls,
          fours: b.fours,
          sixes: b.sixes,
          notOut: !b.isOut,
          strikeRate: b.strikeRate
        },
        points: pts
      });
    }
  });

  // Process Innings 1 Bowling (Team 2 bowling)
  match.innings1.bowlingFigures.forEach(f => {
    if (f.overs > 0 || f.wickets > 0) {
      let pts = f.wickets * 25;
      if (f.wickets >= 3) pts += 20;
      pts += f.dots * 1.5;
      if (f.overs >= 1 && f.economy <= 7.5) pts += 10;

      const existing = candidateMap.get(f.player.name);
      if (existing) {
        existing.bowling = {
          wickets: f.wickets,
          runsConceded: f.runsConceded,
          overs: f.overs,
          dots: f.dots,
          economy: f.economy
        };
        existing.points += pts;
      } else {
        candidateMap.set(f.player.name, {
          name: f.player.name,
          teamName: match.innings2.team.name,
          teamCode: match.innings2.team.code,
          role: f.player.role,
          bowling: {
            wickets: f.wickets,
            runsConceded: f.runsConceded,
            overs: f.overs,
            dots: f.dots,
            economy: f.economy
          },
          points: pts
        });
      }
    }
  });

  // Process Innings 2 Batting
  match.innings2.battingCard.forEach(b => {
    if (b.balls > 0 || b.runs > 0) {
      let pts = b.runs * 1.0;
      if (b.runs >= 50) pts += 25;
      else if (b.runs >= 30) pts += 15;
      if (b.runs >= 20 && b.strikeRate >= 170) pts += 8;
      pts += b.sixes * 2 + b.fours * 1;
      if (!b.isOut) pts += 6;

      const existing = candidateMap.get(b.player.name);
      if (existing) {
        existing.batting = {
          runs: b.runs,
          balls: b.balls,
          fours: b.fours,
          sixes: b.sixes,
          notOut: !b.isOut,
          strikeRate: b.strikeRate
        };
        existing.points += pts;
      } else {
        candidateMap.set(b.player.name, {
          name: b.player.name,
          teamName: match.innings2.team.name,
          teamCode: match.innings2.team.code,
          role: b.player.role,
          batting: {
            runs: b.runs,
            balls: b.balls,
            fours: b.fours,
            sixes: b.sixes,
            notOut: !b.isOut,
            strikeRate: b.strikeRate
          },
          points: pts
        });
      }
    }
  });

  // Process Innings 2 Bowling (Team 1 bowling)
  match.innings2.bowlingFigures.forEach(f => {
    if (f.overs > 0 || f.wickets > 0) {
      let pts = f.wickets * 25;
      if (f.wickets >= 3) pts += 20;
      pts += f.dots * 1.5;
      if (f.overs >= 1 && f.economy <= 7.5) pts += 10;

      const existing = candidateMap.get(f.player.name);
      if (existing) {
        existing.bowling = {
          wickets: f.wickets,
          runsConceded: f.runsConceded,
          overs: f.overs,
          dots: f.dots,
          economy: f.economy
        };
        existing.points += pts;
      } else {
        candidateMap.set(f.player.name, {
          name: f.player.name,
          teamName: match.innings1.team.name,
          teamCode: match.innings1.team.code,
          role: f.player.role,
          bowling: {
            wickets: f.wickets,
            runsConceded: f.runsConceded,
            overs: f.overs,
            dots: f.dots,
            economy: f.economy
          },
          points: pts
        });
      }
    }
  });

  // Apply winning team bonus (1.25x)
  const candidates = Array.from(candidateMap.values());
  candidates.forEach(c => {
    const isWinner = (c.teamCode === match.innings1.team.code && winnerTeamId === match.innings1.team.id) ||
                     (c.teamCode === match.innings2.team.code && winnerTeamId === match.innings2.team.id);
    if (isWinner) {
      c.points *= 1.25;
    }
  });

  // Sort descending by points
  candidates.sort((a, b) => b.points - a.points);
  const best = candidates[0] || {
    name: match.innings1.team.captain,
    teamName: match.innings1.team.name,
    teamCode: match.innings1.team.code,
    role: 'BTBW',
    points: 40
  };

  // Build headline and summary
  let headline = "";
  if (best.batting && best.bowling && best.bowling.wickets > 0) {
    headline = `${best.batting.runs}${best.batting.notOut ? '*' : ''} (${best.batting.balls}b) & ${best.bowling.wickets}/${best.bowling.runsConceded}`;
  } else if (best.batting) {
    headline = `${best.batting.runs}${best.batting.notOut ? '*' : ''} runs off ${best.batting.balls} balls (${best.batting.fours}×4, ${best.batting.sixes}×6)`;
  } else if (best.bowling) {
    headline = `${best.bowling.wickets} wickets for ${best.bowling.runsConceded} (${best.bowling.overs} ov)`;
  } else {
    headline = "Match Defining Leadership & Strategy";
  }

  const summary = `Delivered top impact rating (${Math.round(best.points)} pts) to power ${best.teamName} in this arena battle.`;

  return {
    name: best.name,
    teamName: best.teamName,
    teamCode: best.teamCode,
    role: best.role,
    headline,
    summary,
    batting: best.batting,
    bowling: best.bowling,
    fantasyPoints: Math.round(best.points)
  };
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  match,
  onViewScorecard,
  onViewSummary,
  onClose
}) => {
  const modalScrollRef = React.useRef<HTMLDivElement>(null);

  // Play grand victory fanfare on mount & reset scroll
  useEffect(() => {
    soundEngine.playVictoryFanfare();
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTop = 0;
    }
  }, []);

  const potm = useMemo(() => {
    return match.playerOfTheMatch || calculatePlayerOfTheMatch(match);
  }, [match]);

  const winningTeam: Team = useMemo(() => {
    if (match.winnerTeamId === match.innings1.team.id) return match.innings1.team;
    if (match.winnerTeamId === match.innings2.team.id) return match.innings2.team;
    return match.innings2.score >= (match.targetRuns || 0) ? match.innings2.team : match.innings1.team;
  }, [match]);

  const runnerUpTeam: Team = winningTeam.id === match.innings1.team.id ? match.innings2.team : match.innings1.team;

  const winningInnings = winningTeam.id === match.innings1.team.id ? match.innings1 : match.innings2;
  const runnerUpInnings = winningTeam.id === match.innings1.team.id ? match.innings2 : match.innings1;

  const totalOvers = match.format === '5_overs' ? 5 : 10;

  // Falling confetti ribbons
  const confettiParticles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${(i * 4.2 + 2) % 100}%`,
      delay: `${(i * 0.18).toFixed(2)}s`,
      duration: `${(2.8 + (i % 5) * 0.4).toFixed(2)}s`,
      bg: i % 4 === 0 ? '#ccff00' : i % 4 === 1 ? '#fbbf24' : i % 4 === 2 ? '#38bdf8' : '#ef4444',
      size: `${6 + (i % 4) * 2}px`,
      width: `${12 + (i % 3) * 6}px`
    }));
  }, []);

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-fadeIn overflow-y-auto select-none">
      {/* Background Animated Falling Confetti Ribbons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confettiParticles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-sm animate-confetti-particle opacity-80"
            style={{
              left: p.left,
              top: '-15px',
              width: p.width,
              height: p.size,
              backgroundColor: p.bg,
              animationDelay: p.delay,
              animationDuration: p.duration
            }}
          />
        ))}
      </div>

      {/* Main Victory Dialog Shell */}
      <div 
        ref={modalScrollRef}
        className="relative my-auto w-full max-w-lg bg-gradient-to-b from-[#182017] via-[#121611] to-[#0c0f0c] border-2 border-[#ccff00]/50 rounded-3xl p-3.5 sm:p-5 shadow-[0_0_60px_rgba(204,255,0,0.28)] flex flex-col max-h-[92vh] overflow-y-auto no-scrollbar z-10 tactical-card-sheen"
      >
        {/* Shimmer laser top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#ccff00] to-transparent" />

        {/* Top Header Row with Close Icon */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ccff00] animate-beacon-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ccff00]">
              MATCH CONCLUDED · CHAMPIONS PODIUM
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#1b2218] border border-white/10 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
            title="Dismiss to inspect pitch"
          >
            ✕
          </button>
        </div>

        {/* Hero Champion Spotlight */}
        <div className="flex flex-col items-center text-center my-1.5 relative">
          {/* Glowing Trophy */}
          <div className="relative mb-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-amber-400/20 to-amber-950/40 border-2 border-amber-400/60 flex items-center justify-center shadow-xl animate-trophy-glow animate-victory-float">
              <span className="text-2xl">🏆</span>
            </div>
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#ccff00] text-[#101410] text-[7.5px] font-black uppercase tracking-wider shadow-md">
              VICTORY
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg">{winningTeam.code === 'IND' ? '🇮🇳' : winningTeam.code === 'PAK' ? '🇵🇰' : winningTeam.code === 'AUS' ? '🇦🇺' : winningTeam.code === 'SL' ? '🇱🇰' : '🏏'}</span>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
              {winningTeam.name}
            </h1>
          </div>

          <div className="mt-0.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 border border-[#ccff00]/40 text-[#ccff00] text-[10.5px] font-black uppercase tracking-wide">
            <Sparkles className="w-3 h-3 text-[#ccff00]" />
            <span>{match.winDescription || `${winningTeam.name} won the match!`}</span>
          </div>
        </div>

        {/* Innings Telemetry Comparison Card */}
        <div className="bg-[#0e120e] border border-white/10 rounded-2xl p-2 my-1">
          <div className="text-[9.5px] font-bold text-[#9ba394] uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Match Innings Summary</span>
            <span className="text-slate-400 font-mono">Format: {match.format.replace('_', ' ')} · {match.ground}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* 1st Innings */}
            <div className={`p-2.5 rounded-xl border ${
              match.winnerTeamId === match.innings1.team.id ? 'bg-[#182218] border-[#ccff00]/30' : 'bg-[#141814] border-white/5'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white flex items-center gap-1">
                  {match.innings1.team.code}
                  {match.winnerTeamId === match.innings1.team.id && <span className="text-amber-400 text-xs">🏆</span>}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">1st Inn</span>
              </div>
              <div className="text-lg font-black text-white font-mono">
                {match.innings1.score}/{match.innings1.wickets}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                ({match.innings1.completedOvers}.{match.innings1.ballsInCurrentOver} ov) · RR {((match.innings1.score / (Math.max(1, match.innings1.completedOvers * 6 + match.innings1.ballsInCurrentOver) / 6))).toFixed(2)}
              </div>
            </div>

            {/* 2nd Innings */}
            <div className={`p-2.5 rounded-xl border ${
              match.winnerTeamId === match.innings2.team.id ? 'bg-[#182218] border-[#ccff00]/30' : 'bg-[#141814] border-white/5'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white flex items-center gap-1">
                  {match.innings2.team.code}
                  {match.winnerTeamId === match.innings2.team.id && <span className="text-amber-400 text-xs">🏆</span>}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">2nd Inn</span>
              </div>
              <div className="text-lg font-black text-white font-mono">
                {match.innings2.score}/{match.innings2.wickets}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                ({match.innings2.completedOvers}.{match.innings2.ballsInCurrentOver} ov) · Target: {match.targetRuns || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* PLAYER OF THE MATCH HERO SPOTLIGHT */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1c180f] via-[#241e12] to-[#1c180f] border-2 border-amber-400/50 p-3 my-1.5 shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

          {/* Header Tag */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 px-2 py-0.2 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[9px] font-black uppercase tracking-wider">
              <Award className="w-3 h-3 text-amber-300" />
              <span>Player of the Match</span>
            </div>
            <span className="text-[9px] font-mono font-bold text-amber-200/80 bg-black/40 px-2 py-0.2 rounded-full">
              ★ {potm.fantasyPoints} Impact Rating
            </span>
          </div>

          {/* Player Identity */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-[#101410] font-black text-lg flex items-center justify-center shadow-md shrink-0">
                {potm.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                  {potm.name}
                </h3>
                <div className="text-[11px] text-amber-300 font-bold flex items-center gap-1.5 mt-0.5">
                  <span>{potm.teamName} ({potm.teamCode})</span>
                  <span>·</span>
                  <span className="text-slate-400 font-mono text-[9px]">{potm.role}</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Standout Stats</span>
              <span className="text-xs font-black text-[#ccff00] font-mono block">
                {potm.batting ? `${potm.batting.runs}${potm.batting.notOut ? '*' : ''}r (${potm.batting.balls}b)` : ''}
                {potm.batting && potm.bowling ? ' & ' : ''}
                {potm.bowling ? `${potm.bowling.wickets}w/${potm.bowling.runsConceded}` : ''}
              </span>
            </div>
          </div>

          {/* Headline & Performance Narrative */}
          <div className="mt-2 pt-2 border-t border-amber-400/20 text-xs text-slate-300">
            <p className="font-semibold text-amber-100 flex items-center gap-1 text-[11px]">
              <Flame className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{potm.headline}</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
              {potm.summary}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 mt-2 pt-2 border-t border-white/10">
          {/* Primary View Scorecard Button with Pulse */}
          <button
            onClick={onViewScorecard}
            className="w-full h-11 rounded-full bg-[#ccff00] hover:bg-[#b8f000] text-[#101410] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#ccff00]/25 transition-all active:scale-[0.98] cursor-pointer animate-subtle-pulse"
          >
            <BarChart3 className="w-4 h-4 text-[#101410]" />
            <span>View Complete Match Scorecard</span>
            <ArrowRight className="w-4 h-4 text-[#101410]" />
          </button>

          {/* Secondary Options */}
          <div className="grid grid-cols-2 gap-2">
            {onViewSummary && (
              <button
                onClick={onViewSummary}
                className="py-2 px-3 rounded-full bg-[#1b2218] hover:bg-[#252f21] border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Worm &amp; Summary</span>
              </button>
            )}
            <button
              onClick={onClose}
              className={`py-2 px-3 rounded-full bg-[#141814] hover:bg-[#1f261e] border border-white/10 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                !onViewSummary ? 'col-span-2' : ''
              }`}
            >
              <span>Stay on Pitch View</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
};

export default VictoryModal;
