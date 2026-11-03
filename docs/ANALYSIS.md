# Dice Cricket King · Comprehensive Game Analysis & System Specification

**Faiz Dice Games (FDG) · © 2026 Tanweer Ahmad · All rights reserved**
App Target: "Dice Cricket King" Android Native App + High-Fidelity Interactive Preview

---

## 1. System Overview & Core Metaphor

Dice Cricket King is a tabletop dice-and-card cricket simulation game designed by Faiz Dice Games (FDG). The core architectural design principle is:
- **Two physical or virtual dice govern every delivery**:
  - **Red Die** determines the grid row (**A to F**, 6 rows).
  - **Blue Die** determines the grid column (**1 to 6**, 6 columns).
  - Each sheet forms a 6×6 matrix of 36 discrete cells.
- **Player agency controls strategy**:
  - Bowler selection and spell management (quota, no consecutive overs, matchup optimization).
  - Batting order and striker management.
  - Tactical assignment of roles: Openers (**O**), Finishers (**F**), Death Bowlers (**D**), Captain (**C**), Wicketkeeper (**WK**), and Star players (**★**).
  - Power Card deployment (timing Reroll, Wonderful Shot, Great Delivery, and DRS reviews).

---

## 2. Match Formats & Over Phases

### 2.1 Formats Matrix
| Parameter | 5 Overs | 10 Overs |
|---|---|---|
| **Players per side** | 7 a side | 11 a side |
| **All Out Threshold** | 6 wickets down | 10 wickets down |
| **Bowler Quota** | 2 bowlers max 2 overs; rest max 1 over | Max 2 overs each (5–6 bowlers required) |
| **Powerplay Phase** | Over 1 | Overs 1–2 |
| **Middle Overs** | Overs 2–4 | Overs 3–8 |
| **Slog Phase** | Over 5 | Overs 9–10 |
| **Consecutive Overs** | No bowler may bowl 2 overs consecutively | No bowler may bowl 2 overs consecutively |

*Emergency fallback rule:* If strict quota/consecutive rules would leave no legal bowler available, all bowlers with quota remaining become eligible.

---

## 3. Grounds & Mathematical Balance

Matches occur on one of three distinct pitch surfaces, represented by 3 ground sheet packages:
1. **Normal Scoring Ground (NSG · Green Theme)**:
   - Target benchmark: 5 ov ~68 runs (range 56–80); 10 ov ~150 runs (range 130–170).
   - Serves as the game's core calibrated baseline.
2. **High Scoring Ground (HSG · Red Theme)**:
   - Target benchmark: 5 ov ~90 runs (range 75–110); 10 ov ~197 runs (range 170–225).
   - High boundary concentration, reduced dot ball density, sparse wickets.
3. **Low Scoring Ground (LSG · Yellow Theme)**:
   - Target benchmark: 5 ov ~42 runs (range 30–54); 10 ov ~95 runs (range 75–115).
   - Heavy dot density, high wicket frequency, boundaries are hard-earned.

---

## 4. Delivery Resolution Pipeline

Every delivery follows a deterministic 3-stage resolution pipeline:

```
[Stage 1: Bowling Roll]
  Roll Red Die (A-F) & Blue Die (1-6) on active Bowling Sheet
         │
         ▼
[Stage 2: Evaluate Bowling Outcome]
  ├── '0' / 'D' ──► Dot Ball (over ball completed, 0 runs)
  ├── '+' ────────► Extra Resolution (Draw Runs Card via App-Now Engine; NB = Free Hit)
  ├── 'X' ────────► Wicket Sequence (Wicket Card -> Fielder/Keeper -> Skills -> Runs Card if dropped)
  ├── Wicket Code ─► Immediate Dismissal or Known Fielder Skill Check (from Row F)
  └── 'Ball' / 'B'─► Proceed to Stage 3
         │
         ▼
[Stage 3: Batting Roll]
  Roll Red Die (A-F) & Blue Die (1-6) on active Batting Sheet
         │
         ▼
[Stage 4: Batting Result]
  ├── Runs (0, 1, 2, 3, 4, 6) ──► Score runs, update batsman/bowler, rotate strike on odd runs
  └── 'X' ───────────────────────► Wicket Sequence
```

---

## 5. Decision Trees for Sheet & Line Selection

### 5.1 Bowling Sheet Selection
- **Middle Overs (Overs 2–4 in 5ov, 3–8 in 10ov)**: `Master Bowling Sheet`
- **Powerplay & Slog (Over 1 & 5 in 5ov, 1–2 & 9–10 in 10ov, Super Over)**: `Powerplay & Slog Bowling Sheet`

### 5.2 Bowling Line Selection
#### Middle Overs (Rows A–E):
Domination index is derived strictly from **Bowler Role × Batsman Role**:
| Bowler \ Batsman | BW | BWAL | BTAL / WK | BAT / BTBW |
|---|---|---|---|---|
| **BW** | BWD3 | BWD2 | BWD1 | EQ |
| **BWAL** | BWD2 | BWD1 | EQ | BTD1 |
| **BTAL** | BWD1 | EQ | BTD1 | BTD2 |
| **BTBW** | EQ | BTD1 | BTD2 | BTD3 |

#### Powerplay & Slog (Rows A–E):
Selected based on phase, bowling craft, and death bowling designation:
- **Powerplay**:
  - Pacer (RF, RFM, RM, LF, LFM, LM) ──► `PWP: PC`
  - Spinner (RO, RL, LO, LC) ─────────► `PWP: SP`
- **Slog**:
  - Death Bowler (`D` marker) ────────► `SLG: DB`
  - Other Pacer ──────────────────────► `SLG: PC`
  - Other Spinner ────────────────────► `SLG: SP`

#### Row F Bowling Resolution:
- **Master Bowling**: Governed by **Star Dominance**:
  - Bowling Team Stars > Batting Team Stars ──► Read `5★` line
  - Bowling Team Stars == Batting Team Stars ─► Read `4★` line
  - Bowling Team Stars < Batting Team Stars ──► Read `3★` line
- **Powerplay & Slog Bowling**: Governed by **Bowler Style Group**:
  - `LF/LFM` · `RF/RFM` · `RM/LM` · `RO/RL` · `LO/LC`

---

### 5.3 Batting Sheet & Line Selection
#### Middle Overs (Rows A–E):
1. Batsman has passed his listed **Star ★ runs threshold** ──► `HS/★`
2. Batsman role is `BWAL` or `BW` ──────────────────────────► `BWAL/BW`
3. All other batsmen (BAT, BTBW, BTAL, WK, or F outside Slog) ──► Evaluated via **Matchup Grid B**:
   - `RF` / `RFM`: v RHB = `NS`, v LHB = `LS`
   - `LF` / `LFM`: v RHB = `LS`, v LHB = `NS`
   - `RM`: v RHB = `HS/★`, v LHB = `NS`
   - `LM`: v RHB = `NS`, v LHB = `HS/★`
   - `RO`: v RHB = `HS/★`, v LHB = `LS`
   - `LC`: v RHB = `HS/★`, v LHB = `LS`
   - `LO`: v RHB = `LS`, v LHB = `HS/★`
   - `RL`: v RHB = `LS`, v LHB = `HS/★`

#### Middle Overs Row F:
Read by **Bowler Role**: `v BW` · `v BWAL` · `v BTAL` · `v BTBW`

#### Powerplay & Slog (Rows A–E):
- **Powerplay**:
  - Opener (`O` marker) ──────────────► `PWPO`
  - Everyone else ────────────────────► `PWPR`
- **Slog**:
  - The designated Finisher (`F`) ────► `SLG F`
  - Everyone else ────────────────────► `SLG R`
- **Any Over in PP/Slog**:
  - `BW` role batsman ────────────────► `BW`

#### PP/Slog Batting Row F:
Read by **Batsman Status**: `★` (Star past runs) · `BW` · `BWAL` · `REST`

---

## 6. The Card Decks (87 Total Cards)

1. **Wicket Cards (25 Cards)**:
   - 4 LBW (immediate)
   - 6 Bowled (immediate)
   - 5 Catch (Fielding card -> Skills card)
   - 3 Stumping or Caught Behind (Conditional: pace = keeper catch; spin/medium = keeper stumping)
   - 2 Caught Behind (Keeper catch skill)
   - 1 Caught & Bowled (Bowler catch skill)
   - 2 Run Out at Striker's End (Fielder run-out skill)
   - 2 Run Out at Non-Striker's End (Fielder run-out skill, non-striker dismissed)

2. **Fielding Cards (20 Cards)**:
   - Values 1 to 20 representing squad numbers. If squad number is not currently fielded in the active XI/7, result is **"No Fielder"** (catch dropped or missed run out chance).

3. **Skills Cards (20 Cards)**:
   - Evaluates whether fielder succeeds based on their skill tier: **Red (Best)**, **Green (Good)**, **Blue (Average)**.
   - Contains 5 rows: Keeper Catch, Keeper Stumping, Keeper Run Out, Fielder Catch, Fielder Run Out.

4. **Runs Cards (16 Cards)**:
   - Decides outcomes of missed chances, extras, and Free Hits.
   - **App-Now Extras Engine**: Converts 8 of 16 cards into legal dot balls, mitigating excessive extras while preserving printed sheet balance.

5. **Power Cards (6 Cards · Captains Only)**:
   - 2 Reroll (1 per captain)
   - 2 Wonderful Shot (Batting captain, 30/36 boundaries 4 or 6, no wicket)
   - 2 Great Delivery (Bowling captain, 22/36 wickets)
   - DRS: Batting captain can burn Reroll on LBW/CB; roll single die, 5–6 = Not Out (dot ball).

---

## 7. Dynamic Form Stars & League Standings

- **Printed Stars Baseline**: IND (5★), PAK (5★), SL (5★), AUS (5★), BAN (4★), ENG (4★), SA (4★), NZ (4★), AFG (3★), WI (3★).
- **Form Stars Formula**: Evaluated separately per format (5 ov vs 10 ov). Teams with ≥2 completed matches are ranked by:
  1. Win % (Tie = 0.5 win)
  2. Net Run Rate (NRR), treating all-out innings as full overs quota.
  3. Printed stars.
  4. Team ID code.
- **Tiers**:
  - Rank 1–4 = 5★
  - Rank 5–8 = 4★
  - Rank 9+ = 3★
- **Match Snapshot**: At match creation, both teams' active form stars are locked and recorded into the match record.
