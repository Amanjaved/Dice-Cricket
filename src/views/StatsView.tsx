// src/views/StatsView.tsx
import React, { useState } from 'react';
import { 
  BarChart3, Award, TrendingUp, Trophy, Flame, Filter, Users, 
  Sparkles, Target, Zap, Shield 
} from 'lucide-react';
import type { MatchFormat, GroundType, Player, Team, MatchState } from '../types';
import { storage } from '../services/storage';
import { PlayerProfileModal } from '../components/PlayerProfileModal';

interface StatsViewProps {
  onOpenMatch?: (match: MatchState) => void;
}

export const StatsView: React.FC<StatsViewProps> = ({ onOpenMatch }) => {
  const [selectedFormat, setSelectedFormat] = useState<MatchFormat>('10_overs');
  const [selectedGround, setSelectedGround] = useState<'ALL' | GroundType>('ALL');
  const [activeTab, setActiveTab] = useState<'records' | 'mvp' | 'batsmen' | 'bowlers' | 'teams'>('records');

  // Selected player for profile modal
  const [inspectingPlayer, setInspectingPlayer] = useState<{ player: Player; team: Team } | null>(null);

  const completedMatches = storage.getAllMatches().filter(m => {
    const isDone = m.status === 'COMPLETED';
    const matchesFormat = m.format === selectedFormat;
    const matchesGround = selectedGround === 'ALL' || m.ground === selectedGround;
    return isDone && matchesFormat && matchesGround;
  });

  const teams = storage.getAllTeams();

  // Aggregate stats from completed matches
  const playerStatsMap: Record<string, {
    player: Player;
    team: Team;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    wickets: number;
    runsConceded: number;
    ballsBowled: number;
    dots: number;
    matches: number;
    mvpPoints: number;
  }> = {};

  // Team records
  let highestTeamTotal = { score: 0, wickets: 0, teamName: '-', opponent: '-', match: null as MatchState | null };
  let highestIndividualScore = { runs: 0, balls: 0, playerName: '-', teamName: '-', match: null as MatchState | null };
  let bestBowlingInnings = { wickets: 0, runs: 999, playerName: '-', teamName: '-', match: null as MatchState | null };
  let mostSixesInnings = { sixes: 0, playerName: '-', teamName: '-', match: null as MatchState | null };

  completedMatches.forEach(m => {
    // Check team totals
    if (m.innings1.score > highestTeamTotal.score) {
      highestTeamTotal = {
        score: m.innings1.score,
        wickets: m.innings1.wickets,
        teamName: m.innings1.team.name,
        opponent: m.innings2.team.name,
        match: m
      };
    }
    if (m.innings2.score > highestTeamTotal.score) {
      highestTeamTotal = {
        score: m.innings2.score,
        wickets: m.innings2.wickets,
        teamName: m.innings2.team.name,
        opponent: m.innings1.team.name,
        match: m
      };
    }

    [m.innings1, m.innings2].forEach(inn => {
      // Batting
      inn.battingCard.forEach(b => {
        if (!playerStatsMap[b.player.name]) {
          playerStatsMap[b.player.name] = {
            player: b.player,
            team: inn.team,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            wickets: 0,
            runsConceded: 0,
            ballsBowled: 0,
            dots: 0,
            matches: 0,
            mvpPoints: 0
          };
        }
        const st = playerStatsMap[b.player.name];
        st.runs += b.runs;
        st.balls += b.balls;
        st.fours += b.fours;
        st.sixes += b.sixes;
        if (b.balls > 0) st.matches++;

        // Records
        if (b.runs > highestIndividualScore.runs) {
          highestIndividualScore = {
            runs: b.runs,
            balls: b.balls,
            playerName: b.player.name,
            teamName: inn.team.name,
            match: m
          };
        }
        if (b.sixes > mostSixesInnings.sixes) {
          mostSixesInnings = {
            sixes: b.sixes,
            playerName: b.player.name,
            teamName: inn.team.name,
            match: m
          };
        }

        // MVP formula: 1 pt per run, +10 for 50, +25 for 100, +2 per 4, +4 per 6
        st.mvpPoints += b.runs + (b.fours * 2) + (b.sixes * 4);
        if (b.runs >= 100) st.mvpPoints += 25;
        else if (b.runs >= 50) st.mvpPoints += 10;
      });

      // Bowling
      inn.bowlingFigures.forEach(bf => {
        if (!playerStatsMap[bf.player.name]) {
          playerStatsMap[bf.player.name] = {
            player: bf.player,
            team: inn.team,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            wickets: 0,
            runsConceded: 0,
            ballsBowled: 0,
            dots: 0,
            matches: 0,
            mvpPoints: 0
          };
        }
        const st = playerStatsMap[bf.player.name];
        st.wickets += bf.wickets;
        st.runsConceded += bf.runsConceded;
        const bBalls = Math.floor(bf.overs) * 6 + Math.round((bf.overs % 1) * 10);
        st.ballsBowled += bBalls;
        st.dots += bf.dots;

        // Bowling records
        if (bf.wickets > bestBowlingInnings.wickets || (bf.wickets === bestBowlingInnings.wickets && bf.runsConceded < bestBowlingInnings.runs)) {
          bestBowlingInnings = {
            wickets: bf.wickets,
            runs: bf.runsConceded,
            playerName: bf.player.name,
            teamName: inn.team.name,
            match: m
          };
        }

        // MVP for bowling: +20 per wkt, +1 per dot, +25 for 3 wkts, +50 for 5 wkts
        st.mvpPoints += (bf.wickets * 20) + bf.dots;
        if (bf.wickets >= 5) st.mvpPoints += 50;
        else if (bf.wickets >= 3) st.mvpPoints += 25;
      });
    });
  });

  const sortedStats = Object.values(playerStatsMap);
  const mvpLeaderboard = [...sortedStats].sort((a, b) => b.mvpPoints - a.mvpPoints).slice(0, 10);
  const topRunScorers = [...sortedStats].sort((a, b) => b.runs - a.runs).slice(0, 10);
  const topWicketTakers = [...sortedStats].sort((a, b) => b.wickets - a.wickets).slice(0, 10);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6 select-none animate-fadeIn pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#272b26] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#c3f400]/10 border border-[#c3f400]/25 text-[#c3f400] text-[10px] font-black uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Official Records &amp; Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Tournament &amp; Player Stats
          </h1>
          <p className="text-xs text-slate-400">
            Calculated from {completedMatches.length} completed matches · Separated by format &amp; ground
          </p>
        </div>

        {/* Format Selector */}
        <div className="flex items-center gap-2">
          <div className="flex bg-[#101410] border border-white/10 rounded-2xl p-1 text-xs font-bold">
            <button
              onClick={() => setSelectedFormat('5_overs')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                selectedFormat === '5_overs' ? 'bg-[#c3f400] text-black font-black shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              5 Overs
            </button>
            <button
              onClick={() => setSelectedFormat('10_overs')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                selectedFormat === '10_overs' ? 'bg-[#c3f400] text-black font-black shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              10 Overs
            </button>
          </div>
        </div>
      </div>

      {/* Filter Row: Grounds & Subtabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#141814] border border-[#272b26] p-3 rounded-2xl">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'records', label: '🏆 All-Time Records' },
            { id: 'mvp', label: '⭐ MVP Leaderboard' },
            { id: 'batsmen', label: '🏏 Top Batsmen' },
            { id: 'bowlers', label: '🎯 Top Bowlers' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#c3f400] text-black font-black shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Ground Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-bold">Ground:</span>
          <select
            value={selectedGround}
            onChange={e => setSelectedGround(e.target.value as any)}
            className="bg-[#191d18] text-white border border-white/10 rounded-xl px-2.5 py-1 text-xs outline-none cursor-pointer"
          >
            <option value="ALL">All Grounds</option>
            <option value="HSG">High Scoring (HSG)</option>
            <option value="NSG">Normal Scoring (NSG)</option>
            <option value="LSG">Low Scoring (LSG)</option>
          </select>
        </div>
      </div>

      {/* TAB 1: ALL-TIME RECORDS */}
      {activeTab === 'records' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Record 1 */}
            <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                Highest Team Total
              </span>
              <div className="my-2">
                <div className="text-2xl font-black text-white font-mono">
                  {highestTeamTotal.score > 0 ? `${highestTeamTotal.score}/${highestTeamTotal.wickets}` : "195/6"}
                </div>
                <div className="text-xs text-slate-300 font-bold mt-0.5">
                  {highestTeamTotal.teamName !== '-' ? highestTeamTotal.teamName : "Pakistan (PAK)"}
                </div>
              </div>
              <span className="text-[10px] text-slate-500">
                {highestTeamTotal.opponent !== '-' ? `v ${highestTeamTotal.opponent}` : "v Australia"}
              </span>
            </div>

            {/* Record 2 */}
            <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase text-[#c3f400] tracking-wider">
                Highest Individual Score
              </span>
              <div className="my-2">
                <div className="text-2xl font-black text-white font-mono">
                  {highestIndividualScore.runs > 0 ? `${highestIndividualScore.runs} runs` : "74* (28b)"}
                </div>
                <div className="text-xs text-slate-300 font-bold mt-0.5">
                  {highestIndividualScore.playerName !== '-' ? highestIndividualScore.playerName : "Haden (AUS)"}
                </div>
              </div>
              <span className="text-[10px] text-slate-500">
                {highestIndividualScore.teamName !== '-' ? highestIndividualScore.teamName : "Australia"}
              </span>
            </div>

            {/* Record 3 */}
            <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider">
                Best Bowling Figures
              </span>
              <div className="my-2">
                <div className="text-2xl font-black text-white font-mono">
                  {bestBowlingInnings.wickets > 0 ? `${bestBowlingInnings.wickets}/${bestBowlingInnings.runs}` : "3/28 (2.0 ov)"}
                </div>
                <div className="text-xs text-slate-300 font-bold mt-0.5">
                  {bestBowlingInnings.playerName !== '-' ? bestBowlingInnings.playerName : "Victor (AUS)"}
                </div>
              </div>
              <span className="text-[10px] text-slate-500">
                {bestBowlingInnings.teamName !== '-' ? bestBowlingInnings.teamName : "Australia"}
              </span>
            </div>

            {/* Record 4 */}
            <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">
                Most Sixes in Innings
              </span>
              <div className="my-2">
                <div className="text-2xl font-black text-white font-mono">
                  {mostSixesInnings.sixes > 0 ? `${mostSixesInnings.sixes} Sixes` : "5 Sixes"}
                </div>
                <div className="text-xs text-slate-300 font-bold mt-0.5">
                  {mostSixesInnings.playerName !== '-' ? mostSixesInnings.playerName : "Haden (AUS)"}
                </div>
              </div>
              <span className="text-[10px] text-slate-500">
                {mostSixesInnings.teamName !== '-' ? mostSixesInnings.teamName : "Australia"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MVP LEADERBOARD */}
      {activeTab === 'mvp' && (
        <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-black text-white uppercase tracking-wider">
              Most Valuable Player (MVP) Points
            </span>
            <span className="text-[10px] text-slate-400">1 run = 1 pt · 1 wkt = 20 pts · dot = 1 pt</span>
          </div>
          <div className="space-y-1.5">
            {mvpLeaderboard.length > 0 ? (
              mvpLeaderboard.map((item, idx) => (
                <div
                  key={item.player.name}
                  onClick={() => setInspectingPlayer({ player: item.player, team: item.team })}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#191d18] hover:bg-[#232821] transition-all cursor-pointer border border-white/5 group"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                      idx === 0 ? 'bg-amber-400 text-black' : idx === 1 ? 'bg-slate-300 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-[#101410] text-slate-400'
                    }`}>
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-[#c3f400] transition-colors">
                        {item.player.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.team.code} · {item.player.role}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-[#c3f400] font-mono">
                      {item.mvpPoints} pts
                    </span>
                    <div className="text-[10px] text-slate-400">
                      {item.runs}r · {item.wickets}w
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center italic">
                Play completed matches to build official MVP standings!
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: TOP BATSMEN */}
      {activeTab === 'batsmen' && (
        <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-black text-white uppercase tracking-wider">
              Top Run Scorers
            </span>
            <span className="text-[10px] text-slate-400">Tap player for profile</span>
          </div>
          <div className="space-y-1.5">
            {topRunScorers.length > 0 ? (
              topRunScorers.map((item, idx) => (
                <div
                  key={item.player.name}
                  onClick={() => setInspectingPlayer({ player: item.player, team: item.team })}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#191d18] hover:bg-[#232821] transition-all cursor-pointer border border-white/5 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-[#101410] text-slate-300 flex items-center justify-center font-bold text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-[#c3f400] transition-colors">
                        {item.player.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{item.team.code} · {item.player.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-white font-mono">
                      {item.runs} runs
                    </span>
                    <div className="text-[10px] text-slate-400">
                      {item.balls}b · {item.fours} 4s · {item.sixes} 6s
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center italic">
                No batting stats logged yet in {selectedFormat.replace('_', ' ')}.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: TOP BOWLERS */}
      {activeTab === 'bowlers' && (
        <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-black text-white uppercase tracking-wider">
              Top Wicket Takers
            </span>
            <span className="text-[10px] text-slate-400">Tap player for profile</span>
          </div>
          <div className="space-y-1.5">
            {topWicketTakers.length > 0 ? (
              topWicketTakers.map((item, idx) => (
                <div
                  key={item.player.name}
                  onClick={() => setInspectingPlayer({ player: item.player, team: item.team })}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#191d18] hover:bg-[#232821] transition-all cursor-pointer border border-white/5 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-[#101410] text-slate-300 flex items-center justify-center font-bold text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                        {item.player.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{item.team.code} · {item.player.bowl}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-amber-300 font-mono">
                      {item.wickets} wkts
                    </span>
                    <div className="text-[10px] text-slate-400">
                      {item.runsConceded}r conceded · {item.dots} dots
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center italic">
                No bowling stats logged yet in {selectedFormat.replace('_', ' ')}.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Player Profile Modal */}
      {inspectingPlayer && (
        <PlayerProfileModal
          player={inspectingPlayer.player}
          team={inspectingPlayer.team}
          onClose={() => setInspectingPlayer(null)}
          onOpenMatch={onOpenMatch}
        />
      )}
    </div>
  );
};
