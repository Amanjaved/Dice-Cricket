// src/views/CardsView.tsx
import React, { useState, useMemo } from 'react';
import { 
  Layers, Shield, Sparkles, Zap, Award, Search, Filter, Eye, RotateCw, 
  CheckCircle2, ArrowRight, Dices, ChevronRight, Activity, HelpCircle
} from 'lucide-react';
import { 
  WICKET_CARDS, RUNS_CARDS, FIELDING_CARDS, SKILLS_CARDS, POWER_CARDS 
} from '../../scripts/master_data.js';
import { soundEngine } from '../services/sound';

// Cricket fielding position names corresponding to cards 1-20
const FIELDING_POSITIONS: Record<number, { name: string; zone: 'Outfield' | 'Infield' | 'Ring' | 'Behind Stumps'; angle: string }> = {
  1: { name: 'Deep Fine Leg', zone: 'Outfield', angle: '135° Leg' },
  2: { name: 'Deep Square Leg', zone: 'Outfield', angle: '90° Leg' },
  3: { name: 'Deep Mid-Wicket', zone: 'Outfield', angle: '45° Leg' },
  4: { name: 'Silly Mid-On', zone: 'Infield', angle: '25° Close Leg' },
  5: { name: 'Mid-On', zone: 'Ring', angle: '15° Leg' },
  6: { name: 'Long-On', zone: 'Outfield', angle: '10° Straight Leg' },
  7: { name: 'Straight Hit Boundary', zone: 'Outfield', angle: '0° Down the Ground' },
  8: { name: 'Long-Off', zone: 'Outfield', angle: '10° Straight Off' },
  9: { name: 'Mid-Off', zone: 'Ring', angle: '15° Off' },
  10: { name: 'Silly Mid-Off', zone: 'Infield', angle: '25° Close Off' },
  11: { name: 'Extra Cover', zone: 'Ring', angle: '35° Off' },
  12: { name: 'Cover', zone: 'Ring', angle: '55° Off' },
  13: { name: 'Deep Cover / Sweeper', zone: 'Outfield', angle: '65° Off Boundary' },
  14: { name: 'Point', zone: 'Ring', angle: '90° Square Off' },
  15: { name: 'Backward Point', zone: 'Ring', angle: '110° Off' },
  16: { name: 'Third Man', zone: 'Outfield', angle: '145° Off Boundary' },
  17: { name: '1st & 2nd Slips', zone: 'Infield', angle: '160° Behind Stumps' },
  18: { name: 'Fly Slip / Gully', zone: 'Infield', angle: '130° Behind Square' },
  19: { name: 'Wicketkeeper', zone: 'Behind Stumps', angle: '180° Crease Rear' },
  20: { name: 'Bowler (Follow-through)', zone: 'Infield', angle: '0° Pitch Center' }
};

export const CardsView: React.FC = () => {
  const [activeDeck, setActiveDeck] = useState<'wickets' | 'runs' | 'fielding' | 'skills' | 'power'>('wickets');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState<any | null>(null);

  // Filtered decks based on search
  const filteredWickets = useMemo(() => {
    if (!searchQuery) return WICKET_CARDS;
    const q = searchQuery.toLowerCase();
    return WICKET_CARDS.filter(c => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.type.toLowerCase().includes(q));
  }, [searchQuery]);

  const filteredRuns = useMemo(() => {
    if (!searchQuery) return RUNS_CARDS;
    const q = searchQuery.toLowerCase();
    return RUNS_CARDS.filter(c => 
      c.card.toString().includes(q) || 
      c.extrasAppNow?.toLowerCase().includes(q) || 
      c.stumpingMissed?.toString().toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredFielding = useMemo(() => {
    if (!searchQuery) return FIELDING_CARDS;
    const q = searchQuery.toLowerCase();
    return FIELDING_CARDS.filter(c => {
      const pos = FIELDING_POSITIONS[c.positionNumber];
      return c.positionNumber.toString().includes(q) || pos?.name.toLowerCase().includes(q) || pos?.zone.toLowerCase().includes(q);
    });
  }, [searchQuery]);

  const filteredSkills = useMemo(() => {
    if (!searchQuery) return SKILLS_CARDS;
    const q = searchQuery.toLowerCase();
    return SKILLS_CARDS.filter(c => 
      c.card.toString().includes(q) ||
      c.wkCatch.join(' ').toLowerCase().includes(q) ||
      c.fldCatch.join(' ').toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredPower = useMemo(() => {
    if (!searchQuery) return POWER_CARDS;
    const q = searchQuery.toLowerCase();
    return POWER_CARDS.filter(c => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.usedBy.toLowerCase().includes(q));
  }, [searchQuery]);

  const getDeckCount = (deck: string) => {
    switch (deck) {
      case 'wickets': return 25;
      case 'runs': return 16;
      case 'fielding': return 20;
      case 'skills': return 20;
      case 'power': return 6;
      default: return 0;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-5 space-y-6 select-none animate-fadeIn pb-28">
      {/* Top Banner: Bridge 57x89mm Deck Telemetry matching Stitch Pitch Pulse */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#181e16] to-[#111510] border border-[#2e3728] p-5 shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ccff00] to-transparent" />
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#ccff00]/10 blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ccff00] animate-beacon-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-[#ccff00]">
                TACTICAL 87-CARD DECK VAULT
              </span>
              <span className="text-[#9ba394]">·</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                BRIDGE 57×89 MM PHYSICAL SPEC
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Faiz Dice Games Card Collection
            </h1>
            <p className="text-xs text-[#9ba394] mt-1 max-w-2xl leading-relaxed">
              Official tactical cards for match simulation, DRS reviews, boundary powerplay, fielder reflexes, and captain trumps.
            </p>
          </div>

          {/* Quick Deck Summary Metrics */}
          <div className="flex items-center gap-2 bg-[#0c100c] border border-[#232920] rounded-2xl p-2.5 shrink-0">
            <div className="text-center px-2 border-r border-white/5">
              <span className="text-[18px] font-black text-[#ccff00] block leading-none">87</span>
              <span className="text-[9px] font-bold text-[#9ba394] uppercase tracking-wider">Total</span>
            </div>
            <div className="text-center px-2 border-r border-white/5">
              <span className="text-[18px] font-black text-red-400 block leading-none">25</span>
              <span className="text-[9px] font-bold text-[#9ba394] uppercase tracking-wider">Wickets</span>
            </div>
            <div className="text-center px-2 border-r border-white/5">
              <span className="text-[18px] font-black text-blue-400 block leading-none">16</span>
              <span className="text-[9px] font-bold text-[#9ba394] uppercase tracking-wider">Runs</span>
            </div>
            <div className="text-center px-2">
              <span className="text-[18px] font-black text-amber-300 block leading-none">6</span>
              <span className="text-[9px] font-bold text-[#9ba394] uppercase tracking-wider">Power</span>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs + Search Bar */}
        <div className="mt-5 pt-4 border-t border-[#232920] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 relative z-10">
          {/* Deck Selector segmented chips */}
          <div className="flex items-center gap-1.5 bg-[#0e120d] p-1.5 rounded-full border border-[#242b20] overflow-x-auto no-scrollbar">
            {[
              { id: 'wickets', label: 'Wickets', color: 'text-red-400', count: 25 },
              { id: 'runs', label: 'Runs', color: 'text-blue-400', count: 16 },
              { id: 'fielding', label: 'Fielding', color: 'text-sky-300', count: 20 },
              { id: 'skills', label: 'Skills', color: 'text-emerald-400', count: 20 },
              { id: 'power', label: 'Power', color: 'text-amber-300', count: 6 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveDeck(tab.id as typeof activeDeck);
                  soundEngine.playBallHit();
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-sans text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeDeck === tab.id
                    ? 'bg-[#ccff00] text-[#101410] font-black shadow-md shadow-[#ccff00]/20 scale-102'
                    : 'text-[#9ba394] hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeDeck === tab.id ? 'bg-[#101410]/20 text-[#101410] font-mono' : 'bg-[#191d18] text-slate-400 font-mono'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Quick Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-[#9ba394] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search card properties..."
              className="w-full bg-[#0e120d] border border-[#242b20] rounded-full pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-[#9ba394] focus:outline-none focus:border-[#ccff00]/50"
            />
          </div>
        </div>
      </div>

      {/* CARDS DISPLAY GRID */}
      <div>
        {/* 1. WICKETS DECK (25 CARDS) */}
        {activeDeck === 'wickets' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {filteredWickets.map((card) => {
              const isLBW = card.type === 'lbw';
              const isBowled = card.type === 'bowled';
              const isCatch = card.type === 'caught';
              const isCatchBehind = card.type === 'caughtBehind';
              const isStumping = card.type === 'stumpingOrCaughtBehind';
              const isRunOut = card.type.includes('runOut');

              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedCard({ ...card, deckType: 'wickets' })}
                  className="aspect-[57/89] bg-gradient-to-b from-[#181d16] via-[#121611] to-[#0c0f0c] border-2 border-red-500/35 hover:border-red-500/90 rounded-2xl p-3 flex flex-col justify-between text-center transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:scale-102 tactical-card-sheen cursor-pointer group"
                >
                  {/* Card Top Foil Header */}
                  <div className="flex items-center justify-between border-b border-red-500/20 pb-1.5">
                    <span className="text-[8px] font-black uppercase tracking-widest text-red-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      WICKET #{card.id}
                    </span>
                    <span className="text-[8px] font-mono font-bold text-slate-500">
                      DRS ELIGIBLE
                    </span>
                  </div>

                  {/* Card Core Insignia */}
                  <div className="my-auto py-2 flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl border-2 border-red-500/50 bg-gradient-to-br from-red-950/80 to-[#101410] flex items-center justify-center font-black text-xs text-white shadow-inner group-hover:scale-105 transition-transform">
                      {isLBW ? (
                        <div className="flex flex-col items-center">
                          <span className="text-base">🛡️</span>
                          <span className="text-[9px] font-black text-red-300">LBW</span>
                        </div>
                      ) : isBowled ? (
                        <div className="flex flex-col items-center">
                          <span className="text-base">🎯</span>
                          <span className="text-[9px] font-black text-red-300">BOWLED</span>
                        </div>
                      ) : isCatch ? (
                        <div className="flex flex-col items-center">
                          <span className="text-base">🧤</span>
                          <span className="text-[9px] font-black text-red-300">CATCH</span>
                        </div>
                      ) : isCatchBehind ? (
                        <div className="flex flex-col items-center">
                          <span className="text-base">🏏</span>
                          <span className="text-[9px] font-black text-red-300">BEHIND</span>
                        </div>
                      ) : isStumping ? (
                        <div className="flex flex-col items-center">
                          <span className="text-base">⚡</span>
                          <span className="text-[9px] font-black text-red-300">STUMP</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-base">🏃</span>
                          <span className="text-[9px] font-black text-red-300">RUN OUT</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-xs font-black text-white mt-2 leading-tight uppercase tracking-wide">
                      {card.title}
                    </h3>
                    <p className="text-[9px] text-red-200/70 mt-1 leading-tight line-clamp-2 px-1">
                      {card.desc}
                    </p>
                  </div>

                  {/* Card Footer Laser Watermark */}
                  <div className="text-[8px] text-slate-500 font-mono border-t border-white/5 pt-1 flex items-center justify-between">
                    <span>FDG · 57×89MM</span>
                    <span className="text-red-400 font-bold group-hover:text-white">INSPECT ↗</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. RUNS DECK (16 CARDS) */}
        {activeDeck === 'runs' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {filteredRuns.map((rc) => (
              <div
                key={rc.card}
                onClick={() => setSelectedCard({ ...rc, deckType: 'runs' })}
                className="bg-gradient-to-b from-[#181f18] via-[#121612] to-[#0c0f0c] border border-blue-500/40 hover:border-blue-400 rounded-3xl p-4 flex flex-col justify-between text-xs space-y-3 shadow-xl hover:shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-all duration-300 tactical-card-sheen cursor-pointer group hover:scale-101"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="font-black text-blue-400 uppercase text-[10px] tracking-wider">
                      Runs Card
                    </span>
                  </div>
                  <span className="font-mono text-xs font-extrabold text-white bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-500/30">
                    #{rc.card}
                  </span>
                </div>

                {/* Multi-Outcome Telemetry Grid */}
                <div className="space-y-1.5 text-[11px] bg-[#0c100c] p-2.5 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center py-0.5 border-b border-white/5">
                    <span className="text-[#9ba394]">Catch Dropped:</span>
                    <strong className="text-white font-mono text-[10px]">
                      Fldr <span className="text-blue-300 font-bold">{rc.catchDroppedFielder}</span> · Wk <span className="text-blue-300 font-bold">{rc.catchDroppedKeeperBowler}</span>
                    </strong>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-b border-white/5">
                    <span className="text-[#9ba394]">No Fielder:</span>
                    <strong className="text-white font-mono text-[10px]">
                      Catch <span className="text-white font-bold">{rc.noFielderCatch}</span> · RO <span className="text-white font-bold">{rc.noFielderRunOut}</span>
                    </strong>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-b border-white/5">
                    <span className="text-[#9ba394]">Stumping Missed:</span>
                    <strong className="text-amber-300 font-mono text-[10px] font-bold">
                      {rc.stumpingMissed || '0'}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-b border-white/5">
                    <span className="text-[#9ba394]">Direct Hit (RO):</span>
                    <strong className="text-white font-mono text-[10px]">
                      F:{rc.runOutHit.fielder} · B:{rc.runOutHit.bowler} · K:{rc.runOutHit.keeper}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[#9ba394]">Extras (App-Now):</span>
                    <strong className="text-[#ccff00] font-black font-mono text-[10px]">
                      {rc.extrasAppNow}
                    </strong>
                  </div>
                </div>

                {/* Free Hit Strip */}
                <div className="bg-[#191d18] px-3 py-1.5 rounded-xl border border-amber-400/20 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-amber-300 uppercase">Free Hit:</span>
                  <span className="font-mono text-white font-bold">
                    Bat: <strong className="text-amber-300">{rc.freeHitOthers}r</strong> · Bowler: <strong className="text-slate-300">{rc.freeHitBowler}r</strong>
                  </span>
                </div>

                {/* Footer */}
                <div className="text-[8px] text-slate-500 font-mono text-center pt-1 border-t border-white/5 flex items-center justify-between">
                  <span>Faiz Dice Games</span>
                  <span className="text-blue-400 font-bold group-hover:text-white">Full Spec ↗</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. FIELDING DECK (20 CARDS) */}
        {activeDeck === 'fielding' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3.5">
            {filteredFielding.map((fc) => {
              const pos = FIELDING_POSITIONS[fc.positionNumber] || { name: `Position ${fc.positionNumber}`, zone: 'Infield', angle: 'N/A' };
              const isKeeper = fc.positionNumber === 19;
              const isBowler = fc.positionNumber === 20;
              const isSlip = fc.positionNumber === 17;

              return (
                <div
                  key={fc.id}
                  onClick={() => setSelectedCard({ ...fc, ...pos, deckType: 'fielding' })}
                  className="aspect-[57/89] bg-gradient-to-b from-[#161c16] via-[#101410] to-[#0a0d0a] border-2 border-sky-500/35 hover:border-sky-400 rounded-2xl p-3 flex flex-col justify-between items-center text-center shadow-xl hover:shadow-[0_0_20px_rgba(56,189,248,0.25)] transition-all duration-300 tactical-card-sheen cursor-pointer group hover:scale-102"
                >
                  <div className="w-full flex items-center justify-between border-b border-sky-500/20 pb-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-sky-400">
                      FIELDER #{fc.positionNumber}
                    </span>
                    <span className="text-[8px] font-mono text-slate-500">
                      {pos.zone}
                    </span>
                  </div>

                  <div className="my-auto flex flex-col items-center py-1">
                    <div className="w-16 h-16 rounded-2xl border-2 border-sky-400/40 bg-gradient-to-br from-sky-950/60 to-[#0e130e] flex flex-col items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                      <span className="text-2xl font-black text-white font-mono leading-none">
                        {fc.positionNumber}
                      </span>
                      <span className="text-[8px] font-bold text-sky-300 uppercase tracking-tighter mt-1">
                        {pos.zone === 'Outfield' ? 'DEEP' : pos.zone === 'Ring' ? 'RING' : 'CLOSE'}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-white mt-2 leading-tight uppercase">
                      {pos.name}
                    </h4>
                    <span className="text-[9px] font-mono text-sky-300/80 mt-0.5">
                      {pos.angle}
                    </span>
                  </div>

                  <div className="w-full text-[8px] text-slate-500 font-mono border-t border-white/5 pt-1 flex items-center justify-between">
                    <span>FDG BRIDGE</span>
                    <span className="text-sky-400 font-bold group-hover:text-white">DETAILS ↗</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. SKILLS DECK (20 CARDS) */}
        {activeDeck === 'skills' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {filteredSkills.map((sc) => (
              <div
                key={sc.card}
                onClick={() => setSelectedCard({ ...sc, deckType: 'skills' })}
                className="bg-gradient-to-b from-[#182218] via-[#121812] to-[#0c100c] border border-emerald-500/40 hover:border-emerald-400 rounded-3xl p-4 flex flex-col justify-between text-xs space-y-3 shadow-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 tactical-card-sheen cursor-pointer group hover:scale-101"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-black text-emerald-400 uppercase text-[10px] tracking-wider">
                      Skills Card
                    </span>
                  </div>
                  <span className="font-mono text-xs font-extrabold text-white bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    #{sc.card}
                  </span>
                </div>

                {/* Wicketkeeper Matrix */}
                <div className="space-y-1.5 bg-[#0c110c] p-2.5 rounded-2xl border border-white/5">
                  <div className="text-[10px] font-black text-amber-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Wicketkeeper Skills</span>
                    <span className="text-[9px] font-mono text-slate-400">P19</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#9ba394]">Catch:</span>
                    <span className="font-bold text-white font-mono">{sc.wkCatch.join(', ')}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#9ba394]">Stump:</span>
                    <span className="font-bold text-white font-mono">{sc.wkStump.join(', ')}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#9ba394]">Run Out:</span>
                    <span className="font-bold text-white font-mono">{sc.wkRunOut.join(', ') || 'None'}</span>
                  </div>
                </div>

                {/* Fielder Matrix */}
                <div className="space-y-1.5 bg-[#0c110c] p-2.5 rounded-2xl border border-white/5">
                  <div className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Fielding Positions (1-18)</span>
                    <span className="text-[9px] font-mono text-slate-400">P1-18</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#9ba394]">Catch:</span>
                    <span className="font-bold text-white font-mono">{sc.fldCatch.join(', ')}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#9ba394]">Run Out:</span>
                    <span className="font-bold text-white font-mono">{sc.fldRunOut.join(', ') || 'None'}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-[8px] text-slate-500 font-mono text-center pt-1 border-t border-white/5 flex items-center justify-between">
                  <span>Faiz Dice Games</span>
                  <span className="text-emerald-400 font-bold group-hover:text-white">Full Spec ↗</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. POWER CARDS (6 CARDS) */}
        {activeDeck === 'power' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {filteredPower.map((pc) => {
              const isWonderfulShot = pc.name === 'Wonderful Shot';
              const isGreatDelivery = pc.name === 'Great Delivery';
              const isReroll = pc.name === 'Reroll';

              return (
                <div
                  key={pc.id}
                  onClick={() => setSelectedCard({ ...pc, deckType: 'power' })}
                  className="bg-gradient-to-b from-[#1f261a] via-[#151a12] to-[#0c0f0a] border-2 border-[#ccff00]/40 hover:border-[#ccff00] rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-2xl hover:shadow-[0_0_25px_rgba(204,255,0,0.3)] transition-all duration-300 tactical-card-sheen cursor-pointer group hover:scale-101"
                >
                  <div>
                    {/* Top Pill & Quantity */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#ccff00] bg-[#ccff00]/10 border border-[#ccff00]/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#ccff00]" />
                        CAPTAIN POWER TRUMP ×{pc.count}
                      </span>
                      <span className="text-[10px] font-bold text-amber-300 font-mono bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/25">
                        {pc.usedBy}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-white mt-3 flex items-center gap-2">
                      {pc.name}
                      {isWonderfulShot && <span className="text-lg">💥</span>}
                      {isGreatDelivery && <span className="text-lg">🎯</span>}
                      {isReroll && <span className="text-lg">🎲</span>}
                    </h3>
                    <p className="text-xs text-[#9ba394] mt-1.5 leading-relaxed">
                      {pc.desc}
                    </p>
                  </div>

                  {/* Matrix 6x6 Grid Display for Wonderful Shot & Great Delivery */}
                  {pc.grid ? (
                    <div className="pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1.5">
                        <span>Card Matrix (Red A-F × Blue 1-6):</span>
                        <span className="text-[#ccff00] font-mono">
                          {isWonderfulShot ? '83.3% 4s & 6s' : '61.1% Wickets'}
                        </span>
                      </div>
                      <div className="grid grid-cols-6 gap-1 bg-[#0b0f0b] p-2 rounded-2xl border border-white/10 font-mono text-[9px] text-center font-bold">
                        {pc.grid.map((r, i) => r.map((c, j) => (
                          <div
                            key={`${i}-${j}`}
                            className={`py-1.5 rounded-lg flex items-center justify-center transition-colors ${
                              c === 'X' ? 'bg-red-950/80 text-red-300 font-black border border-red-700/40' :
                              c === '6' ? 'bg-amber-400 text-black font-black' :
                              c === '4' ? 'bg-[#ccff00] text-black font-black' :
                              'bg-[#191d18] text-slate-400 border border-white/5'
                            }`}
                          >
                            {c}
                          </div>
                        )))}
                      </div>
                    </div>
                  ) : (
                    /* Reroll Options Showcase */
                    <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                      <div className="bg-[#0b0f0b] p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                        <span className="text-white font-bold">Full Reroll (Both Dice)</span>
                        <span className="text-base">🎲🎲</span>
                      </div>
                      <div className="bg-[#0b0f0b] p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                        <span className="text-white font-bold">Half Reroll (Red Die Row)</span>
                        <span className="text-[10px] font-mono bg-red-950 text-red-300 px-2 py-0.5 rounded font-bold">A–F</span>
                      </div>
                      <div className="bg-[#0b0f0b] p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                        <span className="text-white font-bold">Half Reroll (Blue Die Col)</span>
                        <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-2 py-0.5 rounded font-bold">1–6</span>
                      </div>
                    </div>
                  )}

                  {/* Action Link */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-[9px] text-slate-500 font-mono">Faiz Dice Games · Official</span>
                    <span className="text-[#ccff00] font-bold group-hover:underline flex items-center gap-1">
                      Inspect Card <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3D CARD INSPECTOR MODAL */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-[#141814] border-2 border-[#ccff00]/40 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ccff00] animate-beacon-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-[#ccff00]">
                  Tactical Card Inspector (Bridge Spec)
                </span>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="w-8 h-8 rounded-full bg-[#1e241c] text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4">
              {/* Card Title & Type */}
              <div className="bg-[#0e120d] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#9ba394] uppercase tracking-wider block">
                    {selectedCard.deckType.toUpperCase()} DECK
                  </span>
                  <h2 className="text-xl font-black text-white mt-0.5">
                    {selectedCard.title || selectedCard.name || `Position #${selectedCard.positionNumber}` || `Runs Card #${selectedCard.card}`}
                  </h2>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#1b2218] border border-[#2e3728] flex items-center justify-center text-xl shadow-inner">
                  {selectedCard.deckType === 'wickets' ? '🎯' :
                   selectedCard.deckType === 'runs' ? '⚡' :
                   selectedCard.deckType === 'fielding' ? '🧤' :
                   selectedCard.deckType === 'skills' ? '⭐' : '👑'}
                </div>
              </div>

              {/* Specific Deck Info */}
              {selectedCard.deckType === 'wickets' && (
                <div className="space-y-3 bg-[#0e120d] border border-red-500/25 rounded-2xl p-4 text-xs">
                  <div className="font-bold text-red-400 uppercase text-[10px]">Dismissal Mechanics:</div>
                  <p className="text-slate-300 leading-relaxed">{selectedCard.desc}</p>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Chance Rule:</span>
                    <strong className="text-white">{selectedCard.chance}</strong>
                  </div>
                  <div className="bg-red-950/40 border border-red-800/40 p-2.5 rounded-xl text-[10px] text-red-200">
                    💡 In Faiz Dice Games, drawing a Wicket Card determines the exact dismissal method, triggering DRS review options or fielder catch checks.
                  </div>
                </div>
              )}

              {selectedCard.deckType === 'runs' && (
                <div className="space-y-2 bg-[#0e120d] border border-blue-500/25 rounded-2xl p-4 text-xs">
                  <div className="font-bold text-blue-400 uppercase text-[10px]">Matrix Probabilities:</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-[#151a14] p-2 rounded-xl border border-white/5">
                      <span className="text-slate-400 block text-[9px]">Catch Dropped:</span>
                      <strong className="text-white">Fldr {selectedCard.catchDroppedFielder} · Wk {selectedCard.catchDroppedKeeperBowler}</strong>
                    </div>
                    <div className="bg-[#151a14] p-2 rounded-xl border border-white/5">
                      <span className="text-slate-400 block text-[9px]">Stumping Miss:</span>
                      <strong className="text-amber-300">{selectedCard.stumpingMissed || '0'}</strong>
                    </div>
                    <div className="bg-[#151a14] p-2 rounded-xl border border-white/5">
                      <span className="text-slate-400 block text-[9px]">Free Hit Batsman:</span>
                      <strong className="text-[#ccff00]">{selectedCard.freeHitOthers} Runs</strong>
                    </div>
                    <div className="bg-[#151a14] p-2 rounded-xl border border-white/5">
                      <span className="text-slate-400 block text-[9px]">Extras (App-Now):</span>
                      <strong className="text-white">{selectedCard.extrasAppNow}</strong>
                    </div>
                  </div>
                </div>
              )}

              {selectedCard.deckType === 'fielding' && (
                <div className="space-y-3 bg-[#0e120d] border border-sky-500/25 rounded-2xl p-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-400 uppercase text-[10px]">Position #{selectedCard.positionNumber}:</span>
                    <span className="text-[10px] font-mono text-sky-300">{selectedCard.zone}</span>
                  </div>
                  <p className="text-slate-300 text-sm font-bold">{selectedCard.name}</p>
                  <p className="text-slate-400 text-xs">Angle on Field: {selectedCard.angle}</p>
                  <div className="bg-sky-950/40 border border-sky-800/40 p-2.5 rounded-xl text-[10px] text-sky-200">
                    💡 Field cards are drawn when a ball is hit into the field. If the drawn position matches a high-skill fielder, catch or run-out chance is triggered!
                  </div>
                </div>
              )}

              {selectedCard.deckType === 'power' && (
                <div className="space-y-3 bg-[#0e120d] border border-[#ccff00]/25 rounded-2xl p-4 text-xs">
                  <div className="font-bold text-[#ccff00] uppercase text-[10px]">Captain Authorization:</div>
                  <p className="text-slate-300 leading-relaxed">{selectedCard.desc}</p>
                  <div className="p-2.5 bg-[#1b2218] rounded-xl text-xs font-bold text-white flex items-center justify-between">
                    <span>Authorized Users:</span>
                    <span className="text-[#ccff00]">{selectedCard.usedBy}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="mt-5 pt-3 border-t border-white/10">
              <button
                onClick={() => setSelectedCard(null)}
                className="w-full py-3 rounded-full bg-[#ccff00] hover:bg-[#b3ff00] text-[#101410] font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer transition-all active:scale-95"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardsView;
