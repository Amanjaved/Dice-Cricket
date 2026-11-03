// src/views/DplView.tsx
import React, { useState } from 'react';
import { Trophy, Gavel, Users, DollarSign, Check, AlertCircle, ArrowRight, RefreshCw, Trash2 } from 'lucide-react';
import type { DplSeason, DplFranchise, Player } from '../types';
import { storage } from '../services/storage';
import { TEAMS_DATA } from '../../scripts/master_data.js';
import { soundEngine } from '../services/sound';

export const DplView: React.FC = () => {
  const [season, setSeason] = useState<DplSeason | null>(storage.getDplSeason());
  const [currentLotIndex, setCurrentLotIndex] = useState(0);
  const [currentBid, setCurrentBid] = useState(1000);
  const [leadingFranchiseId, setLeadingFranchiseId] = useState<string | null>(null);

  // Initialize a default season if none exists
  const handleStartNewSeason = () => {
    const allPlayers: Player[] = [];
    TEAMS_DATA.forEach(t => allPlayers.push(...(t.players as unknown as Player[])));

    const defaultFranchises: DplFranchise[] = [
      { id: 'dpl_delhi', name: 'Delhi Dynamos', code: 'DLD', color: '#f43f5e', purseRemaining: 50000, squad: [], retainedPlayerIds: [] },
      { id: 'dpl_mumbai', name: 'Mumbai Blasters', code: 'MUB', color: '#0ea5e9', purseRemaining: 50000, squad: [], retainedPlayerIds: [] },
      { id: 'dpl_lahore', name: 'Lahore Lions', code: 'LHL', color: '#10b981', purseRemaining: 50000, squad: [], retainedPlayerIds: [] },
      { id: 'dpl_sydney', name: 'Sydney Strikers', code: 'SYS', color: '#f59e0b', purseRemaining: 50000, squad: [], retainedPlayerIds: [] },
      { id: 'dpl_london', name: 'London Royals', code: 'LDR', color: '#8b5cf6', purseRemaining: 50000, squad: [], retainedPlayerIds: [] },
      { id: 'dpl_colombo', name: 'Colombo Titans', code: 'CLT', color: '#ec4899', purseRemaining: 50000, squad: [], retainedPlayerIds: [] }
    ];

    const newSeason: DplSeason = {
      id: `dpl_season_${Date.now()}`,
      seasonNumber: 1,
      status: 'AUCTION',
      seed: 889911,
      auctionCursor: 0,
      franchises: defaultFranchises,
      playerPool: allPlayers.sort(() => Math.random() - 0.5)
    };

    storage.saveDplSeason(newSeason);
    setSeason(newSeason);
    setCurrentLotIndex(0);
    setCurrentBid(1000);
    setLeadingFranchiseId(null);
  };

  const currentLotPlayer = season?.playerPool[currentLotIndex] || null;

  const handlePlaceBid = (franchiseId: string) => {
    soundEngine.playBallHit();
    const nextBid = currentBid + 500;
    setCurrentBid(nextBid);
    setLeadingFranchiseId(franchiseId);
  };

  const handleHammerDown = () => {
    if (!season || !currentLotPlayer || !leadingFranchiseId) return;
    soundEngine.playDrsChime();

    const updatedFranchises = season.franchises.map(f => {
      if (f.id === leadingFranchiseId) {
        return {
          ...f,
          purseRemaining: f.purseRemaining - currentBid,
          squad: [...f.squad, currentLotPlayer]
        };
      }
      return f;
    });

    const updatedSeason: DplSeason = {
      ...season,
      auctionCursor: season.auctionCursor + 1,
      franchises: updatedFranchises
    };

    storage.saveDplSeason(updatedSeason);
    setSeason(updatedSeason);

    // Next Lot
    setCurrentLotIndex(prev => prev + 1);
    setCurrentBid(1000);
    setLeadingFranchiseId(null);
  };

  const handlePassLot = () => {
    if (!season) return;
    setCurrentLotIndex(prev => prev + 1);
    setCurrentBid(1000);
    setLeadingFranchiseId(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6 select-none animate-fadeIn pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#272b26] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-[10px] font-black uppercase tracking-wider">
            <Gavel className="w-3.5 h-3.5" />
            <span>Dice Premier League (DPL)</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Franchise Auction Arena
          </h1>
          <p className="text-xs text-slate-400">
            50,000 Points Purse · 200 Players Pool · Strict Role Balance (BW+BWAL ≥ 40%)
          </p>
        </div>

        {!season ? (
          <button
            onClick={handleStartNewSeason}
            className="px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-[#c3f400] text-black hover:bg-[#d4ff1a] transition-transform active:scale-95 shadow-xl shadow-[#c3f400]/25"
          >
            Start DPL Season 1 Auction
          </button>
        ) : (
          <button
            onClick={handleStartNewSeason}
            className="px-4 py-2 rounded-full text-xs font-bold bg-[#1d211c] text-slate-300 hover:text-white border border-white/10"
          >
            Reset Season
          </button>
        )}
      </div>

      {season && currentLotPlayer ? (
        <div className="space-y-6">
          {/* Active Auction Lot Stage */}
          <div className="bg-[#141814] border-2 border-[#c3f400]/40 rounded-3xl p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Player Card */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#1d211c] border border-white/10 flex items-center justify-center font-black text-xl text-[#c3f400]">
                  #{currentLotPlayer.no}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-white">{currentLotPlayer.name}</span>
                    {currentLotPlayer.marks.includes('★') && (
                      <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded text-xs font-bold">
                        ★ Star @ {currentLotPlayer.starRuns || 20}r
                      </span>
                    )}
                    {currentLotPlayer.marks.includes('F') && (
                      <span className="bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded text-xs font-bold">
                        Finisher
                      </span>
                    )}
                    {currentLotPlayer.marks.includes('D') && (
                      <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-xs font-bold">
                        Death Bowler
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    Role: <strong className="text-white">{currentLotPlayer.role}</strong> · Hand: {currentLotPlayer.bat} · {currentLotPlayer.bowl ? `Bowling: ${currentLotPlayer.bowl}` : 'Non-bowler'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Fielding: Catch [{currentLotPlayer.ct}] · Run Out [{currentLotPlayer.rt}]
                  </div>
                </div>
              </div>

              {/* Live Bidding Box */}
              <div className="w-full md:w-auto bg-[#1d211c] border border-white/10 p-4 rounded-2xl text-center min-w-[200px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Current Top Bid
                </span>
                <span className="text-3xl font-black font-mono text-[#c3f400] block my-0.5">
                  {currentBid.toLocaleString()} pts
                </span>
                <span className="text-xs text-slate-300 font-semibold block">
                  {leadingFranchiseId 
                    ? `Leading: ${season.franchises.find(f => f.id === leadingFranchiseId)?.name}` 
                    : "No bids placed yet"}
                </span>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <button
                    onClick={handlePassLot}
                    className="px-3 py-1.5 rounded-full bg-[#101410] text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Unsold / Pass
                  </button>
                  <button
                    disabled={!leadingFranchiseId}
                    onClick={handleHammerDown}
                    className="px-5 py-1.5 rounded-full bg-[#c3f400] text-black text-xs font-black uppercase tracking-wider hover:bg-[#d4ff1a] disabled:opacity-40"
                  >
                    🔨 Hammer Down (SOLD)
                  </button>
                </div>
              </div>
            </div>

            {/* Bidding Buttons for Franchises */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                Place Bid for Franchise (+500 pts):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {season.franchises.map(f => {
                  const canAfford = f.purseRemaining >= currentBid + 500;
                  const isLeading = leadingFranchiseId === f.id;

                  return (
                    <button
                      key={f.id}
                      disabled={!canAfford}
                      onClick={() => handlePlaceBid(f.id)}
                      className={`p-2.5 rounded-2xl border text-left transition-all ${
                        isLeading 
                          ? "bg-[#c3f400] text-black border-[#c3f400] font-black" 
                          : "bg-[#1d211c] text-white border-white/5 hover:border-white/20 disabled:opacity-40"
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{f.name}</div>
                      <div className={`text-[10px] font-mono ${isLeading ? 'text-black' : 'text-slate-400'}`}>
                        {f.purseRemaining.toLocaleString()} pts
                      </div>
                      <div className={`text-[9px] ${isLeading ? 'text-black font-extrabold' : 'text-[#c3f400]'}`}>
                        {f.squad.length}/18 squad
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Franchise Roster Overview & Role Balance Check */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {season.franchises.map(f => {
              const bowlersCount = f.squad.filter(p => p.role === 'BW' || p.role === 'BWAL').length;
              const bowlingRatio = f.squad.length > 0 ? (bowlersCount / f.squad.length) * 100 : 0;
              const hasWk = f.squad.some(p => p.role === 'WK');

              return (
                <div key={f.id} className="p-4 bg-[#141814] border border-[#272b26] rounded-2xl space-y-2">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: f.color }} />
                      <span className="font-bold text-white text-sm">{f.name}</span>
                    </div>
                    <span className="font-mono text-xs font-black text-[#c3f400]">
                      {f.purseRemaining.toLocaleString()} pts
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Squad: {f.squad.length} players</span>
                    <span>BW+BWAL: {bowlersCount} ({bowlingRatio.toFixed(0)}%)</span>
                    <span>WK: {hasWk ? '✅' : 'Pending'}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 max-h-24 overflow-y-auto custom-scrollbar">
                    {f.squad.map((p, i) => (
                      <span key={i} className="inline-block bg-[#1d211c] px-1.5 py-0.5 rounded mr-1 mb-1 text-slate-300">
                        {p.name} ({p.role})
                      </span>
                    ))}
                    {f.squad.length === 0 && <span className="italic text-slate-600">No players acquired yet</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-8 text-center space-y-3">
          <Trophy className="w-12 h-12 text-[#c3f400] mx-auto opacity-70" />
          <h2 className="text-lg font-black text-white">DPL Season Ready to Launch</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create franchise teams with 50,000 points, bid for 200 players, and balance your bowling and batting depth.
          </p>
          <button
            onClick={handleStartNewSeason}
            className="px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-[#c3f400] text-black hover:bg-[#d4ff1a]"
          >
            Start Season 1 Auction
          </button>
        </div>
      )}
    </div>
  );
};
