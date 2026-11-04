// src/components/SuperOverModal.tsx
import React, { useState } from 'react';
import { Trophy, Shield, ArrowRight, AlertTriangle } from 'lucide-react';
import type { Team, Player, MatchState } from '../types';

interface SuperOverModalProps {
  match: MatchState;
  superOverNumber: number;
  onStartSuperOver: (config: {
    battingFirstTeamId: string;
    team3Batsmen: { [teamId: string]: Player[] };
    teamBowler: { [teamId: string]: Player };
  }) => void;
  onLeaveAsTie?: () => void;
  isKnockout: boolean;
}

export const SuperOverModal: React.FC<SuperOverModalProps> = ({
  match,
  superOverNumber,
  onStartSuperOver,
  onLeaveAsTie,
  isKnockout
}) => {
  const teamA = match.teamA;
  const teamB = match.teamB;

  // By cricket rules, the team that batted 2nd in the match bats 1st in the 1st Super Over
  const defaultBattingFirst = superOverNumber % 2 === 1 ? match.innings2.team.id : match.innings1.team.id;
  const [battingFirstId, setBattingFirstId] = useState<string>(defaultBattingFirst);

  // Nominate 3 batsmen each
  const [teamABatsmen, setTeamABatsmen] = useState<Player[]>(teamA.players.slice(0, 3));
  const [teamBBatsmen, setTeamBBatsmen] = useState<Player[]>(teamB.players.slice(0, 3));

  // Nominate 1 bowler each
  const teamABowlers = teamA.players.filter(p => p.bowl !== null);
  const teamBBowlers = teamB.players.filter(p => p.bowl !== null);
  const [teamABowler, setTeamABowler] = useState<Player>(teamABowlers[0] || teamA.players[teamA.players.length - 1]);
  const [teamBBowler, setTeamBBowler] = useState<Player>(teamBBowlers[0] || teamB.players[teamB.players.length - 1]);

  const handleConfirm = () => {
    onStartSuperOver({
      battingFirstTeamId: battingFirstId,
      team3Batsmen: {
        [teamA.id]: teamABatsmen,
        [teamB.id]: teamBBatsmen
      },
      teamBowler: {
        [teamA.id]: teamABowler,
        [teamB.id]: teamBBowler
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-xl bg-[#141814] border-2 border-amber-400/60 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="border-b border-white/10 pb-3 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              <span>MATCH TIED! SUPER OVER {superOverNumber}</span>
            </div>
            <h2 className="text-xl font-black text-white mt-1">
              Nominate 3 Batsmen &amp; 1 Bowler
            </h2>
            <p className="text-xs text-slate-400">
              1 Over · Slog Sheets · 2 Wickets End Innings · No Power Cards Allowed
            </p>
          </div>
          <div className="text-right font-mono text-xs text-amber-400 font-bold">
            {match.teamA.code} vs {match.teamB.code}
          </div>
        </div>

        {/* Batting First Selection */}
        <div className="bg-[#191d18] p-3 rounded-2xl border border-white/5 space-y-2">
          <label className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
            Who bats first in Super Over {superOverNumber}?
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setBattingFirstId(teamA.id)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                battingFirstId === teamA.id
                  ? 'bg-[#c3f400] text-black font-black shadow-md'
                  : 'bg-[#101410] text-slate-400 hover:text-white'
              }`}
            >
              <span>{teamA.name} ({teamA.code})</span>
            </button>
            <button
              type="button"
              onClick={() => setBattingFirstId(teamB.id)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                battingFirstId === teamB.id
                  ? 'bg-[#c3f400] text-black font-black shadow-md'
                  : 'bg-[#101410] text-slate-400 hover:text-white'
              }`}
            >
              <span>{teamB.name} ({teamB.code})</span>
            </button>
          </div>
        </div>

        {/* Team A Nominations */}
        <div className="bg-[#191d18] p-3.5 rounded-2xl border border-white/5 space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-xs font-black text-white uppercase">{teamA.name} ({teamA.code})</span>
            <span className="text-[10px] text-slate-400">3 Batsmen + 1 Bowler</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Top 3 Batsmen</label>
              <div className="space-y-1">
                {[0, 1, 2].map(idx => (
                  <select
                    key={idx}
                    value={teamABatsmen[idx]?.name || ''}
                    onChange={e => {
                      const p = teamA.players.find(pl => pl.name === e.target.value);
                      if (p) {
                        const copy = [...teamABatsmen];
                        copy[idx] = p;
                        setTeamABatsmen(copy);
                      }
                    }}
                    className="w-full bg-[#101410] text-white border border-white/10 rounded-xl px-2.5 py-1.5 text-xs outline-none"
                  >
                    {teamA.players.map(p => (
                      <option key={p.no} value={p.name}>#{idx + 1}: {p.name} ({p.role})</option>
                    ))}
                  </select>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Nominated Bowler</label>
              <select
                value={teamABowler?.name || ''}
                onChange={e => {
                  const p = teamA.players.find(pl => pl.name === e.target.value);
                  if (p) setTeamABowler(p);
                }}
                className="w-full bg-[#101410] text-[#c3f400] font-bold border border-[#c3f400]/30 rounded-xl px-2.5 py-1.5 text-xs outline-none"
              >
                {teamABowlers.map(p => (
                  <option key={p.no} value={p.name}>{p.name} ({p.bowl} · {p.role})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Team B Nominations */}
        <div className="bg-[#191d18] p-3.5 rounded-2xl border border-white/5 space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-xs font-black text-white uppercase">{teamB.name} ({teamB.code})</span>
            <span className="text-[10px] text-slate-400">3 Batsmen + 1 Bowler</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Top 3 Batsmen</label>
              <div className="space-y-1">
                {[0, 1, 2].map(idx => (
                  <select
                    key={idx}
                    value={teamBBatsmen[idx]?.name || ''}
                    onChange={e => {
                      const p = teamB.players.find(pl => pl.name === e.target.value);
                      if (p) {
                        const copy = [...teamBBatsmen];
                        copy[idx] = p;
                        setTeamBBatsmen(copy);
                      }
                    }}
                    className="w-full bg-[#101410] text-white border border-white/10 rounded-xl px-2.5 py-1.5 text-xs outline-none"
                  >
                    {teamB.players.map(p => (
                      <option key={p.no} value={p.name}>#{idx + 1}: {p.name} ({p.role})</option>
                    ))}
                  </select>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Nominated Bowler</label>
              <select
                value={teamBBowler?.name || ''}
                onChange={e => {
                  const p = teamB.players.find(pl => pl.name === e.target.value);
                  if (p) setTeamBBowler(p);
                }}
                className="w-full bg-[#101410] text-[#c3f400] font-bold border border-[#c3f400]/30 rounded-xl px-2.5 py-1.5 text-xs outline-none"
              >
                {teamBBowlers.map(p => (
                  <option key={p.no} value={p.name}>{p.name} ({p.bowl} · {p.role})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          {!isKnockout && onLeaveAsTie ? (
            <button
              onClick={onLeaveAsTie}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
            >
              Leave it as a Tie
            </button>
          ) : <div />}

          <button
            onClick={handleConfirm}
            className="px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-[#c3f400] hover:bg-[#d4ff1a] text-black shadow-lg shadow-[#c3f400]/20 transition-transform active:scale-95"
          >
            Start Super Over &gt;
          </button>
        </div>
      </div>
    </div>
  );
};
