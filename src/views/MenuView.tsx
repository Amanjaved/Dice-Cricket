// src/views/MenuView.tsx
import React from 'react';
import { 
  Trophy, Flame, Shield, Award, Sparkles, BookOpen, 
  Layers, Volume2, VolumeX, Moon, Sun, Download, ArrowRight, 
  X, Check, Users, BarChart3, ChevronRight, Play, Swords
} from 'lucide-react';
import type { MatchState, GroundType } from '../types';
import { soundEngine } from '../services/sound';
import { storage } from '../services/storage';

interface MenuViewProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onStartQuickMatch?: (format: '5_overs' | '10_overs', ground: GroundType) => void;
  activeMatch?: MatchState | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onClose?: () => void;
}

export const MenuView: React.FC<MenuViewProps> = ({
  currentView,
  onNavigate,
  onStartQuickMatch,
  activeMatch,
  soundEnabled,
  onToggleSound,
  onClose
}) => {
  const settings = storage.getSettings();

  const handleBackup = () => {
    const jsonStr = storage.exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dice-cricket-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert("Match records and database backed up successfully!");
  };

  const navCategories = [
    {
      title: "Play & Compete",
      items: [
        {
          id: 'live',
          title: 'Live Match Arena',
          subtitle: activeMatch ? 'Resume ongoing clash' : 'Dual dice console & pitch view',
          icon: 'stadium',
          badge: activeMatch ? 'ACTIVE MATCH' : 'LIVE PITCH',
          badgeColor: activeMatch ? 'bg-[#c3f400] text-[#101410]' : 'bg-[#232821] text-[#9ba394]'
        },
        {
          id: 'matches',
          title: 'Matches Hub',
          subtitle: 'Resume in-progress, scorecards & results',
          icon: 'sports_cricket',
          badge: 'HUB',
          badgeColor: 'bg-emerald-500/20 text-emerald-300'
        },
        {
          id: 'stats',
          title: 'Stats & Records',
          subtitle: 'Highest totals, MVP ladder & leaderboards',
          icon: 'analytics',
          badge: 'RECORDS',
          badgeColor: 'bg-purple-500/20 text-purple-300'
        },
        {
          id: 'setup',
          title: 'New Match Setup',
          subtitle: '5 or 10 Overs · Select Ground & Toss',
          icon: 'sports_cricket',
          badge: 'ARCADE / XI',
          badgeColor: 'bg-[#232821] text-[#c3f400]'
        },
        {
          id: 'tournaments',
          title: 'World Cup Tournaments',
          subtitle: '4 Groups · Knockout Brackets · Super 8',
          icon: 'emoji_events',
          badge: 'TROPHY ROAD',
          badgeColor: 'bg-amber-400/20 text-amber-300'
        },
        {
          id: 'dpl',
          title: 'DPL Premier League',
          subtitle: 'Franchise Auction Room & Season Table',
          icon: 'military_tech',
          badge: 'AUCTION',
          badgeColor: 'bg-purple-500/20 text-purple-300'
        }
      ]
    },
    {
      title: "Knowledge & Tactical Codex",
      items: [
        {
          id: 'sheets',
          title: '12 Master Sheets Matrix',
          subtitle: 'Official Faiz Dice outcome sheets (1-12)',
          icon: 'table_chart',
          badge: 'CORE RULES',
          badgeColor: 'bg-[#232821] text-[#c3f400]'
        },
        {
          id: 'cards',
          title: '87 Tactical Power Cards',
          subtitle: 'Batting, Bowling, Fielding & Captaincy perks',
          icon: 'style',
          badge: '87 DECK',
          badgeColor: 'bg-sky-500/20 text-sky-300'
        },
        {
          id: 'rulebook',
          title: 'Official DRS & Rule Codex 2026',
          subtitle: 'Powerplay, Star Ratings, Super Over rules',
          icon: 'gavel',
          badge: 'OFFICIAL',
          badgeColor: 'bg-red-500/20 text-red-300'
        },
        {
          id: 'teams',
          title: 'Teams & Players Database',
          subtitle: '10 International Teams & 200+ Players',
          icon: 'group',
          badge: '200+ PLAYERS',
          badgeColor: 'bg-[#232821] text-white'
        },
        {
          id: 'rankings',
          title: 'Rankings & Match Ledger',
          subtitle: 'ICC & DPL Standings, match archives',
          icon: 'leaderboard',
          badge: 'LEDGER',
          badgeColor: 'bg-[#232821] text-amber-300'
        }
      ]
    },
    {
      title: "Customization & Settings",
      items: [
        {
          id: 'customise',
          title: 'Themes & Pitch Pulse Visuals',
          subtitle: 'Stitch Neon, Carbon Night, Emerald Turf',
          icon: 'tune',
          badge: 'STITCH',
          badgeColor: 'bg-[#c3f400]/20 text-[#c3f400]'
        }
      ]
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-5 select-none animate-fadeIn pb-32 antialiased">
      {/* Mobile Top Bar Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#232821]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#191d18] border border-[#2e342c] flex items-center justify-center text-[#c3f400]">
            <span className="material-symbols-outlined text-[22px]">menu_open</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
              Game Codex &amp; Menu
              <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-beacon-pulse" />
            </h1>
            <p className="text-[11px] text-[#9ba394]">Quick Navigation &amp; Tactical Systems</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#191d18] border border-white/10 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* User Status Profile Card matching Stitch */}
      <div className="bg-gradient-to-r from-[#191d18] via-[#1f261e] to-[#191d18] border border-[#2e342c] rounded-3xl p-4 mb-5 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#101410] border-2 border-[#c3f400] p-0.5 shadow-md">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1mbmKlNI1OFjKYnmcL1fqCFMOD9sp2rDTb0L9syNyyuNnC5pemphEml4i4t0lkyDUmoFZY6m5HSFM_QqaIy5wikRTgkgyVdxjiFiihBSe3IpY_dyxMR1iK1HsAkR1QqcBr2lgfhP5u5hN_uuG7GssESiGkW_1wvNcI-jxfzb-o1Bf37C7QnOXUklghHnQPMMGo7sqzVX18CHIM2tO3EHK19NLN6AGrM8cVYMjHpI"
              alt="Tanweer"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-extrabold text-sm sm:text-base">Tanweer Ahmad</span>
              <span className="text-[9px] font-black text-[#101410] bg-[#c3f400] px-2 py-0.5 rounded-full uppercase">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-[#9ba394] mt-0.5">Faiz Dice Games Master Strategist</p>
          </div>
        </div>

        {/* Quick Toggles: Sound & Backup */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            className={`w-9 h-9 rounded-2xl border flex items-center justify-center transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-[#c3f400] text-[#101410] border-[#c3f400]'
                : 'bg-[#191d18] text-[#9ba394] border-[#2e342c] hover:text-white'
            }`}
            title={soundEnabled ? "Faiz Sound Engine Active (Click to mute)" : "Unmute Sound Engine"}
          >
            <span className="material-symbols-outlined text-[19px]">
              {soundEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </button>
          
          <button
            onClick={handleBackup}
            className="w-9 h-9 rounded-2xl bg-[#191d18] border border-[#2e342c] text-[#9ba394] hover:text-[#c3f400] flex items-center justify-center transition-colors cursor-pointer"
            title="Download JSON Match Backup"
          >
            <span className="material-symbols-outlined text-[19px]">cloud_sync</span>
          </button>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="space-y-5">
        {navCategories.map((cat, idx) => (
          <div key={idx} className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#9ba394] px-1">
              {cat.title}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {cat.items.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      if (onClose) onClose();
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                      isActive
                        ? 'bg-[#1e261d] border-[#c3f400] shadow-[0_0_20px_rgba(195,244,0,0.2)]'
                        : 'bg-[#151914] border-[#232821] hover:bg-[#1a2019] hover:border-[#384334]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shrink-0 ${
                        isActive
                          ? 'bg-[#c3f400] text-[#101410]'
                          : 'bg-[#1e231d] text-[#c3f400] border border-white/5'
                      }`}>
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold truncate ${isActive ? 'text-[#c3f400]' : 'text-white'}`}>
                            {item.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#9ba394] truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 pl-2">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Launch Quick Blitz / 10 Over in Menu */}
      {onStartQuickMatch && (
        <div className="mt-6 pt-5 border-t border-[#232821]">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#9ba394] px-1 block mb-2.5">
            Quick Match Launchers
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onStartQuickMatch('5_overs', 'NSG');
                if (onClose) onClose();
              }}
              className="p-3 rounded-2xl bg-[#191d18] border border-[#2e342c] hover:border-[#c3f400]/50 text-left flex items-center justify-between group cursor-pointer transition-colors"
            >
              <div>
                <span className="text-xs font-black text-white block">5 Overs Blitz</span>
                <span className="text-[10px] text-[#9ba394]">7-a-side · 30 balls</span>
              </div>
              <Play className="w-4 h-4 text-[#c3f400] group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => {
                onStartQuickMatch('10_overs', 'NSG');
                if (onClose) onClose();
              }}
              className="p-3 rounded-2xl bg-[#191d18] border border-[#2e342c] hover:border-[#c3f400]/50 text-left flex items-center justify-between group cursor-pointer transition-colors"
            >
              <div>
                <span className="text-xs font-black text-white block">10 Overs Classic</span>
                <span className="text-[10px] text-[#9ba394]">Full XI · Powerplay</span>
              </div>
              <Play className="w-4 h-4 text-[#c3f400] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Footer System Info */}
      <div className="mt-8 text-center text-[10px] text-slate-500 font-mono space-y-1">
        <div>Dice Cricket King v2.0 · Pitch Pulse Edition</div>
        <div>Engineered to official Faiz Dice Games ruleset</div>
      </div>
    </div>
  );
};

export default MenuView;
