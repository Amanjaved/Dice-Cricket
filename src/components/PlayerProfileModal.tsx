// src/components/PlayerProfileModal.tsx
import React, { useState } from 'react';
import { X, Award, Shield, Filter, ChevronRight, TrendingUp } from 'lucide-react';
import type { Player, MatchFormat, Team, MatchState } from '../types';
import { storage } from '../services/storage';

interface PlayerProfileModalProps {
  player: Player;
  team: Team;
  onClose: () => void;
  onOpenMatch?: (match: MatchState) => void;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
  player,
  team,
  onClose,
  onOpenMatch
}) => {
  const [selectedFormat, setSelectedFormat] = useState<MatchFormat>('10_overs');
  const [opponentFilter, setOpponentFilter] = useState<string>('ALL');

  const allMatches = storage.getAllMatches().filter(m => m.status === 'COMPLETED');
  const allTeams = storage.getAllTeams();

  // Extract completed innings for this player respecting filters
  const battingInnings: {
    match: MatchState;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    notOut: boolean;
    opponentCode: string;
    format: string;
  }[] = [];

  const bowlingInnings: {
    match: MatchState;
    wickets: number;
    runsConceded: number;
    overs: number;
    dots: number;
    economy: number;
    opponentCode: string;
    format: string;
  }[] = [];

  allMatches.forEach(m => {
    // Check format filter
    if (m.format !== selectedFormat) return;

    // Check opponent
    const isTeamA = m.teamA.id === team.id || m.innings1.team.id === team.id;
    const opponentTeam = isTeamA ? m.teamB : m.teamA;
    if (opponentFilter !== 'ALL' && opponentTeam.code !== opponentFilter) return;

    // Search player's batting
    [m.innings1, m.innings2].forEach(inn => {
      const batEntry = inn.battingCard.find(b => b.player.name === player.name);
      if (batEntry && batEntry.balls > 0) {
        battingInnings.push({
          match: m,
          runs: batEntry.runs,
          balls: batEntry.balls,
          fours: batEntry.fours,
          sixes: batEntry.sixes,
          notOut: !batEntry.isOut,
          opponentCode: opponentTeam.code,
          format: m.format === '5_overs' ? '5 ov' : '10 ov'
        });
      }

      // Search player's bowling
      const bowlEntry = inn.bowlingFigures.find(b => b.player.name === player.name);
      if (bowlEntry && bowlEntry.overs > 0) {
        bowlingInnings.push({
          match: m,
          wickets: bowlEntry.wickets,
          runsConceded: bowlEntry.runsConceded,
          overs: bowlEntry.overs,
          dots: bowlEntry.dots,
          economy: bowlEntry.economy,
          opponentCode: opponentTeam.code,
          format: m.format === '5_overs' ? '5 ov' : '10 ov'
        });
      }
    });
  });

  // Calculate aggregated stats
  const totalRuns = battingInnings.reduce((sum, inn) => sum + inn.runs, 0);
  const totalBalls = battingInnings.reduce((sum, inn) => sum + inn.balls, 0);
  const totalDismissals = battingInnings.filter(inn => !inn.notOut).length;
  const battingAverage = totalDismissals > 0 ? (totalRuns / totalDismissals).toFixed(1) : totalRuns > 0 ? `${totalRuns}.0*` : "-";
  const battingSR = totalBalls > 0 ? ((totalRuns / totalBalls) * 100).toFixed(1) : "-";
  const highestScore = battingInnings.length > 0 
    ? Math.max(...battingInnings.map(i => i.runs))
    : 0;
  const bestBattingStr = highestScore > 0 ? `${highestScore}${battingInnings.find(i => i.runs === highestScore)?.notOut ? '*' : ''}` : "-";

  const totalWickets = bowlingInnings.reduce((sum, inn) => sum + inn.wickets, 0);
  const bestBowling = bowlingInnings.reduce((best, curr) => {
    if (curr.wickets > best.wickets) return curr;
    if (curr.wickets === best.wickets && curr.runsConceded < best.runsConceded) return curr;
    return best;
  }, { wickets: 0, runsConceded: 999 });

  const last5Batting = battingInnings.slice(0, 5);
  const last5Bowling = bowlingInnings.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-2xl bg-[#141814] border border-[#272b26] rounded-3xl p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* 1. Header (Section 14.1) */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3.5">
            <div 
              className="w-13 h-13 rounded-2xl flex items-center justify-center font-mono font-black text-lg text-white shadow-lg border border-white/20"
              style={{ backgroundColor: team.color || '#232821' }}
            >
              #{player.no}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{player.name}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                  {team.code} · {team.name}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white">{player.role}</span>
                <span>•</span>
                <span>{player.bat}</span>
                {player.bowl && (
                  <>
                    <span>•</span>
                    <span className="text-[#c3f400] font-mono">{player.bowl}</span>
                  </>
                )}
              </div>
              {/* Badges / Flags */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {player.marks.includes('C') && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                    Captain (C)
                  </span>
                )}
                {player.marks.includes('★') && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold">
                    ★ Star from {player.starRuns || 20}r
                  </span>
                )}
                {player.marks.includes('F') && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    Finisher (F)
                  </span>
                )}
                {player.marks.includes('O') && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                    Opener (O)
                  </span>
                )}
                {player.marks.includes('D') && (
                  <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[10px] font-bold">
                    Death Bowler (D)
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1d211c] hover:bg-[#272b26] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 custom-scrollbar">
          {/* 2. Skills (Section 14.2) */}
          <div className="bg-[#1d211c] border border-white/5 rounded-2xl p-3 flex items-center justify-around text-xs">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Catching</span>
              <span className={`inline-block w-3 h-3 rounded-full mt-1 ${player.ct === 'Red' ? 'bg-red-500' : player.ct === 'Green' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
              <span className="text-white font-bold ml-1.5">{player.ct}</span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Run Out</span>
              <span className={`inline-block w-3 h-3 rounded-full mt-1 ${player.rt === 'Red' ? 'bg-red-500' : player.rt === 'Green' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
              <span className="text-white font-bold ml-1.5">{player.rt}</span>
            </div>
            {player.role === 'WK' && (
              <>
                <div className="h-6 w-px bg-white/10" />
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Keeper Stumping</span>
                  <span className="text-[#c3f400] font-bold">{player.wkSt || 'Green'}</span>
                </div>
              </>
            )}
          </div>

          {/* 3. Filters (Section 14.3) */}
          <div className="flex items-center justify-between gap-3 bg-[#101410] p-2.5 rounded-2xl border border-white/5">
            <div className="flex bg-[#191d18] rounded-xl p-0.5 text-xs font-bold">
              <button
                onClick={() => setSelectedFormat('5_overs')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedFormat === '5_overs' ? 'bg-[#c3f400] text-black font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                5 Overs
              </button>
              <button
                onClick={() => setSelectedFormat('10_overs')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedFormat === '10_overs' ? 'bg-[#c3f400] text-black font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                10 Overs
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">Against:</span>
              <select
                value={opponentFilter}
                onChange={e => setOpponentFilter(e.target.value)}
                className="bg-[#191d18] text-white border border-white/10 rounded-xl px-2.5 py-1 text-xs outline-none cursor-pointer"
              >
                <option value="ALL">All Nations</option>
                {allTeams.filter(t => t.id !== team.id).map(t => (
                  <option key={t.id} value={t.code}>{t.name} ({t.code})</option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Stats Tiles (Section 14.4) */}
          <div className="grid grid-cols-5 gap-2">
            <div className="bg-[#1d211c] border border-white/5 p-2.5 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Runs</span>
              <span className="text-base font-black text-white mt-0.5 block">{totalRuns}</span>
            </div>
            <div className="bg-[#1d211c] border border-white/5 p-2.5 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Average</span>
              <span className="text-base font-black text-[#c3f400] mt-0.5 block">{battingAverage}</span>
            </div>
            <div className="bg-[#1d211c] border border-white/5 p-2.5 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Strike Rate</span>
              <span className="text-base font-black text-white mt-0.5 block">{battingSR}</span>
            </div>
            <div className="bg-[#1d211c] border border-white/5 p-2.5 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Best</span>
              <span className="text-base font-black text-amber-300 mt-0.5 block">{bestBattingStr}</span>
            </div>
            <div className="bg-[#1d211c] border border-white/5 p-2.5 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Wickets</span>
              <span className="text-base font-black text-white mt-0.5 block">{totalWickets}</span>
            </div>
          </div>

          {/* 5. Last 5 Innings (Section 14.5) */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-[#c3f400]" />
              <span>Last 5 Innings (Newest First)</span>
            </h3>

            {/* Batting List */}
            <div className="bg-[#1d211c] border border-white/5 rounded-2xl p-3 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Batting Innings
              </span>
              {last5Batting.length > 0 ? (
                <div className="space-y-1.5">
                  {last5Batting.map((inn, idx) => (
                    <div
                      key={idx}
                      onClick={() => onOpenMatch && onOpenMatch(inn.match)}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#101410] hover:bg-[#272b26] border border-white/5 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#c3f400] font-mono">
                          {inn.runs}{inn.notOut ? '*' : ''} ({inn.balls})
                        </span>
                        <span className="text-[11px] text-slate-300">
                          v {inn.opponentCode} · {inn.format}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 group-hover:text-white flex items-center gap-0.5">
                        Open match <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-1 italic">No batting innings yet.</p>
              )}
            </div>

            {/* Bowling List (if bowler) */}
            {player.bowl && (
              <div className="bg-[#1d211c] border border-white/5 rounded-2xl p-3 space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Bowling Innings
                </span>
                {last5Bowling.length > 0 ? (
                  <div className="space-y-1.5">
                    {last5Bowling.map((inn, idx) => (
                      <div
                        key={idx}
                        onClick={() => onOpenMatch && onOpenMatch(inn.match)}
                        className="flex items-center justify-between p-2 rounded-xl bg-[#101410] hover:bg-[#272b26] border border-white/5 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-amber-300 font-mono">
                            {inn.wickets}/{inn.runsConceded} ({inn.overs} ov)
                          </span>
                          <span className="text-[11px] text-slate-300">
                            v {inn.opponentCode} · {inn.format}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 group-hover:text-white flex items-center gap-0.5">
                          Open match <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-1 italic">No bowling innings yet.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full text-xs font-bold bg-[#1d211c] text-white hover:bg-[#272b26]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
