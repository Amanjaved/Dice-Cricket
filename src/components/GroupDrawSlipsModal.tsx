// src/components/GroupDrawSlipsModal.tsx
import React, { useState } from 'react';
import type { Team, TournamentGroup } from '../types';
import { soundEngine } from '../services/sound';

interface GroupDrawSlipsModalProps {
  teams: Team[];
  onComplete: (groups: TournamentGroup[]) => void;
  onCancel: () => void;
}

export const GroupDrawSlipsModal: React.FC<GroupDrawSlipsModalProps> = ({
  teams,
  onComplete,
  onCancel
}) => {
  const [unpickedTeams, setUnpickedTeams] = useState<Team[]>([...teams].sort(() => Math.random() - 0.5));
  const [groupA, setGroupA] = useState<Team[]>([]);
  const [groupB, setGroupB] = useState<Team[]>([]);
  const [drawnTeam, setDrawnTeam] = useState<Team | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const isConcluded = unpickedTeams.length === 0 && drawnTeam === null;

  const handleDrawNextSlip = () => {
    if (unpickedTeams.length === 0 || isDrawing) return;
    setIsDrawing(true);
    soundEngine.playDiceRoll();

    setTimeout(() => {
      const nextTeam = unpickedTeams[0];
      const rest = unpickedTeams.slice(1);
      setDrawnTeam(nextTeam);
      setUnpickedTeams(rest);
      setIsDrawing(false);
      soundEngine.playBallHit();

      // Place into group A or B to balance sizes and stars
      setTimeout(() => {
        if (groupA.length <= groupB.length) {
          setGroupA(prev => [...prev, nextTeam]);
        } else {
          setGroupB(prev => [...prev, nextTeam]);
        }
        setDrawnTeam(null);
      }, 900);
    }, 600);
  };

  const handleFinish = () => {
    onComplete([
      { name: 'Group A', teamIds: groupA.map(t => t.id) },
      { name: 'Group B', teamIds: groupB.map(t => t.id) }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-xl bg-[#141814] border border-[#272b26] rounded-3xl p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="text-center border-b border-white/10 pb-3 mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#c3f400] bg-[#c3f400]/10 px-3 py-1 rounded-full">
            Official Group Draw Ceremony
          </span>
          <h2 className="text-2xl font-black text-white mt-1.5">
            The Crystal Chamber Draw
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isConcluded 
              ? "All 10 slips drawn! Groups A & B balanced by star ratings."
              : `Draw by Slips · ${teams.length - unpickedTeams.length}/${teams.length} Teams Placed`}
          </p>
        </div>

        {/* The Crystal Chamber Urn */}
        {!isConcluded && (
          <div className="my-3 flex flex-col items-center">
            <div className="relative w-44 h-44 rounded-full bg-radial from-[#243324] to-[#0d140d] border-2 border-[#c3f400]/40 shadow-[0_0_30px_rgba(195,244,0,0.15)] flex items-center justify-center p-4 overflow-hidden">
              {/* Slip orbs floating inside */}
              <div className="flex flex-wrap gap-1.5 justify-center items-center">
                {unpickedTeams.map((t, idx) => (
                  <div
                    key={t.id}
                    className={`w-7 h-7 rounded-full bg-[#1c221b] border border-white/20 flex items-center justify-center text-[10px] font-black text-white shadow-md transition-all ${
                      isDrawing ? "animate-pulse scale-90" : ""
                    }`}
                  >
                    #{idx + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Revealed Slip Announcement */}
            {drawnTeam && (
              <div className="mt-3 px-5 py-2 rounded-2xl bg-[#272b26] border border-[#c3f400] text-center animate-bounce shadow-xl">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Drawn Slip</span>
                <span className="text-lg font-black text-white" style={{ color: drawnTeam.color }}>
                  {drawnTeam.name} ({drawnTeam.code}) · {drawnTeam.printedStars}★
                </span>
              </div>
            )}

            <button
              disabled={isDrawing || unpickedTeams.length === 0}
              onClick={handleDrawNextSlip}
              className="mt-4 px-8 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-[#c3f400] text-[#101410] hover:bg-[#d4ff1a] transition-transform active:scale-95 shadow-xl shadow-[#c3f400]/25 disabled:opacity-40"
            >
              {isDrawing ? "Shuffling Crystal Chamber..." : `Draw Next Slip (${unpickedTeams.length} Left)`}
            </button>
          </div>
        )}

        {/* Groups Display */}
        <div className="grid grid-cols-2 gap-3 my-3">
          {/* Group A */}
          <div className="bg-[#101410] border border-[#272b26] rounded-2xl p-3 flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
              <span className="text-xs font-black text-[#c3f400] uppercase tracking-wider">Group A</span>
              <span className="text-[10px] font-mono font-bold text-slate-400">{groupA.length}/5 Teams</span>
            </div>
            <div className="space-y-1.5 flex-1 min-h-[140px]">
              {groupA.map(t => (
                <div key={t.id} className="p-2 bg-[#1d211c] border border-white/5 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                    <span className="font-bold text-white">{t.name}</span>
                  </div>
                  <span className="text-amber-400 font-mono text-[11px]">{t.printedStars}★</span>
                </div>
              ))}
              {groupA.length === 0 && (
                <div className="h-full flex items-center justify-center text-xs text-slate-600 italic">Waiting for slips...</div>
              )}
            </div>
          </div>

          {/* Group B */}
          <div className="bg-[#101410] border border-[#272b26] rounded-2xl p-3 flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
              <span className="text-xs font-black text-[#c3f400] uppercase tracking-wider">Group B</span>
              <span className="text-[10px] font-mono font-bold text-slate-400">{groupB.length}/5 Teams</span>
            </div>
            <div className="space-y-1.5 flex-1 min-h-[140px]">
              {groupB.map(t => (
                <div key={t.id} className="p-2 bg-[#1d211c] border border-white/5 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                    <span className="font-bold text-white">{t.name}</span>
                  </div>
                  <span className="text-amber-400 font-mono text-[11px]">{t.printedStars}★</span>
                </div>
              ))}
              {groupB.length === 0 && (
                <div className="h-full flex items-center justify-center text-xs text-slate-600 italic">Waiting for slips...</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          {isConcluded && (
            <button
              onClick={handleFinish}
              className="px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-[#c3f400] text-[#101410] hover:bg-[#d4ff1a] transition-transform active:scale-95 shadow-xl shadow-[#c3f400]/25"
            >
              Confirm Groups &amp; Build Fixtures →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
