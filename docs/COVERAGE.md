# Dice Cricket King · Rules & Feature Coverage Matrix
**Faiz Dice Games · © 2026 Tanweer Ahmad**

This document provides a line-by-line verification checklist mapping the complete physical board game documentation (`Dice_Cricket_King_Complete_Documentation.md` §1–§27), the official 11-page Rule Book, and all 40 Stitch Android screens to their corresponding digital implementations in both the **Native Android Studio App** (`Dice king Stitch/DiceCricketKing/`) and the **Interactive Web App** (`src/`).

---

## 1. Core Game Rules Coverage (§1 – §27)

| Section | Rule Book Ref | Rule Description | Android Implementation | Web Implementation | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **§1 Game Overview** | pp. 1–2 | 10 International teams, 200 players, 12 master sheets (HSG, NSG, LSG), 87 cards | `GameModels.kt`, `teams.json`, `cards.json` | `src/types/index.ts`, `scripts/master_data.js` | ✅ **100%** |
| **§2 Formats & Squads** | p. 2 | 5-over (Playing 7) & 10-over (Playing 11); squad composition, max overseas | `MatchFormat.kt`, `HomeScreen.kt` | `src/views/MatchSetupView.tsx` | ✅ **100%** |
| **§3 Ground Conditions** | pp. 2–3 | HSG (High Scoring), NSG (Normal Scoring), LSG (Low Scoring); pitch attributes | `GroundType.kt`, `sheets.json` | `scripts/sheets_data.js`, `PitchView.tsx` | ✅ **100%** |
| **§4 Team Star Ratings** | p. 3 | 5★, 4★, 3★ printed ratings, dynamic form stars (1–5) based on momentum | `TeamEntity.kt`, `GameRepository.kt` | `src/services/storage.ts`, `MatchSetupView.tsx` | ✅ **100%** |
| **§5 Player Roles & Dots** | pp. 3–4 | BAT, BW, BTAL, BWAL, BTBW, WK; batting & bowling dot ratings (0–5) | `Player.kt`, `MatchupGrid.kt` | `src/types/index.ts`, `LiveScoringView.tsx` | ✅ **100%** |
| **§6 Bowling Crafts** | p. 4 | Fast (RF, RFM, LF, LFM), Medium (RM, LM), Spin (RO, RL, LO, LC) | `BowlingCraft.kt`, `DiceCricketEngine.kt` | `src/engine/index.ts`, `BowlerSelectModal.tsx` | ✅ **100%** |
| **§7 Matchup Grid** | pp. 4–5 | Batsman Dots vs Bowler Dots determining Row (A–F) and column lookups | `MatchupGrid.kt` | `src/engine/index.ts` (`resolveBowlingLine`) | ✅ **100%** |
| **§8 Delivery Sequence** | pp. 5–6 | 2-Dice roll (White/Black), sheet cell resolution, ball count, over progression | `DiceCricketEngine.kt`, `LiveMatchScreen.kt` | `src/views/LiveScoringView.tsx` | ✅ **100%** |
| **§9 Master Sheets** | pp. 6–7 | 12 sheets (3 grounds × 4 phases/types), 36 cells per sheet | `sheets.json`, `DiceCricketEngine.kt` | `src/views/SheetsView.tsx`, `sheets_data.js` | ✅ **100%** |
| **§10 Purple Row F** | p. 8 | Wicket Card pressure trigger when difference is in bowler favor | `DiceCricketEngine.kt`, `WicketResolver.kt` | `src/engine/index.ts`, `LiveScoringView.tsx` | ✅ **100%** |
| **§11 Wicket Cards** | pp. 8–9 | 25 physical cards deck, 1-die/2-dice resolutions (Bowled, Caught, LBW, Run Out) | `WicketResolver.kt`, `cards.json` | `src/views/CardsView.tsx`, `master_data.js` | ✅ **100%** |
| **§12 Extras Engine** | p. 9 | W (Wide), NB (No Ball) + Free Hit, B (Bye), LB (Leg-Bye) | `ExtrasEngine.kt` | `src/engine/index.ts`, `LiveScoringView.tsx` | ✅ **100%** |
| **§13 Free Hit Rules** | p. 9 | Next ball after No-Ball is Free Hit (Bowled, LBW, Caught protected; RO active) | `DiceCricketEngine.kt`, `WicketResolver.kt` | `src/engine/index.ts`, `LiveScoringView.tsx` | ✅ **100%** |
| **§14 DRS Review System** | p. 9 | 1 review per team per innings; 1-die roll (4–6 Overturn, 1–3 Uphold) | `WicketResolver.kt`, `DiceCricketEngine.kt` | `src/components/DrsModal.tsx` | ✅ **100%** |
| **§15 Double 6 Penalty** | p. 10 | Double Red 6 rolled on fielding/penalties grants 5 penalty runs to batting team | `ExtrasEngine.kt` | `src/engine/index.ts` | ✅ **100%** |
| **§16 Slog Finisher** | p. 10 | Designated finisher / Star batsman boundary bonus during overs 4–5 (5ov) & 8–10 (10ov) | `DiceCricketEngine.kt` | `src/components/NewBatsmanModal.tsx` | ✅ **100%** |
| **§17 Powerplay Phase** | p. 7 | Over 1 (5ov) / Overs 1–2 (10ov): special field restrictions & PP sheets | `MatchPhase.kt`, `DiceCricketEngine.kt` | `src/engine/index.ts` | ✅ **100%** |
| **§18 Bowler Quotas** | p. 6 | 5-over: max 1 over per bowler (5 distinct bowlers); 10-over: max 2 overs per bowler | `DiceCricketEngine.kt` (`canBowlerBowl`) | `src/components/BowlerSelectModal.tsx` | ✅ **100%** |
| **§19 Super Over** | p. 10 | 1-over tiebreaker, 2 wickets max, highest score wins | `DiceCricketEngine.kt` | `src/views/SummaryView.tsx` | ✅ **100%** |
| **§20 Power Cards** | p. 10 | Wonderful Shot (2), Great Delivery (2), Reroll (2) — total 6 physical cards | `cards.json`, `cards_deck` | `src/components/PowerCardModal.tsx` | ✅ **100%** |
| **§21 Fielding Cards** | p. 10 | 20 Fielding Cards (Drop catch, diving stop, direct hit) | `cards.json` | `src/views/CardsView.tsx` | ✅ **100%** |
| **§22 Skills Cards** | p. 10 | 20 Skills Cards (Batting swing, yorker accuracy, googly) | `cards.json` | `src/views/CardsView.tsx` | ✅ **100%** |
| **§23 Runs Cards** | p. 10 | 16 Runs Cards (Single, boundary, overthrow) | `cards.json` | `src/views/CardsView.tsx` | ✅ **100%** |
| **§24 Tournament Engine** | p. 11 | 2-group crystal chamber draw, 23 fixtures, Net Run Rate (NRR), Orange/Purple caps | `TournamentEntity.kt`, `TournamentDao.kt` | `src/views/TournamentsView.tsx` | ✅ **100%** |
| **§25 DPL Auction** | p. 11 | 50,000 pts purse, 200 players auction pool, squad radar, accelerated rounds | `GameRepository.kt` | `src/views/DplView.tsx` | ✅ **100%** |
| **§26 Offline Storage** | — | 100% offline, persistent room/local storage, backup & restore JSON vault | `DiceCricketDatabase.kt` | `src/services/storage.ts` | ✅ **100%** |
| **§27 Theme & Sound** | — | Pitch Pulse theme, 6 selectable themes, Web Audio sound synthesis | `Color.kt`, `Theme.kt` | `src/services/sound.ts`, `CustomiseView.tsx` | ✅ **100%** |

---

## 2. 40 Stitch Android Design Screens Coverage

All 40 screens exported from Stitch design have been mapped and fully implemented:

| Screen Code | Screen Name | Pitch Pulse Theme | Android Native | Web Applet | Status |
| :--- | :--- | :---: | :---: | :---: | :---: |
| `01_home_dashboard` | Home / Active Hub | ✅ | `HomeScreen.kt` | `HomeView.tsx` | ✅ **100%** |
| `02_quick_match_setup` | Format & Pitch Picker | ✅ | `MatchSetupScreen.kt` | `MatchSetupView.tsx` | ✅ **100%** |
| `03_team_select` | Playing XI / 7 Picker | ✅ | `MatchSetupScreen.kt` | `MatchSetupView.tsx` | ✅ **100%** |
| `04_coin_toss` | Head/Tails 3D Coin Toss | ✅ | `MatchSetupScreen.kt` | `MatchSetupView.tsx` | ✅ **100%** |
| `05_live_scoring_main` | Arena Scoreboard & Pitch | ✅ | `LiveMatchScreen.kt` | `LiveScoringView.tsx` | ✅ **100%** |
| `06_pitch_view_2d` | 12-Zone Animated Pitch | ✅ | `PitchSurface.kt` | `PitchView.tsx` | ✅ **100%** |
| `07_split_scoring_view` | Side-by-side Sheet Grid | ✅ | `LiveMatchScreen.kt` | `LiveScoringView.tsx` | ✅ **100%** |
| `08_dice_roll_modal` | 3D Dice Shaker & Outcome | ✅ | `LiveMatchScreen.kt` | `LiveScoringView.tsx` | ✅ **100%** |
| `09_bowler_select_modal` | Tactical Bowler Matchup | ✅ | `LiveMatchScreen.kt` | `BowlerSelectModal.tsx` | ✅ **100%** |
| `10_new_batsman_modal` | Slog Finisher Assignment | ✅ | `LiveMatchScreen.kt` | `NewBatsmanModal.tsx` | ✅ **100%** |
| `11_over_complete_card` | Over Progression & Run Rate | ✅ | `LiveMatchScreen.kt` | `OverCompleteCard.tsx` | ✅ **100%** |
| `12_wicket_card_draw` | Purple Row F 25-Card Reveal | ✅ | `LiveMatchScreen.kt` | `LiveScoringView.tsx` | ✅ **100%** |
| `13_drs_review_modal` | 1-Die DRS Appeal & Snicko | ✅ | `LiveMatchScreen.kt` | `DrsModal.tsx` | ✅ **100%** |
| `14_power_card_grid` | Power Cards Inventory & Play | ✅ | `LiveMatchScreen.kt` | `PowerCardModal.tsx` | ✅ **100%** |
| `15_fielding_card_modal` | 20 Fielding Cards Inspector | ✅ | `LiveMatchScreen.kt` | `CardsView.tsx` | ✅ **100%** |
| `16_skills_card_modal` | 20 Skills Cards Inspector | ✅ | `LiveMatchScreen.kt` | `CardsView.tsx` | ✅ **100%** |
| `17_scorecard_batting` | Full Batting Innings Table | ✅ | `ScorecardScreen.kt` | `ScorecardView.tsx` | ✅ **100%** |
| `18_scorecard_bowling` | Bowler Figures & Dots | ✅ | `ScorecardScreen.kt` | `ScorecardView.tsx` | ✅ **100%** |
| `19_worm_chart_view` | SVG Worm Progression | ✅ | `ScorecardScreen.kt` | `WormChart.tsx` | ✅ **100%** |
| `20_match_summary_result` | Result, POTM & Margin | ✅ | `ScorecardScreen.kt` | `SummaryView.tsx` | ✅ **100%** |
| `21_super_over_modal` | 1-Over Tiebreaker Duel | ✅ | `LiveMatchScreen.kt` | `SummaryView.tsx` | ✅ **100%** |
| `22_ball_by_ball_feed` | Live Hindi/Eng Commentary | ✅ | `LiveMatchScreen.kt` | `BallByBallView.tsx` | ✅ **100%** |
| `23_tournament_dashboard` | 23 Fixtures & Calendar | ✅ | `TournamentScreen.kt` | `TournamentsView.tsx` | ✅ **100%** |
| `24_group_draw_slips` | Crystal Chamber Ceremony | ✅ | `TournamentScreen.kt` | `GroupDrawSlipsModal.tsx` | ✅ **100%** |
| `25_points_table` | Points, Won, Lost, NRR | ✅ | `TournamentScreen.kt` | `TournamentsView.tsx` | ✅ **100%** |
| `26_orange_purple_caps` | Top Run Getters & Wickets | ✅ | `TournamentScreen.kt` | `TournamentsView.tsx` | ✅ **100%** |
| `27_dpl_auction_hub` | 50,000 Pts Live Auction | ✅ | `DplAuctionScreen.kt` | `DplView.tsx` | ✅ **100%** |
| `28_dpl_bidding_paddle` | Increment Bids & Auto-bid | ✅ | `DplAuctionScreen.kt` | `DplView.tsx` | ✅ **100%** |
| `29_dpl_squad_radar` | Squad Balance & Purse Left | ✅ | `DplAuctionScreen.kt` | `DplView.tsx` | ✅ **100%** |
| `30_teams_database` | 10 Teams & 200 Players Hub | ✅ | `HomeScreen.kt` | `TeamsView.tsx` | ✅ **100%** |
| `31_player_profile_card` | Skill Dots, Marks & Roles | ✅ | `HomeScreen.kt` | `TeamsView.tsx` | ✅ **100%** |
| `32_custom_team_builder` | Custom Teams & Squads | ✅ | `HomeScreen.kt` | `TeamsView.tsx` | ✅ **100%** |
| `33_master_sheets_hsg` | 4 High Scoring Sheets | ✅ | `HomeScreen.kt` | `SheetsView.tsx` | ✅ **100%** |
| `34_master_sheets_nsg` | 4 Normal Scoring Sheets | ✅ | `HomeScreen.kt` | `SheetsView.tsx` | ✅ **100%** |
| `35_master_sheets_lsg` | 4 Low Scoring Sheets | ✅ | `HomeScreen.kt` | `SheetsView.tsx` | ✅ **100%** |
| `36_cards_inspector` | Complete 87 Cards Deck | ✅ | `HomeScreen.kt` | `CardsView.tsx` | ✅ **100%** |
| `37_icc_rankings` | Official Team Form Rankings | ✅ | `HomeScreen.kt` | `RankingsView.tsx` | ✅ **100%** |
| `38_rule_book_reader` | 11-Page Interactive Guide | ✅ | `HomeScreen.kt` | `RuleBookView.tsx` | ✅ **100%** |
| `39_customise_themes` | 6 Themes & Audio Controls | ✅ | `HomeScreen.kt` | `CustomiseView.tsx` | ✅ **100%** |
| `40_data_backup_vault` | JSON Export/Import & Reset | ✅ | `HomeScreen.kt` | `CustomiseView.tsx` | ✅ **100%** |

---

## 3. Verification & Compliance Sign-off

- **Data Integrity**: All 12 master sheets, 200 players, and 87 cards loaded from verified JSON data with 0 discrepancies against Rule Book tables.
- **Simulation Benchmark**: 10,000 innings per condition (60,000 total innings) executed and verified in `docs/SIMULATION.md`.
- **Unit Test Coverage**: Automated test suites passing in both Kotlin (`DataValidationTest.kt`, `GameEngineTest.kt`, `SimulationTest.kt`) and Node.js (`src/engine/engine.test.ts`).
- **Copyright & Branding**: All views display `© 2026 Tanweer Ahmad · Faiz Dice Games`.
