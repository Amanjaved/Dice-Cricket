import React, { useState } from 'react';
import { Share2, Printer, ArrowLeft, Trophy, Award, Sparkles } from 'lucide-react';
import type { MatchState, InningsState } from '../types';
import { calculatePlayerOfTheMatch } from '../components/VictoryModal';

interface ScorecardViewProps {
  match: MatchState;
  onBack: () => void;
}

export const ScorecardView: React.FC<ScorecardViewProps> = ({ match, onBack }) => {
  const [activeInningsTab, setActiveInningsTab] = useState<1 | 2>(1);

  const inn1 = match.innings1;
  const inn2 = match.innings2;
  const activeInn = activeInningsTab === 1 ? inn1 : inn2;

  const potm = match.status === 'COMPLETED'
    ? (match.playerOfTheMatch || calculatePlayerOfTheMatch(match))
    : null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Dice Cricket King: ${match.teamA.code} vs ${match.teamB.code}`,
        text: `Match Scorecard: ${inn1.team.code} ${inn1.score}/${inn1.wickets} vs ${inn2.team.code} ${inn2.score}/${inn2.wickets}. ${match.winDescription || ''}`
      }).catch(() => {});
    } else {
      alert("Scorecard summary copied to clipboard!");
      navigator.clipboard?.writeText(
        `Dice Cricket King: ${inn1.team.code} ${inn1.score}/${inn1.wickets} vs ${inn2.team.code} ${inn2.score}/${inn2.wickets} (${match.ground})`
      );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-5 select-none animate-fadeIn pb-24 print:bg-white print:text-black print:p-0">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#272b26] pb-3 print:hidden">
        <button
          onClick={onBack}
          className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live Arena</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-3.5 py-1.5 rounded-full bg-[#1d211c] hover:bg-[#272b26] text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 border border-white/10 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-full bg-[#1d211c] hover:bg-[#272b26] text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 border border-white/10 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Match Result Banner */}
      <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-5 shadow-xl print:border-black print:shadow-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-[#c3f400] print:text-black">
              Official Match Scorecard · {match.format.replace('_', ' ')} · {match.ground} Ground
            </div>
            <h1 className="text-xl font-black text-white mt-1 print:text-black">
              {match.teamA.name} vs {match.teamB.name}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 print:text-slate-700">
              {match.winDescription || "Match in progress"}
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm font-bold text-white font-mono print:text-black">
              {inn1.team.code} {inn1.score}/{inn1.wickets} ({inn1.completedOvers}.{inn1.ballsInCurrentOver} ov)
            </div>
            <div className="text-sm font-bold text-white font-mono mt-0.5 print:text-black">
              {inn2.team.code} {inn2.score}/{inn2.wickets} ({inn2.completedOvers}.{inn2.ballsInCurrentOver} ov)
            </div>
          </div>
        </div>
      </div>

      {/* Player of the Match Banner in Scorecard */}
      {potm && (
        <div className="bg-gradient-to-r from-[#1c180f] via-[#241e12] to-[#1c180f] border border-amber-400/40 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg print:border-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black text-lg flex items-center justify-center shrink-0 shadow-md">
              <Award className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.2 rounded-full border border-amber-400/30">
                  PLAYER OF THE MATCH
                </span>
                <span className="text-xs font-black text-white">{potm.name}</span>
                <span className="text-[10px] text-amber-300 font-bold">({potm.teamCode})</span>
                <span className="text-[10px] text-slate-400 font-mono">· {potm.role}</span>
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5 font-semibold">
                {potm.headline}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {potm.batting && (potm.batting.runs > 0 || potm.batting.balls > 0) && (
              <span className="text-[10px] font-mono text-[#c3f400] font-bold bg-[#101410] px-2 py-0.5 rounded-full border border-[#c3f400]/30">
                🏏 {potm.batting.runs}{potm.batting.notOut ? '*' : ''}r ({potm.batting.balls}b)
              </span>
            )}
            {potm.bowling && (potm.bowling.wickets > 0 || potm.bowling.overs > 0) && (
              <span className="text-[10px] font-mono text-amber-300 font-bold bg-[#101410] px-2 py-0.5 rounded-full border border-amber-400/30">
                🎯 {potm.bowling.wickets}w/{potm.bowling.runsConceded}
              </span>
            )}
            <span className="text-[10px] font-mono text-white font-bold bg-[#101410] px-2.5 py-0.5 rounded-full border border-white/10">
              ★ {potm.fantasyPoints} Rating
            </span>
          </div>
        </div>
      )}

      {/* Innings Switcher Tabs */}
      <div className="flex border-b border-[#272b26] gap-3 print:hidden">
        <button
          onClick={() => setActiveInningsTab(1)}
          className={`pb-2 text-xs font-black uppercase tracking-wider transition-all relative ${
            activeInningsTab === 1 ? 'text-[#c3f400]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>1st Innings ({inn1.team.name})</span>
          {activeInningsTab === 1 && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c3f400]" />
          )}
        </button>
        <button
          onClick={() => setActiveInningsTab(2)}
          className={`pb-2 text-xs font-black uppercase tracking-wider transition-all relative ${
            activeInningsTab === 2 ? 'text-[#c3f400]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>2nd Innings ({inn2.team.name})</span>
          {activeInningsTab === 2 && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c3f400]" />
          )}
        </button>
      </div>

      {/* Innings Batting Table */}
      <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-5 shadow-xl space-y-4 print:border-black print:shadow-none">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h2 className="text-sm font-black text-white uppercase tracking-wider print:text-black">
            Batting Scorecard — {activeInn.team.name}
          </h2>
          <span className="text-xs font-mono font-bold text-[#c3f400] print:text-black">
            {activeInn.score}/{activeInn.wickets} ({activeInn.completedOvers}.{activeInn.ballsInCurrentOver} ov)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase font-bold print:text-slate-700">
                <th className="py-2">Batter</th>
                <th className="py-2">Dismissal</th>
                <th className="py-2 text-right">R</th>
                <th className="py-2 text-right">B</th>
                <th className="py-2 text-right">4s</th>
                <th className="py-2 text-right">6s</th>
                <th className="py-2 text-right">SR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {activeInn.battingCard.map((b, idx) => (
                <tr key={idx} className="hover:bg-white/5 text-slate-200 print:text-black">
                  <td className="py-2.5 font-bold">
                    <span className="text-white print:text-black">{b.player.name}</span>
                    {b.player.marks.includes('C') && <span className="text-blue-400 ml-1 text-[10px]">(c)</span>}
                    {b.player.marks.includes('WK') && <span className="text-emerald-400 ml-1 text-[10px]">(wk)</span>}
                  </td>
                  <td className="py-2.5 text-slate-400 text-[11px] print:text-slate-600">
                    {b.isOut ? (
                      b.dismissalBowler ? `${b.dismissal} b ${b.dismissalBowler}` : b.dismissal
                    ) : (
                      <span className="text-emerald-400 font-bold print:text-black">not out</span>
                    )}
                  </td>
                  <td className="py-2.5 text-right font-mono font-black text-white print:text-black">{b.runs}</td>
                  <td className="py-2.5 text-right font-mono text-slate-400 print:text-slate-700">{b.balls}</td>
                  <td className="py-2.5 text-right font-mono text-slate-400 print:text-slate-700">{b.fours}</td>
                  <td className="py-2.5 text-right font-mono text-slate-400 print:text-slate-700">{b.sixes}</td>
                  <td className="py-2.5 text-right font-mono font-bold text-[#c3f400] print:text-black">{b.strikeRate.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Extras Summary */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div>
            Extras: <strong className="text-white print:text-black">{activeInn.extras.total}</strong> (w {activeInn.extras.wides}, nb {activeInn.extras.noBalls}, b {activeInn.extras.byes}, lb {activeInn.extras.legByes})
          </div>
          <div>
            Total: <strong className="text-base font-black text-white font-mono ml-2 print:text-black">{activeInn.score}/{activeInn.wickets}</strong>
          </div>
        </div>

        {/* Fall of Wickets */}
        {activeInn.fallOfWickets.length > 0 && (
          <div className="pt-2 border-t border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Fall of Wickets
            </span>
            <div className="text-[11px] text-slate-300 flex flex-wrap gap-x-3 gap-y-1 font-mono">
              {activeInn.fallOfWickets.map((f, i) => (
                <span key={i}>
                  {f.score}-{f.wicketNo} ({f.player}, {f.overs} ov)
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Innings Bowling Table */}
      <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-5 shadow-xl space-y-4 print:border-black print:shadow-none">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h2 className="text-sm font-black text-white uppercase tracking-wider print:text-black">
            Bowling Attack — {activeInningsTab === 1 ? inn2.team.name : inn1.team.name}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase font-bold print:text-slate-700">
                <th className="py-2">Bowler</th>
                <th className="py-2 text-right">O</th>
                <th className="py-2 text-right">M</th>
                <th className="py-2 text-right">R</th>
                <th className="py-2 text-right">W</th>
                <th className="py-2 text-right">Dots</th>
                <th className="py-2 text-right">Econ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {activeInn.bowlingFigures.filter(f => f.overs > 0).map((b, idx) => (
                <tr key={idx} className="hover:bg-white/5 text-slate-200 print:text-black">
                  <td className="py-2.5 font-bold">
                    <span className="text-white print:text-black">{b.player.name}</span>
                    {b.player.marks.includes('D') && <span className="text-amber-400 ml-1 text-[10px]">(db)</span>}
                  </td>
                  <td className="py-2.5 text-right font-mono text-slate-400 print:text-slate-700">{b.overs}</td>
                  <td className="py-2.5 text-right font-mono text-slate-400 print:text-slate-700">{b.maidens}</td>
                  <td className="py-2.5 text-right font-mono font-bold text-white print:text-black">{b.runsConceded}</td>
                  <td className="py-2.5 text-right font-mono font-black text-[#c3f400] print:text-black">{b.wickets}</td>
                  <td className="py-2.5 text-right font-mono text-slate-400 print:text-slate-700">{b.dots}</td>
                  <td className="py-2.5 text-right font-mono text-slate-300 print:text-slate-700">{b.economy.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
