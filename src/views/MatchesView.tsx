// src/views/MatchesView.tsx
import React, { useState } from 'react';
import { 
  Play, RotateCcw, Trash2, Eye, Trophy, Calendar, Filter, Plus, 
  CheckCircle, Clock, Shield, ChevronRight, FileText, ArrowRight
} from 'lucide-react';
import type { MatchState, MatchFormat } from '../types';
import { storage } from '../services/storage';

interface MatchesViewProps {
  onStartNewMatch: () => void;
  onResumeMatch: (match: MatchState) => void;
  onViewScorecard: (match: MatchState) => void;
  onViewSummary: (match: MatchState) => void;
  onViewBallByBall: (match: MatchState) => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  onStartNewMatch,
  onResumeMatch,
  onViewScorecard,
  onViewSummary,
  onViewBallByBall
}) => {
  const [matches, setMatches] = useState<MatchState[]>(storage.getAllMatches());
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
  const [formatFilter, setFormatFilter] = useState<'ALL' | MatchFormat>('ALL');
  const [matchToDelete, setMatchToDelete] = useState<MatchState | null>(null);

  const handleDeleteConfirm = () => {
    if (!matchToDelete) return;

    // If part of tournament fixture, reset fixture
    if (matchToDelete.tournamentId && matchToDelete.fixtureId) {
      const tourneys = storage.getAllTournaments();
      const tourney = tourneys.find(t => t.id === matchToDelete.tournamentId);
      if (tourney) {
        const fix = tourney.fixtures.find(f => f.id === matchToDelete.fixtureId);
        if (fix) {
          fix.isPlayed = false;
          fix.matchId = undefined;
          fix.winnerTeamId = undefined;
          storage.saveTournament(tourney);
        }
      }
    }

    storage.deleteMatch(matchToDelete.id);
    setMatches(storage.getAllMatches());
    setMatchToDelete(null);
  };

  const filteredMatches = matches.filter(m => {
    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'IN_PROGRESS' && (m.status === 'IN_PROGRESS' || m.status === 'TIE_SUPER_OVER')) ||
      (statusFilter === 'COMPLETED' && m.status === 'COMPLETED');
    const matchesFormat = formatFilter === 'ALL' || m.format === formatFilter;
    return matchesStatus && matchesFormat;
  });

  const inProgressCount = matches.filter(m => m.status === 'IN_PROGRESS' || m.status === 'TIE_SUPER_OVER').length;
  const completedCount = matches.filter(m => m.status === 'COMPLETED').length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6 select-none animate-fadeIn pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#272b26] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#c3f400]/10 border border-[#c3f400]/25 text-[#c3f400] text-[10px] font-black uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>Match Records &amp; Ledger</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Matches Hub
          </h1>
          <p className="text-xs text-slate-400">
            {inProgressCount} in progress · {completedCount} completed · Everything saved on device
          </p>
        </div>

        <button
          onClick={onStartNewMatch}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#c3f400] hover:bg-[#d4ff1a] text-black font-black text-xs uppercase tracking-wider transition-transform active:scale-95 shadow-md shadow-[#c3f400]/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Match</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#141814] border border-[#272b26] p-3 rounded-2xl">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'ALL', label: `All (${matches.length})` },
            { id: 'IN_PROGRESS', label: `In Progress (${inProgressCount})` },
            { id: 'COMPLETED', label: `Completed (${completedCount})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === tab.id
                  ? 'bg-[#c3f400] text-black font-black shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-[#101410] border border-white/5 rounded-xl p-1 text-xs font-bold">
          <button
            onClick={() => setFormatFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              formatFilter === 'ALL' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Overs
          </button>
          <button
            onClick={() => setFormatFilter('5_overs')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              formatFilter === '5_overs' ? 'bg-[#c3f400] text-black font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            5 Ov
          </button>
          <button
            onClick={() => setFormatFilter('10_overs')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              formatFilter === '10_overs' ? 'bg-[#c3f400] text-black font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            10 Ov
          </button>
        </div>
      </div>

      {/* Match Cards List */}
      <div className="space-y-3">
        {filteredMatches.length > 0 ? (
          filteredMatches.map(m => {
            const isInProgress = m.status === 'IN_PROGRESS' || m.status === 'TIE_SUPER_OVER';
            const inn1 = m.innings1;
            const inn2 = m.innings2;

            return (
              <div
                key={m.id}
                className="bg-[#141814] border border-[#272b26] hover:border-white/20 rounded-3xl p-4 transition-all shadow-md flex flex-col gap-3"
              >
                {/* Top Info Bar */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#c3f400] bg-[#c3f400]/10 px-2.5 py-0.5 rounded-full border border-[#c3f400]/20 text-[10px] uppercase">
                      {m.format.replace('_', ' ')} · {m.ground} Ground
                    </span>
                    {m.tournamentId && (
                      <span className="bg-amber-400/10 text-amber-300 border border-amber-400/20 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        🏆 Tournament Match
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold flex items-center gap-1.5 ${
                      isInProgress ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        isInProgress ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'
                      }`} />
                      {isInProgress ? 'In Progress' : 'Completed'}
                    </span>
                    <button
                      onClick={() => setMatchToDelete(m)}
                      title="Delete Match Record"
                      className="w-7 h-7 rounded-full bg-red-950/40 text-red-400 hover:bg-red-900/60 flex items-center justify-center transition-colors ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Teams & Scores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-1">
                  {/* Innings 1 Team */}
                  <div className="flex items-center justify-between bg-[#191d18] p-3 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#0b0f0b] border border-white/10 flex items-center justify-center text-sm font-black text-white">
                        {inn1.team.code}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-1">
                          <span>{inn1.team.name}</span>
                          <span className="text-amber-400 text-xs">{m.teamASnapshotStars || inn1.team.printedStars}★</span>
                        </div>
                        <div className="text-[11px] text-slate-400">1st Innings</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-white font-mono">
                        {inn1.score}/{inn1.wickets}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ({inn1.completedOvers}.{inn1.ballsInCurrentOver} ov)
                      </div>
                    </div>
                  </div>

                  {/* Innings 2 Team */}
                  <div className="flex items-center justify-between bg-[#191d18] p-3 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#0b0f0b] border border-white/10 flex items-center justify-center text-sm font-black text-white">
                        {inn2.team.code}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-1">
                          <span>{inn2.team.name}</span>
                          <span className="text-amber-400 text-xs">{m.teamBSnapshotStars || inn2.team.printedStars}★</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {m.targetRuns ? `Target: ${m.targetRuns}` : '2nd Innings'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-[#c3f400] font-mono">
                        {inn2.score}/{inn2.wickets}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ({inn2.completedOvers}.{inn2.ballsInCurrentOver} ov)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outcome Banner & Action Buttons */}
                <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="text-slate-300">
                    {m.winDescription ? (
                      <span className="text-[#c3f400] font-bold">{m.winDescription}</span>
                    ) : (
                      <span>Match in progress · {m.currentInningsNo === 1 ? '1st' : '2nd'} innings live</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {isInProgress ? (
                      <button
                        onClick={() => onResumeMatch(m)}
                        className="flex-1 sm:flex-none px-5 py-2 rounded-full bg-[#c3f400] hover:bg-[#d4ff1a] text-black font-black text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Resume Match</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => onViewScorecard(m)}
                          className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-full bg-[#1d211c] hover:bg-[#272b26] text-white font-bold text-xs border border-white/10"
                        >
                          Scorecard
                        </button>
                        <button
                          onClick={() => onViewSummary(m)}
                          className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-full bg-[#1d211c] hover:bg-[#272b26] text-white font-bold text-xs border border-white/10"
                        >
                          Summary
                        </button>
                        <button
                          onClick={() => onViewBallByBall(m)}
                          className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-full bg-[#1d211c] hover:bg-[#272b26] text-[#c3f400] font-bold text-xs border border-[#c3f400]/30"
                        >
                          Ball by Ball
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-12 text-center text-slate-400">
            <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Matches Found</h3>
            <p className="text-xs mb-4">Start a new match or adjust your filters above.</p>
            <button
              onClick={onStartNewMatch}
              className="px-6 py-2 rounded-full bg-[#c3f400] text-black font-black text-xs uppercase"
            >
              Start New Match
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {matchToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#141814] border border-red-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-red-400">
              <Trash2 className="w-5 h-5" />
              <h3 className="text-base font-black text-white">Delete Match Record?</h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete this match record for <strong>{matchToDelete.teamA.code} vs {matchToDelete.teamB.code}</strong>?
              {matchToDelete.tournamentId && " This is a tournament fixture; deleting will reset the fixture back to unplayed."}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setMatchToDelete(null)}
                className="px-4 py-2 rounded-full text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-full text-xs font-black bg-red-600 hover:bg-red-500 text-white uppercase tracking-wider shadow-lg shadow-red-600/30"
              >
                Delete Match
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
