// src/components/OverCompleteCard.tsx
import React from 'react';
import type { OverDelivery, BowlerFigures } from '../types';

interface OverCompleteCardProps {
  overNumber: number;
  bowler: BowlerFigures;
  deliveries: OverDelivery[];
  runsInOver: number;
  wicketsInOver: number;
  onNextOver: () => void;
}

export const OverCompleteCard: React.FC<OverCompleteCardProps> = ({
  overNumber,
  bowler,
  deliveries,
  runsInOver,
  wicketsInOver,
  onNextOver
}) => {
  return (
    <div className="w-full bg-[#1c221b] border-2 border-[#c3f400]/40 rounded-3xl p-5 shadow-2xl animate-slideUp my-3">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#c3f400] bg-[#c3f400]/10 px-2.5 py-0.5 rounded-full">
            Over {overNumber} Concluded
          </span>
          <h3 className="text-lg font-black text-white mt-1">
            End of Over {overNumber}
          </h3>
        </div>
        <div className="text-right">
          <div className="text-sm font-black text-white font-mono">
            +{runsInOver} Runs · {wicketsInOver} Wkts
          </div>
          <div className="text-[11px] text-slate-400">
            Bowler: {bowler.player.name}
          </div>
        </div>
      </div>

      {/* Deliveries Chips in Over */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {deliveries.map((d, i) => {
          const isWkt = d.isWicket;
          const isFour = d.runsScored === 4;
          const isSix = d.runsScored === 6;
          const isExtra = !!d.extraType;

          return (
            <div
              key={i}
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 shadow-sm ${
                isWkt
                  ? "bg-red-950 border border-red-500 text-red-300"
                  : isSix
                  ? "bg-purple-950 border border-purple-400 text-purple-300"
                  : isFour
                  ? "bg-[#c3f400] text-black font-extrabold"
                  : isExtra
                  ? "bg-amber-950 border border-amber-500 text-amber-300"
                  : d.runsScored === 0
                  ? "bg-[#101410] border border-white/10 text-slate-400"
                  : "bg-[#272b26] border border-white/15 text-white"
              }`}
            >
              {isWkt ? "W" : isSix ? "6" : isFour ? "4" : isExtra ? (d.extraType === 'wide' ? 'Wd' : 'Nb') : d.runsScored}
            </div>
          );
        })}
      </div>

      {/* Action to Start Next Over */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
        <span className="text-xs text-slate-400">Strike will rotate for Over {overNumber + 1}</span>
        <button
          onClick={onNextOver}
          className="px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#c3f400] text-[#101410] hover:bg-[#d4ff1a] transition-transform active:scale-95 shadow-lg shadow-[#c3f400]/20"
        >
          Start Over {overNumber + 1} · Select Bowler →
        </button>
      </div>
    </div>
  );
};
