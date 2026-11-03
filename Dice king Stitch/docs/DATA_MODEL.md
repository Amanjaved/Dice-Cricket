# Dice Cricket King · Data Model & Persistence Architecture

## 1. Overview
The data architecture is designed for 100% offline persistence using:
- **Android Platform**: SQLite with **Room Persistence Library** + `kotlinx.serialization` for JSON assets and backups.
- **Web Runtime**: LocalStorage & IndexedDB (via browser storage API) with exact same entity schemas.

---

## 2. Core Entities & Schemas

### 2.1 Team & Player Entities
```sql
CREATE TABLE teams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    printedStars INTEGER NOT NULL,
    currentStars INTEGER NOT NULL,
    color TEXT NOT NULL,
    captain TEXT NOT NULL,
    logoUri TEXT,
    isCustom INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE players (
    id TEXT PRIMARY KEY,
    teamId TEXT NOT NULL,
    squadNumber INTEGER NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL, -- BAT, BTBW, BTAL, WK, BWAL, BW
    battingHand TEXT NOT NULL, -- RHB, LHB
    bowlingStyle TEXT, -- RF, RFM, RM, LF, LFM, LM, RO, RL, LO, LC
    fieldingCatchSkill TEXT NOT NULL, -- Red, Green, Blue
    fieldingRunOutSkill TEXT NOT NULL,
    keepingCatchSkill TEXT,
    keepingRunOutSkill TEXT,
    keepingStumpingSkill TEXT,
    starRuns INTEGER,
    isOpener INTEGER NOT NULL DEFAULT 0,
    isFinisher INTEGER NOT NULL DEFAULT 0,
    isDeathBowler INTEGER NOT NULL DEFAULT 0,
    isCaptain INTEGER NOT NULL DEFAULT 0,
    isReleased INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(teamId) REFERENCES teams(id) ON DELETE RESTRICT
);
```

### 2.2 Match & Delivery Telemetry
```sql
CREATE TABLE matches (
    id TEXT PRIMARY KEY,
    format TEXT NOT NULL, -- "5_overs" or "10_overs"
    ground TEXT NOT NULL, -- "HSG", "NSG", "LSG"
    teamAId TEXT NOT NULL,
    teamBId TEXT NOT NULL,
    teamASnapshotStars INTEGER NOT NULL,
    teamBSnapshotStars INTEGER NOT NULL,
    tossWinnerId TEXT NOT NULL,
    tossDecision TEXT NOT NULL, -- "bat" or "bowl"
    status TEXT NOT NULL, -- "IN_PROGRESS", "COMPLETED", "ABANDONED"
    currentInningsNo INTEGER NOT NULL DEFAULT 1,
    currentOver INTEGER NOT NULL DEFAULT 0,
    currentBall INTEGER NOT NULL DEFAULT 0,
    targetRuns INTEGER,
    winnerTeamId TEXT,
    winMarginRuns INTEGER,
    winMarginWickets INTEGER,
    isTie INTEGER NOT NULL DEFAULT 0,
    isSuperOver INTEGER NOT NULL DEFAULT 0,
    startTime INTEGER NOT NULL,
    endTime INTEGER,
    tournamentId TEXT,
    fixtureId TEXT
);

CREATE TABLE deliveries (
    id TEXT PRIMARY KEY,
    matchId TEXT NOT NULL,
    inningsNo INTEGER NOT NULL,
    overNo INTEGER NOT NULL,
    ballNo INTEGER NOT NULL,
    isLegalBall INTEGER NOT NULL,
    strikerId TEXT NOT NULL,
    nonStrikerId TEXT NOT NULL,
    bowlerId TEXT NOT NULL,
    bowlingRedDie TEXT NOT NULL, -- A-F
    bowlingBlueDie INTEGER NOT NULL, -- 1-6
    bowlingResult TEXT NOT NULL,
    battingRedDie TEXT,
    battingBlueDie INTEGER,
    battingResult TEXT,
    runsScored INTEGER NOT NULL,
    extrasType TEXT, -- WIDE, NO_BALL, BYE, LEG_BYE
    extraRuns INTEGER NOT NULL DEFAULT 0,
    isWicket INTEGER NOT NULL DEFAULT 0,
    dismissalType TEXT,
    dismissedPlayerId TEXT,
    fielderId TEXT,
    isFreeHit INTEGER NOT NULL DEFAULT 0,
    powerCardPlayed TEXT, -- "REROLL", "WONDERFUL_SHOT", "GREAT_DELIVERY", "DRS"
    drsOverturned INTEGER NOT NULL DEFAULT 0,
    commentaryEn TEXT,
    commentaryHi TEXT,
    timestamp INTEGER NOT NULL,
    FOREIGN KEY(matchId) REFERENCES matches(id) ON DELETE CASCADE
);
```

### 2.3 Tournament & DPL Entities
```sql
CREATE TABLE tournaments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    format TEXT NOT NULL,
    ground TEXT NOT NULL,
    type TEXT NOT NULL, -- "GROUPS_KNOCKOUT", "LEAGUE"
    numGroups INTEGER NOT NULL,
    qualifiersPerGroup INTEGER NOT NULL,
    status TEXT NOT NULL,
    championTeamId TEXT
);

CREATE TABLE tournament_fixtures (
    id TEXT PRIMARY KEY,
    tournamentId TEXT NOT NULL,
    matchNumber INTEGER NOT NULL,
    stage TEXT NOT NULL, -- "GROUP", "SEMI_FINAL", "FINAL"
    groupName TEXT,
    teamAId TEXT NOT NULL,
    teamBId TEXT NOT NULL,
    ground TEXT NOT NULL,
    matchId TEXT,
    isPlayed INTEGER NOT NULL DEFAULT 0,
    winnerTeamId TEXT,
    scheduledTime TEXT
);

CREATE TABLE dpl_seasons (
    id TEXT PRIMARY KEY,
    seasonNumber INTEGER NOT NULL,
    status TEXT NOT NULL, -- "DRAFT", "AUCTION", "ACTIVE", "COMPLETED"
    seed INTEGER NOT NULL,
    auctionCursor INTEGER NOT NULL DEFAULT 0
);
```
