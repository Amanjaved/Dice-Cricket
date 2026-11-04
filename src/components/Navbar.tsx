// src/components/Navbar.tsx
import React from 'react';

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
  const NAV_ITEMS = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'matches', label: 'Matches', icon: 'sports_cricket' },
    { id: 'tournaments', label: 'Tournaments', icon: 'emoji_events' },
    { id: 'teams', label: 'Teams', icon: 'group' },
    { id: 'dpl', label: 'DPL', icon: 'military_tech' },
    { id: 'rankings', label: 'Rankings', icon: 'leaderboard' },
    { id: 'stats', label: 'Stats', icon: 'analytics' },
    { id: 'sheets', label: 'Sheets', icon: 'table_chart' },
    { id: 'customise', label: 'Customise', icon: 'tune' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0b0f0b]/95 backdrop-blur-xl border-b border-[#232821] px-4 py-2.5 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Header Branding matching Section 2: red-and-blue dice logo, "Dice Cricket", "Faiz Dice Games" */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Red and Blue Dice Graphic Logo */}
          <div className="flex items-center -space-x-1.5 group-hover:scale-105 transition-transform">
            {/* Red Die */}
            <div className="w-7 h-7 rounded-lg die-3d-red flex items-center justify-center shadow-md relative z-10 border border-red-300/30">
              <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
            </div>
            {/* Blue Die */}
            <div className="w-7 h-7 rounded-lg die-3d-blue flex items-center justify-center shadow-md border border-sky-300/30">
              <div className="grid grid-cols-2 gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-sans font-black text-white tracking-tight uppercase text-[16px] leading-tight">
              Dice Cricket
            </span>
            <span className="text-[10px] font-bold text-[#c3f400] tracking-wider uppercase leading-tight">
              Faiz Dice Games
            </span>
          </div>
        </div>

        {/* Top menu (large screen): Home, Matches, Tournaments, Teams, DPL, Rankings, Stats, Sheets, Customise */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
                currentView === item.id || (item.id === 'matches' && ['live', 'scorecard', 'summary', 'ballbyball', 'setup'].includes(currentView))
                  ? 'bg-[#c3f400] text-[#101410] shadow-[0_0_18px_rgba(195,244,0,0.3)] font-black'
                  : 'text-[#9ba394] hover:text-white hover:bg-[#191d18]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Tools: Sound Toggle, Customise shortcut & Mobile Matches Quick Link */}
        <div className="flex items-center gap-2">
          {/* Quick Match / Matches button on tablet/mobile */}
          <button
            onClick={() => onNavigate('matches')}
            className="hidden sm:flex lg:hidden items-center gap-1 px-3 py-1.5 rounded-full bg-[#191d18] border border-[#2e342c] text-xs font-bold text-slate-300 hover:text-white"
          >
            <span className="material-symbols-outlined text-[16px] text-[#c3f400]">sports_cricket</span>
            <span>Matches</span>
          </button>

          <button
            onClick={onToggleSound}
            title={soundEnabled ? "Faiz Sound Engine Active (Click to mute)" : "Unmute Sound Engine"}
            className="w-9 h-9 rounded-full bg-[#191d18] border border-[#2e342c] flex items-center justify-center text-[#9ba394] hover:text-[#c3f400] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              {soundEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          <button
            onClick={() => onNavigate('customise')}
            title="Customise (Themes, Layouts, Scorer)"
            className="w-9 h-9 rounded-full bg-[#191d18] border border-[#2e342c] flex items-center justify-center text-[#9ba394] hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
