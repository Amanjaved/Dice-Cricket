// src/views/SheetsView.tsx
import React, { useState } from 'react';
import { SHEETS_DATA } from '../../scripts/sheets_data.js';
import type { GroundType } from '../types';
import { soundEngine } from '../services/sound';

export const SheetsView: React.FC = () => {
  const [selectedGround, setSelectedGround] = useState<GroundType>('NSG');
  const [selectedPhase, setSelectedPhase] = useState<number>(2); // default: Powerplay & Slog Bowl
  const [dieRed, setDieRed] = useState<string>('D');
  const [dieBlue, setDieBlue] = useState<number>(4);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  const phaseKeys: Array<'masterBowling' | 'masterBatting' | 'powerplaySlogBowling' | 'powerplaySlogBatting'> = [
    'masterBowling',
    'masterBatting',
    'powerplaySlogBowling',
    'powerplaySlogBatting'
  ];

  const phaseLabels = [
    { label: 'Mid Bowling', icon: 'sports_baseball' },
    { label: 'Mid Batting', icon: 'sports_cricket' },
    { label: 'Powerplay & Slog (Bowl)', icon: 'bolt' },
    { label: 'Powerplay & Slog (Bat)', icon: 'electric_bolt' }
  ];

  const activeGround = (SHEETS_DATA as any)[selectedGround];
  const activeSheetKey = phaseKeys[selectedPhase];
  const activeSheet = activeGround ? activeGround[activeSheetKey] : null;

  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cols = [1, 2, 3, 4, 5, 6];

  const formatCellSummary = (cellObj: any): string => {
    if (!cellObj) return '-';
    if (typeof cellObj === 'string') return cellObj;
    if (cellObj.forAll) return cellObj.forAll;
    if (cellObj.EQ) return cellObj.EQ;
    if (cellObj['4★']) return cellObj['4★'];
    const keys = Object.keys(cellObj);
    return keys.length > 0 ? String(cellObj[keys[0]]) : '-';
  };

  const handleRollDice = () => {
    setIsRolling(true);
    soundEngine.playDiceRoll();

    let count = 0;
    const interval = setInterval(() => {
      setDieRed(rows[Math.floor(Math.random() * 6)]);
      setDieBlue(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 8) {
        clearInterval(interval);
        setDieRed(rows[Math.floor(Math.random() * 6)]);
        setDieBlue(Math.floor(Math.random() * 6) + 1);
        setIsRolling(false);
      }
    }, 70);
  };

  const rawCellObj = activeSheet?.grid ? (activeSheet.grid as any)[`${dieRed}${dieBlue}`] : null;
  const selectedCellContent = formatCellSummary(rawCellObj);

  return (
    <div className="flex flex-col relative w-full pt-4 pb-24 bg-[#101410] max-w-screen-md mx-auto select-none antialiased">
      <div className="flex flex-col w-full px-4 space-y-4">
        
        {/* Top Header Card matching Stitch */}
        <div className="rounded-3xl bg-[#151914] border border-[#232821] p-4 flex flex-col gap-2 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#c3f400] text-[#101410]">
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
              </span>
              <span className="text-[17px] font-black text-white">12 Master Sheets</span>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-[#191d18] text-[#c3f400] border border-[#c3f400]/30">
              v2 Print Edition
            </span>
          </div>

          <div className="flex items-center justify-between text-[#9ba394] text-[11px] pt-1 border-t border-[#232821]">
            <span className="flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[15px] text-[#c3f400]">verified</span>
              Faiz Dice Games Official Ruleset
            </span>
            <div className="flex items-center bg-[#232821] px-2.5 py-0.5 rounded-full text-[#c3f400] font-bold gap-1 text-[10px]">
              <span className="material-symbols-outlined text-[13px]">timer</span>
              <span>5 &amp; 10 Overs Format</span>
            </div>
          </div>
        </div>

        {/* Ground Preset (3 Types) matching Stitch */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-[#9ba394] uppercase tracking-wider">
              Ground Preset (3 Grounds)
            </span>
            <span className="text-[11px] font-extrabold text-[#c3f400]">4 Sheets / Ground</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSelectedGround('HSG')}
              type="button"
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all active:scale-95 shadow-sm ${
                selectedGround === 'HSG'
                  ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.35)] font-black'
                  : 'bg-[#151914] border border-[#232821] text-white hover:bg-[#191d18]'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-[13px] font-black">HSG</span>
              </div>
              <span className={`text-[10px] ${selectedGround === 'HSG' ? 'text-white' : 'text-red-400'}`}>
                High Scoring
              </span>
            </button>

            <button
              onClick={() => setSelectedGround('NSG')}
              type="button"
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all active:scale-95 shadow-sm ${
                selectedGround === 'NSG'
                  ? 'bg-[#c3f400] text-[#101410] shadow-[0_0_20px_rgba(195,244,0,0.35)] font-black'
                  : 'bg-[#151914] border border-[#232821] text-white hover:bg-[#191d18]'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[13px] font-black">NSG</span>
              </div>
              <span className={`text-[10px] ${selectedGround === 'NSG' ? 'text-[#101410] font-bold' : 'text-emerald-400'}`}>
                Normal Pitch
              </span>
            </button>

            <button
              onClick={() => setSelectedGround('LSG')}
              type="button"
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all active:scale-95 shadow-sm ${
                selectedGround === 'LSG'
                  ? 'bg-amber-400 text-[#101410] shadow-[0_0_20px_rgba(251,191,36,0.35)] font-black'
                  : 'bg-[#151914] border border-[#232821] text-white hover:bg-[#191d18]'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-[13px] font-black">LSG</span>
              </div>
              <span className={`text-[10px] ${selectedGround === 'LSG' ? 'text-[#101410] font-bold' : 'text-amber-400'}`}>
                Low Scoring
              </span>
            </button>
          </div>
        </div>

        {/* Phase Sheets Tabs matching Stitch */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-[#9ba394] uppercase tracking-wider px-1">
            Phase Sheets
          </span>
          <div className="flex items-center overflow-x-auto gap-2 no-scrollbar py-0.5">
            {phaseLabels.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPhase(idx)}
                type="button"
                className={`shrink-0 px-3.5 py-2 rounded-full text-[12px] flex items-center gap-1.5 font-bold transition-all ${
                  selectedPhase === idx
                    ? 'bg-[#c3f400] text-[#101410] shadow-[0_0_18px_rgba(195,244,0,0.3)] font-black'
                    : 'bg-[#151914] border border-[#232821] text-[#9ba394] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{p.icon}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 6x6 Matrix Table matching Stitch */}
        <div className="rounded-3xl bg-[#151914] border border-[#232821] p-4 shadow-lg flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c3f400]" />
              <span className="text-[15px] font-bold text-white">
                {selectedGround}: {phaseLabels[selectedPhase].label} Matrix
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-rose-950 flex items-center justify-center text-[10px] text-rose-300 font-bold">
                R
              </span>
              <span className="text-[11px] text-[#9ba394]">vs</span>
              <span className="w-5 h-5 rounded-full bg-sky-950 flex items-center justify-center text-[10px] text-sky-300 font-bold">
                B
              </span>
            </div>
          </div>

          <div className="w-full overflow-x-auto rounded-2xl bg-[#0b0f0b] p-2 border border-[#232821]">
            <div className="min-w-[420px]">
              {/* Header: Blue cols 1-6 */}
              <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
                <div className="h-8 flex items-center justify-center text-[#9ba394] font-mono text-[10px]">
                  R \ B
                </div>
                {cols.map((c) => (
                  <div
                    key={c}
                    className={`h-8 flex items-center justify-center font-bold rounded-lg ${
                      dieBlue === c
                        ? 'bg-sky-500 text-[#0b0f0b] shadow-sm font-black'
                        : 'text-sky-400 bg-sky-950/40'
                    }`}
                  >
                    {c}
                  </div>
                ))}
              </div>

              {/* Rows A-F */}
              <div className="flex flex-col gap-1 mt-1">
                {rows.map((r) => {
                  const isRowF = r === 'F';
                  const isRedSelected = dieRed === r;

                  return (
                    <div key={r} className="grid grid-cols-7 gap-1">
                      {/* Row Label */}
                      <div
                        className={`h-10 rounded-lg flex items-center justify-center font-mono font-bold text-[12px] ${
                          isRowF
                            ? 'bg-purple-950/80 border border-purple-500/50 text-purple-300'
                            : isRedSelected
                            ? 'bg-rose-500 text-white font-black shadow-sm'
                            : 'bg-rose-950/40 text-rose-300'
                        }`}
                      >
                        {r}
                      </div>

                      {/* 6 Cols */}
                      {cols.map((c) => {
                        const cellKey = `${r}${c}`;
                        const cellObj = activeSheet?.grid ? (activeSheet.grid as any)[cellKey] : null;
                        const content = formatCellSummary(cellObj);
                        const isHighlighted = dieRed === r && dieBlue === c;

                        return (
                          <div
                            key={c}
                            onClick={() => { setDieRed(r); setDieBlue(c); }}
                            className={`h-10 rounded-lg flex flex-col items-center justify-center p-1 text-center text-[10px] font-bold cursor-pointer transition-all ${
                              isHighlighted
                                ? 'bg-[#c3f400] text-[#101410] font-black scale-105 shadow-md z-10 ring-2 ring-[#c3f400]'
                                : isRowF
                                ? 'bg-purple-950/40 border border-purple-500/20 text-purple-200 hover:bg-purple-900/40'
                                : 'bg-[#151914] border border-[#232821] text-white hover:bg-[#191d18]'
                            }`}
                            title={`Cell ${cellKey}: ${content}`}
                          >
                            <span className="truncate w-full leading-tight font-mono">{content}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legend Strip matching Stitch */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[#9ba394] text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-purple-900" />
              <span className="text-purple-300 font-semibold">Row F: Wicket / Dismissal Strip</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#c3f400]" /> Selected Cell: <strong>{dieRed}{dieBlue} ({selectedCellContent})</strong>
              </span>
            </div>
          </div>
        </div>

        {/* 3D Dice Roll Inspector matching Stitch */}
        <div className="rounded-3xl bg-[#151914] border border-[#232821] p-4 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#c3f400]">casino</span>
              <span className="text-[15px] font-bold text-white">Dice Roll Inspector</span>
            </div>
            <span className="text-[11px] text-[#9ba394]">Tap dice or roll</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {/* Red Die */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-rose-400 mb-1 font-bold">RED DIE</span>
                <div
                  className={`w-14 h-14 rounded-2xl die-3d-red flex items-center justify-center shadow-lg transition-transform active:scale-90 ${
                    isRolling ? 'animate-dice-shake' : ''
                  }`}
                >
                  <span className="text-2xl text-white font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                    {dieRed}
                  </span>
                </div>
              </div>

              <span className="text-[#9ba394] text-xl font-bold pt-4">+</span>

              {/* Blue Die */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-sky-400 mb-1 font-bold">BLUE DIE</span>
                <div
                  className={`w-14 h-14 rounded-2xl die-3d-blue flex items-center justify-center shadow-lg transition-transform active:scale-90 ${
                    isRolling ? 'animate-dice-shake' : ''
                  }`}
                >
                  <span className="text-2xl text-white font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                    {dieBlue}
                  </span>
                </div>
              </div>
            </div>

            <button
              disabled={isRolling}
              onClick={handleRollDice}
              type="button"
              className="flex-1 h-14 rounded-full bg-[#c3f400] text-[#101410] font-black text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(195,244,0,0.35)] active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[22px]">replay</span>
              <span>ROLL MATRIX DIE</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
export default SheetsView;
