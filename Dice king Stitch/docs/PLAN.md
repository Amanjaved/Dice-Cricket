# Dice Cricket King · Architectural Blueprint & Execution Plan

## 1. System Architecture
The application is structured into modular layers adhering to clean architecture:
- **Core Engine (`engine/`)**: Pure Kotlin / TypeScript deterministic state machine. Zero framework dependencies. Seeded PRNG. 100% unit-tested. Handles dice resolution, sheets lookup, cards drawing, bowler quotas, strike rotation, DRS, power cards, form stars, and Super Overs.
- **Data & Persistence (`data/` / Room)**: Repositories for Teams, Players, Matches, Deliveries, Tournaments, DPL, and Settings. Automated offline Storage Access Framework backup and JSON serialization.
- **Presentation & UI (`ui/`)**: Built strictly in accordance with **Pitch Pulse** design tokens from `stitch_dice_cricket_king_android_app/pitch_pulse/DESIGN.md`:
  - Surfaces: `#101410`, `#141814`, `#1C221B`.
  - Primary Accent: Electric Lime (`#C3F400` / `#CCFF00`).
  - Typography: `Outfit`, `IBM Plex Sans`, `IBM Plex Sans Condensed`.
  - Sound & Haptics: "Faiz Sound Engine" audio effects with settings toggle.
  - Multi-Language: English and Hindi commentary with optional Speech synthesis.

---

## 2. Milestones Roadmap

- [x] **M0: Project Setup & Design Token Integration**
  - Theme configuration (`Pitch Pulse` dark obsidian/lime system), fonts (`Outfit`, `IBM Plex Sans`), colors, shapes.
  - Verification of asset files and PDF data.

- [x] **M1: Data Validation & Clean Asset Compilation**
  - All 12 master sheets verified with exact cell data.
  - Published statistics on 24 bowling lines and 27 batting lines verified within 0.1% against Rule Book pp. 8–9 and md §28.
  - All 87 cards (25 Wickets, 16 Runs, 20 Fielding, 20 Skills, 6 Power) extracted and validated.
  - 10 International teams × 20 players (200 total) verified.

- [ ] **M2: Core Deterministic Engine & Mathematical Simulation**
  - Ball resolution pipeline: Bowling roll -> result -> Batting roll.
  - Decision trees for Middle, Powerplay, Slog phases.
  - Star dominance on Row F.
  - Wicket resolution sequence (Wicket card -> Fielder -> Skills -> Runs).
  - App-now extras engine (8 dot conversions, no-ball free hit).
  - Power cards & DRS single-die review.
  - Simulation suite running 10,000 innings per ground.

- [ ] **M3: Local Persistence & Storage Architecture**
  - Database entities and schema for Room / Web storage.
  - JSON backup, restore, and weekly backup reminders.

- [ ] **M4: Navigation & Hub Screens**
  - Home dashboard with Quick Play, active match resume cards, and tools vault.
  - 12 Master Sheets interactive browser with "Roll This Sheet" utility.
  - 87 Cards deck inspector.
  - 11-page in-app Rule Book reader with print-ready file sharing.

- [ ] **M5: Match Setup & Pre-Match Atmosphere**
  - 5-over (7-a-side) & 10-over (Playing XI) flows.
  - Head-to-head squad comparison with C, F, O, ★, D role markers.
  - Form stars snapshotting.
  - 3D-styled animated Coin Toss.

- [ ] **M6: Live Scoring Arena (Split & Pitch View Layouts)**
  - Dual layouts: Split block view and Pitch View with 2D animated ground.
  - Dynamic callouts, over chips, "At the crease" telemetry.
  - Tactical choose-bowler modal with live matchup previews.
  - Strict new batsman confirmation lock (~1s delay, Finisher assignment in Slog).
  - Over completion summary cards (~0.75s delay).

- [ ] **M7: Wicket, DRS, Power Card & Boundary Animations**
  - Full-screen boundary animations (FOUR running to rope, SIX soaring arc, OUT stump shake).
  - 12-zone randomized field trajectory.
  - DRS 1-die review appeal and overturn flow.
  - Wonderful Shot and Great Delivery 36-cell power grids.

- [ ] **M8: Post-Match Analytics & Commentary**
  - Detailed innings scorecard, fall of wickets, bowling figures.
  - Match summary with interactive comparative Worm Chart.
  - Ball-by-ball timeline with Hindi/English audio commentary feed.
  - Super Over multi-tie handling.

- [ ] **M9: Tournaments & Slips Draw Ceremony**
  - Animated "Crystal Chamber" group draw by slips.
  - 23-fixture World Cup 2026 schedule and results tracking.
  - Points tables with Net Run Rate (NRR) and qualification cutoffs.
  - Orange Cap, Purple Cap, and Tournament MVP awards.

- [ ] **M10: Custom Teams, Squad Builder & DPL Franchise Auction**
  - Custom team creator (14 color presets, emblems, 7–20 squad roster).
  - Granular Add Player form.
  - DPL franchise management, 50,000-point purse seeded auction, squad needs radar, retention.

- [ ] **M11: Customise Hub & Android Project Generation**
  - 6-theme color switcher (Pitch Pulse, Classic Maroon, Night Stadium, Pitch Green, Super League, Ocean Breeze, Retro Scoreboard).
  - Complete Android Studio project (`Dice king Stitch/DiceCricketKing/`) with clean Gradle build.
  - Android Room database, Jetpack Compose UI, and assets.

- [ ] **M12: Comprehensive QA, Verification & Coverage**
  - Full simulation testing (10,000 innings benchmark).
  - `docs/COVERAGE.md` with 100% section-by-section verification.
