// src/components/BottomNav.tsx
import React from 'react';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenMore?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0b0f0b]/95 backdrop-blur-xl border-t border-[#232821] py-2 px-3 select-none">
      <div className="h-12 flex items-center justify-around max-w-screen-md mx-auto">
        {/* Tab 1: Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-full transition-all cursor-pointer ${
            currentView === 'home'
              ? 'bg-[#c3f400] text-[#101410] font-black shadow-[0_0_20px_rgba(195,244,0,0.35)]'
              : 'text-[#9ba394] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[19px]">home</span>
          <span className="font-sans text-[11px] font-bold">Home</span>
        </button>

        {/* Tab 2: DPL */}
        <button
          onClick={() => onNavigate('dpl')}
          className={`flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-full transition-all cursor-pointer ${
            currentView === 'dpl'
              ? 'bg-[#c3f400] text-[#101410] font-black shadow-[0_0_20px_rgba(195,244,0,0.35)]'
              : 'text-[#9ba394] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[19px]">military_tech</span>
          <span className="font-sans text-[11px] font-bold">DPL</span>
        </button>

        {/* Tab 3: Rankings */}
        <button
          onClick={() => onNavigate('rankings')}
          className={`flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-full transition-all cursor-pointer ${
            currentView === 'rankings'
              ? 'bg-[#c3f400] text-[#101410] font-black shadow-[0_0_20px_rgba(195,244,0,0.35)]'
              : 'text-[#9ba394] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[19px]">leaderboard</span>
          <span className="font-sans text-[11px] font-bold">Rankings</span>
        </button>

        {/* Tab 4: Stats */}
        <button
          onClick={() => onNavigate('stats')}
          className={`flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-full transition-all cursor-pointer ${
            currentView === 'stats'
              ? 'bg-[#c3f400] text-[#101410] font-black shadow-[0_0_20px_rgba(195,244,0,0.35)]'
              : 'text-[#9ba394] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[19px]">analytics</span>
          <span className="font-sans text-[11px] font-bold">Stats</span>
        </button>
      </div>
    </nav>
  );
};
export default BottomNav;
