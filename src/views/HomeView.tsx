// src/views/HomeView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Trophy, Trash2, ArrowRight, Shield, Layers, Table, 
  Settings, Download, Upload, RefreshCw, AlertTriangle, Check, 
  Calendar, Flame, Sparkles, Plus, Volume2
} from 'lucide-react';
import type { MatchState, GroundType, TournamentState } from '../types';
import { storage } from '../services/storage';
import { soundEngine } from '../services/sound';

interface HomeViewProps {
  onNavigate: (view: string, data?: unknown) => void;
  onStartQuickMatch: (format: '5_overs' | '10_overs', ground: GroundType) => void;
  onResumeMatch: (match: MatchState) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onStartQuickMatch,
  onResumeMatch
}) => {
  const [matches, setMatches] = useState<MatchState[]>(storage.getAllMatches());
  const [tournaments, setTournaments] = useState<TournamentState[]>(storage.getAllTournaments());
  const [settings, setSettings] = useState(storage.getSettings());
  const [matchToDelete, setMatchToDelete] = useState<MatchState | null>(null);
  const [restoreFeedback, setRestoreFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter in-progress matches (last 3 for Section 3.2)
  const inProgressMatches = matches.filter(m => m.status === 'IN_PROGRESS' || m.status === 'TIE_SUPER_OVER');
  const last3InProgress = inProgressMatches.slice(0, 3);
  const completedMatchesCount = matches.filter(m => m.status === 'COMPLETED').length;

  const runningTournamentsCount = tournaments.filter(t => t.status !== 'COMPLETED').length;
  const finishedTournamentsCount = tournaments.filter(t => t.status === 'COMPLETED').length;

  // Weekly reminder check (Section 16)
  const daysSinceBackup = Math.floor((Date.now() - (settings.lastBackupTimestamp || 0)) / (1000 * 60 * 60 * 24));
  const isBackupReminderDue = daysSinceBackup >= 7;

  // Auto-backup weekly on Home open if enabled (Section 16)
  useEffect(() => {
    if (settings.autoBackupWeekly && isBackupReminderDue) {
      handleBackupDownload(false);
    }
  }, []);

  const handleBackupDownload = (showNotification = true) => {
    const jsonStr = storage.exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dice-cricket-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    const updated = { ...settings, lastBackupTimestamp: Date.now() };
    storage.saveSettings(updated);
    setSettings(updated);

    if (showNotification) {
      setRestoreFeedback("Backup JSON downloaded successfully!");
      setTimeout(() => setRestoreFeedback(null), 4000);
    }
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const res = storage.importBackupJson(text);
        setMatches(storage.getAllMatches());
        setTournaments(storage.getAllTournaments());
        setSettings(storage.getSettings());
        setRestoreFeedback(`Restored ${res.matchesRestored} matches and ${res.tournamentsRestored} tournaments!`);
        setTimeout(() => setRestoreFeedback(null), 5000);
      } catch (err) {
        alert("Restore failed: " + (err as Error).message);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleToggleAutoBackup = () => {
    const next = !settings.autoBackupWeekly;
    const updated = { ...settings, autoBackupWeekly: next };
    storage.saveSettings(updated);
    setSettings(updated);
  };

  const handleResetData = () => {
    if (window.confirm("WARNING: Are you sure you want to reset all data? All saved matches, custom teams, tournaments, and DPL seasons will be permanently deleted.")) {
      storage.resetAllData();
      setMatches(storage.getAllMatches());
      setTournaments(storage.getAllTournaments());
      setSettings(storage.getSettings());
      setRestoreFeedback("All data has been reset to defaults.");
      setTimeout(() => setRestoreFeedback(null), 4000);
    }
  };

  const handleDeleteMatch = () => {
    if (!matchToDelete) return;
    storage.deleteMatch(matchToDelete.id);
    setMatches(storage.getAllMatches());
    setMatchToDelete(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6 select-none animate-fadeIn pb-24">
      {/* Restore Feedback Toast */}
      {restoreFeedback && (
        <div className="bg-[#c3f400] text-black px-4 py-2.5 rounded-2xl font-black text-xs flex items-center justify-between shadow-xl animate-slideUp">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            {restoreFeedback}
          </span>
          <button onClick={() => setRestoreFeedback(null)} className="text-black font-bold text-xs hover:opacity-75">
            ✕
          </button>
        </div>
      )}

      {/* Weekly Backup Reminder Banner (Section 16) */}
      {isBackupReminderDue && (
        <div className="bg-amber-950/60 border border-amber-500/40 px-4 py-3 rounded-3xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Weekly Backup Reminder:</strong> Last backup was {daysSinceBackup} days ago. Back up your matches and tournament records to keep them safe.
            </span>
          </div>
          <button
            onClick={() => handleBackupDownload(true)}
            className="px-3.5 py-1.5 rounded-full bg-amber-400 text-black font-black text-xs uppercase tracking-wider shrink-0 hover:bg-amber-300 transition-transform active:scale-95 shadow-sm"
          >
            Backup Now
          </button>
        </div>
      )}

      {/* 1. Hero Section (Section 3.1) */}
      <div className="relative w-full rounded-3xl bg-gradient-to-br from-[#191d18] via-[#141814] to-[#0e120e] border border-[#2e3629] p-6 shadow-2xl overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute -right-12 -top-12 w-60 h-60 rounded-full bg-[#c3f400]/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-[#c3f400]/5 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c3f400]/15 border border-[#c3f400]/30 text-[#c3f400] text-[11px] font-black uppercase tracking-wider">
              <span>Faiz Dice Games presents</span>
              <span>•</span>
              <span className="text-white">Pitch Pulse Edition</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase mt-2">
              Dice Cricket
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mt-1">
              The premier physical dice &amp; cards cricket companion. Red die (A–F) and blue die (1–6) across 12 master pitch sheets with 87 official tactical cards.
            </p>
          </div>

          {/* Power-Card Strips Preview (Section 3.1) */}
          <div className="flex items-center gap-2 py-1 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300 shrink-0">
              <span className="font-black">⚡ WONDERFUL SHOT</span>
              <span className="text-[10px] text-amber-200/80">30/36 Boundary Cells</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-[11px] text-purple-300 shrink-0">
              <span className="font-black">🎯 GREAT DELIVERY</span>
              <span className="text-[10px] text-purple-200/80">22/36 Wicket Strike</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-sky-950/40 border border-sky-500/30 text-[11px] text-sky-300 shrink-0">
              <span className="font-black">🔄 CAPTAIN REROLL &amp; DRS</span>
              <span className="text-[10px] text-sky-200/80">1-Die Appeal (5-6 Safe)</span>
            </div>
          </div>

          {/* Two Big Hero Buttons (Section 3.1) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => onNavigate('setup')}
              className="py-3.5 px-6 rounded-full bg-[#c3f400] hover:bg-[#d4ff1a] text-[#101410] text-sm font-black flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(195,244,0,0.35)] transition-all active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">sports_cricket</span>
              <span className="tracking-wide">PLAY A MATCH</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('tournaments')}
              className="py-3.5 px-6 rounded-full bg-[#1d211c] hover:bg-[#272b26] border border-[#2e342c] text-white text-sm font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="tracking-wide">NEW TOURNAMENT</span>
              <ArrowRight className="w-4 h-4 ml-1 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Resume Section: Last 3 In-Progress Matches (Section 3.2) */}
      {last3InProgress.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span>Resume Matches ({last3InProgress.length})</span>
            </h2>
            <button
              onClick={() => onNavigate('matches')}
              className="text-xs text-[#c3f400] font-bold hover:underline"
            >
              View all matches &gt;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {last3InProgress.map(match => {
              const currentInn = match.currentInningsNo === 1 ? match.innings1 : match.innings2;
              return (
                <div
                  key={match.id}
                  className="bg-[#141814] border border-amber-500/30 hover:border-[#c3f400]/60 rounded-3xl p-4 transition-all shadow-lg flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="font-black text-[#c3f400] bg-[#c3f400]/10 px-2.5 py-0.5 rounded-full uppercase">
                        {match.format.replace('_', ' ')} · {match.ground}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMatchToDelete(match);
                        }}
                        title="Delete Match"
                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between my-2">
                      <div className="text-left">
                        <span className="text-base font-black text-white">{match.teamA.code}</span>
                        <span className="text-[10px] text-slate-400 block">{match.teamASnapshotStars}★</span>
                      </div>
                      <span className="text-xs font-bold text-slate-500">vs</span>
                      <div className="text-right">
                        <span className="text-base font-black text-white">{match.teamB.code}</span>
                        <span className="text-[10px] text-slate-400 block">{match.teamBSnapshotStars}★</span>
                      </div>
                    </div>

                    <div className="bg-[#191d18] rounded-2xl p-2.5 text-center my-1 border border-white/5">
                      <div className="text-lg font-black text-[#c3f400] font-mono leading-tight">
                        {currentInn.score}/{currentInn.wickets}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Over {currentInn.completedOvers}.{currentInn.ballsInCurrentOver} · {match.currentInningsNo === 1 ? '1st Inn' : '2nd Inn'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onResumeMatch(match)}
                    className="w-full mt-3 py-2 rounded-full bg-[#c3f400] hover:bg-[#d4ff1a] text-black font-black text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Resume</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Interactive Tiles (Section 3.3) */}
      <div className="space-y-3">
        <h2 className="text-base font-black text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#c3f400]" />
          <span>Core Game Hubs</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Tile 1: Matches */}
          <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-5 flex flex-col justify-between shadow-md hover:border-white/20 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-2xl bg-[#191d18] border border-[#2e342c] flex items-center justify-center text-[#c3f400]">
                  <span className="material-symbols-outlined text-[20px]">sports_cricket</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 font-bold">
                  {matches.length} Total
                </span>
              </div>
              <h3 className="text-base font-black text-white">Matches</h3>
              <p className="text-xs text-slate-400 mt-1">
                {inProgressMatches.length} in progress · {completedMatchesCount} completed
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
              <button
                onClick={() => onNavigate('setup')}
                className="flex-1 py-1.5 rounded-full bg-[#c3f400] text-black font-black text-xs text-center hover:bg-[#d4ff1a]"
              >
                New Match
              </button>
              <button
                onClick={() => onNavigate('matches')}
                className="flex-1 py-1.5 rounded-full bg-[#191d18] text-white font-bold text-xs text-center border border-white/10 hover:bg-[#232821]"
              >
                Resume/History
              </button>
            </div>
          </div>

          {/* Tile 2: Tournaments */}
          <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-5 flex flex-col justify-between shadow-md hover:border-white/20 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-2xl bg-[#191d18] border border-[#2e342c] flex items-center justify-center text-amber-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-slate-400 font-bold">
                  {tournaments.length} Tourneys
                </span>
              </div>
              <h3 className="text-base font-black text-white">Tournaments</h3>
              <p className="text-xs text-slate-400 mt-1">
                {runningTournamentsCount} running · {finishedTournamentsCount} finished
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
              <button
                onClick={() => onNavigate('tournaments')}
                className="flex-1 py-1.5 rounded-full bg-[#c3f400] text-black font-black text-xs text-center hover:bg-[#d4ff1a]"
              >
                New Tournament
              </button>
              <button
                onClick={() => onNavigate('tournaments')}
                className="flex-1 py-1.5 rounded-full bg-[#191d18] text-white font-bold text-xs text-center border border-white/10 hover:bg-[#232821]"
              >
                Resume
              </button>
            </div>
          </div>

          {/* Tile 3: Teams */}
          <div 
            onClick={() => onNavigate('teams')}
            className="bg-[#141814] border border-[#272b26] rounded-3xl p-5 flex flex-col justify-between shadow-md hover:border-white/20 transition-all cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-2xl bg-[#191d18] border border-[#2e342c] flex items-center justify-center text-sky-400">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-slate-400 font-bold">
                  200+ Players
                </span>
              </div>
              <h3 className="text-base font-black text-white group-hover:text-[#c3f400] transition-colors">
                Teams &amp; Players
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                10 Nations database, form stars, squad builder &amp; profiles
              </p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-xs font-bold text-slate-400 group-hover:text-white">
              <span>View Database</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Tile 4: Sheets */}
          <div 
            onClick={() => onNavigate('sheets')}
            className="bg-[#141814] border border-[#272b26] rounded-3xl p-5 flex flex-col justify-between shadow-md hover:border-white/20 transition-all cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-2xl bg-[#191d18] border border-[#2e342c] flex items-center justify-center text-[#c3f400]">
                  <Table className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-slate-400 font-bold">
                  12 Sheets
                </span>
              </div>
              <h3 className="text-base font-black text-white group-hover:text-[#c3f400] transition-colors">
                Sheets &amp; Roll-a-Sheet
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                HSG, NSG, LSG master sheets, purple row F &amp; power grids
              </p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-xs font-bold text-slate-400 group-hover:text-white">
              <span>Explore Sheets</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Tile 5: Customise */}
          <div 
            onClick={() => onNavigate('customise')}
            className="bg-[#141814] border border-[#272b26] rounded-3xl p-5 flex flex-col justify-between shadow-md hover:border-white/20 transition-all cursor-pointer group sm:col-span-2 lg:col-span-1"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-2xl bg-[#191d18] border border-[#2e342c] flex items-center justify-center text-purple-400">
                  <Settings className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-slate-400 font-bold">
                  6 Themes
                </span>
              </div>
              <h3 className="text-base font-black text-white group-hover:text-[#c3f400] transition-colors">
                Customise
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Themes, scoring layouts (Split/Pitch/Face-to-face), scorer mode
              </p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-xs font-bold text-slate-400 group-hover:text-white">
              <span>Customise Arena</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Your Data Section (Section 3.4 & Section 16) */}
      <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-[#c3f400]" />
              <span>Your Data, Backup &amp; Device Storage</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              100% on-device storage (no cloud server needed). Export, restore, or reset anytime.
            </p>
          </div>
          <div className="text-right text-[11px] text-slate-400 font-mono">
            Last backup: {daysSinceBackup === 0 ? "Today" : `${daysSinceBackup} days ago`}
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Backup Button */}
          <button
            onClick={() => handleBackupDownload(true)}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#191d18] hover:bg-[#232821] border border-white/10 text-xs font-bold text-white transition-all active:scale-[0.98]"
          >
            <Download className="w-4 h-4 text-[#c3f400]" />
            <span>Download JSON Backup</span>
          </button>

          {/* Restore Button with Hidden File Input */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#191d18] hover:bg-[#232821] border border-white/10 text-xs font-bold text-white transition-all active:scale-[0.98]"
          >
            <Upload className="w-4 h-4 text-sky-400" />
            <span>Restore from File</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleRestoreFile}
            accept=".json"
            className="hidden"
          />

          {/* Reset Data Button */}
          <button
            onClick={handleResetData}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-red-950/30 hover:bg-red-950/50 border border-red-500/30 text-xs font-bold text-red-300 transition-all active:scale-[0.98]"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
            <span>Reset All Data</span>
          </button>
        </div>

        {/* Auto-Backup Checkbox Option */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoBackupWeekly}
              onChange={handleToggleAutoBackup}
              className="w-4 h-4 rounded text-[#c3f400] focus:ring-0 bg-[#101410] border-white/20 cursor-pointer"
            />
            <span>Auto backup download once a week when Home opens</span>
          </label>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {matchToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#141814] border border-red-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-red-400">
              <Trash2 className="w-5 h-5" />
              <h3 className="text-base font-black text-white">Delete In-Progress Match?</h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete the match between <strong>{matchToDelete.teamA.code}</strong> and <strong>{matchToDelete.teamB.code}</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setMatchToDelete(null)}
                className="px-4 py-2 rounded-full text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMatch}
                className="px-5 py-2 rounded-full text-xs font-black bg-red-600 hover:bg-red-500 text-white uppercase tracking-wider"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
