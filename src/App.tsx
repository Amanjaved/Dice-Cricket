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
import { MenuView } from './views/MenuView';
import { MatchesView } from './views/MatchesView';
import { StatsView } from './views/StatsView';

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
  const [returnView, setReturnView] = useState<string>('matches');

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

  const handleOpenScorecard = (match: MatchState, fromView = 'matches') => {
    setActiveMatch(match);
    setReturnView(fromView);
    setCurrentView('scorecard');
  };

  const handleOpenSummary = (match: MatchState, fromView = 'matches') => {
    setActiveMatch(match);
    setReturnView(fromView);
    setCurrentView('summary');
  };

  const handleOpenBallByBall = (match: MatchState, fromView = 'matches') => {
    setActiveMatch(match);
    setReturnView(fromView);
    setCurrentView('ballbyball');
  };

  const handleOpenMatch = (match: MatchState, fromView = 'matches') => {
    setActiveMatch(match);
    setReturnView(fromView);
    if (match.status === 'COMPLETED') {
      setCurrentView('scorecard');
    } else {
      setCurrentView('live');
    }
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
              onBack={() => setCurrentView(activeMatch?.status === 'IN_PROGRESS' || activeMatch?.status === 'TIE_SUPER_OVER' ? 'live' : returnView)}
            />
          )}

          {currentView === 'summary' && activeMatch && (
            <SummaryView
              match={activeMatch}
              onBack={() => setCurrentView(activeMatch?.status === 'IN_PROGRESS' || activeMatch?.status === 'TIE_SUPER_OVER' ? 'live' : returnView)}
              onViewScorecard={() => setCurrentView('scorecard')}
            />
          )}

          {currentView === 'ballbyball' && activeMatch && (
            <BallByBallView
              match={activeMatch}
              onBack={() => setCurrentView(activeMatch?.status === 'IN_PROGRESS' || activeMatch?.status === 'TIE_SUPER_OVER' ? 'live' : returnView)}
            />
          )}

          {currentView === 'matches' && (
            <MatchesView
              onStartNewMatch={() => handleStartQuickMatch('5_overs', 'NSG')}
              onResumeMatch={handleResumeMatch}
              onViewScorecard={(m) => handleOpenScorecard(m, 'matches')}
              onViewSummary={(m) => handleOpenSummary(m, 'matches')}
              onViewBallByBall={(m) => handleOpenBallByBall(m, 'matches')}
            />
          )}

          {currentView === 'stats' && (
            <StatsView
              onOpenMatch={(m) => handleOpenMatch(m, 'stats')}
            />
          )}

          {currentView === 'tournaments' && (
            <TournamentsView
              onPlayFixture={handlePlayFixture}
              onNavigateHome={() => setCurrentView('home')}
            />
          )}

          {currentView === 'dpl' && <DplView />}

          {currentView === 'teams' && (
            <TeamsView
              onOpenMatch={(m) => handleOpenMatch(m, 'teams')}
            />
          )}

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

          {currentView === 'menu' && (
            <MenuView
              currentView={currentView}
              onNavigate={(view) => {
                setCurrentView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onStartQuickMatch={handleStartQuickMatch}
              activeMatch={activeMatch}
              soundEnabled={settings.soundEnabled}
              onToggleSound={() => {
                const next = !settings.soundEnabled;
                soundEngine.enabled = next;
                const updated = { ...settings, soundEnabled: next };
                setSettings(updated);
                storage.saveSettings(updated);
              }}
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
        onOpenMore={() => setCurrentView('menu')}
      />

      {/* Mobile "More" Drawer Sheet (Full-fidelity MenuView Slideup) */}
      {showMobileMore && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-end">
          <div className="bg-[#141814] border-t-2 border-[#c3f400]/40 rounded-t-3xl max-h-[88vh] overflow-y-auto p-4 space-y-4 animate-slideUp">
            <MenuView
              currentView={currentView}
              onNavigate={(view) => {
                setCurrentView(view);
                setShowMobileMore(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onStartQuickMatch={(fmt, grd) => {
                handleStartQuickMatch(fmt, grd);
                setShowMobileMore(false);
              }}
              activeMatch={activeMatch}
              soundEnabled={settings.soundEnabled}
              onToggleSound={() => {
                const next = !settings.soundEnabled;
                soundEngine.enabled = next;
                const updated = { ...settings, soundEnabled: next };
                setSettings(updated);
                storage.saveSettings(updated);
              }}
              onClose={() => setShowMobileMore(false)}
            />
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
