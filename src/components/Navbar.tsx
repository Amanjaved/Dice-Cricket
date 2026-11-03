// src/components/Navbar.tsx
import React from 'react';
import { soundEngine } from '../services/sound';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  soundEnabled,
  onToggleSound
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0b0f0b]/90 backdrop-blur-xl border-b border-[#232821] px-4 py-2.5 select-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name matching Stitch */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#191d18] border border-[#2e342c] flex items-center justify-center text-[#c3f400] shadow-md group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">sports_cricket</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-headline-sm font-black text-white tracking-tight uppercase text-[17px]">
                DICE CRICKET KING
              </span>
              <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-ping" />
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#9ba394] tracking-widest uppercase mt-1">
              <span>By Faiz Dice Games</span>
              <span className="text-[#3d4538]">•</span>
              <span className="text-[#c3f400]">Pitch Pulse</span>
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { id: 'home', label: 'Home', icon: 'home' },
            { id: 'live', label: 'Live Arena', icon: 'stadium' },
            { id: 'tournaments', label: 'Tournaments', icon: 'emoji_events' },
            { id: 'dpl', label: 'DPL League', icon: 'military_tech' },
            { id: 'teams', label: 'Teams DB', icon: 'group' },
            { id: 'sheets', label: '12 Sheets', icon: 'table_chart' },
            { id: 'cards', label: '87 Cards', icon: 'style' },
            { id: 'rankings', label: 'Rankings', icon: 'leaderboard' },
            { id: 'rulebook', label: 'Rule Codex', icon: 'gavel' },
            { id: 'customise', label: 'Customise', icon: 'tune' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                currentView === item.id
                  ? 'bg-[#c3f400] text-[#101410] shadow-[0_0_18px_rgba(195,244,0,0.3)] font-black'
                  : 'text-[#9ba394] hover:text-white hover:bg-[#191d18]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Tools: Sound Toggle & Tanweer Profile */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleSound}
            title={soundEnabled ? "Faiz Sound Engine Active (Click to mute)" : "Unmute Sound Engine"}
            className="w-9 h-9 rounded-full bg-[#191d18] border border-[#2e342c] flex items-center justify-center text-on-surface hover:text-[#c3f400] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              {soundEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          <div
            onClick={() => onNavigate('customise')}
            className="flex items-center gap-2 pl-1 cursor-pointer group"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#191d18] border border-[#c3f400]/40 p-0.5 shadow-md group-hover:border-[#c3f400] transition-colors">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1mbmKlNI1OFjKYnmcL1fqCFMOD9sp2rDTb0L9syNyyuNnC5pemphEml4i4t0lkyDUmoFZY6m5HSFM_QqaIy5wikRTgkgyVdxjiFiihBSe3IpY_dyxMR1iK1HsAkR1QqcBr2lgfhP5u5hN_uuG7GssESiGkW_1wvNcI-jxfzb-o1Bf37C7QnOXUklghHnQPMMGo7sqzVX18CHIM2tO3EHK19NLN6AGrM8cVYMjHpI"
                alt="Tanweer"
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#c3f400] rounded-full ring-2 ring-[#101410]" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[12px] font-bold text-white flex items-center gap-1 leading-tight">
                Tanweer
                <span className="text-[9px] font-black text-[#101410] bg-[#c3f400] px-1 py-0.2 rounded-full">
                  PRO
                </span>
              </span>
              <span className="text-[10px] text-[#9ba394] leading-tight">Strategist</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
