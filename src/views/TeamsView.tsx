// src/views/TeamsView.tsx
import React, { useState } from 'react';
import { Users, Plus, Shield, Search, Sparkles, Trash2, Check, ArrowRight } from 'lucide-react';
import type { Team, Player, Role, BattingHand, BowlingStyle, SkillColor } from '../types';
import { storage } from '../services/storage';

export const TeamsView: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>(storage.getAllTeams());
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || "IND");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  // Modals for Custom Team and Add Player
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);

  // New Team Form State
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamCode, setNewTeamCode] = useState("");
  const [newTeamStars, setNewTeamStars] = useState<number>(4);
  const [newTeamColor, setNewTeamColor] = useState<string>("#38bdf8");

  // New Player Form State
  const [pName, setPName] = useState("");
  const [pRole, setPRole] = useState<Role>("BAT");
  const [pBat, setPBat] = useState<BattingHand>("RHB");
  const [pBowl, setPBowl] = useState<BowlingStyle | null>(null);
  const [pCt, setPCt] = useState<SkillColor>("Green");
  const [pRt, setPRt] = useState<SkillColor>("Green");
  const [pWkSt, setPWkSt] = useState<SkillColor>("Green");
  const [pStarRuns, setPStarRuns] = useState<number | undefined>(undefined);
  const [pIsOpener, setPIsOpener] = useState(false);
  const [pIsFinisher, setPIsFinisher] = useState(false);
  const [pIsDeathBowler, setPIsDeathBowler] = useState(false);
  const [pIsCaptain, setPIsCaptain] = useState(false);

  const selectedTeam = teams.find(t => t.id === selectedTeamId) || teams[0];

  const COLOR_PALETTE = [
    "#f43f5e", "#ef4444", "#f97316", "#f59e0b", "#eab308", 
    "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6", 
    "#6366f1", "#8b5cf6", "#ec4899", "#8a5a34"
  ];

  // Save new custom team
  const handleCreateCustomTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName || !newTeamCode) return;

    const teamId = `custom_${newTeamCode.toLowerCase()}_${Date.now()}`;
    const newTeam: Team = {
      id: teamId,
      name: newTeamName,
      code: newTeamCode.toUpperCase(),
      printedStars: newTeamStars,
      currentStars: newTeamStars,
      color: newTeamColor,
      captain: "Captain",
      starPlayers: [],
      deathBowlers: [],
      finishers: [],
      openers: [],
      suggestedXI: [],
      suggested7: [],
      players: [],
      isCustom: true
    };

    storage.saveCustomTeam(newTeam);
    const updated = storage.getAllTeams();
    setTeams(updated);
    setSelectedTeamId(teamId);
    setShowAddTeamModal(false);
    setNewTeamName("");
    setNewTeamCode("");
  };

  // Add player to currently selected custom team
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !selectedTeam) return;

    const marks: string[] = [];
    if (pIsCaptain) marks.push("C");
    if (pIsFinisher) marks.push("F");
    if (pIsOpener) marks.push("O");
    if (pIsDeathBowler) marks.push("D");
    if (pStarRuns) marks.push("★");

    const newPlayerNo = selectedTeam.players.length > 0
      ? Math.max(...selectedTeam.players.map(p => p.no)) + 1
      : 1;

    const newPlayer: Player = {
      no: newPlayerNo,
      name: pName,
      role: pRole,
      bat: pBat,
      bowl: pBowl,
      ct: pCt,
      rt: pRt,
      wkCt: pRole === 'WK' ? pCt : undefined,
      wkRt: pRole === 'WK' ? pRt : undefined,
      wkSt: pRole === 'WK' ? pWkSt : undefined,
      marks,
      starRuns: pStarRuns
    };

    const updatedPlayers = [...selectedTeam.players, newPlayer];
    const updatedTeam: Team = {
      ...selectedTeam,
      players: updatedPlayers,
      captain: pIsCaptain ? pName : selectedTeam.captain,
      suggestedXI: updatedPlayers.slice(0, 11).map(p => p.name),
      suggested7: updatedPlayers.slice(0, 7).map(p => p.name)
    };

    storage.saveCustomTeam(updatedTeam);
    setTeams(storage.getAllTeams());
    setShowAddPlayerModal(false);
    setPName("");
  };

  const filteredPlayers = selectedTeam?.players.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "ALL" || p.role === roleFilter;
    return matchesSearch && matchesRole;
  }) || [];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6 select-none animate-fadeIn pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#272b26] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#c3f400]/10 border border-[#c3f400]/25 text-[#c3f400] text-[10px] font-black uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Players Database &amp; Squad Registry</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            10 Nations &amp; Custom Squads
          </h1>
          <p className="text-xs text-slate-400">
            200 World-Class Players · Skill Dots (Red/Green/Blue) · Roles &amp; Tactical Markers
          </p>
        </div>

        <button
          onClick={() => setShowAddTeamModal(true)}
          className="px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#c3f400] text-black hover:bg-[#d4ff1a] transition-transform active:scale-95 shadow-xl shadow-[#c3f400]/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Team</span>
        </button>
      </div>

      {/* Team Selection Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {teams.map(t => (
          <button
            key={t.id}
            onClick={() => setSelectedTeamId(t.id)}
            className={`px-4 py-2 rounded-2xl border text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedTeamId === t.id
                ? "bg-[#272b26] text-white border-[#c3f400] shadow-md shadow-[#c3f400]/20"
                : "bg-[#141814] text-slate-400 hover:text-white border-[#272b26]"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
            <span>{t.name}</span>
            <span className="text-amber-400 font-mono text-[10px]">{t.printedStars}★</span>
          </button>
        ))}
      </div>

      {/* Selected Team Profile Card */}
      {selectedTeam && (
        <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3.5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg border border-white/20"
                style={{ backgroundColor: selectedTeam.color }}
              >
                {selectedTeam.code}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-white">{selectedTeam.name}</h2>
                  <span className="text-amber-400 font-mono text-sm">{selectedTeam.printedStars}★</span>
                  {selectedTeam.isCustom && (
                    <span className="bg-purple-950 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-500/30">
                      Custom
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-300 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  <span>Captain: <strong className="text-white">{selectedTeam.captain}</strong></span>
                  <span>Death Bowlers: <strong className="text-amber-300">{selectedTeam.deathBowlers.join(', ') || 'Assigned in roster'}</strong></span>
                  <span>Squad Size: <strong className="text-[#c3f400]">{selectedTeam.players.length} players</strong></span>
                </div>
              </div>
            </div>

            {selectedTeam.isCustom && (
              <button
                onClick={() => setShowAddPlayerModal(true)}
                className="px-4 py-2 rounded-full bg-[#1d211c] hover:bg-[#272b26] text-xs font-bold text-[#c3f400] border border-[#c3f400]/40 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Player</span>
              </button>
            )}
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#101410] border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white outline-none focus:border-[#c3f400]"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 custom-scrollbar">
              {['ALL', 'BAT', 'BTBW', 'BTAL', 'WK', 'BWAL', 'BW'].map(r => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                    roleFilter === r
                      ? 'bg-[#c3f400] text-black shadow-xs font-black'
                      : 'bg-[#101410] text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Players Roster Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredPlayers.map(p => (
              <div
                key={p.no}
                className="p-3.5 bg-[#1d211c] border border-white/5 hover:border-white/20 rounded-2xl transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#101410] text-slate-300 font-mono text-xs flex items-center justify-center font-bold">
                      {p.no}
                    </span>
                    <span className="font-bold text-white text-sm">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {p.marks.includes('C') && <span className="bg-blue-400/20 text-blue-300 text-[9px] px-1.5 py-0.5 rounded font-bold">C</span>}
                    {p.marks.includes('★') && <span className="bg-amber-400/20 text-amber-300 text-[9px] px-1.5 py-0.5 rounded font-bold">★ @ {p.starRuns}r</span>}
                    {p.marks.includes('F') && <span className="bg-emerald-400/20 text-emerald-300 text-[9px] px-1.5 py-0.5 rounded font-bold">F</span>}
                    {p.marks.includes('O') && <span className="bg-purple-400/20 text-purple-300 text-[9px] px-1.5 py-0.5 rounded font-bold">O</span>}
                    {p.marks.includes('D') && <span className="bg-amber-500/20 text-amber-300 text-[9px] px-1.5 py-0.5 rounded font-bold">D</span>}
                  </div>
                </div>

                <div className="text-xs text-slate-300 flex items-center justify-between">
                  <span>Role: <strong className="text-white">{p.role}</strong> ({p.bat})</span>
                  <span>{p.bowl ? p.bowl : 'Non-bowler'}</span>
                </div>

                {/* Skill Dots (Red / Green / Blue) */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <span className="text-[10px]">Ct:</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${p.ct === 'Red' ? 'bg-red-500' : p.ct === 'Green' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-[10px]">Rt:</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${p.rt === 'Red' ? 'bg-red-500' : p.rt === 'Green' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                    </span>
                  </div>
                  {p.role === 'WK' && (
                    <span className="text-emerald-400 font-bold text-[10px]">
                      WK Skills: {p.wkCt?.charAt(0)}·{p.wkRt?.charAt(0)}·{p.wkSt?.charAt(0)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Custom Team */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
          <form onSubmit={handleCreateCustomTeam} className="w-full max-w-md bg-[#141814] border border-[#272b26] rounded-3xl p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-black text-white">Add New Custom Team</h2>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Team Name</label>
              <input
                type="text"
                placeholder="e.g. Delhi Dynamos"
                required
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                className="w-full bg-[#1d211c] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#c3f400]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">3-Letter Code</label>
                <input
                  type="text"
                  placeholder="DLD"
                  maxLength={3}
                  required
                  value={newTeamCode}
                  onChange={e => setNewTeamCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#1d211c] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white font-mono font-bold uppercase outline-none focus:border-[#c3f400]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Star Tier (★)</label>
                <select
                  value={newTeamStars}
                  onChange={e => setNewTeamStars(parseInt(e.target.value, 10))}
                  className="w-full bg-[#1d211c] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white font-bold outline-none focus:border-[#c3f400]"
                >
                  <option value={5}>5★ Tier (Elite)</option>
                  <option value={4}>4★ Tier (Competitive)</option>
                  <option value={3}>3★ Tier (Underdog)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-2">Team Primary Color</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PALETTE.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewTeamColor(c)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${newTeamColor === c ? 'scale-110 border-white' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowAddTeamModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#c3f400] text-black hover:bg-[#d4ff1a]"
              >
                Save Team
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Granular Add Player Form */}
      {showAddPlayerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
          <form onSubmit={handleAddPlayer} className="w-full max-w-lg bg-[#141814] border border-[#272b26] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-lg font-black text-white">Add Player to {selectedTeam.name}</h2>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Player Name (Max 24 chars)</label>
              <input
                type="text"
                maxLength={24}
                required
                value={pName}
                onChange={e => setPName(e.target.value)}
                placeholder="e.g. Imran Khan"
                className="w-full bg-[#1d211c] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#c3f400]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Role</label>
                <select
                  value={pRole}
                  onChange={e => setPRole(e.target.value as Role)}
                  className="w-full bg-[#1d211c] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white font-bold"
                >
                  {['BAT', 'BTBW', 'BTAL', 'WK', 'BWAL', 'BW'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Batting Hand</label>
                <select
                  value={pBat}
                  onChange={e => setPBat(e.target.value as BattingHand)}
                  className="w-full bg-[#1d211c] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white font-bold"
                >
                  <option value="RHB">RHB (Right)</option>
                  <option value="LHB">LHB (Left)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Bowling Style</label>
                <select
                  value={pBowl || ""}
                  onChange={e => setPBowl((e.target.value as BowlingStyle) || null)}
                  className="w-full bg-[#1d211c] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white font-bold"
                >
                  <option value="">None</option>
                  {['RF', 'RFM', 'RM', 'LF', 'LFM', 'LM', 'RO', 'RL', 'LO', 'LC'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fielding Skills */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Catching Skill</label>
                <select
                  value={pCt}
                  onChange={e => setPCt(e.target.value as SkillColor)}
                  className="w-full bg-[#1d211c] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white font-bold"
                >
                  <option value="Red">Red (Best)</option>
                  <option value="Green">Green (Good)</option>
                  <option value="Blue">Blue (Average)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Run Out Skill</label>
                <select
                  value={pRt}
                  onChange={e => setPRt(e.target.value as SkillColor)}
                  className="w-full bg-[#1d211c] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white font-bold"
                >
                  <option value="Red">Red (Best)</option>
                  <option value="Green">Green (Good)</option>
                  <option value="Blue">Blue (Average)</option>
                </select>
              </div>
            </div>

            {/* Tactical Markers Flags */}
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-2">Tactical Markers</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <label className="flex items-center gap-1.5 p-2 bg-[#1d211c] rounded-xl border border-white/5 cursor-pointer">
                  <input type="checkbox" checked={pIsCaptain} onChange={e => setPIsCaptain(e.target.checked)} />
                  <span className="font-bold text-blue-300">Captain (C)</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 bg-[#1d211c] rounded-xl border border-white/5 cursor-pointer">
                  <input type="checkbox" checked={pIsFinisher} onChange={e => setPIsFinisher(e.target.checked)} />
                  <span className="font-bold text-emerald-300">Finisher (F)</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 bg-[#1d211c] rounded-xl border border-white/5 cursor-pointer">
                  <input type="checkbox" checked={pIsOpener} onChange={e => setPIsOpener(e.target.checked)} />
                  <span className="font-bold text-purple-300">Opener (O)</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 bg-[#1d211c] rounded-xl border border-white/5 cursor-pointer">
                  <input type="checkbox" checked={pIsDeathBowler} onChange={e => setPIsDeathBowler(e.target.checked)} />
                  <span className="font-bold text-amber-300">Death Bowler (D)</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowAddPlayerModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#c3f400] text-black hover:bg-[#d4ff1a]"
              >
                Save Player to Squad
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
