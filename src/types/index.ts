// src/types/index.ts

export type Role = 'BAT' | 'BTBW' | 'BTAL' | 'WK' | 'BWAL' | 'BW';
export type BattingHand = 'RHB' | 'LHB';
export type BowlingStyle = 'RF' | 'RFM' | 'RM' | 'LF' | 'LFM' | 'LM' | 'RO' | 'RL' | 'LO' | 'LC';
export type SkillColor = 'Red' | 'Green' | 'Blue';
export type GroundType = 'NSG' | 'HSG' | 'LSG';
export type MatchFormat = '5_overs' | '10_overs';
export type ScoringLayout = 'split' | 'pitch' | 'facetoface';
export type ThemeType = 'pitch_pulse' | 'classic_maroon' | 'night_stadium' | 'pitch_green' | 'super_league' | 'ocean_breeze' | 'retro_scoreboard';

export interface Player {
  no: number;
  name: string;
  role: Role;
  bat: BattingHand;
  bowl: BowlingStyle | null;
  ct: SkillColor;
  rt: SkillColor;
  wkCt?: SkillColor;
  wkRt?: SkillColor;
  wkSt?: SkillColor;
  marks: string[]; // 'C', 'F', 'O', '★', 'D'
  starRuns?: number;
  isReleased?: boolean;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  printedStars: number;
  currentStars: number;
  color: string;
  captain: string;
  starPlayers: { name: string; runs: number }[];
  deathBowlers: string[];
  finishers: string[];
  openers: string[];
  suggestedXI: string[];
  suggested7: string[];
  players: Player[];
  isCustom?: boolean;
  logoUri?: string;
}

export interface FormStarsRecord {
  teamId: string;
  printedStars: number;
  currentStars: number;
  rank: number;
  matchesPlayed: number;
  wins: number;
  ties: number;
  losses: number;
  winPct: number;
  nrr: number;
  movement: 'up' | 'down' | 'same';
}

export interface BatsmanInnings {
  player: Player;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  dismissal?: string;
  dismissalBowler?: string;
  dismissalFielder?: string;
  strikeRate: number;
  battingOrder: number;
  sheetRoleOverride?: 'auto' | 'ignore' | 'force_star' | 'treat_finisher';
}

export interface BowlerFigures {
  player: Player;
  overs: number; // e.g. 1.2
  maidens: number;
  runsConceded: number;
  wickets: number;
  dots: number;
  economy: number;
}

export interface OverDelivery {
  ballNo: number; // 1 to 6 in over
  overNo: number; // 1-indexed
  legalBallNumber: number; // cumulative in innings
  isLegal: boolean;
  striker: string;
  nonStriker: string;
  bowler: string;
  bowlingRedDie: string;
  bowlingBlueDie: number;
  bowlingResult: string;
  battingRedDie?: string;
  battingBlueDie?: number;
  battingResult?: string;
  runsScored: number;
  extraRuns: number;
  extraType?: 'wide' | 'no_ball' | 'bye' | 'leg_bye';
  isWicket: boolean;
  wicketType?: string;
  dismissedPlayer?: string;
  isFreeHit: boolean;
  powerCardPlayed?: string;
  drsTaken?: boolean;
  drsOverturned?: boolean;
  commentaryEn: string;
  commentaryHi: string;
  displayTag?: string; // 'Sgl', 'DRS', '★', 'POW', 'W', '4', '6', '•'
}

export interface FallOfWicket {
  wicketNo: number;
  score: number;
  overs: string;
  player: string;
}

export interface InningsState {
  team: Team;
  score: number;
  wickets: number;
  completedOvers: number;
  ballsInCurrentOver: number;
  deliveries: OverDelivery[];
  battingCard: BatsmanInnings[];
  bowlingFigures: BowlerFigures[];
  fallOfWickets: FallOfWicket[];
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    total: number;
  };
  strikerIndex: number;
  nonStrikerIndex: number;
  currentBowlerName: string | null;
  lastBowlerName: string | null;
  isCompleted: boolean;
}

export interface MatchState {
  id: string;
  format: MatchFormat;
  ground: GroundType;
  teamA: Team;
  teamB: Team;
  teamASnapshotStars: number;
  teamBSnapshotStars: number;
  tossWinnerId: string;
  tossDecision: 'bat' | 'bowl';
  battingFirstId: string;
  bowlingFirstId: string;
  innings1: InningsState;
  innings2: InningsState;
  currentInningsNo: 1 | 2;
  targetRuns: number | null;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'TIE_SUPER_OVER';
  winnerTeamId?: string;
  winDescription?: string;
  isSuperOver: boolean;
  superOversHistory?: {
    superOverNo: number;
    teamAScore: number;
    teamAWickets: number;
    teamBScore: number;
    teamBWickets: number;
    winnerId?: string;
  }[];
  powerCardsRemaining: {
    [teamId: string]: {
      reroll: number; // max 1
      wonderfulShot: number; // max 2 (if eligible)
      greatDelivery: number; // max 2 (if eligible)
    };
  };
  startTime: number;
  endTime?: number;
  tournamentId?: string;
  fixtureId?: string;
}

export interface TournamentFixture {
  id: string;
  matchNumber: number;
  stage: 'GROUP' | 'SEMI_FINAL' | 'FINAL';
  groupName?: 'Group A' | 'Group B';
  teamAId: string;
  teamBId: string;
  ground: GroundType;
  isPlayed: boolean;
  matchId?: string;
  winnerTeamId?: string;
  scheduledTime?: string;
}

export interface TournamentGroup {
  name: 'Group A' | 'Group B';
  teamIds: string[];
}

export interface TournamentState {
  id: string;
  name: string;
  format: MatchFormat;
  ground: GroundType;
  numGroups: number;
  qualifiersPerGroup: number;
  groups: TournamentGroup[];
  fixtures: TournamentFixture[];
  status: 'DRAFT_DRAW' | 'IN_PROGRESS' | 'COMPLETED';
  championTeamId?: string;
}

export interface DplFranchise {
  id: string;
  name: string;
  code: string;
  color: string;
  purseRemaining: number; // starts at 50,000
  squad: Player[];
  retainedPlayerIds: string[];
}

export interface DplSeason {
  id: string;
  seasonNumber: number;
  status: 'AUCTION' | 'ACTIVE' | 'COMPLETED';
  seed: number;
  auctionCursor: number;
  franchises: DplFranchise[];
  playerPool: Player[];
}
