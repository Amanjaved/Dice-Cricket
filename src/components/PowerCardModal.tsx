// src/components/PowerCardModal.tsx
import React, { useState } from 'react';
import { POWER_CARDS } from '../../scripts/master_data.js';
import { soundEngine } from '../services/sound';
import { Zap, ShieldAlert, Dices, Sparkles, CheckCircle2 } from 'lucide-react';

interface PowerCardModalProps {
  type: 'wonderful_shot' | 'great_delivery' | 'reroll';
  captainName: string;
  isBattingCaptain: boolean;
  onExecuteWonderfulShot: (result: { redDie: string; blueDie: number; runs: number }) => void;
  onExecuteGreatDelivery: (result: { redDie: string; blueDie: number; outcome: string }) => void;
  onExecuteReroll: (mode: 'both' | 'red_only' | 'blue_only') => void;
  onClose: () => void;
}

export const PowerCardModal: React.FC<PowerCardModalProps> = ({
  type,
  captainName,
  isBattingCaptain,
  onExecuteWonderfulShot,
  onExecuteGreatDelivery,
  onExecuteReroll,
  onClose
}) => {
  const [highlightCell, setHighlightCell] = useState<{ r: number; c: number } | null>(null);
  const [rolledResult, setRolledResult] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const card = type === 'wonderful_shot' 
    ? POWER_CARDS.find(c => c.name === "Wonderful Shot")
    : type === 'great_delivery'
    ? POWER_CARDS.find(c => c.name === "Great Delivery")
    : POWER_CARDS.find(c => c.name === "Reroll");

  const rows = ["A", "B", "C", "D", "E", "F"];

  const handleRollGrid = () => {
    setIsRolling(true);
    soundEngine.playDiceRoll();

    let count = 0;
    const interval = setInterval(() => {
      const r = Math.floor(Math.random() * 6);
      const c = Math.floor(Math.random() * 6);
      setHighlightCell({ r, c });
      count++;

      if (count > 10) {
        clearInterval(interval);
        const finalR = Math.floor(Math.random() * 6);
        const finalC = Math.floor(Math.random() * 6);
        setHighlightCell({ r: finalR, c: finalC });
        setIsRolling(false);

        if (type === 'wonderful_shot') {
          const val = card?.grid?.[finalR]?.[finalC] || "4";
          setRolledResult(`${val} RUNS`);
          if (val === '6') soundEngine.playSix();
          else if (val === '4') soundEngine.playFour();
          else soundEngine.playBallHit();

          setTimeout(() => {
            onExecuteWonderfulShot({
              redDie: rows[finalR],
              blueDie: finalC + 1,
              runs: parseInt(val, 10) || 4
            });
          }, 900);
        } else if (type === 'great_delivery') {
          const val = card?.grid?.[finalR]?.[finalC] || "X";
          setRolledResult(val === 'X' ? 'WICKET (X)' : val === 'D' ? 'DOT BALL (D)' : val === '+' ? 'EXTRA (+)' : 'BALL (B)');
          if (val === 'X') soundEngine.playWicket();
          else soundEngine.playBallHit();

          setTimeout(() => {
            onExecuteGreatDelivery({
              redDie: rows[finalR],
              blueDie: finalC + 1,
              outcome: val
            });
          }, 900);
        }
      }
    }, 60);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-[#141814] border-2 border-[#ccff00]/40 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto tactical-card-sheen">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ccff00] animate-beacon-pulse" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded-full border border-[#ccff00]/30">
                Captain Power Trump Card
              </span>
              <h2 className="text-xl font-black text-white mt-1">
                {type === 'wonderful_shot' && "💥 Wonderful Shot"}
                {type === 'great_delivery' && "🎯 Great Delivery"}
                {type === 'reroll' && "🎲 Captain Reroll"}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1d211c] text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-[#191e17] border border-[#2e3728] rounded-2xl p-3 mb-4 text-xs text-slate-300">
          <div className="font-bold text-white mb-0.5 flex items-center justify-between">
            <span>Authorized by Captain: <strong className="text-[#ccff00]">{captainName}</strong></span>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.2 rounded border border-amber-400/25">
              {card?.usedBy}
            </span>
          </div>
          <p className="text-[#9ba394] mt-1">{card?.desc}</p>
        </div>

        {/* 6x6 Grid for Wonderful Shot or Great Delivery */}
        {card?.grid && (
          <div className="mb-4">
            <div className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Card Matrix (Red Die A-F · Blue Die 1-6)</span>
              {type === 'wonderful_shot' && <span className="text-[#ccff00] font-mono font-bold">83.3% Boundaries (30/36)</span>}
              {type === 'great_delivery' && <span className="text-red-400 font-mono font-bold">61.1% Wickets (22/36)</span>}
            </div>

            <div className="grid grid-cols-6 gap-1 bg-[#0e120e] p-2.5 rounded-2xl border border-white/10">
              {card.grid.map((rowArr, rIdx) =>
                rowArr.map((cellVal, cIdx) => {
                  const isCellHighlighted = highlightCell?.r === rIdx && highlightCell?.c === cIdx;
                  const isWicket = cellVal === 'X';
                  const isBoundary = cellVal === '4' || cellVal === '6';

                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`h-9 rounded-xl flex items-center justify-center text-xs font-black font-mono transition-all ${
                        isCellHighlighted
                          ? 'bg-[#ccff00] text-black scale-108 shadow-[0_0_18px_rgba(204,255,0,0.9)] z-10'
                          : isWicket
                          ? 'bg-red-950/70 border border-red-700/40 text-red-300'
                          : isBoundary
                          ? cellVal === '6' ? 'bg-amber-400 text-black font-black' : 'bg-[#ccff00]/90 text-black font-black'
                          : 'bg-[#181d17] border border-white/5 text-slate-300'
                      }`}
                    >
                      {cellVal}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Reroll Options */}
        {type === 'reroll' && (
          <div className="space-y-2 mb-4">
            <div className="text-xs font-bold text-slate-300 mb-2">Choose Reroll Scope:</div>
            <button
              onClick={() => onExecuteReroll('both')}
              className="w-full py-3 bg-[#191e17] hover:bg-[#232a20] border border-white/10 rounded-2xl text-left px-4 flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-[#ccff00]">Full Reroll (Both Dice)</div>
                <div className="text-[10px] text-slate-400">Cancel both Red and Blue dice and roll fresh</div>
              </div>
              <span className="text-lg">🎲🎲</span>
            </button>
            <button
              onClick={() => onExecuteReroll('red_only')}
              className="w-full py-3 bg-[#191e17] hover:bg-[#232a20] border border-white/10 rounded-2xl text-left px-4 flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-red-400">Half Reroll (Red Die Row Only)</div>
                <div className="text-[10px] text-slate-400">Keep Blue die column locked, reroll Red die row A–F</div>
              </div>
              <span className="text-xs font-bold font-mono text-red-400 px-2.5 py-1 bg-red-950 border border-red-800/40 rounded-lg">RED ROW</span>
            </button>
            <button
              onClick={() => onExecuteReroll('blue_only')}
              className="w-full py-3 bg-[#191e17] hover:bg-[#232a20] border border-white/10 rounded-2xl text-left px-4 flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-blue-400">Half Reroll (Blue Die Column Only)</div>
                <div className="text-[10px] text-slate-400">Keep Red die row locked, reroll Blue die column 1–6</div>
              </div>
              <span className="text-xs font-bold font-mono text-blue-400 px-2.5 py-1 bg-blue-950 border border-blue-800/40 rounded-lg">BLUE COL</span>
            </button>
          </div>
        )}

        {/* Action Button for Matrix Rolls */}
        {card?.grid && (
          <div>
            {rolledResult && (
              <div className="text-center mb-3">
                <span className="text-xs text-slate-400 uppercase tracking-widest block">Resolved Outcome</span>
                <span className="text-2xl font-black text-[#ccff00] font-mono">{rolledResult}</span>
              </div>
            )}
            <button
              disabled={isRolling}
              onClick={handleRollGrid}
              className={`w-full py-3.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#ccff00] text-[#101410] hover:bg-[#d4ff1a] transition-all active:scale-95 shadow-xl shadow-[#ccff00]/25 disabled:opacity-40 cursor-pointer ${
                !isRolling ? 'animate-subtle-pulse' : ''
              }`}
            >
              {isRolling ? "Rolling Card Matrix..." : `Roll ${card.name} Matrix`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PowerCardModal;
