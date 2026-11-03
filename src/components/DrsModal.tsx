// src/components/DrsModal.tsx
import React, { useState } from 'react';
import { soundEngine } from '../services/sound';

interface DrsModalProps {
  captainName: string;
  batsmanName: string;
  bowlerName: string;
  wicketType: string;
  onDecision: (isNotOut: boolean, rolledDie: number) => void;
  onCancel: () => void;
}

export const DrsModal: React.FC<DrsModalProps> = ({
  captainName,
  batsmanName,
  bowlerName,
  wicketType,
  onDecision,
  onCancel
}) => {
  const [dieResult, setDieResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = () => {
    setIsRolling(true);
    soundEngine.playDrsChime();

    let count = 0;
    const interval = setInterval(() => {
      setDieResult(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 10) {
        clearInterval(interval);
        const finalDie = Math.floor(Math.random() * 6) + 1;
        setDieResult(finalDie);
        setIsRolling(false);
      }
    }, 80);
  };

  const isNotOut = dieResult !== null && dieResult >= 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-md bg-[#191d18] border border-[#2e3629] rounded-3xl p-5 shadow-2xl flex flex-col relative overflow-hidden">
        {/* Neon Ambient Accents */}
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-[#c3f400]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-36 h-36 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Alert Ribbon matching Stitch */}
        <div className="flex items-center justify-between pb-3 border-b border-[#232821]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-950/80 border border-red-500/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px] text-red-400">gavel</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                  Field Umpire Call
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              </div>
              <h2 className="text-[16px] text-white font-black leading-tight">
                WICKET! {wicketType.toUpperCase()} APPEAL
              </h2>
            </div>
          </div>
          <div className="w-9 h-9 rounded-2xl bg-[#232821] flex items-center justify-center">
            <span className="text-xl font-black text-red-400 leading-none">!</span>
          </div>
        </div>

        {/* Dismissal Commentary Capsule */}
        <div className="mt-3 p-3 rounded-2xl bg-[#121611] border border-[#232920] flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#191d18] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px] text-[#c3f400]">sports_cricket</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] text-white font-bold truncate">
              {batsmanName} ({wicketType}) b {bowlerName}
            </span>
            <span className="text-[11px] text-[#9ba394] mt-0.5">
              Captain <strong>{captainName}</strong> appealing via Third Umpire Hawk-Eye Tracking.
            </span>
          </div>
        </div>

        {/* Codex Rule Pill */}
        <div className="mt-2.5 px-3 py-2 rounded-xl bg-[#151914] border border-[#232920] flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#c3f400]">verified</span>
          <p className="text-[11px] text-[#9ba394] leading-tight">
            <strong className="text-white">Codex Sec 11 &amp; 8.1:</strong> Captain may spend 1 Reroll Power Card to appeal via DRS 1-Die Review.
          </p>
        </div>

        {/* Outcome Probability Matrix matching Stitch */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="p-2.5 rounded-2xl bg-[#121611] border border-[#232920] flex flex-col">
            <div className="flex items-center gap-1 text-[#c3f400]">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span className="text-[10px] uppercase font-black">Die 5 or 6</span>
            </div>
            <span className="text-[13px] text-white font-black mt-0.5">NOT OUT</span>
            <span className="text-[10px] text-[#9ba394]">Overturned to Dot Ball</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#121611] border border-[#232920] flex flex-col">
            <div className="flex items-center gap-1 text-red-400">
              <span className="material-symbols-outlined text-[14px]">cancel</span>
              <span className="text-[10px] uppercase font-black">Die 1, 2, 3, 4</span>
            </div>
            <span className="text-[13px] text-white font-black mt-0.5">OUT CONFIRMED</span>
            <span className="text-[10px] text-[#9ba394]">Decision Stands</span>
          </div>
        </div>

        {/* DRS Die Stage */}
        <div className="mt-3 p-3 rounded-2xl bg-[#121611] border border-[#232920] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black shadow-md transition-all ${
                isRolling ? 'die-3d-blue animate-dice-shake text-white' :
                dieResult === null ? 'bg-[#232821] border border-[#2e342c] text-[#9ba394]' :
                isNotOut ? 'bg-[#c3f400] text-[#101410] neon-glow scale-105' :
                'die-3d-red text-white scale-105'
              }`}
            >
              {dieResult !== null ? dieResult : "?"}
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-[#c3f400]">
                {isRolling ? "THIRD UMPIRE CHECKING..." :
                 dieResult === null ? "READY FOR REVIEW ROLL" :
                 isNotOut ? "DECISION OVERTURNED: NOT OUT!" : "DECISION UPHELD: OUT CONFIRMED"}
              </span>
              <span className="text-[10px] text-[#9ba394]">
                {isRolling ? "Synthesizing ball trajectory & impact..." :
                 dieResult === null ? "1 Reroll card will be consumed" :
                 isNotOut ? "Reverted to dot ball, striker stays on crease" : "Batter departs to pavilion"}
              </span>
            </div>
          </div>
          {isRolling && <div className="w-2.5 h-2.5 rounded-full bg-[#c3f400] animate-ping" />}
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-col gap-2">
          {dieResult === null ? (
            <>
              <button
                disabled={isRolling}
                onClick={handleRoll}
                className="w-full py-3.5 px-4 rounded-full bg-[#c3f400] hover:bg-[#d4ff1a] text-[#101410] text-[13px] font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(195,244,0,0.3)] active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[20px]">casino</span>
                <span>ROLL 1-DIE DRS REVIEW NOW</span>
              </button>
              <button
                onClick={onCancel}
                className="w-full py-2.5 px-4 rounded-full bg-[#191d18] text-[#9ba394] hover:text-white text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>ACCEPT DISMISSAL &amp; SEND NEXT BATTER</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onDecision(isNotOut, dieResult)}
              className={`w-full py-3.5 px-4 rounded-full text-[13px] font-black uppercase tracking-wider transition-transform active:scale-95 shadow-xl flex items-center justify-center gap-2 ${
                isNotOut
                  ? 'bg-[#c3f400] text-[#101410] shadow-[0_8px_24px_rgba(195,244,0,0.4)]'
                  : 'bg-red-500 text-white shadow-[0_8px_24px_rgba(255,82,82,0.4)]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isNotOut ? 'check_circle' : 'gavel'}
              </span>
              <span>
                {isNotOut ? 'CONFIRM NOT OUT · OVERTURN TO DOT BALL' : 'CONFIRM OUT · BATTER WALKS BACK'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default DrsModal;
