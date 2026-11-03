// src/views/TournamentsView.tsx
import React, { useState } from 'react';
import { Trophy, Plus, Play, Calendar, Award, ChevronRight, Shuffle } from 'lucide-react';
import type { TournamentState, TournamentFixture, GroundType, MatchFormat, Team } from '../types';
import { storage } from '../services/storage';
import { GroupDrawSlipsModal } from '../components/GroupDrawSlipsModal';

interface TournamentsViewProps {
  onPlayFixture: (fixture: TournamentFixture) => void;
  onNavigateHome: () => void;
}

export const TournamentsView: React.FC<TournamentsViewProps> = ({ onPlayFixture, onNavigateHome }) => {
  const allTeams = storage.getAllTeams();
  const [tournaments, setTournaments] = useState<TournamentState[]>(storage.getAllTournaments());
  const [activeTab, setActiveTab] = useState<'fixtures' | 'table' | 'caps'>('fixtures');
  const [showDrawModal, setShowDrawModal] = useState(false);

  // Active or Default World Cup 2026 Tournament
  const activeTournament = tournaments[0] || null;

  const handleCreateDefaultWorldCup = () => {
    setShowDrawModal(true);
  };

  const handleDrawComplete = (groups: { name: 'Group A' | 'Group B'; teamIds: string[] }[]) => {
    setShowDrawModal(false);

    // Create 20 group matches + 2 semi finals + 1 final = 23 matches
    const grounds: GroundType[] = ['NSG', 'HSG', 'LSG'];
    const fixtures: TournamentFixture[] = [];
    let matchNumber = 1;

    // Group A round robin (5 teams -> 10 matches)
    const grpA = groups[0].teamIds;
    for (let i = 0; i < grpA.length; i++) {
      for (let j = i + 1; j < grpA.length; j++) {
        fixtures.push({
          id: `fix_${matchNumber}`,
          matchNumber: matchNumber,
          stage: 'GROUP',
          groupName: 'Group A',
          teamAId: grpA[i],
          teamBId: grpA[j],
          ground: grounds[(matchNumber - 1) % grounds.length],
          isPlayed: false,
          scheduledTime: `Match ${matchNumber} · Group A`
        });
        matchNumber++;
      }
    }

    // Group B round robin (5 teams -> 10 matches)
    const grpB = groups[1].teamIds;
    for (let i = 0; i < grpB.length; i++) {
      for (let j = i + 1; j < grpB.length; j++) {
        fixtures.push({
          id: `fix_${matchNumber}`,
          matchNumber: matchNumber,
          stage: 'GROUP',
          groupName: 'Group B',
          teamAId: grpB[i],
          teamBId: grpB[j],
          ground: grounds[(matchNumber - 1) % grounds.length],
          isPlayed: false,
          scheduledTime: `Match ${matchNumber} · Group B`
        });
        matchNumber++;
      }
    }

    // Semi-Final 1 (Match 21)
    fixtures.push({
      id: `fix_21`,
      matchNumber: 21,
      stage: 'SEMI_FINAL',
      teamAId: grpA[0],
      teamBId: grpB[1],
      ground: 'HSG',
      isPlayed: false,
      scheduledTime: `Semi-Final 1 · Winner A1 vs Runner-up B2`
    });

    // Semi-Final 2 (Match 22)
    fixtures.push({
      id: `fix_22`,
      matchNumber: 22,
      stage: 'SEMI_FINAL',
      teamAId: grpB[0],
      teamBId: grpA[1],
      ground: 'NSG',
      isPlayed: false,
      scheduledTime: `Semi-Final 2 · Winner B1 vs Runner-up A2`
    });

    // Grand Final (Match 23)
    fixtures.push({
      id: `fix_23`,
      matchNumber: 23,
      stage: 'FINAL',
      teamAId: grpA[0],
      teamBId: grpB[0],
      ground: 'NSG',
      isPlayed: false,
      scheduledTime: `World Cup Grand Final · Championship Match`
    });

    const newTourney: TournamentState = {
      id: `tourney_wc2026_${Date.now()}`,
      name: "World Cup 2026",
      format: "10_overs",
      ground: "NSG",
      numGroups: 2,
      qualifiersPerGroup: 2,
      groups,
      fixtures,
      status: 'IN_PROGRESS'
    };

    storage.saveTournament(newTourney);
    setTournaments(storage.getAllTournaments());
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6 select-none animate-fadeIn pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#272b26] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#c3f400]/10 border border-[#c3f400]/25 text-[#c3f400] text-[10px] font-black uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>Tournament Championship Hub</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            {activeTournament ? activeTournament.name : "Tournament Arena"}
          </h1>
          <p className="text-xs text-slate-400">
            {activeTournament
              ? `10 Nations · 2 Groups of 5 · 23 Total Fixtures (Set 2 Sheets)`
              : "Launch an official 10-team World Cup with the Crystal Chamber Slips Draw"}
          </p>
        </div>

        {!activeTournament ? (
          <button
            onClick={handleCreateDefaultWorldCup}
            className="px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-[#c3f400] text-black hover:bg-[#d4ff1a] transition-transform active:scale-95 shadow-xl shadow-[#c3f400]/25 flex items-center gap-2"
          >
            <Shuffle className="w-4 h-4" />
            <span>Draw Groups by Slips</span>
          </button>
        ) : (
          <div className="flex bg-[#101410] border border-white/10 rounded-full p-1 text-xs font-bold">
            {[
              { id: 'fixtures', label: 'Schedule & Results' },
              { id: 'table', label: 'Points Tables' },
              { id: 'caps', label: 'Caps & Awards' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#c3f400] text-black font-black shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      {activeTournament ? (
        <div className="space-y-5">
          {/* TAB 1: FIXTURES */}
          {activeTab === 'fixtures' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tournament Fixtures ({activeTournament.fixtures.length} matches)
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeTournament.fixtures.map(fix => {
                  const teamA = allTeams.find(t => t.id === fix.teamAId);
                  const teamB = allTeams.find(t => t.id === fix.teamBId);

                  return (
                    <div
                      key={fix.id}
                      className="p-4 bg-[#141814] border border-[#272b26] hover:border-[#c3f400]/40 rounded-3xl transition-all shadow-md flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-[#c3f400]">
                          Match #{fix.matchNumber} · {fix.groupName || fix.stage}
                        </span>
                        <span className="bg-[#1d211c] text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded-full border border-white/10">
                          {fix.ground} Ground
                        </span>
                      </div>

                      {/* Teams matchup */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: teamA?.color }} />
                          <span className="font-bold text-white text-sm">{teamA?.name}</span>
                          <span className="text-amber-400 text-xs font-mono">{teamA?.printedStars}★</span>
                        </div>
                        <span className="text-xs font-bold text-slate-500">VS</span>
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400 text-xs font-mono">{teamB?.printedStars}★</span>
                          <span className="font-bold text-white text-sm">{teamB?.name}</span>
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: teamB?.color }} />
                        </div>
                      </div>

                      {/* Play Action */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">{fix.scheduledTime}</span>
                        <button
                          onClick={() => onPlayFixture(fix)}
                          className="px-4 py-1.5 rounded-full bg-[#1d211c] hover:bg-[#c3f400] text-slate-300 hover:text-black font-black text-xs transition-all flex items-center gap-1.5 border border-white/10"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Play Match</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: POINTS TABLE */}
          {activeTab === 'table' && (
            <div className="space-y-6">
              {activeTournament.groups.map(grp => (
                <div key={grp.name} className="bg-[#141814] border border-[#272b26] rounded-3xl p-5 shadow-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h3 className="text-sm font-black text-[#c3f400] uppercase tracking-wider">
                      {grp.name} Standings (Top 2 Advance to Semi-Finals)
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase font-bold">
                          <th className="py-2">Nation</th>
                          <th className="py-2 text-right">P</th>
                          <th className="py-2 text-right">W</th>
                          <th className="py-2 text-right">L</th>
                          <th className="py-2 text-right">Pts</th>
                          <th className="py-2 text-right">NRR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-mono">
                        {grp.teamIds.map((tId, idx) => {
                          const team = allTeams.find(t => t.id === tId);
                          const isQualifying = idx < 2;

                          return (
                            <tr key={tId} className={`hover:bg-white/5 ${isQualifying ? "bg-emerald-950/20" : ""}`}>
                              <td className="py-2.5 font-bold font-sans flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: team?.color }} />
                                <span className="text-white">{team?.name}</span>
                                <span className="text-amber-400 text-[10px]">{team?.printedStars}★</span>
                                {isQualifying && <span className="text-emerald-400 text-[9px] font-bold">[Q]</span>}
                              </td>
                              <td className="py-2.5 text-right text-slate-300">0</td>
                              <td className="py-2.5 text-right text-slate-300">0</td>
                              <td className="py-2.5 text-right text-slate-300">0</td>
                              <td className="py-2.5 text-right font-bold text-white">0</td>
                              <td className="py-2.5 text-right text-[#c3f400]">+0.000</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: CAPS & AWARDS */}
          {activeTab === 'caps' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Orange Cap */}
              <div className="bg-[#141814] border-2 border-amber-500/40 rounded-3xl p-5 shadow-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase">
                  <span>🧢 ORANGE CAP</span>
                  <span className="text-slate-400">· Leading Run Scorer</span>
                </div>
                <div className="text-2xl font-black text-white">Debashish (IND)</div>
                <div className="text-xs text-slate-400">128 Runs · 3 Innings · HS 64*</div>
              </div>

              {/* Purple Cap */}
              <div className="bg-[#141814] border-2 border-purple-500/40 rounded-3xl p-5 shadow-xl space-y-2">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-black uppercase">
                  <span>🧢 PURPLE CAP</span>
                  <span className="text-slate-400">· Leading Wicket Taker</span>
                </div>
                <div className="text-2xl font-black text-white">Ojas (IND)</div>
                <div className="text-xs text-slate-400">7 Wickets · Econ 6.2 · BB 3/14</div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-8 text-center space-y-4">
          <Trophy className="w-12 h-12 text-[#c3f400] mx-auto opacity-70" />
          <h2 className="text-lg font-black text-white">No Active Tournament</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Experience the full 23-fixture World Cup 2026. Draw groups into the Crystal Chamber using the official draw by slips.
          </p>
          <button
            onClick={handleCreateDefaultWorldCup}
            className="px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-[#c3f400] text-black hover:bg-[#d4ff1a]"
          >
            Start World Cup 2026 Slips Draw
          </button>
        </div>
      )}

      {/* Slips Draw Modal */}
      {showDrawModal && (
        <GroupDrawSlipsModal
          teams={allTeams}
          onComplete={handleDrawComplete}
          onCancel={() => setShowDrawModal(false)}
        />
      )}
    </div>
  );
};
