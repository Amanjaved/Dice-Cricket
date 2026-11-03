# Dice Cricket King · Ambiguities & Decisions Log

This document records all rules and edge cases not explicitly defined in the printed material or documentation, together with the chosen faithful design decisions.

---

### 1. Strike Rotation on Odd Runs and Over-End
- **Ambiguity**: How is strike rotated across singles, 3s, over completion, and dismissals?
- **Decision**: 
  - On 1 or 3 runs scored off the bat or as byes/leg-byes, the striker and non-striker swap ends immediately.
  - On boundaries (4 or 6) or dots (0) or even runs (2), strike is retained.
  - At the end of an over (after 6 legal deliveries), strike rotates between striker and non-striker for the next over.
  - After a dismissal:
    - Caught, Bowled, LBW, Stumped, Caught Behind, Caught & Bowled: Incoming batsman takes the striker's position.
    - Run Out Striker's End: Striker is dismissed; incoming batsman takes striker's crease.
    - Run Out Non-Striker's End: Non-striker is dismissed; incoming batsman takes non-striker's crease; current striker retains strike.

---

### 2. Free Hit Dismissal Mechanics
- **Ambiguity**: On a Free Hit, what dismissals are possible when the ball is directly resolved by a Runs card?
- **Decision**:
  - The Stitch Free Hit Engine screen confirms: On a Free Hit, Bowled, Caught, LBW, and Stumped are NOT OUT. Run Out remains a legal dismissal.
  - When the user draws a Runs Card on a Free Hit, the card directly assigns the runs scored off the delivery (0 to 6).
  - To allow a run-out dismissal on a Free Hit (if the batsmen attempt an extra run and get run out), the scorer can use the **Custom Ball** action with dismissal type `Run Out`.

---

### 3. Fielding Card Squad Mapping for Non-Playing Players
- **Ambiguity**: What happens when a Fielding Card draws a squad number between 1 and 20 that is not in the active Playing XI or Playing 7?
- **Decision**:
  - The rule in md §9.1 and the rule book states: If that number is not in the Playing XI/7, it is **"No Fielder"**: nobody was there, and the chance goes begging.
  - On a missed chance due to "No Fielder", the app draws a Runs Card from the "No Fielder" column to determine additional runs scored by the batsmen.

---

### 4. Player Ranking & Rating System Constants
- **Ambiguity**: The md states: "Points for each innings are compared with average for that format and ground. Older innings ×0.9. Average player is about 500. Reliability builds up to 5 innings; min 2 innings to be listed. All-rounder = batting × bowling / 1000." Exact baseline weights are not detailed in full.
- **Decision**:
  - Batting Innings Points = `(Runs * 10) + (StrikeRate * 0.5) + (Boundaries4 * 2) + (Boundaries6 * 4) + (IsNotOut ? 15 : 0)`.
  - Bowling Innings Points = `(Wickets * 50) + (Dots * 5) - (RunsConceded * 3) - (EconomyRate * 2)`.
  - Exponential decay of 0.9 per past match: `WeightedAverage = Sum(Points_i * 0.9^i) / Sum(0.9^i)`.
  - Reliability factor `min(1.0, inningsCount / 5.0)`.
  - Calibrated so baseline average is approximately 500 rating points.

---

### 5. DPL Auction Pricing & Seeding
- **Ambiguity**: How is fair value calculated for retention and auto-bidding?
- **Decision**:
  - Player Base Fair Value = `(StarRating * 2000) + (HasStarMarker ? 3000 : 0) + (IsFinisher || IsDeathBowler ? 2000 : 0) + (FieldingSkillScore * 500)`.
  - Retention price = player's fair value deducted from the 50,000 franchise point purse.
  - Seeded random sequence using standard pseudo-random generator with the stored season seed.
