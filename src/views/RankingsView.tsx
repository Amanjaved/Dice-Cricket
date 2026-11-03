// src/views/RankingsView.tsx
import React, { useState } from 'react';
import { BarChart3, Trophy, Award, TrendingUp, Sparkles, Filter } from 'lucide-react';
import type { MatchFormat, GroundType } from '../types';
import { storage } from '../services/storage';

export const RankingsView: React.FC = () => {
  const [format, setFormat] = useState<MatchFormat>('10_overs');
  const [groundFilter, setGroundFilter] = useState<'ALL' | GroundType>('ALL');
  const [category, setCategory] = useState<'batting' | 'bowling' | 'allrounder' | 'teams'>('batting');

  const teams = storage.getAllTeams();

  // Official ICC-Style Top 10 Batsmen
  const topBatsmen = [
    { rank: 1, name: "Debashish", team: "IND", rating: 894, pts: 25, runs: 248, sr: 154.2 },
    { rank: 2, name: "Joshua", team: "ENG", rating: 865, pts: 30, runs: 230, sr: 162.0 },
    { rank: 3, name: "Daniyal", team: "PAK", rating: 842, pts: 20, runs: 215, sr: 148.5 },
    { rank: 4, name: "Haden", team: "AUS", rating: 820, pts: 17, runs: 198, sr: 142.1 },
    { rank: 5, name: "Hirday", team: "BAN", rating: 798, pts: 25, runs: 185, sr: 139.8 },
    { rank: 6, name: "Harvey", team: "NZ", rating: 775, pts: 25, runs: 176, sr: 134.5 },
    { rank: 7, name: "Sadiq", team: "SA", rating: 760, pts: 25, runs: 168, sr: 140.2 },
    { rank: 8, name: "Arqam", team: "AFG", rating: 745, pts: 30, runs: 162, sr: 136.0 },
    { rank: 9, name: "Sanjeeva", team: "SL", rating: 730, pts: 20, runs: 155, sr: 130.4 },
    { rank: 10, name: "Devnarain", team: "WI", rating: 712, pts: 10, runs: 142, sr: 128.9 }
  ];

  // Official Top 10 Bowlers
  const topBowlers = [
    { rank: 1, name: "Ojas", team: "IND", rating: 880, style: "LFM", wkts: 16, econ: 6.2 },
    { rank: 2, name: "Faizan", team: "PAK", rating: 852, style: "RF", wkts: 14, econ: 6.5 },
    { rank: 3, name: "Victor", team: "AUS", rating: 834, style: "LFM", wkts: 13, econ: 6.8 },
    { rank: 4, name: "Teboho", team: "SA", rating: 815, style: "LFM", wkts: 12, econ: 6.4 },
    { rank: 5, name: "Eric", team: "ENG", rating: 795, style: "LF", wkts: 11, econ: 7.1 },
    { rank: 6, name: "Ibrahim", team: "NZ", rating: 780, style: "RF", wkts: 11, econ: 7.0 },
    { rank: 7, name: "Naveen", team: "SL", rating: 764, style: "RFM", wkts: 10, econ: 7.3 },
    { rank: 8, name: "Taimur", team: "AFG", rating: 750, style: "LF", wkts: 10, econ: 6.9 },
    { rank: 9, name: "Mohammad", team: "WI", rating: 735, style: "LF", wkts: 9, econ: 7.4 },
    { rank: 10, name: "Ashish", team: "BAN", rating: 718, style: "LFM", wkts: 9, econ: 7.5 }
  ];

  // Official Top 10 All-Rounders (Batting * Bowling / 1000)
  const topAllRounders = [
    { rank: 1, name: "Rana", team: "IND", rating: 412, role: "BTAL", starRuns: 18 },
    { rank: 2, name: "Joshua", team: "ENG", rating: 395, role: "BTAL", starRuns: 30 },
    { rank: 3, name: "Milindu", team: "SL", rating: 378, role: "BTAL", marks: "F, DB" },
    { rank: 4, name: "Aryan", team: "PAK", rating: 360, role: "BWAL", marks: "F" },
    { rank: 5, name: "Victor", team: "AUS", rating: 348, role: "BWAL", marks: "F, DB" },
    { rank: 6, name: "David", team: "NZ", rating: 335, role: "BWAL", marks: "C, F" },
    { rank: 7, name: "Siyabonga", team: "SA", rating: 320, role: "BWAL", marks: "C" },
    { rank: 8, name: "Besharat", team: "AFG", rating: 308, role: "BTAL", marks: "F" },
    { rank: 9, name: "Hussain", team: "BAN", rating: 295, role: "BTAL", marks: "F" },
    { rank: 10, name: "Akhtar", team: "WI", rating: 280, role: "BTAL", marks: "F" }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6 select-none animate-fadeIn pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#272b26] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#c3f400]/10 border border-[#c3f400]/25 text-[#c3f400] text-[10px] font-black uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Official Ratings &amp; Leaderboards</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Official ICC-Style World Rankings
          </h1>
          <p className="text-xs text-slate-400">
            Weighted Exponential Decay · 500 Benchmark Average · Ground Normalization
          </p>
        </div>

        {/* Format Selector */}
        <div className="flex bg-[#101410] border border-white/10 rounded-2xl p-1 text-xs font-bold">
          <button
            onClick={() => setFormat('5_overs')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              format === '5_overs' ? 'bg-[#c3f400] text-black font-black shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            5 Overs
          </button>
          <button
            onClick={() => setFormat('10_overs')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              format === '10_overs' ? 'bg-[#c3f400] text-black font-black shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            10 Overs
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { id: 'batting', label: 'Top 10 Batsmen' },
          { id: 'bowling', label: 'Top 10 Bowlers' },
          { id: 'allrounder', label: 'Top 10 All-Rounders' },
          { id: 'teams', label: 'Team Standings & Form Stars' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id as typeof category)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              category === cat.id
                ? 'bg-[#c3f400] text-black font-black shadow-md shadow-[#c3f400]/20'
                : 'bg-[#141814] text-slate-400 hover:text-white border border-[#272b26]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Rankings Table */}
      <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-5 shadow-xl space-y-4">
        {category === 'batting' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase font-bold">
                  <th className="py-2.5 w-12">Rank</th>
                  <th className="py-2.5">Player</th>
                  <th className="py-2.5">Team</th>
                  <th className="py-2.5 text-right">Star Runs</th>
                  <th className="py-2.5 text-right">Runs</th>
                  <th className="py-2.5 text-right">SR</th>
                  <th className="py-2.5 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {topBatsmen.map(b => (
                  <tr key={b.rank} className="hover:bg-white/5">
                    <td className="py-2.5 font-bold text-[#c3f400]">#{b.rank}</td>
                    <td className="py-2.5 font-sans font-bold text-white">{b.name}</td>
                    <td className="py-2.5 font-bold text-slate-300">{b.team}</td>
                    <td className="py-2.5 text-right text-amber-300">★ {b.pts}r</td>
                    <td className="py-2.5 text-right text-white font-bold">{b.runs}</td>
                    <td className="py-2.5 text-right text-slate-400">{b.sr}</td>
                    <td className="py-2.5 text-right font-black text-[#c3f400]">{b.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {category === 'bowling' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase font-bold">
                  <th className="py-2.5 w-12">Rank</th>
                  <th className="py-2.5">Bowler</th>
                  <th className="py-2.5">Team</th>
                  <th className="py-2.5">Craft</th>
                  <th className="py-2.5 text-right">Wkts</th>
                  <th className="py-2.5 text-right">Econ</th>
                  <th className="py-2.5 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {topBowlers.map(b => (
                  <tr key={b.rank} className="hover:bg-white/5">
                    <td className="py-2.5 font-bold text-[#c3f400]">#{b.rank}</td>
                    <td className="py-2.5 font-sans font-bold text-white">{b.name}</td>
                    <td className="py-2.5 font-bold text-slate-300">{b.team}</td>
                    <td className="py-2.5 text-slate-400">{b.style}</td>
                    <td className="py-2.5 text-right text-white font-bold">{b.wkts}</td>
                    <td className="py-2.5 text-right text-slate-400">{b.econ}</td>
                    <td className="py-2.5 text-right font-black text-[#c3f400]">{b.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {category === 'allrounder' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase font-bold">
                  <th className="py-2.5 w-12">Rank</th>
                  <th className="py-2.5">All-Rounder</th>
                  <th className="py-2.5">Team</th>
                  <th className="py-2.5">Role</th>
                  <th className="py-2.5">Badges</th>
                  <th className="py-2.5 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {topAllRounders.map(ar => (
                  <tr key={ar.rank} className="hover:bg-white/5">
                    <td className="py-2.5 font-bold text-[#c3f400]">#{ar.rank}</td>
                    <td className="py-2.5 font-sans font-bold text-white">{ar.name}</td>
                    <td className="py-2.5 font-bold text-slate-300">{ar.team}</td>
                    <td className="py-2.5 text-slate-400">{ar.role}</td>
                    <td className="py-2.5 text-amber-300 text-[11px]">{ar.starRuns ? `★ @ ${ar.starRuns}r` : ar.marks || ''}</td>
                    <td className="py-2.5 text-right font-black text-[#c3f400]">{ar.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {category === 'teams' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase font-bold">
                  <th className="py-2.5 w-12">Rank</th>
                  <th className="py-2.5">Nation</th>
                  <th className="py-2.5">Printed ★</th>
                  <th className="py-2.5">Current Form ★</th>
                  <th className="py-2.5">Captain</th>
                  <th className="py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {teams.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-white/5">
                    <td className="py-2.5 font-bold text-[#c3f400]">#{idx + 1}</td>
                    <td className="py-2.5 font-sans font-bold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                      <span>{t.name} ({t.code})</span>
                    </td>
                    <td className="py-2.5 text-amber-400">{t.printedStars}★</td>
                    <td className="py-2.5 text-[#c3f400] font-bold">{t.currentStars}★</td>
                    <td className="py-2.5 text-slate-300 font-sans">{t.captain}</td>
                    <td className="py-2.5 text-right font-sans text-xs text-emerald-400">
                      Active
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
