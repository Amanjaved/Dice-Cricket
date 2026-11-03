// src/components/NewBatsmanModal.tsx
import React, { useState } from 'react';
import type { Player } from '../types';

interface NewBatsmanModalProps {
  wicketNumber: number; // e.g. 1st wicket -> incoming is No. 3
  incomingBattingOrderNo: number;
  remainingBatsmen: Player[];
  isSlog: boolean;
  onConfirm: (player: Player, isFinisher: boolean) => void;
}

export const NewBatsmanModal: React.FC<NewBatsmanModalProps> = ({
  wicketNumber,
  incomingBattingOrderNo,
  remainingBatsmen,
  isSlog,
  onConfirm
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player>(remainingBatsmen[0]);
  const [isFinisherSelected, setIsFinisherSelected] = useState<boolean>(
    remainingBatsmen[0]?.marks.includes('F') || false
  );

  // If in Slog, check if multiple F batsmen are eligible
  const fEligible = remainingBatsmen.filter(p => p.marks.includes('F'));
  const showFinisherPrompt = isSlog && fEligible.length > 1;

  if (!selectedPlayer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#141814] border border-[#272b26] rounded-3xl p-5 shadow-2xl flex flex-col overflow-hidden">
        {/* Banner Alert: Bowling on hold */}
        <div className="bg-red-950/60 border border-red-500/40 px-3 py-2 rounded-xl text-center mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-red-400 block">
            BOWLING ON HOLD · ROLLS LOCKED
          </span>
          <span className="text-xs font-bold text-slate-200">
            Wicket #{wicketNumber} Fallen · Confirm Batsman #{incomingBattingOrderNo}
          </span>
        </div>

        {/* Batsman Selector */}
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
          Select Incoming Batsman
        </label>
        <select
          value={selectedPlayer.name}
          onChange={(e) => {
            const p = remainingBatsmen.find(b => b.name === e.target.value);
            if (p) {
              setSelectedPlayer(p);
              setIsFinisherSelected(p.marks.includes('F'));
            }
          }}
          className="w-full bg-[#1d211c] border border-[#272b26] text-white text-sm font-bold rounded-2xl px-4 py-3 outline-none focus:border-[#c3f400] transition-colors mb-4 cursor-pointer"
        >
          {remainingBatsmen.map((p, idx) => (
            <option key={p.no} value={p.name} className="bg-[#141814] text-white">
              #{idx + incomingBattingOrderNo} · {p.name} ({p.role} · {p.bat}) {p.marks.length > 0 ? `[${p.marks.join(' ')}]` : ''}
            </option>
          ))}
        </select>

        {/* Selected Batsman Profile Card */}
        <div className="bg-[#1d211c] border border-white/10 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-white">{selectedPlayer.name}</span>
                {selectedPlayer.marks.includes('★') && (
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    ★ Star @ {selectedPlayer.starRuns || 20}r
                  </span>
                )}
                {selectedPlayer.marks.includes('F') && (
                  <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Finisher (F)
                  </span>
                )}
                {selectedPlayer.marks.includes('C') && (
                  <span className="bg-blue-400/20 text-blue-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Captain
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {selectedPlayer.bat} · Role: <strong className="text-slate-200">{selectedPlayer.role}</strong>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#101410] border border-white/10 flex items-center justify-center font-black text-sm text-[#c3f400]">
              #{selectedPlayer.no}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div>Catching: <strong className="text-white">{selectedPlayer.ct}</strong></div>
            <div>Run Out: <strong className="text-white">{selectedPlayer.rt}</strong></div>
            {selectedPlayer.role === 'WK' && (
              <>
                <div>Keeper Stumping: <strong className="text-white">{selectedPlayer.wkSt}</strong></div>
                <div>Keeper Catch: <strong className="text-white">{selectedPlayer.wkCt}</strong></div>
              </>
            )}
          </div>
        </div>

        {/* Finisher Prompt in Slog */}
        {showFinisherPrompt && (
          <div className="bg-[#272b26] p-3 rounded-2xl border border-amber-500/40 mb-4">
            <div className="text-xs font-bold text-amber-300 mb-1">
              🔥 Slog Overs Finisher Assignment
            </div>
            <p className="text-[11px] text-slate-300 mb-2">
              Multiple (F) batsmen available. Do you want <strong>{selectedPlayer.name}</strong> to enter as the designated Finisher (reads SLG F line)?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsFinisherSelected(true)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isFinisherSelected
                    ? "bg-[#c3f400] text-black shadow-md"
                    : "bg-[#101410] text-slate-400 hover:text-white"
                }`}
              >
                Yes, as Finisher (SLG F)
              </button>
              <button
                type="button"
                onClick={() => setIsFinisherSelected(false)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  !isFinisherSelected
                    ? "bg-[#c3f400] text-black shadow-md"
                    : "bg-[#101410] text-slate-400 hover:text-white"
                }`}
              >
                No, Standard Slog (SLG R)
              </button>
            </div>
          </div>
        )}

        {/* Confirm Button */}
        <button
          onClick={() => onConfirm(selectedPlayer, isFinisherSelected)}
          className="w-full py-3.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#c3f400] text-[#101410] hover:bg-[#d4ff1a] transition-transform active:scale-95 shadow-xl shadow-[#c3f400]/20"
        >
          Confirm {selectedPlayer.name} Enters at No. {incomingBattingOrderNo}
        </button>
      </div>
    </div>
  );
};
