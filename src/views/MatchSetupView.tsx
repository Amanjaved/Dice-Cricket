// src/views/MatchSetupView.tsx
import React, { useState } from 'react';
import { Shield, Sparkles, Trophy, ChevronRight, Check, ArrowUpDown, Shuffle, CircleDollarSign } from 'lucide-react';
import type { Team, Player, MatchFormat, GroundType, MatchState } from '../types';
import { storage } from '../services/storage';
import { soundEngine } from '../services/sound';

interface MatchSetupViewProps {
  initialFormat?: MatchFormat;
  initialGround?: GroundType;
  onMatchCreated: (match: MatchState) => void;
  onCancel: () => void;
}

export const MatchSetupView: React.FC<MatchSetupViewProps> = ({
  initialFormat = '5_overs',
  initialGround = 'NSG',
  onMatchCreated,
  onCancel
}) => {
  const allTeams = storage.getAllTeams();

  const [format, setFormat] = useState<MatchFormat>(initialFormat);
  const [ground, setGround] = useState<GroundType>(initialGround);

  const [teamAId, setTeamAId] = useState<string>("IND");
  const [teamBId, setTeamBId] = useState<string>("PAK");

  const [step, setStep] = useState<'config' | 'squads' | 'toss'>('config');

  const teamA = allTeams.find(t => t.id === teamAId) || allTeams[0];
  const teamB = allTeams.find(t => t.id === teamBId) || allTeams[1];

  const is5Overs = format === '5_overs';
  const squadSize = is5Overs ? 7 : 11;

  // Squad selection
  const [teamASquad, setTeamASquad] = useState<Player[]>(() => {
    const names = is5Overs ? teamA.suggested7 : teamA.suggestedXI;
    return names.map(n => teamA.players.find(p => p.name === n)!);
  });

  const [teamBSquad, setTeamBSquad] = useState<Player[]>(() => {
    const names = is5Overs ? teamB.suggested7 : teamB.suggestedXI;
    return names.map(n => teamB.players.find(p => p.name === n)!);
  });

  // Captains
  const [teamACaptain, setTeamACaptain] = useState<string>(teamA.captain);
  const [teamBCaptain, setTeamBCaptain] = useState<string>(teamB.captain);

  // Toss State
  const [tossFlipping, setTossFlipping] = useState(false);
  const [tossWinnerId, setTossWinnerId] = useState<string | null>(null);
  const [tossDecision, setTossDecision] = useState<'bat' | 'bowl'>('bat');

  const handleUpdateFormat = (newFmt: MatchFormat) => {
    setFormat(newFmt);
    const newSize = newFmt === '5_overs' ? 7 : 11;
    const aNames = newFmt === '5_overs' ? teamA.suggested7 : teamA.suggestedXI;
    const bNames = newFmt === '5_overs' ? teamB.suggested7 : teamB.suggestedXI;
    setTeamASquad(aNames.map(n => teamA.players.find(p => p.name === n)!));
    setTeamBSquad(bNames.map(n => teamB.players.find(p => p.name === n)!));
  };

  const handleFlipToss = () => {
    setTossFlipping(true);
    soundEngine.playDiceRoll();
    setTimeout(() => {
      const winner = Math.random() > 0.5 ? teamA.id : teamB.id;
      setTossWinnerId(winner);
      setTossFlipping(false);
      soundEngine.playDrsChime();
    }, 700);
  };

  const handleCreateMatch = () => {
    const battingFirstId = (tossWinnerId === teamA.id)
      ? (tossDecision === 'bat' ? teamA.id : teamB.id)
      : (tossDecision === 'bat' ? teamB.id : teamA.id);

    const bowlingFirstId = battingFirstId === teamA.id ? teamB.id : teamA.id;

    const batTeam = battingFirstId === teamA.id ? teamA : teamB;
    const bowlTeam = battingFirstId === teamA.id ? teamB : teamA;

    const batSquad = battingFirstId === teamA.id ? teamASquad : teamBSquad;
    const bowlSquad = battingFirstId === teamA.id ? teamBSquad : teamASquad;

    const initInnings = (t: Team, sq: Player[]) => ({
      team: t,
      score: 0,
      wickets: 0,
      completedOvers: 0,
      ballsInCurrentOver: 0,
      deliveries: [],
      battingCard: sq.map((p, idx) => ({
        player: p,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false,
        strikeRate: 0,
        battingOrder: idx + 1
      })),
      bowlingFigures: sq.filter(p => p.bowl !== null).map(p => ({
        player: p,
        overs: 0,
        maidens: 0,
        runsConceded: 0,
        wickets: 0,
        dots: 0,
        economy: 0
      })),
      fallOfWickets: [],
      extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, total: 0 },
      strikerIndex: 0,
      nonStrikerIndex: 1,
      currentBowlerName: null,
      lastBowlerName: null,
      isCompleted: false
    });

    const match: MatchState = {
      id: `match_${Date.now()}`,
      format,
      ground,
      teamA,
      teamB,
      teamASnapshotStars: teamA.printedStars,
      teamBSnapshotStars: teamB.printedStars,
      tossWinnerId: tossWinnerId || teamA.id,
      tossDecision,
      battingFirstId,
      bowlingFirstId,
      innings1: initInnings(batTeam, batSquad),
      innings2: initInnings(bowlTeam, bowlSquad),
      currentInningsNo: 1,
      targetRuns: null,
      status: 'IN_PROGRESS',
      isSuperOver: false,
      powerCardsRemaining: {
        [teamA.id]: {
          reroll: 1,
          wonderfulShot: ["BAT", "BTBW", "BTAL", "WK"].includes(teamA.players.find(p => p.name === teamACaptain)?.role || "") ? 2 : 0,
          greatDelivery: ["BW", "BWAL"].includes(teamA.players.find(p => p.name === teamACaptain)?.role || "") ? 2 : 0
        },
        [teamB.id]: {
          reroll: 1,
          wonderfulShot: ["BAT", "BTBW", "BTAL", "WK"].includes(teamB.players.find(p => p.name === teamBCaptain)?.role || "") ? 2 : 0,
          greatDelivery: ["BW", "BWAL"].includes(teamB.players.find(p => p.name === teamBCaptain)?.role || "") ? 2 : 0
        }
      },
      startTime: Date.now()
    };

    storage.saveMatch(match);
    onMatchCreated(match);
  };

  const starDomDiff = teamA.printedStars - teamB.printedStars;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6 select-none animate-fadeIn">
      {/* Stepper Header */}
      <div className="flex items-center justify-between border-b border-[#272b26] pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#c3f400] bg-[#c3f400]/10 px-2.5 py-0.5 rounded-full">
            Match Protocol
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            New Match Configuration
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {['config', 'squads', 'toss'].map((s, idx) => (
            <div
              key={s}
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                step === s
                  ? "bg-[#c3f400] text-black shadow-lg shadow-[#c3f400]/25"
                  : "bg-[#1d211c] text-slate-400"
              }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: CONFIGURATION (Format, Ground, Teams) */}
      {step === 'config' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Format Picker */}
          <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-5 shadow-xl space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-300 block">
              1. Select Match Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: '5_overs', title: '5 Overs · 7-a-side', sub: '6 wkts all out · 2 bowlers get 2 ov' },
                { id: '10_overs', title: '10 Overs · Playing 11', sub: '10 wkts all out · Max 2 ov each' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => handleUpdateFormat(f.id as MatchFormat)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    format === f.id
                      ? "bg-[#272b26] border-[#c3f400] shadow-md shadow-[#c3f400]/15"
                      : "bg-[#1d211c] border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="font-bold text-sm text-white">{f.title}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{f.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Ground Picker */}
          <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-5 shadow-xl space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-300 block">
              2. Select Ground &amp; Pitch Condition
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'HSG', name: 'High Scoring (HSG)', desc: 'Red · Few dots, boundaries galore', color: '#ef4444' },
                { id: 'NSG', name: 'Normal Scoring (NSG)', desc: 'Green · The classic balanced pitch', color: '#22c55e' },
                { id: 'LSG', name: 'Low Scoring (LSG)', desc: 'Yellow · High wickets, hard boundaries', color: '#eab308' }
              ].map(g => (
                <button
                  key={g.id}
                  onClick={() => setGround(g.id as GroundType)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    ground === g.id
                      ? "bg-[#272b26] border-[#c3f400] shadow-md"
                      : "bg-[#1d211c] border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                    <span>{g.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-snug">{g.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Teams Picker */}
          <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-5 shadow-xl space-y-4">
            <label className="text-xs font-black uppercase tracking-wider text-slate-300 block">
              3. Select Competing Nations
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Team A */}
              <div>
                <span className="text-[11px] text-slate-400 font-bold block mb-1">TEAM A</span>
                <select
                  value={teamAId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setTeamAId(id);
                    const t = allTeams.find(x => x.id === id)!;
                    setTeamASquad((is5Overs ? t.suggested7 : t.suggestedXI).map(n => t.players.find(p => p.name === n)!));
                    setTeamACaptain(t.captain);
                  }}
                  className="w-full bg-[#1d211c] border border-white/10 text-white text-sm font-bold rounded-2xl p-3 outline-none focus:border-[#c3f400]"
                >
                  {allTeams.map(t => (
                    <option key={t.id} value={t.id} disabled={t.id === teamBId} className="bg-[#141814]">
                      {t.name} ({t.printedStars}★)
                    </option>
                  ))}
                </select>
              </div>

              {/* Team B */}
              <div>
                <span className="text-[11px] text-slate-400 font-bold block mb-1">TEAM B</span>
                <select
                  value={teamBId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setTeamBId(id);
                    const t = allTeams.find(x => x.id === id)!;
                    setTeamBSquad((is5Overs ? t.suggested7 : t.suggestedXI).map(n => t.players.find(p => p.name === n)!));
                    setTeamBCaptain(t.captain);
                  }}
                  className="w-full bg-[#1d211c] border border-white/10 text-white text-sm font-bold rounded-2xl p-3 outline-none focus:border-[#c3f400]"
                >
                  {allTeams.map(t => (
                    <option key={t.id} value={t.id} disabled={t.id === teamAId} className="bg-[#141814]">
                      {t.name} ({t.printedStars}★)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Star Dominance Preview Banner */}
            <div className="bg-[#1c221b] border border-white/10 rounded-2xl p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c3f400]" />
                <span className="font-bold text-white">Star Dominance Preview:</span>
                <span className="text-slate-300">
                  {starDomDiff === 0 
                    ? `★ ${teamA.code} ${teamA.printedStars}★ vs ${teamB.code} ${teamB.printedStars}★ · Equal stars: even match (4★ line on Row F)`
                    : starDomDiff > 0
                    ? `★ ${teamA.code} dominates on stars (${teamA.printedStars}★ vs ${teamB.printedStars}★) · Unlocks 5★ bowling line`
                    : `★ ${teamB.code} dominates on stars (${teamB.printedStars}★ vs ${teamA.printedStars}★) · Unlocks 5★ bowling line`}
                </span>
              </div>
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => setStep('squads')}
              className="px-8 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-[#c3f400] text-black hover:bg-[#d4ff1a] transition-transform active:scale-95 shadow-xl shadow-[#c3f400]/20 flex items-center gap-2"
            >
              <span>Continue to Lineup ({squadSize} Players)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SQUAD & LINEUP */}
      {step === 'squads' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Team A Lineup */}
            <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: teamA.color }} />
                  <span className="font-black text-white text-sm">{teamA.name} Lineup</span>
                </div>
                <span className="text-xs font-bold font-mono text-[#c3f400]">{squadSize} Players</span>
              </div>

              <div className="space-y-1.5 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                {teamASquad.map((p, idx) => (
                  <div key={p.no} className="p-2 bg-[#1d211c] border border-white/5 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-500 w-4 font-bold">{idx + 1}</span>
                      <span className="font-bold text-white">{p.name}</span>
                      {p.name === teamACaptain && <span className="bg-blue-400/20 text-blue-300 text-[9px] px-1 rounded font-bold">C</span>}
                      {p.marks.includes('★') && <span className="text-amber-300 text-[10px]">★</span>}
                      {p.marks.includes('F') && <span className="bg-emerald-400/20 text-emerald-300 text-[9px] px-1 rounded">F</span>}
                    </div>
                    <span className="text-slate-400 text-[11px]">{p.role} · {p.bat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Team B Lineup */}
            <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: teamB.color }} />
                  <span className="font-black text-white text-sm">{teamB.name} Lineup</span>
                </div>
                <span className="text-xs font-bold font-mono text-[#c3f400]">{squadSize} Players</span>
              </div>

              <div className="space-y-1.5 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                {teamBSquad.map((p, idx) => (
                  <div key={p.no} className="p-2 bg-[#1d211c] border border-white/5 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-500 w-4 font-bold">{idx + 1}</span>
                      <span className="font-bold text-white">{p.name}</span>
                      {p.name === teamBCaptain && <span className="bg-blue-400/20 text-blue-300 text-[9px] px-1 rounded font-bold">C</span>}
                      {p.marks.includes('★') && <span className="text-amber-300 text-[10px]">★</span>}
                      {p.marks.includes('F') && <span className="bg-emerald-400/20 text-emerald-300 text-[9px] px-1 rounded">F</span>}
                    </div>
                    <span className="text-slate-400 text-[11px]">{p.role} · {p.bat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setStep('config')}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-400 hover:text-white"
            >
              ← Back to Config
            </button>
            <button
              onClick={() => setStep('toss')}
              className="px-8 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-[#c3f400] text-black hover:bg-[#d4ff1a] transition-transform active:scale-95 shadow-xl shadow-[#c3f400]/20 flex items-center gap-2"
            >
              <span>Proceed to Coin Toss</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: COIN TOSS */}
      {step === 'toss' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#c3f400] bg-[#c3f400]/10 px-3 py-1 rounded-full mb-3">
              Match Stage: Coin Toss
            </span>

            <h2 className="text-xl font-black text-white">
              The Official Coin Toss
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Captain {teamA.captain} ({teamA.name}) vs Captain {teamB.captain} ({teamB.name})
            </p>

            {/* Coin Animation */}
            <div className="my-6">
              <div
                onClick={!tossWinnerId ? handleFlipToss : undefined}
                className={`w-28 h-28 rounded-full border-4 border-amber-400 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.4)] cursor-pointer transition-transform ${
                  tossFlipping ? 'animate-spin scale-110' : 'hover:scale-105 active:scale-95'
                }`}
              >
                <div className="text-center">
                  <CircleDollarSign className="w-8 h-8 text-[#141814] mx-auto" />
                  <span className="text-[10px] font-black text-[#141814] uppercase tracking-wider block">
                    {tossWinnerId ? (tossWinnerId === teamA.id ? teamA.code : teamB.code) : "FLIP"}
                  </span>
                </div>
              </div>
            </div>

            {/* Toss Outcome Reveal */}
            {tossWinnerId && (
              <div className="bg-[#1d211c] border border-[#c3f400] p-4 rounded-2xl w-full max-w-md animate-bounce mb-4">
                <span className="text-[11px] font-black text-[#c3f400] uppercase tracking-wider block">
                  Toss Winner
                </span>
                <span className="text-base font-black text-white">
                  {tossWinnerId === teamA.id ? teamA.name : teamB.name} won the toss!
                </span>

                <div className="mt-3 flex items-center justify-center gap-3">
                  <span className="text-xs text-slate-300 font-bold">Elected to:</span>
                  <button
                    onClick={() => setTossDecision('bat')}
                    className={`px-4 py-1.5 rounded-full text-xs font-black uppercase transition-all ${
                      tossDecision === 'bat'
                        ? 'bg-[#c3f400] text-black shadow-md'
                        : 'bg-[#101410] text-slate-400'
                    }`}
                  >
                    BAT FIRST
                  </button>
                  <button
                    onClick={() => setTossDecision('bowl')}
                    className={`px-4 py-1.5 rounded-full text-xs font-black uppercase transition-all ${
                      tossDecision === 'bowl'
                        ? 'bg-[#c3f400] text-black shadow-md'
                        : 'bg-[#101410] text-slate-400'
                    }`}
                  >
                    BOWL FIRST
                  </button>
                </div>
              </div>
            )}

            {!tossWinnerId ? (
              <button
                disabled={tossFlipping}
                onClick={handleFlipToss}
                className="px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-black hover:bg-yellow-300 transition-transform active:scale-95 shadow-xl shadow-amber-400/25"
              >
                {tossFlipping ? "Flipping Coin..." : "Flip the Coin"}
              </button>
            ) : (
              <button
                onClick={handleCreateMatch}
                className="px-10 py-4 rounded-full text-sm font-black uppercase tracking-wider bg-[#c3f400] text-black hover:bg-[#d4ff1a] transition-transform active:scale-95 shadow-2xl shadow-[#c3f400]/30"
              >
                Enter Live Scoring Arena →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
