// src/components/BottomNav.tsx
import React from 'react';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenMore: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenMore
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0b0f0b]/95 backdrop-blur-xl border-t border-[#232821] py-2 px-3 select-none">
      <div className="h-12 flex items-center justify-around max-w-screen-md mx-auto">
        <button
          onClick={() => onNavigate('home')}
          className={`flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-full transition-all ${
            currentView === 'home'
              ? 'bg-[#c3f400] text-[#101410] font-black shadow-[0_0_20px_rgba(195,244,0,0.35)]'
              : 'text-[#9ba394] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[19px]">sports_cricket</span>
          <span className="font-sans text-[11px] font-bold">Home</span>
        </button>

        <button
          onClick={() => onNavigate('live')}
          className={`flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-full transition-all ${
            currentView === 'live'
              ? 'bg-[#c3f400] text-[#101410] font-black shadow-[0_0_20px_rgba(195,244,0,0.35)]'
              : 'text-[#9ba394] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[19px]">stadium</span>
          <span className="font-sans text-[11px] font-bold">Matches</span>
        </button>

        <button
          onClick={() => onNavigate('tournaments')}
          className={`flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-full transition-all ${
            currentView === 'tournaments'
              ? 'bg-[#c3f400] text-[#101410] font-black shadow-[0_0_20px_rgba(195,244,0,0.35)]'
              : 'text-[#9ba394] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[19px]">emoji_events</span>
          <span className="font-sans text-[11px] font-bold">Tourneys</span>
        </button>

        <button
          onClick={() => onNavigate('rankings')}
          className={`flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-full transition-all ${
            currentView === 'rankings'
              ? 'bg-[#c3f400] text-[#101410] font-black shadow-[0_0_20px_rgba(195,244,0,0.35)]'
              : 'text-[#9ba394] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[19px]">leaderboard</span>
          <span className="font-sans text-[11px] font-bold">Rankings</span>
        </button>

        <button
          onClick={onOpenMore}
          className="flex items-center justify-center gap-1.5 h-10 px-3 rounded-full text-[#9ba394] hover:text-white transition-all"
        >
          <span className="material-symbols-outlined text-[19px]">tune</span>
          <span className="font-sans text-[11px] font-bold">More</span>
        </button>
      </div>
    </nav>
  );
};
export default BottomNav;
