// src/services/storage.ts
import { TEAMS_DATA } from '../../scripts/master_data.js';
import type { Team, MatchState, TournamentState, DplSeason, ThemeType, ScoringLayout } from '../types';

export interface AppSettings {
  theme: ThemeType;
  scoringLayout: ScoringLayout;
  bowlingBlockSide: 'left' | 'right';
  animationsEnabled: boolean;
  scorerMode: 'auto' | 'manual';
  soundEnabled: boolean;
  commentaryLanguage: 'en' | 'hi';
  spokenHindiEnabled: boolean;
  lastBackupTimestamp: number;
  autoBackupWeekly: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'pitch_pulse',
  scoringLayout: 'pitch', // Default to Pitch Pulse pitch view per Stitch design!
  bowlingBlockSide: 'left',
  animationsEnabled: true,
  scorerMode: 'auto',
  soundEnabled: true,
  commentaryLanguage: 'en',
  spokenHindiEnabled: false,
  lastBackupTimestamp: Date.now(),
  autoBackupWeekly: true
};

class StorageService {
  private SETTINGS_KEY = 'dck_settings_v2';
  private MATCHES_KEY = 'dck_matches_v2';
  private TEAMS_KEY = 'dck_custom_teams_v2';
  private TOURNAMENTS_KEY = 'dck_tournaments_v2';
  private DPL_KEY = 'dck_dpl_seasons_v2';

  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(this.SETTINGS_KEY);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(settings: AppSettings) {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings", e);
    }
  }

  // TEAMS
  getAllTeams(): Team[] {
    try {
      const customData = localStorage.getItem(this.TEAMS_KEY);
      const customTeams: Team[] = customData ? JSON.parse(customData) : [];
      const baseTeams: Team[] = TEAMS_DATA.map(t => ({
        ...t,
        currentStars: t.printedStars
      })) as Team[];
      // Combine printed teams + custom teams
      return [...baseTeams, ...customTeams];
    } catch {
      return TEAMS_DATA.map(t => ({
        ...t,
        currentStars: t.printedStars
      })) as Team[];
    }
  }

  saveCustomTeam(team: Team) {
    try {
      const customData = localStorage.getItem(this.TEAMS_KEY);
      let customTeams: Team[] = customData ? JSON.parse(customData) : [];
      const existingIdx = customTeams.findIndex(t => t.id === team.id);
      if (existingIdx >= 0) {
        customTeams[existingIdx] = team;
      } else {
        customTeams.push(team);
      }
      localStorage.setItem(this.TEAMS_KEY, JSON.stringify(customTeams));
    } catch (e) {
      console.error("Failed to save custom team", e);
    }
  }

  deleteCustomTeam(teamId: string): boolean {
    try {
      const customData = localStorage.getItem(this.TEAMS_KEY);
      if (!customData) return false;
      let customTeams: Team[] = JSON.parse(customData);
      customTeams = customTeams.filter(t => t.id !== teamId);
      localStorage.setItem(this.TEAMS_KEY, JSON.stringify(customTeams));
      return true;
    } catch {
      return false;
    }
  }

  // MATCHES
  getAllMatches(): MatchState[] {
    try {
      const data = localStorage.getItem(this.MATCHES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  getMatchById(id: string): MatchState | null {
    const matches = this.getAllMatches();
    return matches.find(m => m.id === id) || null;
  }

  saveMatch(match: MatchState) {
    try {
      let matches = this.getAllMatches();
      const existingIdx = matches.findIndex(m => m.id === match.id);
      if (existingIdx >= 0) {
        matches[existingIdx] = match;
      } else {
        matches.unshift(match);
      }
      localStorage.setItem(this.MATCHES_KEY, JSON.stringify(matches));
    } catch (e) {
      console.error("Failed to save match", e);
    }
  }

  deleteMatch(id: string) {
    try {
      let matches = this.getAllMatches();
      matches = matches.filter(m => m.id !== id);
      localStorage.setItem(this.MATCHES_KEY, JSON.stringify(matches));
    } catch (e) {
      console.error("Failed to delete match", e);
    }
  }

  // TOURNAMENTS
  getAllTournaments(): TournamentState[] {
    try {
      const data = localStorage.getItem(this.TOURNAMENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveTournament(tournament: TournamentState) {
    try {
      let tournaments = this.getAllTournaments();
      const idx = tournaments.findIndex(t => t.id === tournament.id);
      if (idx >= 0) {
        tournaments[idx] = tournament;
      } else {
        tournaments.unshift(tournament);
      }
      localStorage.setItem(this.TOURNAMENTS_KEY, JSON.stringify(tournaments));
    } catch (e) {
      console.error("Failed to save tournament", e);
    }
  }

  // DPL
  getDplSeason(): DplSeason | null {
    try {
      const data = localStorage.getItem(this.DPL_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  saveDplSeason(season: DplSeason) {
    try {
      localStorage.setItem(this.DPL_KEY, JSON.stringify(season));
    } catch (e) {
      console.error("Failed to save DPL season", e);
    }
  }

  // BACKUP & RESTORE
  exportBackupJson(): string {
    const backup = {
      version: 2,
      exportDate: new Date().toISOString(),
      settings: this.getSettings(),
      matches: this.getAllMatches(),
      customTeams: localStorage.getItem(this.TEAMS_KEY) ? JSON.parse(localStorage.getItem(this.TEAMS_KEY)!) : [],
      tournaments: this.getAllTournaments(),
      dpl: this.getDplSeason()
    };
    return JSON.stringify(backup, null, 2);
  }

  importBackupJson(jsonString: string): { matchesRestored: number; tournamentsRestored: number } {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) this.saveSettings(data.settings);
      if (data.matches) localStorage.setItem(this.MATCHES_KEY, JSON.stringify(data.matches));
      if (data.customTeams) localStorage.setItem(this.TEAMS_KEY, JSON.stringify(data.customTeams));
      if (data.tournaments) localStorage.setItem(this.TOURNAMENTS_KEY, JSON.stringify(data.tournaments));
      if (data.dpl) localStorage.setItem(this.DPL_KEY, JSON.stringify(data.dpl));

      return {
        matchesRestored: data.matches ? data.matches.length : 0,
        tournamentsRestored: data.tournaments ? data.tournaments.length : 0
      };
    } catch (e) {
      throw new Error("Invalid backup file format: " + (e as Error).message);
    }
  }

  resetAllData() {
    localStorage.removeItem(this.MATCHES_KEY);
    localStorage.removeItem(this.TEAMS_KEY);
    localStorage.removeItem(this.TOURNAMENTS_KEY);
    localStorage.removeItem(this.DPL_KEY);
    localStorage.removeItem(this.SETTINGS_KEY);
  }
}

export const storage = new StorageService();
