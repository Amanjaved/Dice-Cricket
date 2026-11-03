import React, { useState } from 'react';
import type { MatchState, GroundType } from '../types';
import { storage } from '../services/storage';
import { soundEngine } from '../services/sound';
import { TEAMS_DATA } from '../../scripts/master_data.js';
import { calculatePlayerOfTheMatch } from '../components/VictoryModal';

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
  const [selectedGround, setSelectedGround] = useState<GroundType>('NSG');
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState<MatchState[]>(storage.getAllMatches());
  const [soundActive, setSoundActive] = useState<boolean>(soundEngine.enabled);
  const settings = storage.getSettings();

  const inProgressMatches = matches.filter(m => m.status === 'IN_PROGRESS' || m.status === 'TIE_SUPER_OVER');
  const activeMatch = inProgressMatches[0] || null;
  const recentCompleted = matches.filter(m => m.status === 'COMPLETED').slice(0, 3);

  const getSampleMatch = (): MatchState => {
    const pak = TEAMS_DATA.find(t => t.code === 'PAK') || TEAMS_DATA[2];
    const aus = TEAMS_DATA.find(t => t.code === 'AUS') || TEAMS_DATA[0];

    const matchObj: MatchState = {
      id: 'sample_sf2_completed',
      format: '10_overs',
      ground: 'NSG',
      teamA: pak as any,
      teamB: aus as any,
      teamASnapshotStars: 5,
      teamBSnapshotStars: 5,
      tossWinnerId: aus.id,
      tossDecision: 'bowl',
      battingFirstId: pak.id,
      bowlingFirstId: aus.id,
      innings1: {
        team: pak as any,
        score: 195,
        wickets: 6,
        completedOvers: 10,
        ballsInCurrentOver: 0,
        deliveries: [],
        battingCard: [
          { player: pak.players[0] as any, runs: 68, balls: 26, fours: 6, sixes: 4, isOut: true, strikeRate: 261.5, battingOrder: 1 },
          { player: pak.players[1] as any, runs: 42, balls: 18, fours: 3, sixes: 3, isOut: true, strikeRate: 233.3, battingOrder: 2 },
          { player: pak.players[2] as any, runs: 35, balls: 14, fours: 2, sixes: 2, isOut: false, strikeRate: 250.0, battingOrder: 3 },
          { player: pak.players[3] as any, runs: 18, balls: 8, fours: 2, sixes: 1, isOut: true, strikeRate: 225.0, battingOrder: 4 }
        ],
        bowlingFigures: [
          { player: aus.players[11] as any, overs: 2, maidens: 0, runsConceded: 32, wickets: 2, dots: 5, economy: 16.0 },
          { player: aus.players[15] as any, overs: 2, maidens: 0, runsConceded: 28, wickets: 3, dots: 6, economy: 14.0 }
        ],
        fallOfWickets: [],
        extras: { wides: 3, noBalls: 1, byes: 0, legByes: 2, total: 6 },
        strikerIndex: 0,
        nonStrikerIndex: 1,
        currentBowlerName: aus.players[11].name,
        lastBowlerName: null,
        isCompleted: true
      },
      innings2: {
        team: aus as any,
        score: 196,
        wickets: 7,
        completedOvers: 9,
        ballsInCurrentOver: 5,
        deliveries: [],
        battingCard: [
          { player: aus.players[0] as any, runs: 74, balls: 28, fours: 7, sixes: 5, isOut: false, strikeRate: 264.3, battingOrder: 1 },
          { player: aus.players[1] as any, runs: 38, balls: 15, fours: 3, sixes: 2, isOut: true, strikeRate: 253.3, battingOrder: 2 },
          { player: aus.players[2] as any, runs: 29, balls: 12, fours: 3, sixes: 1, isOut: true, strikeRate: 241.7, battingOrder: 3 }
        ],
        bowlingFigures: [
          { player: pak.players[12] as any, overs: 2, maidens: 0, runsConceded: 34, wickets: 2, dots: 4, economy: 17.0 },
          { player: pak.players[16] as any, overs: 2, maidens: 0, runsConceded: 36, wickets: 3, dots: 5, economy: 18.0 }
        ],
        fallOfWickets: [],
        extras: { wides: 4, noBalls: 1, byes: 1, legByes: 0, total: 6 },
        strikerIndex: 0,
        nonStrikerIndex: 1,
        currentBowlerName: pak.players[12].name,
        lastBowlerName: null,
        isCompleted: true
      },
      currentInningsNo: 2,
      targetRuns: 196,
      status: 'COMPLETED',
      winnerTeamId: aus.id,
      winDescription: 'Australia won by 3 wickets (1 ball remaining)!',
      isSuperOver: false,
      powerCardsRemaining: { [aus.id]: { reroll: 0, wonderfulShot: 0, greatDelivery: 0 }, [pak.id]: { reroll: 0, wonderfulShot: 0, greatDelivery: 0 } },
      startTime: Date.now() - 3600000
    };
    matchObj.playerOfTheMatch = calculatePlayerOfTheMatch(matchObj);
    return matchObj;
  };

  const handleToggleSound = () => {
    const next = !soundActive;
    soundEngine.enabled = next;
    setSoundActive(next);
    storage.saveSettings({ ...settings, soundEnabled: next });
  };

  const handleBackupDownload = () => {
    const jsonStr = storage.exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dice-cricket-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    storage.saveSettings({ ...settings, lastBackupTimestamp: Date.now() });
    alert("Match records and database successfully backed up!");
  };

  return (
    <div className="flex flex-col relative w-full pt-4 pb-20 bg-[#101410] max-w-screen-md mx-auto select-none antialiased">
      <div className="flex flex-col w-full px-4 gap-5">
        
        {/* Profile Header Card & Greeting matching Stitch */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#191d18] p-0.5 shadow-md border border-[#c3f400]/40">
              <img
                className="w-full h-full object-cover rounded-full"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1mbmKlNI1OFjKYnmcL1fqCFMOD9sp2rDTb0L9syNyyuNnC5pemphEml4i4t0lkyDUmoFZY6m5HSFM_QqaIy5wikRTgkgyVdxjiFiihBSe3IpY_dyxMR1iK1HsAkR1QqcBr2lgfhP5u5hN_uuG7GssESiGkW_1wvNcI-jxfzb-o1Bf37C7QnOXUklghHnQPMMGo7sqzVX18CHIM2tO3EHK19NLN6AGrM8cVYMjHpI"
                alt="Tanweer"
              />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#c3f400] rounded-full ring-2 ring-[#101410]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[#9ba394] text-[11px] font-semibold uppercase tracking-wider">
                Good Day!
              </span>
              <h2 className="text-white text-[18px] font-bold flex items-center gap-1.5 leading-tight">
                Tanweer
                <span className="text-[#101410] text-[10px] font-black px-2 py-0.5 rounded-full bg-[#c3f400]">
                  PRO
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onNavigate('sheets')}
              aria-label="Dice History"
              className="w-10 h-10 rounded-full bg-[#191d18] border border-[#2e342c] flex items-center justify-center text-white hover:bg-[#232821] transition-transform active:scale-95 shadow-sm"
              title="12 Master Sheets"
            >
              <span className="material-symbols-outlined text-[20px] text-[#c3f400]">casino</span>
            </button>
            <button
              onClick={() => onNavigate('teams')}
              aria-label="Teams database"
              className="w-10 h-10 rounded-full bg-[#191d18] border border-[#2e342c] flex items-center justify-center text-white hover:bg-[#232821] transition-transform active:scale-95 shadow-sm"
              title="Search Teams & Players"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative w-full">
          <div className="flex items-center bg-[#151914] rounded-full px-4 py-2.5 border border-[#2e342c] shadow-inner">
            <span className="material-symbols-outlined text-[#9ba394] text-[20px] mr-2">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams, dice presets, or tournament logs..."
              className="bg-transparent text-white placeholder:text-[#9ba394] text-[13px] w-full focus:outline-none"
            />
            <button
              onClick={() => onNavigate('customise')}
              className="w-7 h-7 rounded-full bg-[#2e342c] flex items-center justify-center text-white hover:text-[#c3f400] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
            </button>
          </div>
        </div>

        {/* Mode Category Chips Slider */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4">
          <button
            onClick={() => onStartQuickMatch('5_overs', selectedGround)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#c3f400] text-[#101410] font-sans text-[13px] font-bold whitespace-nowrap shadow-[0_0_18px_rgba(195,244,0,0.25)] transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">sports_cricket</span>
            <span>5 Overs (7-a-side)</span>
          </button>
          <button
            onClick={() => onStartQuickMatch('10_overs', selectedGround)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#191d18] border border-[#2e342c] text-white font-sans text-[13px] font-bold whitespace-nowrap hover:bg-[#232821] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-[#9ba394]">group</span>
            <span>10 Overs (XI)</span>
          </button>
          <button
            onClick={() => onNavigate('tournaments')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#191d18] border border-[#2e342c] text-white font-sans text-[13px] font-bold whitespace-nowrap hover:bg-[#232821] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-[#9ba394]">emoji_events</span>
            <span>Tournaments</span>
          </button>
          <button
            onClick={() => onNavigate('dpl')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#191d18] border border-[#2e342c] text-white font-sans text-[13px] font-bold whitespace-nowrap hover:bg-[#232821] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-[#9ba394]">military_tech</span>
            <span>DPL League</span>
          </button>
          <button
            onClick={() => onNavigate('sheets')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#191d18] border border-[#2e342c] text-white font-sans text-[13px] font-bold whitespace-nowrap hover:bg-[#232821] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-[#9ba394]">table_chart</span>
            <span>Sheets</span>
          </button>
        </div>

        {/* Hero Pitch Pulse Live Match Card */}
        <div className="relative w-full rounded-3xl bg-[#191d18] border border-[#2e3629] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Subtle ambient neon glow */}
          <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-[#c3f400]/10 blur-xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-36 h-36 rounded-full bg-[#c3f400]/5 blur-xl pointer-events-none" />

          {/* Top Tag Row */}
          <div className="flex items-center justify-between relative z-10 mb-4">
            <span className="bg-[#232821] text-[#c3f400] text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider border border-[#c3f400]/30">
              {activeMatch ? `${activeMatch.format.replace('_', ' ')} · Arena Match` : 'World Cup Grand Final'}
            </span>
            <div className="flex items-center gap-1.5 bg-[#0b0f0b]/90 px-3 py-1 rounded-full border border-red-500/30 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-beacon-pulse" />
              <span className="text-[10px] text-white uppercase font-extrabold tracking-widest">
                {activeMatch ? 'IN PROGRESS' : 'SPOTLIGHT'}
              </span>
            </div>
          </div>

          {/* Teams & Telemetry */}
          {activeMatch ? (
            <div className="flex items-center justify-between relative z-10 py-1">
              {/* Team 1 */}
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-14 h-14 rounded-2xl bg-[#0b0f0b] border border-[#2e342c] flex items-center justify-center p-1 shadow-md">
                  <span className="text-2xl">{activeMatch.innings1.team.code === 'IND' ? '🇮🇳' : '🏏'}</span>
                </div>
                <span className="text-[16px] text-white font-extrabold tracking-tight">
                  {activeMatch.innings1.team.code}
                </span>
                <span className="text-[10px] font-bold text-amber-400">
                  {activeMatch.innings1.team.printedStars}★
                </span>
              </div>

              {/* Center Score */}
              <div className="flex flex-col items-center justify-center px-2 flex-[1.4] text-center">
                <span className="bg-[#232821] text-[#9ba394] text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-1 tracking-wider uppercase">
                  {activeMatch.currentInningsNo === 1 ? '1st Innings' : '2nd Innings'}
                </span>
                <div className="text-[32px] font-black text-[#c3f400] tracking-tight leading-tight">
                  {activeMatch.currentInningsNo === 1
                    ? `${activeMatch.innings1.score}/${activeMatch.innings1.wickets}`
                    : `${activeMatch.innings2.score}/${activeMatch.innings2.wickets}`}
                </div>
                <span className="text-[12px] text-[#9ba394] font-semibold mt-0.5 font-mono">
                  {activeMatch.currentInningsNo === 1
                    ? `(${activeMatch.innings1.completedOvers}.${activeMatch.innings1.ballsInCurrentOver} ov)`
                    : `(${activeMatch.innings2.completedOvers}.${activeMatch.innings2.ballsInCurrentOver} ov)`}
                </span>
                {activeMatch.targetRuns && (
                  <div className="mt-2 bg-[#c3f400]/15 text-[#c3f400] border border-[#c3f400]/40 text-[11px] px-3 py-1 rounded-full font-bold shadow-sm whitespace-nowrap">
                    Target {activeMatch.targetRuns} · Need {Math.max(0, activeMatch.targetRuns - activeMatch.innings2.score)} runs
                  </div>
                )}
              </div>

              {/* Team 2 */}
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-14 h-14 rounded-2xl bg-[#0b0f0b] border border-[#2e342c] flex items-center justify-center p-1 shadow-md">
                  <span className="text-2xl">{activeMatch.innings2.team.code === 'AUS' ? '🇦🇺' : '🏏'}</span>
                </div>
                <span className="text-[16px] text-white font-extrabold tracking-tight">
                  {activeMatch.innings2.team.code}
                </span>
                <span className="text-[10px] font-bold text-amber-400">
                  {activeMatch.innings2.team.printedStars}★
                </span>
              </div>
            </div>
          ) : (
            /* Showcase Match (IND vs AUS Final) */
            <div className="flex items-center justify-between relative z-10 py-1">
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-14 h-14 rounded-2xl bg-[#0b0f0b] border border-[#c3f400]/30 flex items-center justify-center p-1 shadow-md">
                  <span className="text-2xl">🇮🇳</span>
                </div>
                <span className="text-[16px] text-white font-extrabold tracking-tight">IND</span>
                <div className="flex items-center gap-0.5 text-[#c3f400]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[13px]">star</span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center px-2 flex-[1.4] text-center">
                <span className="bg-[#232821] text-[#9ba394] text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-1 tracking-wider uppercase">
                  Grand Clash
                </span>
                <div className="text-[32px] font-black text-white tracking-tight leading-tight">
                  IND <span className="text-[#c3f400]">vs</span> AUS
                </div>
                <span className="text-[12px] text-[#9ba394] font-semibold mt-0.5">
                  10 Overs Final · Melbourne
                </span>
                <div className="mt-2 bg-[#c3f400]/15 text-[#c3f400] border border-[#c3f400]/40 text-[11px] px-3 py-1 rounded-full font-bold shadow-sm whitespace-nowrap">
                  12 Master Sheets · Full Powerplay
                </div>
              </div>

              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-14 h-14 rounded-2xl bg-[#0b0f0b] border border-[#2e342c] flex items-center justify-center p-1 shadow-md">
                  <span className="text-2xl">🇦🇺</span>
                </div>
                <span className="text-[16px] text-white font-extrabold tracking-tight">AUS</span>
                <div className="flex items-center gap-0.5 text-[#c3f400]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[13px]">star</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Match Details Pitch & Toss Row */}
          <div className="mt-4 pt-3 border-t border-[#232821] flex items-center justify-between text-[#9ba394] text-[11px] relative z-10">
            <div className="flex items-center gap-1.5 truncate">
              <span className="material-symbols-outlined text-[15px] text-[#c3f400]">sports</span>
              <span className="truncate">
                {activeMatch
                  ? `Toss: ${activeMatch.tossWinnerId === activeMatch.teamA.id ? activeMatch.teamA.code : activeMatch.teamB.code} elected to ${activeMatch.tossDecision}`
                  : 'Toss: Choice of Bat or Bowl'}
              </span>
            </div>
            <span className="font-bold whitespace-nowrap bg-[#232821] text-[#c3f400] px-2.5 py-0.5 rounded-full border border-[#c3f400]/20">
              Pitch: {activeMatch ? activeMatch.ground : selectedGround}
            </span>
          </div>

          {/* Sleek Tactile Neon Lime Resume / Start Match Button */}
          {activeMatch ? (
            <button
              onClick={() => onResumeMatch(activeMatch)}
              className="mt-4 w-full py-3.5 px-4 rounded-full bg-[#c3f400] hover:bg-[#d4ff1a] text-[#101410] text-[14px] font-black flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(195,244,0,0.35)] transition-all active:scale-[0.98] cursor-pointer animate-subtle-pulse"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#101410] animate-beacon-pulse" />
              <span className="material-symbols-outlined text-[20px]">play_circle</span>
              <span className="tracking-wide">RESUME LIVE MATCH</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('setup')}
              className="mt-4 w-full py-3.5 px-4 rounded-full bg-[#c3f400] hover:bg-[#d4ff1a] text-[#101410] text-[14px] font-black flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(195,244,0,0.35)] transition-all active:scale-[0.98] cursor-pointer animate-subtle-pulse"
            >
              <span className="material-symbols-outlined text-[20px]">sports_cricket</span>
              <span className="tracking-wide">START NEW CRICKET MATCH</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          )}
        </div>

        {/* Quick Play & Match Modes Section */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[17px] font-bold text-white flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#c3f400] text-[22px]">play_arrow</span>
              Quick Play &amp; Match Modes
            </h3>
            <span className="text-[11px] text-[#9ba394] uppercase tracking-wider font-bold">
              Arcade / Classic
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* 5 Overs Card with Ground Selector */}
            <div className="bg-[#191d18] border border-[#293024] rounded-3xl p-4 flex flex-col justify-between shadow-md hover:bg-[#232821] transition-colors">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-full bg-[#c3f400]/20 text-[#c3f400] flex items-center justify-center font-black text-[14px]">
                    5
                  </span>
                  <span className="bg-[#2e342c] text-[#9ba394] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    7-a-side
                  </span>
                </div>
                <h4 className="text-[16px] text-white font-black">Quick Blitz</h4>
                <p className="text-[11px] text-[#9ba394] mt-0.5">Rapid 30-ball chase</p>
              </div>

              <div className="mt-4 pt-3 bg-[#0b0f0b]/60 -mx-4 -mb-4 p-3 rounded-b-3xl">
                <span className="text-[10px] text-[#9ba394] uppercase tracking-wider block mb-1.5 font-bold">
                  Select Ground
                </span>
                <div className="flex items-center justify-between gap-1">
                  <button
                    onClick={() => { setSelectedGround('HSG'); onStartQuickMatch('5_overs', 'HSG'); }}
                    className={`flex-1 py-1 rounded-full text-[11px] text-center font-bold transition-all ${
                      selectedGround === 'HSG'
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'bg-red-950/60 text-red-300 hover:bg-red-900/60'
                    }`}
                  >
                    HSG Red
                  </button>
                  <button
                    onClick={() => { setSelectedGround('NSG'); onStartQuickMatch('5_overs', 'NSG'); }}
                    className={`flex-1 py-1 rounded-full text-[11px] text-center font-bold transition-all ${
                      selectedGround === 'NSG'
                        ? 'bg-[#c3f400] text-[#101410] shadow-sm'
                        : 'bg-[#232821] text-white hover:bg-[#2e342c]'
                    }`}
                  >
                    NSG Grn
                  </button>
                  <button
                    onClick={() => { setSelectedGround('LSG'); onStartQuickMatch('5_overs', 'LSG'); }}
                    className={`flex-1 py-1 rounded-full text-[11px] text-center font-bold transition-all ${
                      selectedGround === 'LSG'
                        ? 'bg-amber-400 text-[#101410] shadow-sm'
                        : 'bg-amber-950/60 text-amber-300 hover:bg-amber-900/60'
                    }`}
                  >
                    LSG Ylw
                  </button>
                </div>
              </div>
            </div>

            {/* 10 Overs Classic Card */}
            <div className="bg-[#191d18] border border-[#293024] rounded-3xl p-4 flex flex-col justify-between shadow-md hover:bg-[#232821] transition-colors">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-full bg-[#2e342c] text-white flex items-center justify-center font-black text-[14px]">
                    10
                  </span>
                  <span className="bg-[#c3f400]/20 text-[#c3f400] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    Standard XI
                  </span>
                </div>
                <h4 className="text-[16px] text-white font-black">10 Ov Classic</h4>
                <p className="text-[11px] text-[#9ba394] mt-0.5">Full Powerplay rules</p>
              </div>

              <div className="mt-4 pt-3 bg-[#0b0f0b]/60 -mx-4 -mb-4 p-3 rounded-b-3xl">
                <span className="text-[10px] text-[#9ba394] uppercase tracking-wider block mb-1.5 font-bold">
                  Rosters
                </span>
                <button
                  onClick={() => onStartQuickMatch('10_overs', selectedGround)}
                  className="w-full py-1.5 rounded-full bg-[#232821] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 hover:text-[#c3f400] transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#c3f400]">play_arrow</span>
                  <span>Play Standard 10 Ov</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Matches Section */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[17px] font-bold text-white flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#9ba394] text-[22px]">history</span>
              Recent Matches
            </h3>
            <button
              onClick={() => onNavigate('rankings')}
              className="text-[11px] text-[#c3f400] font-bold hover:underline"
            >
              View Ledger
            </button>
          </div>

          {/* Showcase or Recorded Match 1 */}
          <div
            onClick={() => onResumeMatch(recentCompleted[0] || getSampleMatch())}
            className="bg-[#191d18] border border-[#293024] hover:border-[#ccff00]/40 rounded-3xl p-4 flex flex-col gap-3 shadow-md hover:bg-[#232821] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="bg-[#0b0f0b] text-[#9ba394] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                Semi-Final 2 · Eden Gardens
              </span>
              <span className="text-[11px] text-[#ccff00] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-beacon-pulse" /> Completed
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0b0f0b] border border-[#2e342c] flex items-center justify-center text-[18px]">
                  🇵🇰
                </div>
                <div>
                  <div className="text-[15px] text-white font-bold leading-tight">PAK</div>
                  <div className="text-[11px] text-[#9ba394] font-mono">195/6 (10.0 ov)</div>
                </div>
              </div>
              <div className="flex flex-col items-center px-2">
                <span className="text-[10px] text-[#9ba394] font-bold">VS</span>
                <span className="material-symbols-outlined text-[#c3f400] text-[16px]">trending_flat</span>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div>
                  <div className="text-[15px] text-white font-bold leading-tight">AUS</div>
                  <div className="text-[11px] text-[#c3f400] font-mono font-semibold">196/7 (9.5 ov)</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#0b0f0b] border border-[#2e342c] flex items-center justify-center text-[18px]">
                  🇦🇺
                </div>
              </div>
            </div>
            <div className="bg-[#0b0f0b]/80 px-3 py-2 rounded-2xl flex items-center justify-between text-[11px]">
              <span className="text-[#c3f400] font-bold">AUS won by 3 wickets (1 ball remaining)</span>
              <span className="text-[#9ba394] font-semibold">Scorecard &gt;</span>
            </div>
          </div>

          {/* Match 2 */}
          <div className="bg-[#191d18] border border-[#293024] rounded-3xl p-4 flex flex-col gap-3 shadow-md hover:bg-[#232821] transition-colors">
            <div className="flex items-center justify-between">
              <span className="bg-[#0b0f0b] text-[#9ba394] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                Super 8 · Lords Ground
              </span>
              <span className="text-[11px] text-[#9ba394] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9ba394]" /> Completed
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0b0f0b] border border-[#2e342c] flex items-center justify-center text-[18px]">
                  🏴󠁧󠁢󠁥󠁮󠁧󠁿
                </div>
                <div>
                  <div className="text-[15px] text-white font-bold leading-tight">ENG</div>
                  <div className="text-[11px] text-[#9ba394] font-mono">142/8 (10.0 ov)</div>
                </div>
              </div>
              <div className="flex flex-col items-center px-2">
                <span className="text-[10px] text-[#9ba394] font-bold">VS</span>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div>
                  <div className="text-[15px] text-white font-bold leading-tight">SA</div>
                  <div className="text-[11px] text-[#c3f400] font-mono font-semibold">145/4 (8.1 ov)</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#0b0f0b] border border-[#2e342c] flex items-center justify-center text-[18px]">
                  🇿🇦
                </div>
              </div>
            </div>
            <div className="bg-[#0b0f0b]/80 px-3 py-2 rounded-2xl flex items-center justify-between text-[11px]">
              <span className="text-[#9ba394] font-semibold">South Africa won by 6 wickets</span>
              <span className="text-[#9ba394] font-semibold">Scorecard &gt;</span>
            </div>
          </div>
        </div>

        {/* Quick Tools & Management Bento Grid matching Stitch */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[17px] font-bold text-white flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#c3f400] text-[22px]">build_circle</span>
              Dice King Vault &amp; Tools
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {/* Tool 1: Master Sheets */}
            <button
              onClick={() => onNavigate('sheets')}
              className="bg-[#191d18] border border-[#293024] rounded-3xl p-3 flex flex-col items-center text-center gap-2 hover:bg-[#232821] transition-transform active:scale-95 shadow-sm"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#232821] flex items-center justify-center text-[#c3f400] shadow-inner">
                <span className="material-symbols-outlined text-[24px]">description</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] text-white font-bold leading-tight">12 Master</span>
                <span className="text-[10px] text-[#9ba394]">Sheets Log</span>
              </div>
            </button>

            {/* Tool 2: DRS & Rules */}
            <button
              onClick={() => onNavigate('rulebook')}
              className="bg-[#191d18] border border-[#293024] rounded-3xl p-3 flex flex-col items-center text-center gap-2 hover:bg-[#232821] transition-transform active:scale-95 shadow-sm"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#232821] flex items-center justify-center text-red-400 shadow-inner">
                <span className="material-symbols-outlined text-[24px]">gavel</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] text-white font-bold leading-tight">DRS &amp; Rule</span>
                <span className="text-[10px] text-[#9ba394]">Codex 2026</span>
              </div>
            </button>

            {/* Tool 3: Backup Data Center */}
            <button
              onClick={handleBackupDownload}
              className="bg-[#191d18] border border-[#293024] rounded-3xl p-3 flex flex-col items-center text-center gap-2 hover:bg-[#232821] transition-transform active:scale-95 shadow-sm relative"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#232821] flex items-center justify-center text-[#c3f400] shadow-inner">
                <span className="material-symbols-outlined text-[24px]">cloud_sync</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] text-white font-bold leading-tight">Backup</span>
                <span className="text-[10px] text-[#c3f400] font-semibold">Auto Ready</span>
              </div>
            </button>
          </div>
        </div>

        {/* Stadium Atmosphere Mini Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-[#191d18] border border-[#293024] p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#c3f400] flex items-center justify-center text-[#101410]">
              <span className="material-symbols-outlined text-[22px]">volume_up</span>
            </div>
            <div>
              <h5 className="text-white text-[13px] font-bold">Faiz Sound Engine Active</h5>
              <p className="text-[#9ba394] text-[11px]">Crowd chants, dice rolls, boundary roar</p>
            </div>
          </div>
          <div
            onClick={handleToggleSound}
            className={`w-9 h-5 rounded-full relative p-0.5 cursor-pointer transition-colors ${
              soundActive ? 'bg-[#c3f400]' : 'bg-[#2e342c]'
            }`}
          >
            <div
              className={`w-4 h-4 bg-[#101410] rounded-full transition-transform ${
                soundActive ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
export default HomeView;
