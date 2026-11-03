// src/views/CustomiseView.tsx
import React, { useState } from 'react';
import { Settings, Palette, Layout, Volume2, ShieldAlert, Download, Upload, RotateCcw, Check } from 'lucide-react';
import type { ThemeType, ScoringLayout } from '../types';
import { storage, AppSettings } from '../services/storage';
import { soundEngine } from '../services/sound';

interface CustomiseViewProps {
  onThemeChanged: (theme: ThemeType) => void;
  onSettingsChanged: (settings: AppSettings) => void;
}

export const CustomiseView: React.FC<CustomiseViewProps> = ({ onThemeChanged, onSettingsChanged }) => {
  const [settings, setSettings] = useState<AppSettings>(storage.getSettings());

  const THEMES: { id: ThemeType; name: string; desc: string; preview: string }[] = [
    { id: 'pitch_pulse', name: 'Pitch Pulse (Signature)', desc: 'Obsidian & High-Voltage Electric Lime', preview: 'bg-[#101410] border-[#c3f400]' },
    { id: 'classic_maroon', name: 'Classic Maroon', desc: 'Maroon & Light Brown like the printed sheets', preview: 'bg-[#4a0e17] border-[#d4af37]' },
    { id: 'night_stadium', name: 'Night Stadium', desc: 'Dark Navy & Gold floodlit stadium', preview: 'bg-[#0f172a] border-[#fbbf24]' },
    { id: 'pitch_green', name: 'Pitch Green', desc: 'Lush grass green & clean white', preview: 'bg-[#143019] border-[#22c55e]' },
    { id: 'super_league', name: 'Super League', desc: 'Vibrant purple & energetic neon orange', preview: 'bg-[#2e1065] border-[#f97316]' },
    { id: 'ocean_breeze', name: 'Ocean Breeze', desc: 'Deep ocean blue & coastal teal', preview: 'bg-[#0c4a6e] border-[#14b8a6]' },
    { id: 'retro_scoreboard', name: 'Retro Scoreboard', desc: 'Pitch black & vintage incandescent amber', preview: 'bg-[#000000] border-[#f59e0b]' }
  ];

  const handleUpdate = (partial: Partial<AppSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    storage.saveSettings(updated);
    onSettingsChanged(updated);
    if (partial.theme) onThemeChanged(partial.theme);
    if (partial.soundEnabled !== undefined) soundEngine.enabled = partial.soundEnabled;
  };

  const handleReset = () => {
    if (confirm("Reset all settings and options back to default? (Match history will not be deleted)")) {
      storage.resetAllData();
      const fresh = storage.getSettings();
      setSettings(fresh);
      onSettingsChanged(fresh);
      onThemeChanged(fresh.theme);
      alert("Settings reset to defaults.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6 select-none animate-fadeIn pb-24">
      {/* Header */}
      <div className="border-b border-[#272b26] pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#c3f400]/10 border border-[#c3f400]/25 text-[#c3f400] text-[10px] font-black uppercase tracking-wider">
          <Settings className="w-3.5 h-3.5" />
          <span>App Preferences &amp; Themes</span>
        </div>
        <h1 className="text-2xl font-black text-white mt-1">
          Customise Arena Experience
        </h1>
        <p className="text-xs text-slate-400">
          Everything saved instantly on this device · Zero cloud dependency
        </p>
      </div>

      {/* 1. Theme Selection */}
      <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#c3f400]" />
            <h2 className="text-sm font-black text-white uppercase tracking-wider">1. Colour Theme</h2>
          </div>
          <span className="text-[11px] text-slate-400 font-bold">Outcome colors retain printed rules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {THEMES.map(th => {
            const isSelected = settings.theme === th.id;
            return (
              <div
                key={th.id}
                onClick={() => handleUpdate({ theme: th.id })}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected 
                    ? "bg-[#272b26] border-[#c3f400] shadow-[0_0_15px_rgba(195,244,0,0.2)]" 
                    : "bg-[#1d211c] border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-xl border-2 ${th.preview} flex items-center justify-center`}>
                    {isSelected && <Check className="w-4 h-4 text-[#c3f400]" />}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Theme</span>
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold text-white">{th.name}</div>
                  <div className="text-[10px] text-slate-400">{th.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Scoring Layout & Orientation */}
      <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <Layout className="w-4 h-4 text-[#c3f400]" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">2. Scoring Layout &amp; Display</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'pitch', label: 'Pitch View (Default)', desc: '2D stadium pitch graphic with real boundary trajectories' },
            { id: 'split', label: 'Split View', desc: 'Side-by-side dedicated bowling & batting control blocks' },
            { id: 'facetoface', label: 'Face-to-Face', desc: 'Opponent bowling panel rotated 180° for table play' }
          ].map(lay => (
            <button
              key={lay.id}
              onClick={() => handleUpdate({ scoringLayout: lay.id as ScoringLayout })}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                settings.scoringLayout === lay.id
                  ? 'bg-[#272b26] border-[#c3f400] shadow-md shadow-[#c3f400]/15'
                  : 'bg-[#1d211c] border-white/5 hover:border-white/20'
              }`}
            >
              <div className="text-xs font-black text-white">{lay.label}</div>
              <div className="text-[10px] text-slate-400 mt-1">{lay.desc}</div>
            </button>
          ))}
        </div>

        {/* Bowling block Left/Right Switch */}
        <div className="flex items-center justify-between p-3 bg-[#1d211c] border border-white/5 rounded-2xl text-xs">
          <div>
            <span className="font-bold text-white block">Bowling Block Position</span>
            <span className="text-[11px] text-slate-400">Position of the bowling block relative to the batting block</span>
          </div>
          <div className="flex bg-[#101410] border border-white/10 rounded-full p-1 text-[11px] font-bold">
            <button
              onClick={() => handleUpdate({ bowlingBlockSide: 'left' })}
              className={`px-3 py-1 rounded-full transition-all ${
                settings.bowlingBlockSide === 'left' ? 'bg-[#c3f400] text-black' : 'text-slate-400'
              }`}
            >
              Left
            </button>
            <button
              onClick={() => handleUpdate({ bowlingBlockSide: 'right' })}
              className={`px-3 py-1 rounded-full transition-all ${
                settings.bowlingBlockSide === 'right' ? 'bg-[#c3f400] text-black' : 'text-slate-400'
              }`}
            >
              Right
            </button>
          </div>
        </div>
      </div>

      {/* 3. Toggles: Animations, Scorer Mode, Audio */}
      <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-5 shadow-xl space-y-3">
        <h2 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/10 pb-2">
          3. Mechanics &amp; Sound Engine
        </h2>

        {/* Animations */}
        <div className="flex items-center justify-between p-3 bg-[#1d211c] rounded-2xl text-xs">
          <div>
            <span className="font-bold text-white block">Field &amp; Boundary Animations</span>
            <span className="text-[11px] text-slate-400">FOUR rolling ball, SIX soar, stump shake on wicket</span>
          </div>
          <input
            type="checkbox"
            checked={settings.animationsEnabled}
            onChange={e => handleUpdate({ animationsEnabled: e.target.checked })}
            className="w-5 h-5 accent-[#c3f400] cursor-pointer"
          />
        </div>

        {/* Scorer Mode */}
        <div className="flex items-center justify-between p-3 bg-[#1d211c] rounded-2xl text-xs">
          <div>
            <span className="font-bold text-white block">Scorer Mode</span>
            <span className="text-[11px] text-slate-400">Auto (virtual dice) or Manual (enter your physical dice)</span>
          </div>
          <div className="flex bg-[#101410] border border-white/10 rounded-full p-1 text-[11px] font-bold">
            <button
              onClick={() => handleUpdate({ scorerMode: 'auto' })}
              className={`px-3 py-1 rounded-full ${settings.scorerMode === 'auto' ? 'bg-[#c3f400] text-black' : 'text-slate-400'}`}
            >
              Auto
            </button>
            <button
              onClick={() => handleUpdate({ scorerMode: 'manual' })}
              className={`px-3 py-1 rounded-full ${settings.scorerMode === 'manual' ? 'bg-[#c3f400] text-black' : 'text-slate-400'}`}
            >
              Manual
            </button>
          </div>
        </div>

        {/* Faiz Sound Engine */}
        <div className="flex items-center justify-between p-3 bg-[#1d211c] rounded-2xl text-xs">
          <div>
            <span className="font-bold text-white block">Faiz Sound Engine (Synthesized Audio)</span>
            <span className="text-[11px] text-slate-400">Synthesized bat clicks, dice rattles, boundary fanfares</span>
          </div>
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={e => handleUpdate({ soundEnabled: e.target.checked })}
            className="w-5 h-5 accent-[#c3f400] cursor-pointer"
          />
        </div>
      </div>

      {/* 4. Reset & Defaults */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-full text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Settings to Defaults</span>
        </button>

        <span className="text-[11px] text-slate-500 font-mono">
          Dice Cricket King · Faiz Dice Games © 2026
        </span>
      </div>
    </div>
  );
};
