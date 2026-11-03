// src/components/BowlerSelectModal.tsx
import React, { useState } from 'react';
import type { Player, BowlerFigures, GroundType } from '../types';
import { DiceCricketEngine } from '../engine';

interface BowlerSelectModalProps {
  overNumber: number;
  totalOvers: number;
  is5Overs: boolean;
  ground: GroundType;
  bowlingSquad: Player[];
  allBowlerFigures: BowlerFigures[];
  lastBowlerName: string | null;
  striker: Player;
  nonStriker: Player;
  strikerRuns: number;
  nonStrikerRuns: number;
  bowlingTeamStars: number;
  battingTeamStars: number;
  onConfirm: (bowler: Player) => void;
  onCancel: () => void;
}

export const BowlerSelectModal: React.FC<BowlerSelectModalProps> = ({
  overNumber,
  totalOvers,
  is5Overs,
  ground,
  bowlingSquad,
  allBowlerFigures,
  lastBowlerName,
  striker,
  nonStriker,
  strikerRuns,
  nonStrikerRuns,
  bowlingTeamStars,
  battingTeamStars,
  onConfirm,
  onCancel
}) => {
  const [selectedBowler, setSelectedBowler] = useState<Player | null>(null);

  const isPowerplay = is5Overs ? (overNumber === 1) : (overNumber <= 2);
  const isSlog = is5Overs ? (overNumber === 5) : (overNumber >= 9);

  // Bowlers with bowling capability
  const capableBowlers = bowlingSquad.filter(p => p.bowl !== null);

  // Check quota for each bowler
  const getBowlerStatus = (bowler: Player) => {
    const fig = allBowlerFigures.find(f => f.player.name === bowler.name);
    const completedOvers = fig ? Math.floor(fig.overs) : 0;

    if (bowler.name === lastBowlerName) {
      return { eligible: false, reason: "Bowled last over (LOCKED)" };
    }

    if (is5Overs) {
      // 5 overs rule: 2 bowlers may bowl 2 overs, rest 1
      const bowlersWith2Overs = allBowlerFigures.filter(f => f.overs >= 2).length;
      if (completedOvers >= 2) {
        return { eligible: false, reason: "Quota complete (2 ov max)" };
      }
      if (completedOvers === 1 && bowlersWith2Overs >= 2) {
        return { eligible: false, reason: "Quota complete (only 2 bowlers get 2 ov)" };
      }
    } else {
      // 10 overs rule: max 2 overs each
      if (completedOvers >= 2) {
        return { eligible: false, reason: "Quota complete (2 ov max)" };
      }
    }

    return { eligible: true, reason: `${completedOvers}/2 ov` };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-[#141814] border border-[#272b26] rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-[#272b26] pb-3 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-[#c3f400] uppercase tracking-wider bg-[#c3f400]/10 px-2 py-0.5 rounded-full">
                Tactical Matchup
              </span>
              <h2 className="text-xl font-black text-white mt-1">
                Choose Bowler for Over {overNumber}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-400">
                {isPowerplay ? "⚡ Powerplay Phase" : isSlog ? "🔥 Slog Phase" : "Middle Overs"}
              </span>
              <div className="text-[11px] text-[#c3f400] font-mono">{ground} Ground</div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {is5Overs ? "2 bowlers max 2 overs · Rest max 1 · No consecutive overs" : "Max 2 overs per bowler · No consecutive overs"}
          </p>
        </div>

        {/* Scrollable Bowler List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {capableBowlers.map(bowler => {
            const status = getBowlerStatus(bowler);
            const fig = allBowlerFigures.find(f => f.player.name === bowler.name);
            const isSelected = selectedBowler?.name === bowler.name;

            return (
              <div
                key={bowler.no}
                onClick={() => {
                  if (status.eligible) setSelectedBowler(bowler);
                }}
                className={`p-3 rounded-2xl border transition-all ${
                  !status.eligible
                    ? "bg-[#101410]/50 border-red-900/30 opacity-60 cursor-not-allowed"
                    : isSelected
                    ? "bg-[#272b26] border-[#c3f400] shadow-[0_0_15px_rgba(195,244,0,0.2)] cursor-pointer"
                    : "bg-[#1d211c] border-[#272b26] hover:border-slate-500 cursor-pointer"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#101410] text-slate-300 font-mono text-xs flex items-center justify-center font-bold">
                      {bowler.no}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{bowler.name}</span>
                        {bowler.marks.includes("D") && (
                          <span className="bg-amber-400/20 text-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded">
                            DB
                          </span>
                        )}
                        {bowler.marks.includes("C") && (
                          <span className="bg-blue-400/20 text-blue-300 text-[9px] font-bold px-1.5 py-0.2 rounded">
                            C
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 font-medium">
                        {bowler.bowl} · {bowler.role}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-mono font-bold ${status.eligible ? "text-[#c3f400]" : "text-red-400"}`}>
                      {status.reason}
                    </span>
                    {fig && (
                      <div className="text-[11px] text-slate-400 font-mono">
                        {fig.wickets}/{fig.runsConceded} ({fig.overs} ov)
                      </div>
                    )}
                  </div>
                </div>

                {/* Tactical Matchup Live Preview if Selected */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                    {/* vs Striker */}
                    <div className="bg-[#101410] p-2 rounded-xl border border-white/5">
                      <div className="text-[10px] font-bold text-[#c3f400] uppercase truncate">
                        vs Striker ({striker.name} · {striker.bat})
                      </div>
                      {(() => {
                        const bLine = DiceCricketEngine.resolveBowlingLine(ground, isPowerplay, isSlog, bowler, striker, bowlingTeamStars, battingTeamStars);
                        const batLine = DiceCricketEngine.resolveBattingLine(ground, isPowerplay, isSlog, bowler, striker, strikerRuns, null);
                        return (
                          <div className="mt-1 space-y-0.5">
                            <div className="text-slate-300">
                              Bowl Line: <strong className="text-white font-mono">{bLine.lineName}</strong>
                            </div>
                            <div className="text-slate-300">
                              Bat Line: <strong className="text-[#c3f400] font-mono">{batLine.lineName}</strong>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* vs Non-Striker */}
                    <div className="bg-[#101410] p-2 rounded-xl border border-white/5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase truncate">
                        vs Non-Striker ({nonStriker.name} · {nonStriker.bat})
                      </div>
                      {(() => {
                        const bLine = DiceCricketEngine.resolveBowlingLine(ground, isPowerplay, isSlog, bowler, nonStriker, bowlingTeamStars, battingTeamStars);
                        const batLine = DiceCricketEngine.resolveBattingLine(ground, isPowerplay, isSlog, bowler, nonStriker, nonStrikerRuns, null);
                        return (
                          <div className="mt-1 space-y-0.5">
                            <div className="text-slate-300">
                              Bowl Line: <strong className="text-white font-mono">{bLine.lineName}</strong>
                            </div>
                            <div className="text-slate-300">
                              Bat Line: <strong className="text-[#c3f400] font-mono">{batLine.lineName}</strong>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Actions */}
        <div className="mt-4 pt-3 border-t border-[#272b26] flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-full text-xs font-bold text-slate-300 bg-[#1d211c] hover:bg-[#272b26] transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!selectedBowler}
            onClick={() => {
              if (selectedBowler) onConfirm(selectedBowler);
            }}
            className="px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#c3f400] text-[#101410] hover:bg-[#d4ff1a] disabled:opacity-40 disabled:cursor-not-allowed transition-transform active:scale-95 shadow-lg shadow-[#c3f400]/20"
          >
            Confirm Bowler
          </button>
        </div>
      </div>
    </div>
  );
};
