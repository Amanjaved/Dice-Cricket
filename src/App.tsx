// src/App.tsx
import React, { useState, useEffect } from 'react';
import type { MatchState, TournamentFixture, MatchFormat, GroundType, ThemeType } from './types';
import { storage, AppSettings } from './services/storage';
import { soundEngine } from './services/sound';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './views/HomeView';
import { MatchSetupView } from './views/MatchSetupView';
import { LiveScoringView } from './views/LiveScoringView';
import { ScorecardView } from './views/ScorecardView';
import { SummaryView } from './views/SummaryView';
import { BallByBallView } from './views/BallByBallView';
import { TournamentsView } from './views/TournamentsView';
import { DplView } from './views/DplView';
import { TeamsView } from './views/TeamsView';
import { SheetsView } from './views/SheetsView';
import { CardsView } from './views/CardsView';
import { RankingsView } from './views/RankingsView';
import { RuleBookView } from './views/RuleBookView';
import { CustomiseView } from './views/CustomiseView';

export function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeMatch, setActiveMatch] = useState<MatchState | null>(null);
  const [settings, setSettings] = useState<AppSettings>(storage.getSettings());
  const [showMobileMore, setShowMobileMore] = useState(false);

  // Quick match setup params
  const [setupParams, setSetupParams] = useState<{ format: MatchFormat; ground: GroundType }>({
    format: '5_overs',
    ground: 'NSG'
  });

  useEffect(() => {
    // Check for ongoing match on startup
    const inProgress = storage.getAllMatches().filter(m => m.status === 'IN_PROGRESS' || m.status === 'TIE_SUPER_OVER');
    if (inProgress.length > 0) {
      setActiveMatch(inProgress[0]);
    }
    soundEngine.enabled = settings.soundEnabled;
  }, []);

  const handleStartQuickMatch = (format: MatchFormat, ground: GroundType) => {
    setSetupParams({ format, ground });
    setCurrentView('setup');
  };

  const handleResumeMatch = (match: MatchState) => {
    setActiveMatch(match);
    setCurrentView('live');
  };

  const handlePlayFixture = (fixture: TournamentFixture) => {
    setSetupParams({
      format: '10_overs',
      ground: fixture.ground
    });
    setCurrentView('setup');
  };

  return (
    <div className={`min-h-screen bg-[#101410] text-[#e0e4dc] font-sans transition-colors duration-300 theme-${settings.theme}`}>
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => {
          const next = !settings.soundEnabled;
          soundEngine.enabled = next;
          const updated = { ...settings, soundEnabled: next };
          setSettings(updated);
          storage.saveSettings(updated);
        }}
      />

      {/* Main View Router with Smooth Entrance Transitions */}
      <main className="min-h-[calc(100vh-60px)]">
        <div key={currentView} className="animate-view-entrance">
          {currentView === 'home' && (
            <HomeView
              onNavigate={(view) => setCurrentView(view)}
              onStartQuickMatch={handleStartQuickMatch}
              onResumeMatch={handleResumeMatch}
            />
          )}

          {currentView === 'setup' && (
            <MatchSetupView
              initialFormat={setupParams.format}
              initialGround={setupParams.ground}
              onMatchCreated={(match) => {
                setActiveMatch(match);
                setCurrentView('live');
              }}
              onCancel={() => setCurrentView('home')}
            />
          )}

          {currentView === 'live' && activeMatch && (
            <LiveScoringView
              match={activeMatch}
              onUpdateMatch={(updated) => setActiveMatch(updated)}
              onNavigateTab={(tab) => {
                if (tab === 'home') setCurrentView('home');
                else setCurrentView(tab);
              }}
            />
          )}

          {currentView === 'live' && !activeMatch && (
            <div className="p-12 text-center text-slate-400">
              <h2 className="text-xl font-bold text-white mb-2">No Match In Progress</h2>
              <p className="text-xs mb-4">Start a new match or load from history.</p>
              <button
                onClick={() => setCurrentView('setup')}
                className="px-6 py-2.5 rounded-full bg-[#c3f400] text-black font-black text-xs uppercase"
              >
                Start New Match
              </button>
            </div>
          )}

          {currentView === 'scorecard' && activeMatch && (
            <ScorecardView
              match={activeMatch}
              onBack={() => setCurrentView('live')}
            />
          )}

          {currentView === 'summary' && activeMatch && (
            <SummaryView
              match={activeMatch}
              onBack={() => setCurrentView('live')}
              onViewScorecard={() => setCurrentView('scorecard')}
            />
          )}

          {currentView === 'ballbyball' && activeMatch && (
            <BallByBallView
              match={activeMatch}
              onBack={() => setCurrentView('live')}
            />
          )}

          {currentView === 'tournaments' && (
            <TournamentsView
              onPlayFixture={handlePlayFixture}
              onNavigateHome={() => setCurrentView('home')}
            />
          )}

          {currentView === 'dpl' && <DplView />}

          {currentView === 'teams' && <TeamsView />}

          {currentView === 'sheets' && <SheetsView />}

          {currentView === 'cards' && <CardsView />}

          {currentView === 'rankings' && <RankingsView />}

          {currentView === 'rulebook' && <RuleBookView />}

          {currentView === 'customise' && (
            <CustomiseView
              onThemeChanged={(th) => {
                setSettings(prev => ({ ...prev, theme: th }));
              }}
              onSettingsChanged={(st) => setSettings(st)}
            />
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenMore={() => setShowMobileMore(true)}
      />

      {/* Mobile "More" Drawer Sheet */}
      {showMobileMore && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end">
          <div className="bg-[#141814] border-t border-[#272b26] rounded-t-3xl p-5 space-y-4 animate-slideUp">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-sm font-black text-white">More Game Features</span>
              <button
                onClick={() => setShowMobileMore(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Done ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              {[
                { id: 'dpl', label: 'DPL Auction' },
                { id: 'teams', label: 'Teams DB' },
                { id: 'sheets', label: '12 Sheets' },
                { id: 'cards', label: '87 Cards' },
                { id: 'rulebook', label: 'Rule Book' },
                { id: 'customise', label: 'Customise' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setShowMobileMore(false);
                  }}
                  className="p-3 bg-[#1d211c] border border-white/5 rounded-2xl text-slate-200 font-bold hover:bg-[#272b26]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#272b26] py-6 px-4 text-center text-xs text-slate-500 bg-[#0b0f0b]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2026 Tanweer Ahmad · Faiz Dice Games · All rights reserved</span>
          <span className="text-slate-600 font-mono text-[10px]">
            Dice Cricket King v2.0 · 12 Sheets · 87 Cards · Pitch Pulse Edition
          </span>
        </div>
      </footer>
    </div>
  );
}
export default App;
