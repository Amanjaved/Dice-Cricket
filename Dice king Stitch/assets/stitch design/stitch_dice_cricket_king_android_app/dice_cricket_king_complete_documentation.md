# Dice Cricket King · Complete Documentation

**Faiz Dice Games (FDG) · © 2026 Tanweer · All rights reserved**
App: "Dice Cricket · Faiz Dice Games" (a web app built on Floot; not published yet)

This file records all the cricket work done so far in one place: the game rules, sheets, cards, teams and players, every screen and feature of the app, DPL, rankings, Customise, the print files and the balance figures.
**Not included:** the eight wicket animations (Bowled, LBW, Catch, Caught behind, Caught & bowled, Run out, Stumped, Hit wicket) and the 1/2/3-run ground animation. This is the latest animation work, left out as you asked (it has not been added to the app yet either).

> Note: anything that could not be confirmed against the code is marked "(to be checked)".

---

## Contents
1. The game and the brand
2. Game components (dice, sheets, cards)
3. Formats: 5 overs and 10 overs
4. The three grounds: HSG, NSG, LSG
5. How a ball is played
6. Bowling sheets: which line
7. Batting sheets: which line
8. Row F (the purple row): all the rules
9. The wicket system: Wicket, Fielding and Skills cards
10. Runs cards (16) and extras
11. Power cards (6) and Review (DRS)
12. Special players: Star, Opener, Finisher, Death bowler, Captain, Keeper
13. Stars, form stars and star dominance
14. Super Over and ties
15. Teams and the Players Database (all 200 players)
16. Suggested Playing 7 and Playing XI
17. App: navigation and Home screen
18. App: new match setup
19. App: the live scoring screen (every part)
20. App: Scorecard, Summary, Ball by ball
21. App: tournaments
22. App: Stats, records, ratings, rankings
23. App: Teams page, custom teams, adding players
24. App: DPL (Dice Premier League)
25. App: Customise page (themes, layouts, animations)
26. App: data, backup and reset
27. Sheets page
28. Balance and simulation figures
29. Print files (sheets, cards, rule book)
30. Future plans
31. Work done so far, in order

---

## 1. The game and the brand

- **Name:** Dice Cricket King by FDG (FDG = Faiz Dice Games).
- **App name:** Dice Cricket · Faiz Dice Games.
- **Copyright line** (on every sheet, card and rule book page): "© 2026 Tanweer · Faiz Dice Games · All rights reserved · Not to be copied, reproduced, shared or sold without written permission".
- **Core idea:** two dice decide every ball, but every decision belongs to the player: who bowls, the batting order, who captains, when to play a power card.
- **Two dice:** the red die picks the row (A–F), the blue die picks the column (1–6). Every sheet has 6×6 = 36 cells.

## 2. Game components

### 2.1 Dice and sheets
- Two dice: red (row A–F) and blue (column 1–6).
- Four master sheets for each ground:
  1. **Master Bowling** (middle overs, bowling)
  2. **Master Batting** (middle overs, batting)
  3. **Powerplay & Slog Bowling**
  4. **Powerplay & Slog Batting**
- 3 grounds × 4 sheets = **12 sheets** (the printed v2 set).
- Each cell lists several lines; a player reads only his own line. A large "FOR ALL" cell is the same for everyone.
- **Row F is purple on every sheet** (with the text and stripes inside in purple shades), so it stands out.
- The sheets are labelled "For 5 and 10 overs".

### 2.2 Cards (87 in total)
| Deck | Count | Purpose |
|---|---|---|
| Wicket cards | 25 | After an X, says how the batsman is out |
| Runs cards (blue deck) | 16 | Runs after a missed chance, the kind of extra, free-hit runs |
| Fielding cards | 20 | Which fielder the chance went to (1–20 = squad number) |
| Skills cards | 20 | Whether the fielder took or missed the chance (by colour) |
| Power cards | 6 | 2 Reroll, 2 Wonderful Shot, 2 Great Delivery |

- Card size: Bridge 57×89 mm, all the same size.
- **No card carries a "No. N" number**, so nobody can tell a result from the number (fielding position numbers are card content and stay).

## 3. Formats: 5 overs and 10 overs

| Format | Players | All out at | Bowling limit | Powerplay | Slog |
|---|---|---|---|---|---|
| 5 overs | 7 a side | 6 wickets | 2 bowlers may bowl 2 overs, the rest 1 | Over 1 | Over 5 |
| 10 overs | 11 a side | 10 wickets | Max 2 overs each | Overs 1–2 | Overs 9–10 |

- All other overs are the **middle overs**.
- **No bowler bowls two overs in a row.**
- App rule: Powerplay = the first fifth of the innings (`ceil(overs/5)`), Slog = the last fifth.
- Older saved 5-over matches that were played with 11 players keep their 11.
- If no bowler is allowed under the rules, everyone with quota left becomes available again.
- In 7-a-side, once two bowlers have bowled 2 overs, everyone else is limited to 1 over.

## 4. The three grounds: HSG, NSG, LSG

Every match (and every tournament fixture) picks its ground, and the whole match uses that ground's four sheets. The rules never change; only the numbers inside the sheets do.

| Ground | Full name | Sheet colour | 5 overs (about, usual range) | 10 overs (about, usual range) | What changes |
|---|---|---|---|---|---|
| HSG | High Scoring Ground | Red | ~90 (75–110) | ~197 (170–225) | Very few dots, fewer wickets, many more 4s and 6s |
| NSG | Normal Scoring Ground | Green | ~68 (56–80) | ~150 (130–170) | The normal game the sheets were built on |
| LSG | Low Scoring Ground | Yellow | ~42 (30–54) | ~95 (75–115) | Many dots, more wickets, boundaries are hard |

- Older matches without a ground count as NSG.
- Stats have a ground filter.
- **Sheet sets:** older matches run on "set 1" (the first ground sheets) and new matches on "set 2" (the printed v2 sheets). A match with no set recorded counts as set 1.

## 5. How a ball is played

1. **Bowling roll:** roll both dice on the bowling sheet and read only your line.
2. **Result:**
   - `D` or `0`: dot ball
   - `X`: wicket (draw a Wicket card)
   - `+`: extra (draw a Runs card)
   - `B` (Ball): go to the batting roll
   - Row F may also print a wicket code (BLD, LBW, CT, CB, C&B, ST, R/O, HW)
3. **Batting roll:** roll again on the batting sheet. The result is 0, 1, 2, 3, 4 or 6 runs, or X (Wicket card).

**Example:** middle overs, a RHB faces an RF bowler, so he reads the NS line. The dice show red 2, blue 4: cell B4. The cell lists HS/★, NS, LS and BWAL/BW; he reads only NS. A FOR ALL cell is the same for every line.

## 6. Bowling sheets: which line

### 6.1 Middle overs · Master Bowling
The line comes from player types alone: **bowler type × the batsman on strike**. Team stars are not part of it; they only touch row F.

| Bowler ↓ / batsman → | v BW | v BWAL | v BTAL/WK | v BAT/BTBW |
|---|---|---|---|---|
| BW | BWD3 | BWD2 | BWD1 | EQ |
| BWAL | BWD2 | BWD1 | EQ | BTD1 |
| BTAL | BWD1 | EQ | BTD1 | BTD2 |
| BTBW | EQ | BTD1 | BTD2 | BTD3 |

- BWD3 = Bowling Domination 3 (the bowler most on top).
- EQ = Equal.
- BTD3 = Batting Domination 3 (the batsman most on top).
- In the code: bowler rank (BW 0, BWAL 1, BTAL 2, BTBW 3) + batsman rank (BW 0, BWAL 1, BTAL/WK 2, BT/BTBW 3) = line number 0–6.
- Row F of Master Bowling follows the stars (see sections 8 and 13).

### 6.2 Powerplay & Slog Bowling (5 lines)
| Line | When |
|---|---|
| PWP: PC | A pacer in the Powerplay |
| PWP: SP | A spinner in the Powerplay |
| SLG: PC | A pacer in the Slog |
| SLG: SP | A spinner in the Slog |
| SLG: DB | A death bowler in the Slog (pacer or spinner) |

- **Spinners:** RO, RL, LO, LC (older files wrote LC as LW).
- **Pacers:** RF, RFM, RM, LF, LFM, LM.
- There is no DB line in the Powerplay.
- In set 2, row F of this sheet is read by bowling style (see section 8).

### 6.3 Bowling style names
RF = Right-arm fast · RFM = Right-arm fast-medium · RM = Right-arm medium · RO = Right-arm off-spin · RL = Right-arm leg-spin · LF = Left-arm fast · LFM = Left-arm fast-medium · LM = Left-arm medium · LO = Left-arm orthodox spin · LC = Left-arm wrist spin

## 7. Batting sheets: which line

### 7.1 Middle overs · Master Batting (4 lines: HS/★, NS, LS, BWAL/BW)
1. A ★ Star past his listed runs reads **HS/★**.
2. A BWAL or BW batsman reads **BWAL/BW**.
3. Everyone else (BAT, BTBW, BTAL, WK, and an F batsman in the middle overs) reads HS, NS or LS from **matchup grid B**:

| Bowler | v RHB | v LHB |
|---|---|---|
| RF | NS | LS |
| RFM | NS | LS |
| LF | LS | NS |
| LFM | LS | NS |
| RM | HS/★ | NS |
| LM | NS | HS/★ |
| RO | HS/★ | LS |
| LC | HS/★ | LS |
| LO | LS | HS/★ |
| RL | LS | HS/★ |

- Principle: a ball turning or moving into the bat means higher scoring.
- Older set-1 matches use the older grid: LF/LFM/LM v LHB NS, v RHB LS; RF/RFM/RM v RHB NS, v LHB LS; RL/RO v RHB LS, v LHB HS; LC/LO v LHB LS, v RHB HS.
- Row F of Master Batting follows the bowler's type (v BW · v BWAL · v BTAL · v BTBW).

### 7.2 Powerplay & Slog Batting
| Line | Who |
|---|---|
| PWPO | Openers (O) in the Powerplay |
| PWPR | Everyone else in the Powerplay |
| SLG F | The one Finisher in the Slog |
| SLG R | Everyone else in the Slog |
| BW | A BW batsman, in any of these overs |

- Row F follows the batsman: ★ (Star) · BW · BWAL · Rest.
- A Super Over counts as one Slog over.

### 7.3 Sheet roles the scorer can set (app, "At the crease" panel)
- **Auto:** Star / Opener / Finisher by the rules.
- **Ignore Star / Opener / Finisher:** rules switched off for him.
- **Treat as Finisher:** treated as the Finisher in the Slog.
- **Force Star ★:** HS/★ line in the middle overs.

## 8. Row F (the purple row): all the rules

| Sheet | Row F is read by |
|---|---|
| Master Bowling (set 2, new matches) | **Star dominance:** bowling team has more stars → 5★ list; equal stars → the middle 4★ list; fewer stars → 3★ list |
| Master Bowling (set 1, older matches) | The bowling team's own stars (5★ / 4★ / 3★) |
| Master Batting | The bowler's type: v BW · v BWAL · v BTAL · v BTBW |
| Powerplay & Slog Bowling (set 2) | The bowling style group: LF/LFM · RF/RFM · RM/LM · RO/RL · LO/LC. Result: a dot, a ball, or a wicket code |
| Powerplay & Slog Bowling (set 1) | Pacer / Spinner, or SLG: DB for a death bowler in the Slog |
| Powerplay & Slog Batting | The batsman: ★ Star · BW · BWAL · Rest |

### 8.1 Row F wicket codes (Powerplay & Slog Bowling)
| Code | Meaning | What happens next |
|---|---|---|
| BLD | Bowled | Out straight away |
| LBW | Leg before wicket | Out straight away (can be reviewed with DRS) |
| HW | Hit wicket | Out straight away |
| CB | Caught behind | The keeper is known: only his Skills card |
| ST | Stumped | The keeper is known: only his Skills card |
| C&B | Caught & bowled | The bowler is known: only his Skills card |
| CT | Caught | Fielding card first, then the Skills card |
| R/O | Run out | Fielding card first, then the Skills card |

- When row F names the wicket, no Wicket card is drawn.
- The app notes such a ball as "Row F: X".
- `R/O` on a sheet is a wicket code, not an "a/b" split cell.

## 9. The wicket system

### 9.1 Order of play
1. An **X** on the bowling or batting roll: draw a Wicket card. It says how the batsman is out.
2. If a fielder is involved (catch, run out, stumping):
   - **Fielder's chance:** draw a Fielding card (1–20). The player with that squad number is the fielder. If that number is not in the Playing XI, it is **"No fielder"**: nobody was there and the chance goes begging.
   - **Keeper's chance** (caught behind, stumping): the keeper is already known.
   - **Bowler's chance** (caught & bowled): the bowler is already known.
   - If the Fielding card names the keeper, he counts as the keeper; if it names the bowler, he counts as the bowler.
3. **Skills card:** the fielder's colour (Red = Best, Green = Good, Blue = Average) decides whether the chance is taken or missed.
4. A missed chance (catch dropped, stumping missed, run-out miss, no fielder) draws a **Runs card** for the runs.
5. On a run-out **direct hit**, the Runs card also gives the runs completed before the batsman is out.

### 9.2 Kinds of wicket (app)
| Kind | Label | Whose chance |
|---|---|---|
| lbw | LBW | Nobody (out straight away) |
| bowled | Bowled | Nobody |
| caught | Catch | Fielder, catch skill |
| caughtBehind | Caught behind | Keeper, catch skill |
| stumped | Stumping | Keeper, stumping skill |
| caughtAndBowled | Caught & bowled | Bowler, catch skill |
| runOutStriker | Run out at striker's end | Fielder, run-out skill |
| runOutNonStriker | Run out at non-striker's end | Fielder, run-out skill (non-striker out) |
| hitWicket | Hit wicket | Nobody (only from a row-F "HW" code or Custom ball; the deck has no such card) |

- The Wicket card result also depends on the bowler's style. Caught-behind cards apply to pace bowlers (LF, RF, LFM, RFM); on other styles the same card reads differently (`kindFor(card, style)` in the code).

### 9.3 Skills cards (20)
Each card has five rows, and each row says which colours succeed. R/G/B = Red/Green/Blue succeeds; ○ = that colour fails on this card.

| Skill card | Keeper catch | Keeper stumping | Keeper run-out | Fielder catch | Fielder run-out |
|---|---|---|---|---|---|
| 1 | R ○ B | R G B | R ○ ○ | ○ G B | R G ○ |
| 2 | R G B | R G B | ○ G ○ | R ○ ○ | R ○ B |
| 3 | R G B | ○ G B | ○ G ○ | R G ○ | R G ○ |
| 4 | R G B | ○ G B | ○ G ○ | R ○ B | R G ○ |
| 5 | R G B | R G B | ○ G ○ | ○ G B | R G ○ |
| 6 | R G ○ | R ○ B | R ○ B | R G ○ | ○ G B |
| 7 | R G B | R G B | ○ G ○ | R ○ B | R ○ B |
| 8 | ○ G B | R ○ B | R ○ ○ | R G ○ | R ○ ○ |
| 9 | R G B | R G B | ○ G ○ | R ○ B | R ○ B |
| 10 | R G ○ | R ○ B | R ○ B | R G ○ | R ○ ○ |
| 11 | R G B | R G ○ | ○ G ○ | R ○ B | ○ G B |
| 12 | R G B | R G ○ | ○ G ○ | R G ○ | R ○ ○ |
| 13 | R ○ B | R G ○ | R ○ B | R ○ B | R ○ B |
| 14 | ○ G B | R G ○ | R ○ B | R G ○ | R ○ ○ |
| 15 | R G ○ | R G B | R ○ B | R G ○ | R ○ ○ |
| 16 | R G ○ | R G B | R G ○ | ○ G B | ○ G B |
| 17 | R G B | R G B | R ○ B | R G ○ | ○ G ○ |
| 18 | R G B | R G B | ○ ○ B | R G ○ | ○ G ○ |
| 19 | R G B | R G B | R ○ B | R ○ B | ○ G B |
| 20 | R ○ B | R G B | R ○ ○ | ○ G B | R G ○ |

## 10. Runs cards (16) and extras

- **Codes:** `2` = runs off the bat; `B1` = byes; `L2` = leg byes; `W` / `W+2` = wide (+ extra runs); `NB` / `NB+3` = no ball (+ runs off the bat).
- **A no ball makes the next ball a Free hit.**
- **Free hit:** read the free-hit column of the Runs card. A BW batsman has his own column; everyone else uses the other.

| Card | Catch dropped: fielder | Catch dropped: keeper/bowler | No fielder: catch | No fielder: run-out | Stumping missed | Run-out HIT: fielder · bowler · keeper | Run-out MISSED: fielder · bowler · keeper | Extras (printed card) | Extras (app now) | Free hit: others | Free hit: BW batsman |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 0 | 0 | 1 | 1 | 0 | 0 · 0 · 0 | 0 · 0 · 0 | W | Dot ball (no extra) | 0 | 0 |
| 2 | 0 | 0 | 1 | 1 | 0 | 0 · 0 · 0 | 0 · 0 · 0 | W+1 | Dot ball (no extra) | 1 | 0 |
| 3 | 1 | 0 | 2 | 1 | 0 | 0 · 0 · 0 | 1 · 0 · 0 | W+2 | W | 2 | 0 |
| 4 | 1 | 0 | 2 | 2 | 0 | 0 · 0 · 0 | 1 · 0 · 0 | W+3 | Dot ball (no extra) | 3 | 0 |
| 5 | 1 | 0 | 2 | 2 | 0 | 0 · 0 · 0 | 1 · 0 · 1 | W+4 | L1 | 4 | 0 |
| 6 | 2 | 0 | 2 | 2 | 0 | 0 · 0 · 0 | 1 · 0 · 1 | NB | Dot ball (no extra) | 4 | 0 |
| 7 | 2 | 1 | 2 | 2 | 0 | 0 · 0 · 0 | 1 · 0 · B1 | NB+1 | NB | 4 | 0 |
| 8 | 2 | 1 | 3 | 2 | W | 0 · 0 · 0 | 1 · 0 · B1 | NB+2 | Dot ball (no extra) | 4 | 0 |
| 9 | 2 | 2 | 3 | 2 | W+1 | 1 · 0 · 0 | 2 · 1 · B1 | NB+3 | B1 | 6 | 1 |
| 10 | 2 | 2 | 3 | 3 | W+2 | 1 · 0 · 0 | 2 · 1 · B1 | NB+4 | W+1 | 6 | 2 |
| 11 | 3 | 3 | 3 | 3 | W+3 | 1 · 0 · 0 | 2 · 1 · B1 | NB+6 | Dot ball (no extra) | 6 | 3 |
| 12 | 3 | 3 | 3 | 3 | W+4 | 1 · 1 · 0 | 2 · 2 · B1 | B4 | NB+1 | 6 | 4 |
| 13 | 4 | 4 | 4 | L1 | B1 | 1 · 1 · 0 | 2 · L1 · B1 | L1 | L2 | 6 | 4 |
| 14 | 4 | 4 | 4 | L1 | B2 | 2 · 1 · 0 | 2 · L1 · B1 | L2 | Dot ball (no extra) | 6 | 4 |
| 15 | 6 | 4 | 4 | L2 | B3 | 2 · 1 · 1 | 3 · L1 · B1 | L3 | W+2 | 6 | 4 |
| 16 | 6 | 4 | 6 | L3 | B4 | 2 · 1 · 1 | 3 · L1 · B1 | L4 | Dot ball (no extra) | 6 | 6 |

### 10.1 Fewer extras (app rule)
- The printed sheets and printed cards are unchanged; this is an app-only change.
- When a "+" comes up, the Runs card the app draws gives a **plain dot ball** in 8 of 16 cases: no extra, a legal ball.
- The other 8 give light extras: W, W+1, W+2, NB, NB+1, B1, L1, L2. The heavy ones (W+3, W+4, NB+3 to NB+6, B4, L3, L4) were removed.
- App message: "Extra? Draw a runs card: a wide, no ball, bye or leg bye, or just a dot ball."
- The app also has an "Extras help" card that explains the kinds of extra.
- Effect (simulation, IND v PAK): 5 overs, extra runs per innings fell from 6.3 to 2.4 and extra balls from 2.9 to 1.5; 10 overs, from 10.1 to 3.6 runs and from 4.8 to 2.4 balls.

## 11. Power cards (6) and Review (DRS)

| Card | Count | Held by | What it does |
|---|---|---|---|
| Reroll | 2 (one per captain) | Each team's captain | Cancel his own roll and roll again: both dice, or only the red or only the blue (**Half Reroll**, one die is kept) |
| Wonderful Shot | 2 | A BAT / BTBW / BTAL / WK captain | While on strike, cancel the batting roll and roll the card's grid: 30 of 36 cells are 4 or 6 (6 ×18, 4 ×12, 2 ×3, 1 ×3), no wicket |
| Great Delivery | 2 | A BW / BWAL captain | While bowling, cancel the bowling roll and roll the card's grid: 22 of 36 are wickets (X 22, D 12, B 1, + 1) |

**Rules:**
- **Only captains** play power cards. A batting card only while the captain himself is on strike; a bowling card only while the captain himself is bowling.
- A captain's Reroll works only on the sheet of his category: a BW/BWAL captain on the bowling sheet, everyone else on the batting sheet.
- A card is played **straight after** the roll, before anything else happens. A team never rerolls the other team's roll.
- Power cards can be played on the **last ball of an over** too (also after an undo).
- No power cards in a Super Over.
- On the Great Delivery grid a B goes to a batting roll and a + is an extra.
- Older saved matches may hold an extra Reroll for the toss winner; new matches do not.

**Best use (rule book):**
| Card | Best moment | Don't waste it on |
|---|---|---|
| Reroll | A wicket result on the captain's own roll | A dot ball early in the innings |
| Wonderful Shot | The last over of a close chase | A roll that already gave 4 or 6 |
| Great Delivery | A set Star, or the Finisher in the Slog | A tail-ender who is already struggling |

**Review (DRS):** a batting captain given out LBW or caught behind may spend his Reroll to review. One die is rolled: 5–6 = not out (dot ball). DRS also works on a row-F LBW.

## 12. Special players

| Mark | Who | Rule |
|---|---|---|
| ★ (S+runs) | Star | Once past his listed runs: HS/★ line in the middle overs and ★ on row F in the Powerplay and Slog |
| O | Opener | PWPO line in the Powerplay (3 openers per team) |
| F | Finisher | Only one F batsman is the Finisher, and only in the Slog (SLG F). Before the Slog he bats by his normal type |
| D (DB) | Death bowler | SLG: DB line in the Slog, with more dots and wickets than any other bowler |
| C | Captain | Holds the power cards; one captain per team |
| WK | Wicket-keeper | Keeping skills (catch, run-out, stumping); if the XI has no WK, the last player in the XI keeps |

- **Who is the Finisher:** the first F batsman in the batting order who is not out. A Finisher chosen by the scorer always wins.
- **"Who goes in as the Finisher?":** in the Slog, when a new batsman is about to come in, the Finisher is not in yet and there are 2 or more F batsmen to choose from, the app asks. Anyone not picked reads SLG R.
- **Player types:** BW = Bowler · BWAL = Bowling all-rounder · BTAL = Batting all-rounder · BTBW = Top-order bat who bowls · BAT = Batter · WK = Wicket-keeper.
- **Batting type:** BTBW and BAT = "BT/BTBW"; BTAL and WK = "BTAL/WK"; BWAL = "BWAL"; BW = "BW".
- **Bowling type:** BAT and WK do not bowl; the others keep their role's type.
- **Fielding skills:** catch and run-out, each Red / Green / Blue. A keeper also has catch, run-out and stumping.

## 13. Stars, form stars and star dominance

### 13.1 Printed stars (starting point)
- **5★:** India, Pakistan, Sri Lanka, Australia
- **4★:** Bangladesh, England, South Africa, New Zealand
- **3★:** Afghanistan, West Indies

### 13.2 Form stars (dynamic stars)
- 5-over and 10-over cricket are separate formats.
- Teams with 2 or more completed matches in a format are ranked by **win %** (a tie = half a win). Ties are broken by **NRR**, then printed stars, then team code.
- **Rank 1–4 = 5★, 5–8 = 4★, 9 and below = 3★.**
- A team with fewer than 2 matches keeps its printed stars.
- In NRR an all-out innings counts as the full quota of overs.
- Super Overs are not counted.
- **Snapshot:** when a match starts, both teams' stars are saved in the match and do not change mid-match.
- The Teams page has a "Form stars" table (5 / 10 overs) showing each team's printed stars, current stars, rank, matches, wins, win % and NRR, with up/down movement.
- Match setup shows these form stars next to the teams.

### 13.3 Star dominance
- Strength between teams comes **only from stars**, never from real-world strength.
- 5★ v 5★, 4★ v 4★ and 3★ v 3★ play on equal terms; 5★ dominates 4★ and 3★, and 4★ dominates 3★.
- **How it is applied** (Master Bowling, set 2):

| Matchup | Row F list |
|---|---|
| Equal stars | The middle 4★ list |
| Bowling team has more stars (5v4, 5v3, 4v3) | 5★ list (bowling on top) |
| Bowling team has fewer stars | 3★ list |

- Row F label in the app: "Bowling team has MORE ★ than the batting team" / "Both teams have the SAME ★" / "Bowling team has FEWER ★ than the batting team".
- Line on the match page: "★ IND 5★ v PAK 5★ · equal stars: even match" or "... AUS dominate on stars".
- Older set-1 matches keep the old rule (the bowling team's own stars).
- Simulation at the time (10 overs): average wins 5★ teams 66%, 4★ 45%, 3★ 21%.

## 14. Super Over and ties

- A tied match goes to a **Super Over:** each team nominates 3 batsmen and 1 bowler, one over, Slog sheets, 2 wickets end it, no power cards.
- **A tied Super Over** means another Super Over; players from the last Super Over sit out.
- The app says which side bats first (from the previous Super Over or the match).
- A **knockout** needs a winner, so as many Super Overs as it takes. A league or friendly match may "Leave it as a tie".
- A Super Over uses the match's sheet set.
- Each Super Over appears separately in the Scorecard, Summary and Ball by ball tabs.
- **Tie roll-off** (older feature): unused Rerolls can re-roll a team's own die.

## 15. Teams and the Players Database

10 teams, 20 players each (Players Database A4, October 2026, printed order). Squad numbers 1–20 follow this order.
**Captain changes:** SA Shawn → Siyabonga, NZ Reynolds → David, AFG Bakhtiar → Reza, WI Keston → Devnarain.
**Team colours:** deliberately moved away from the official kit colours (SA pink, BAN red, WI brown, etc.).

### 15.1 Team summary
| Team | Code | Printed stars | Colour | Captain | Death bowlers (D) | Finishers (F) | Openers (O) | Star players (runs) |
|---|---|---|---|---|---|---|---|---|
| Australia | AUS | ★★★★★ 5 | `#f4b942` | Declan | Victor, Abhay | Declan, Alex, Ethan, Victor | Malcolm, Flynn, Haden | Haden (17) |
| Sri Lanka | SL | ★★★★★ 5 | `#6c5ce7` | Sanjeeva | Milindu, Naveen | Oshada, Banduka, Milindu, Sadeera | Sanjeeva, Tharindu, Oshan | Sanjeeva (20), Oshan (15) |
| Pakistan | PAK | ★★★★★ 5 | `#14b8a6` | Daniyal | Huzaifa, Faizan | Danish, Basit, Khalid, Aryan | Daniyal, Murtuza, Umair | Daniyal (20), Umair (20) |
| India | IND | ★★★★★ 5 | `#ff8c4a` | Debashish | Ojas, Javed | Tejas, Randeep, Maneesh, Satyam | Debashish, Arham, Aditya | Debashish (25), Rana (18) |
| Bangladesh | BAN | ★★★★ 4 | `#d62f2f` | Faisal | Ashish | Hussain, Faisal, Asad | Habib, Hirday, Qais | Hirday (25) |
| England | ENG | ★★★★ 4 | `#4f8ff7` | Joshua | Eric | Jack, Hudson, Joshua | Arthur, Kent, Habeeb | Joshua (30) |
| South Africa | SA | ★★★★ 4 | `#e8649b` | Siyabonga | Teboho | Justin, Aviral, Tanvir | Shawn, Jabulani, Sadiq | Sadiq (25) |
| New Zealand | NZ | ★★★★ 4 | `#7c6fa8` | David | Ibrahim | Tyler, Nathan, David | Harvey, Bennet, Hasan | Harvey (25) |
| Afghanistan | AFG | ★★★ 3 | `#2dd4bf` | Reza | Taimur | Besharat, Mursalin, Reza | Arqam, Muhib | Arqam (30) |
| West Indies | WI | ★★★ 3 | `#8a5a34` | Devnarain | Mohammad | Williams, Akhtar, Devnarain | Omar, Devnarain | Devnarain (10) |

### 15.2 All players
Colours: Red = Best, Green = Good, Blue = Average.

#### Australia (AUS) · ★★★★★ (5★ printed) · team colour `#f4b942`

| No. | Player | Role | Bats | Bowls | Fielding (catch · run-out) | Keeping (catch · run-out · stumping) | Marks |
|---|---|---|---|---|---|---|---|
| 1 | Declan | BTBW | RHB | RM | Red · Red | — | F Finisher, C Captain |
| 2 | Ben | BTBW | RHB | RO | Red · Green | — | — |
| 3 | Alex | BAT | LHB | — | Red · Red | — | F Finisher |
| 4 | Malcolm | BAT | RHB | — | Red · Red | — | O Opener |
| 5 | Flynn | BAT | LHB | — | Red · Green | — | O Opener |
| 6 | Lachlan | BTAL | RHB | RM | Blue · Green | — | — |
| 7 | Jonathan | BTAL | LHB | LO | Red · Red | — | — |
| 8 | Ethan | BTAL | LHB | LM | Red · Green | — | F Finisher |
| 9 | Owais | BTAL | LHB | LO | Red · Green | — | — |
| 10 | Kunal | WK | RHB | — | Green · Red | Red · Blue · Green | — |
| 11 | Haden | WK | LHB | — | Red · Green | Red · Green · Red | ★ Star from 17 runs, O Opener |
| 12 | Victor | BWAL | LHB | LFM | Green · Red | — | F Finisher, D Death bowler |
| 13 | Noah | BWAL | RHB | RO | Green · Blue | — | — |
| 14 | Harrison | BW | RHB | RL | Green · Blue | — | — |
| 15 | Scott | BW | LHB | LO | Green · Red | — | — |
| 16 | Abhay | BW | RHB | RFM | Blue · Blue | — | D Death bowler |
| 17 | Neville | BW | RHB | RF | Green · Red | — | — |
| 18 | Harvey | BW | RHB | RO | Green · Blue | — | — |
| 19 | Ali | BW | LHB | LC | Red · Green | — | — |
| 20 | Bruce | BW | LHB | LF | Blue · Blue | — | — |

#### Sri Lanka (SL) · ★★★★★ (5★ printed) · team colour `#6c5ce7`

| No. | Player | Role | Bats | Bowls | Fielding (catch · run-out) | Keeping (catch · run-out · stumping) | Marks |
|---|---|---|---|---|---|---|---|
| 1 | Sanjeeva | BTBW | LHB | LM | Red · Red | — | ★ Star from 20 runs, O Opener, C Captain |
| 2 | Oshada | BTBW | RHB | RO | Red · Green | — | F Finisher |
| 3 | Ashan | BTBW | LHB | LM | Red · Red | — | — |
| 4 | Hasitha | BAT | RHB | — | Red · Red | — | — |
| 5 | Tharindu | BAT | LHB | — | Red · Green | — | O Opener |
| 6 | Buddhika | BAT | RHB | — | Blue · Green | — | — |
| 7 | Banduka | BTAL | LHB | LO | Red · Red | — | F Finisher |
| 8 | Milindu | BTAL | LHB | LFM | Red · Green | — | F Finisher, D Death bowler |
| 9 | Vidura | BTAL | LHB | LM | Red · Green | — | — |
| 10 | Oshan | WK | RHB | — | Green · Red | Red · Blue · Red | ★ Star from 15 runs, O Opener |
| 11 | Minura | WK | LHB | — | Red · Green | Green · Blue · Red | — |
| 12 | Eshantha | BWAL | LHB | LFM | Green · Red | — | — |
| 13 | Sadeera | BWAL | RHB | RO | Green · Blue | — | F Finisher |
| 14 | Wickramasinghe | BW | RHB | RL | Green · Blue | — | — |
| 15 | Ruwan | BW | LHB | LO | Green · Red | — | — |
| 16 | Naveen | BW | RHB | RFM | Blue · Blue | — | D Death bowler |
| 17 | Asanka | BW | RHB | RF | Green · Red | — | — |
| 18 | Ravishka | BW | RHB | RO | Green · Blue | — | — |
| 19 | Naved | BW | LHB | LC | Red · Green | — | — |
| 20 | Gimhan | BW | LHB | LF | Blue · Blue | — | — |

#### Pakistan (PAK) · ★★★★★ (5★ printed) · team colour `#14b8a6`

| No. | Player | Role | Bats | Bowls | Fielding (catch · run-out) | Keeping (catch · run-out · stumping) | Marks |
|---|---|---|---|---|---|---|---|
| 1 | Daniyal | BTBW | RHB | RM | Red · Red | — | ★ Star from 20 runs, O Opener, C Captain |
| 2 | Danish | BTBW | RHB | RO | Red · Green | — | F Finisher |
| 3 | Huda | BTBW | LHB | LM | Red · Red | — | — |
| 4 | Hamza | BAT | RHB | — | Red · Red | — | — |
| 5 | Basit | BAT | LHB | — | Red · Green | — | F Finisher |
| 6 | Murtuza | BAT | RHB | — | Blue · Green | — | O Opener |
| 7 | Azhar | BTAL | LHB | LO | Red · Red | — | — |
| 8 | Khalid | BTAL | LHB | LM | Red · Green | — | F Finisher |
| 9 | Mudassir | BTAL | LHB | LO | Red · Green | — | — |
| 10 | Muhazzim | WK | RHB | — | Green · Red | Red · Blue · Green | — |
| 11 | Umair | WK | LHB | — | Red · Green | Red · Blue · Red | ★ Star from 20 runs, O Opener |
| 12 | Aryan | BWAL | LHB | LFM | Green · Red | — | F Finisher |
| 13 | Huzaifa | BWAL | RHB | RFM | Green · Blue | — | D Death bowler |
| 14 | Gauhar | BW | RHB | RO | Green · Blue | — | — |
| 15 | Musa | BW | LHB | LC | Green · Red | — | — |
| 16 | Arfeen | BW | RHB | RFM | Blue · Blue | — | — |
| 17 | Faizan | BW | RHB | RF | Green · Red | — | D Death bowler |
| 18 | Abbas | BW | LHB | LF | Green · Blue | — | — |
| 19 | Abid | BW | LHB | LO | Red · Green | — | — |
| 20 | Muhammad | BW | LHB | LF | Blue · Blue | — | — |

#### India (IND) · ★★★★★ (5★ printed) · team colour `#ff8c4a`

| No. | Player | Role | Bats | Bowls | Fielding (catch · run-out) | Keeping (catch · run-out · stumping) | Marks |
|---|---|---|---|---|---|---|---|
| 1 | Debashish | BTBW | RHB | RO | Red · Red | — | ★ Star from 25 runs, O Opener, C Captain |
| 2 | Arham | BTBW | RHB | RM | Red · Green | — | O Opener |
| 3 | Tejas | BAT | LHB | — | Red · Red | — | F Finisher |
| 4 | Aditya | BAT | RHB | — | Red · Red | — | O Opener |
| 5 | Manjot | BAT | LHB | — | Red · Green | — | — |
| 6 | Vedant | BTAL | RHB | RO | Blue · Green | — | — |
| 7 | Rana | BTAL | LHB | LO | Red · Red | — | ★ Star from 18 runs |
| 8 | Aarav | BTAL | LHB | LM | Red · Green | — | — |
| 9 | Randeep | BTAL | LHB | LO | Red · Green | — | F Finisher |
| 10 | Maneesh | WK | RHB | — | Green · Red | Red · Blue · Green | F Finisher |
| 11 | Ruman | WK | RHB | — | Red · Green | Red · Blue · Red | — |
| 12 | Shiva | WK | LHB | — | Green · Red | Red · Green · Red | — |
| 13 | Satyam | BWAL | RHB | RFM | Green · Blue | — | F Finisher |
| 14 | Yash | BWAL | RHB | RO | Green · Blue | — | — |
| 15 | Ojas | BW | LHB | LFM | Green · Red | — | D Death bowler |
| 16 | Subroto | BW | LHB | LC | Blue · Blue | — | — |
| 17 | Akshat | BW | RHB | RL | Green · Red | — | — |
| 18 | Javed | BW | RHB | RF | Green · Blue | — | D Death bowler |
| 19 | Nischay | BW | LHB | LF | Red · Green | — | — |
| 20 | Himanshu | BW | LHB | LO | Blue · Blue | — | — |

#### Bangladesh (BAN) · ★★★★ (4★ printed) · team colour `#d62f2f`

| No. | Player | Role | Bats | Bowls | Fielding (catch · run-out) | Keeping (catch · run-out · stumping) | Marks |
|---|---|---|---|---|---|---|---|
| 1 | Habib | BTBW | RHB | RM | Red · Red | — | O Opener |
| 2 | Nabil | BTBW | RHB | RO | Red · Green | — | — |
| 3 | Hirday | BAT | LHB | — | Red · Red | — | ★ Star from 25 runs, O Opener |
| 4 | Qais | BAT | RHB | — | Green · Green | — | O Opener |
| 5 | Arindam | BTAL | RHB | RO | Red · Red | — | — |
| 6 | Mubasshir | BTAL | RHB | RO | Blue · Green | — | — |
| 7 | Hussain | BTAL | LHB | LO | Red · Red | — | F Finisher |
| 8 | Obaida | BTAL | LHB | LM | Red · Green | — | — |
| 9 | Ashish | BTAL | LHB | LFM | Red · Red | — | D Death bowler |
| 10 | Deepak | WK | RHB | — | Green · Red | Red · Blue · Green | — |
| 11 | Faisal | WK | LHB | — | Red · Green | Red · Green · Red | F Finisher, C Captain |
| 12 | Amirul | BWAL | LHB | LO | Green · Red | — | — |
| 13 | Asad | BWAL | RHB | RO | Green · Blue | — | F Finisher |
| 14 | Rahman | BWAL | RHB | RFM | Green · Blue | — | — |
| 15 | Saif | BWAL | LHB | LF | Green · Green | — | — |
| 16 | Tahseen | BW | RHB | RF | Blue · Blue | — | — |
| 17 | Soumik | BW | LHB | LFM | Green · Green | — | — |
| 18 | Rony | BW | RHB | RL | Green · Blue | — | — |
| 19 | Saleh | BW | LHB | LC | Blue · Green | — | — |
| 20 | Muzammil | BW | LHB | LF | Blue · Blue | — | — |

#### England (ENG) · ★★★★ (4★ printed) · team colour `#4f8ff7`

| No. | Player | Role | Bats | Bowls | Fielding (catch · run-out) | Keeping (catch · run-out · stumping) | Marks |
|---|---|---|---|---|---|---|---|
| 1 | Jack | BTBW | RHB | RM | Red · Green | — | F Finisher |
| 2 | Hudson | BTBW | RHB | RO | Red · Green | — | F Finisher |
| 3 | Dylan | BTBW | RHB | RM | Red · Red | — | — |
| 4 | Arthur | BTBW | LHB | LM | Green · Green | — | O Opener |
| 5 | Kent | BAT | LHB | — | Red · Red | — | O Opener |
| 6 | Habeeb | BAT | RHB | — | Blue · Green | — | O Opener |
| 7 | Francis | BAT | LHB | — | Red · Red | — | — |
| 8 | Joshua | BTAL | LHB | LFM | Red · Red | — | ★ Star from 30 runs, F Finisher, C Captain |
| 9 | Daniel | BTAL | LHB | LO | Red · Red | — | — |
| 10 | Harry | BTAL | RHB | RFM | Green · Red | — | — |
| 11 | Oliver | WK | LHB | — | Red · Green | Red · Green · Red | — |
| 12 | Edward | WK | LHB | — | Green · Red | Blue · Blue · Green | — |
| 13 | Richard | BWAL | RHB | RO | Green · Blue | — | — |
| 14 | Rupert | BWAL | RHB | RF | Green · Blue | — | — |
| 15 | Stephen | BW | LHB | LO | Green · Green | — | — |
| 16 | Philip | BW | RHB | RFM | Blue · Blue | — | — |
| 17 | Eric | BW | LHB | LF | Green · Green | — | D Death bowler |
| 18 | Gurdas | BW | RHB | RL | Green · Blue | — | — |
| 19 | Percy | BW | LHB | LC | Blue · Green | — | — |
| 20 | Ahmad | BW | LHB | LFM | Blue · Blue | — | — |

#### South Africa (SA) · ★★★★ (4★ printed) · team colour `#e8649b`

| No. | Player | Role | Bats | Bowls | Fielding (catch · run-out) | Keeping (catch · run-out · stumping) | Marks |
|---|---|---|---|---|---|---|---|
| 1 | Shawn | BTBW | RHB | RM | Red · Red | — | O Opener |
| 2 | Jabulani | BTBW | RHB | RO | Red · Green | — | O Opener |
| 3 | Connor | BAT | RHB | — | Red · Red | — | — |
| 4 | Sisanda | BAT | LHB | — | Green · Green | — | — |
| 5 | Sadiq | BAT | RHB | — | Red · Red | — | ★ Star from 25 runs, O Opener |
| 6 | Bryan | BTAL | RHB | RO | Blue · Green | — | — |
| 7 | Justin | BTAL | LHB | LFM | Red · Red | — | F Finisher |
| 8 | Aviral | BTAL | LHB | LO | Red · Green | — | F Finisher |
| 9 | Tanvir | WK | LHB | — | Red · Red | Red · Green · Red | F Finisher |
| 10 | Luke | WK | RHB | — | Green · Red | Red · Green · Green | — |
| 11 | Francois | WK | LHB | — | Red · Green | Red · Blue · Red | — |
| 12 | Siyabonga | BWAL | LHB | LO | Green · Red | — | C Captain |
| 13 | Jacques | BWAL | RHB | RO | Green · Blue | — | — |
| 14 | Hendrik | BWAL | RHB | RFM | Green · Blue | — | — |
| 15 | Teboho | BW | LHB | LFM | Green · Green | — | D Death bowler |
| 16 | Gerald | BW | RHB | RF | Blue · Blue | — | — |
| 17 | Luthando | BW | LHB | LF | Green · Green | — | — |
| 18 | Haider | BW | RHB | RL | Green · Blue | — | — |
| 19 | Vedant | BW | LHB | LC | Blue · Green | — | — |
| 20 | Bongani | BW | LHB | LFM | Blue · Blue | — | — |

#### New Zealand (NZ) · ★★★★ (4★ printed) · team colour `#7c6fa8`

| No. | Player | Role | Bats | Bowls | Fielding (catch · run-out) | Keeping (catch · run-out · stumping) | Marks |
|---|---|---|---|---|---|---|---|
| 1 | Reynolds | BTBW | RHB | RO | Red · Red | — | — |
| 2 | Harvey | BTBW | RHB | RM | Red · Green | — | ★ Star from 25 runs, O Opener |
| 3 | Bennet | BAT | LHB | — | Red · Red | — | O Opener |
| 4 | Craig | BAT | RHB | — | Green · Green | — | — |
| 5 | Graham | BAT | LHB | — | Red · Red | — | — |
| 6 | Nixon | BAT | RHB | — | Blue · Green | — | — |
| 7 | Tyler | BAT | LHB | — | Red · Red | — | F Finisher |
| 8 | Nathan | BTAL | LHB | LM | Red · Green | — | F Finisher |
| 9 | Cody | BTAL | LHB | LFM | Red · Red | — | — |
| 10 | Nicholson | WK | RHB | — | Green · Red | Red · Blue · Green | — |
| 11 | Hasan | WK | LHB | — | Red · Green | Red · Green · Red | O Opener |
| 12 | Presley | BWAL | LHB | LFM | Green · Red | — | — |
| 13 | David | BWAL | RHB | RFM | Green · Blue | — | F Finisher, C Captain |
| 14 | Benzamin | BW | RHB | RO | Green · Blue | — | — |
| 15 | Mason | BW | LHB | LO | Green · Green | — | — |
| 16 | Ibrahim | BW | RHB | RF | Blue · Blue | — | D Death bowler |
| 17 | Martin | BW | LHB | LF | Green · Green | — | — |
| 18 | Jacob | BW | RHB | RL | Green · Blue | — | — |
| 19 | Blake | BW | LHB | LC | Blue · Green | — | — |
| 20 | Dhruv | BW | LHB | LFM | Blue · Blue | — | — |

#### Afghanistan (AFG) · ★★★ (3★ printed) · team colour `#2dd4bf`

| No. | Player | Role | Bats | Bowls | Fielding (catch · run-out) | Keeping (catch · run-out · stumping) | Marks |
|---|---|---|---|---|---|---|---|
| 1 | Arqam | BTBW | RHB | RM | Red · Red | — | ★ Star from 30 runs, O Opener |
| 2 | Hamed | BTBW | RHB | RO | Green · Green | — | — |
| 3 | Musheer | BTBW | LHB | LM | Red · Red | — | — |
| 4 | Muhib | BAT | LHB | — | Green · Green | — | O Opener |
| 5 | Idrees | BAT | RHB | — | Red · Red | — | — |
| 6 | Zulfaqar | BTAL | RHB | RO | Green · Green | — | — |
| 7 | Besharat | BTAL | LHB | LFM | Red · Red | — | F Finisher |
| 8 | Bakhtiar | BTAL | LHB | LM | Red · Green | — | — |
| 9 | Mursalin | WK | RHB | — | Red · Green | Red · Green · Red | F Finisher |
| 10 | Fareed | WK | RHB | — | Blue · Red | Red · Blue · Green | — |
| 11 | Mirwais | BWAL | LHB | LC | Green · Green | — | — |
| 12 | Fahim | BWAL | LHB | LO | Green · Red | — | — |
| 13 | Yawar | BW | RHB | RFM | Blue · Blue | — | — |
| 14 | Ayub | BW | RHB | RO | Green · Blue | — | — |
| 15 | Nasar | BW | RHB | RFM | Green · Blue | — | — |
| 16 | Nemat | BW | RHB | RF | Blue · Blue | — | — |
| 17 | Taimur | BW | LHB | LF | Green · Green | — | D Death bowler |
| 18 | Reza | BW | RHB | RL | Blue · Blue | — | F Finisher, C Captain |
| 19 | Zakaria | BW | LHB | LC | Blue · Blue | — | — |
| 20 | Noorullah | BW | LHB | LO | Blue · Blue | — | — |

#### West Indies (WI) · ★★★ (3★ printed) · team colour `#8a5a34`

| No. | Player | Role | Bats | Bowls | Fielding (catch · run-out) | Keeping (catch · run-out · stumping) | Marks |
|---|---|---|---|---|---|---|---|
| 1 | Darren | BTBW | LHB | LM | Red · Red | — | — |
| 2 | Kevin | BTBW | RHB | RM | Green · Green | — | — |
| 3 | Williams | BTBW | RHB | RO | Red · Red | — | F Finisher |
| 4 | Jason | BAT | RHB | — | Green · Green | — | — |
| 5 | Omar | BAT | LHB | — | Red · Red | — | O Opener |
| 6 | Keston | BTAL | LHB | LM | Green · Green | — | — |
| 7 | Akhtar | BTAL | RHB | RO | Red · Red | — | F Finisher |
| 8 | Emmanuel | BTAL | LHB | LFM | Red · Green | — | — |
| 9 | Nelson | BTAL | RHB | RM | Red · Green | — | — |
| 10 | Rennard | WK | RHB | — | Blue · Red | Red · Blue · Green | — |
| 11 | Devnarain | WK | LHB | — | Green · Green | Red · Green · Red | ★ Star from 10 runs, F Finisher, O Opener, C Captain |
| 12 | Gabriel | BWAL | LHB | LFM | Green · Red | — | — |
| 13 | Conrad | BWAL | RHB | RFM | Blue · Blue | — | — |
| 14 | Carlton | BWAL | RHB | RO | Green · Blue | — | — |
| 15 | Jayden | BWAL | LHB | LO | Green · Blue | — | — |
| 16 | Andre | BWAL | RHB | RF | Blue · Blue | — | — |
| 17 | Mohammad | BW | LHB | LF | Green · Green | — | D Death bowler |
| 18 | Siddharth | BW | RHB | RL | Blue · Blue | — | — |
| 19 | Thomas | BW | LHB | LC | Blue · Blue | — | — |
| 20 | Ricardo | BW | LHB | LFM | Blue · Blue | — | — |

## 16. Suggested Playing 7 and Playing XI

### 16.1 5 overs · Suggested 7 (always this line-up; changes come from the bench)
| Team | Order 1 → 7 |
|---|---|
| IND | Debashish, Arham, Rana, Aditya, Maneesh, Ojas, Javed |
| PAK | Daniyal, Umair, Danish, Aryan, Huzaifa, Musa, Faizan |
| SL | Sanjeeva, Oshan, Tharindu, Oshada, Milindu, Wickramasinghe, Naveen |
| ENG | Habeeb, Arthur, Joshua, Kent, Oliver, Eric, Gurdas |
| AUS | Malcolm, Haden, Declan, Flynn, Victor, Ali, Abhay |
| BAN | Hirday, Qais, Habib, Faisal, Ashish, Saleh, Tahseen |
| NZ | Harvey, Bennet, Hasan, Tyler, David, Jacob, Ibrahim |
| SA | Sadiq, Jabulani, Shawn, Tanvir, Siyabonga, Teboho, Luthando |
| WI | Devnarain, Omar, Williams, Darren, Andre, Mohammad, Thomas |
| AFG | Arqam, Muhib, Musheer, Mursalin, Reza, Taimur, Yawar |

- Every 7 has a keeper and at least 3 bowlers (checked by a test).
- Simulation with these 7 at the time: 5 overs HSG 102 / NSG 79 / LSG 54; 10 overs HSG 201 / NSG 157 / LSG 107.

### 16.2 10 overs · Suggested XI (printed in the Players Database, always the default)
| Team | Order 1 → 11 |
|---|---|
| AUS | Malcolm, Haden, Declan, Ben, Flynn, Jonathan, Victor, Harrison, Ali, Bruce, Abhay |
| SL | Sanjeeva, Oshan, Tharindu, Oshada, Hasitha, Milindu, Eshantha, Ravishka, Gimhan, Naveen, Asanka |
| PAK | Daniyal, Umair, Danish, Hamza, Basit, Khalid, Aryan, Huzaifa, Musa, Faizan, Muhammad |
| IND | Debashish, Aarav, Rana, Arham, Tejas, Maneesh, Randeep, Ojas, Subroto, Javed, Nischay |
| BAN, ENG, SA, NZ, AFG, WI | As printed in the app's Suggested XI (these six lists are still to be checked against the code for this document) |

### 16.3 Building a balanced team (rule book)
**10 overs · Playing 11:**
- No. 1–2: Openers (BAT / BTBW)
- No. 3: Star ★
- No. 4: BAT / BTBW
- No. 5: WK
- No. 6: Finisher
- No. 7: BTAL
- No. 8–9: BWAL
- No. 10–11: BW, with at least one DB
- 5–6 bowlers in all: at least 3 pacers and 1–2 spinners. Two DBs cover overs 9 and 10.

**5 overs · Playing 7:** Opener, Star or BAT, WK, Finisher (best if he also bowls), BTAL, BWAL, BW death bowler. At least 3 bowlers.

**Over-by-over bowling plan:**
- **5 overs:** Ov 1 BWAL pacer · Ov 2 BTAL · Ov 3 DB · Ov 4 BWAL · Ov 5 DB.
- **10 overs:** Ov 1–2 two pacers · Ov 3–8 spinners, BWAL, BTAL (BW at the top order) · Ov 9 DB 1 · Ov 10 DB 2.

**Beginner mistakes to avoid:** reading the wrong line · forgetting row F · bowling a spinner in the Powerplay · using the DB before the Slog · sending the Finisher in too late.
Never pick two keepers unless one bats in the top order.

## 17. App: navigation and Home screen

- **Phone bottom bar** (4 tabs): Home, DPL, Rankings, Stats.
- **Top menu on a large screen:** Home, Matches, Tournaments, Teams, DPL, Rankings, Stats, Sheets, Customise.
- **Header:** red-and-blue dice logo, "Dice Cricket" and "Faiz Dice Games" (kept on one line).
- **Footer:** "© 2026 Tanweer Ahmad · Faiz Dice Games".
- **Home screen:**
  - Hero: "Faiz Dice Games presents · Dice Cricket", the power card strips, and "Play a match" and "New tournament" buttons.
  - **Resume:** the last 3 matches in progress (each with Delete).
  - **Tiles:** Matches (in progress and completed counts; New match, Resume/history) · Tournaments (running and finished; New tournament, Resume) · Teams · Sheets · Customise.
  - **Your data:** the backup section (section 26).

## 18. App: new match setup

- **Overs:** 5 or 10.
- **Ground:** High scoring (HSG), Normal (NSG), Low scoring (LSG).
- **Pick two teams:** each shows its form stars ("Stars shown are form stars for 5/10 overs").
- **Pick the Playing XI:** 7 for 5 overs, 11 for 10 overs. The default is the Suggested 7 or Suggested XI; changes come from the bench.
- **Batting order** and **captain**.
- **Toss:** the winner chooses to bat or bowl. The toss line shows on the match page.
- A new match always uses sheet set 2 and takes a snapshot of both teams' stars.
- Markers shown: C (captain), F, O, ★, D (death bowler).

## 19. App: the live scoring screen

### 19.1 Top of the page
- **Breadcrumb:** ← Matches or ← tournament · fixture, with both teams, the overs and a **Delete** button.
- **Delete match:** with a confirmation dialog. For a tournament match the fixture becomes unplayed again, and later fixtures that depended on it are cleared too. Two options were built: "match only" and "with all its stats" (how the current dialog handles both is to be checked).
- **Scoreboard:** batting team, its stars, score/wickets, overs, CRR, RRR in a chase, "Need X off Y", target, and the first-innings score.
- **Toss line** and **star line** (set 2).
- **Banners:** innings break ("Start 2nd innings"), Super Over break, tie and Super Over setup, and the win banner (🏆 result, then "Back to tournament" or "New match").

### 19.2 Tabs
Live · Scorecard · Summary · Ball by ball.

### 19.3 Scorer (Auto / Manual)
- **Auto:** the app rolls the dice and draws the cards.
- **Manual:** only the two physical dice (ball and shot, and power card rolls) are entered by hand. Tap the sheet cell your dice landed on. In a Half Reroll the kept die stays locked.
- In both modes the app draws the Wicket, Fielding, Skills, Runs, Extras and Free-hit cards itself.
- The switch is at the top of the live screen and on the Customise page.

### 19.4 Layouts (from Customise)
- **Split** (default): the bowling and batting blocks side by side. Each block shows the team, "Bowling/Batting", "Your roll/Waiting", the bowler or striker's name, type, style, figures or runs (balls), the captain line, both dice and a 52px-tall button.
- **Pitch View:** a small ground at the top: green field, white rope, a short pitch in the middle with stumps and creases at both ends, and the last ball's result in the middle. Three cards in the corners: **Non-striker** runs (balls) and **Bowler** overs · wickets/runs at the bowler's end, **▶ Striker** runs (balls) at the batting end. The dice and buttons sit below the ground, as in Split.
- **Face-to-face:** one above the other; the bowling side is turned 180° for the player across the table.
- **Bowling block Left/Right:** in Split and Pitch View the bowling block sits on the left or the right. Pitch View mirrors completely. The button is disabled in Face-to-face.

### 19.5 The middle section
- **Callout:** what to do now, or what the last ball was. Examples: "It's a ball! Roll the shot on …", "It's an X! Draw a wicket card", "Catch chance for … : Red at catch. Draw a skill card", "Dropped by …! Draw a runs card", "Extra? …", "Free hit …", "OUT! …", "Dot ball to …", "Next ball: …".
- **Cards:** the Wicket, Fielder, Skill and Runs cards, with a drawing animation.
- **Flags:** why a batting sheet was chosen, e.g. "★ Star column", "Slog overs · Finisher", "Powerplay · Opener", "BW batsman".
- **Power card button** (PowerPlay) and **Review (DRS)** button.
- **Draw buttons:** Draw wicket card / fielding card / skill card / runs card / free hit (in red, blue or normal colours).
- **Sheet grid:** the current sheet (bowling, batting or power card) with the last roll highlighted. During the batting roll a faded bowling sheet shows underneath. Spinner split cells are read correctly. On a phone the sheet comes after the over chips and batters; in Manual it comes first.

### 19.6 Choosing the bowler (bowler preview)
- At the start of an over: "Choose the bowler for over N", with the rule ("Max 2 overs each" or the 7-a-side rule) and "Not two overs in a row".
- Each bowler shows his name, type, style and figures (or "Quota done" / "Bowled last over").
- **Tap a bowler to see a preview:** the bowling line (BWD/EQ/BTD or PWP/SLG) and the batting matchup line, for both the striker and the non-striker. Then **Confirm** or **Clear**.

### 19.7 New batsman (after a wicket)
- **Order:** the wicket is shown first (the OUT result, the cards and the animation); about 1 second later the **"Wicket! New batsman walking in · No. N"** card appears below it.
- Until then the roll buttons are disabled (and the Space key).
- The batsman can be changed from the dropdown. In the Slog, the Finisher question also appears in this card.
- Bowling resumes only after **"Confirm: [name] comes in at No. N"**.
- It is asked only straight after the wicket ball, and **only once** for each new batsman.
- **Openers (No. 1 and 2) are fixed by the batting order** and are never asked about.

### 19.8 The last ball of an over
- The last ball's result and animation stay on the table. The bowler stays at the bowling end with his name and updated figures; the roll buttons are disabled.
- About three-quarters of a second later, an **"Over N complete"** card appears below, with that over's balls and a "Start the next over · choose the bowler" button.
- If the last ball was a wicket, the new batsman must be confirmed first.
- Power cards and DRS can still be played at this point.

### 19.9 Action line at the bottom
Undo · Custom ball · Batting order · Swap strike · Bowling on the left/right · Face-to-face · Customise
- **Undo:** step back.
- **Custom ball:** enter a ball result by hand, including Hit wicket.
- **Batting order:** change the batting order (not in a Super Over).
- **Swap strike:** only between balls.
- **Keyboard:** Space = next roll or draw.

### 19.10 Panels on the right
- **Over N:** chips for this over's balls.
- **Power cards:** the cards both teams have left.
- **At the crease:** striker (▶) and non-striker with number, type, hand, SR, 4s, 6s, "Star at", and the sheet-role dropdown (section 7.3). Also Extras and "Next in".

### 19.11 Animations (when switched on in Customise)
- **Split and Face-to-face:** a FOUR pops the result in, a SIX pops and glows, a wicket shakes with a red flash.
- **Pitch View ground:**
  - **FOUR:** the ball runs along the grass from the striker's end to the rope, bumps into it and bounces back slightly; the rope glows; then a green "FOUR!".
  - **SIX:** the ball grows as it rises and flies over the rope; then a golden "SIX!".
  - **OUT:** the stumps shake and a red "OUT!" appears.
- **Direction:** the ground is cut into 12 zones all the way round. Each innings shuffles their order and every ball adds ±12° of jitter, so the whole ground is used with no fixed pattern.
- Phones set to "reduce motion" never animate.
- (The eight wicket scenes and the 1/2/3-run animation are excluded from this document.)

## 20. App: Scorecard, Summary, Ball by ball

- **Scorecard:**
  - Both innings: batsmen (with how out), bowlers, extras, fall of wickets.
  - Match start and completion time.
  - **Share image / PDF:** printing hides the app menus and buttons.
  - A separate scorecard for each Super Over.
- **Summary:** the match summary and Super Over results.
- **Ball by ball:** commentary for every ball, with an **English / Hindi toggle**. Each Super Over separately.

## 21. App: tournaments

- **New tournament:** name, overs (5/10), teams, ground (each fixture has its own), type (groups + knockout, etc.), number of groups and qualifiers per group.
- **Ways to form groups:**
  - **Auto** (seeded by pick order)
  - **Manual** (choose each team's group)
  - **Draw by slips** (pick a slip for Group A/B)
  - An incomplete manual assignment falls back to Auto.
- **Fixtures** show the match number and time.
- **Points table** with NRR, and knockouts.
- **Tournament page tabs:** besides fixtures and the table, **Caps & awards** (Orange cap = most runs, Purple cap = most wickets, and other awards) and **Player rating**.
- **Champion:** after the final. Home shows the "running · finished" counts.
- **MVP points** and records also come from tournament matches.

## 22. App: Stats, records, ratings, rankings

- **Stats page:** player and team stats, 5 and 10 overs separately, a ground filter, records, MVP points and ratings. The Rankings tab was moved out into its own page.
- **Player rating / Team rating:** top 10 highlighted in each format.
- **Rankings page** (like the ICC tables):
  - Top 10 batsmen, Top 10 bowlers, Top 10 all-rounders, and team rankings.
  - 5 and 10 overs separately; all grounds or one ground at a time.
- **How rankings work:**
  - Points for each innings are compared with the average for that format and ground.
  - Recent innings count more (each older innings ×0.9).
  - An average player is about 500.
  - Reliability builds up to 5 innings; a player needs at least 2 innings to be listed.
  - All-rounder = batting × bowling / 1000.
  - Team rankings add 20% squad strength (stars) to the results; teams with no matches are shown faded.
- **Tournament Caps & awards** (section 21).

## 23. App: Teams page, custom teams, adding players

- **Teams page:** the Players Database. Each team card shows its colour, stars, captain and Star players; then the squad, records and player profiles. The Form stars table is here too.
- **Team banner:** coloured band, name, stars (up to 5), captain, and Star players ("@ N runs").
- **Add team:**
  - Name, code, stars (3/4/5), colour (14 suggested colours) and logo (preset emblems or your own picture).
  - Printed teams keep their name, stars and colour; only their logo can change and new players can be added.
- **Add Player form:**
  - Name (up to 24 letters, no duplicate in the squad)
  - Role (BAT, BTBW, BTAL, WK, BWAL, BW)
  - Hand (RHB/LHB)
  - Bowling style (required for bowling roles)
  - Fielding skills
  - Keeping skills (required for a WK)
  - Star runs (1–200)
  - Finisher, Death bowler, Opener, Captain
- One captain per team: making a new captain removes the old one.
- **A squad number is never given out twice,** not even a released player's.
- Players added to a printed team take numbers after the printed 20.
- A team used in saved matches cannot be deleted.

## 24. App: DPL (Dice Premier League)

### 24.1 Seasons and teams
- Create franchise teams and start a new DPL season (tested with 2 to 10 franchises).
- **Delete team** next to **Add team:**
  - Tapping it turns on delete mode (a 🗑 on each team; the button reads "Done").
  - Tapping a team asks for confirmation.
  - A team in a DPL season cannot be deleted ("Delete that season first").
  - A team in a saved match or tournament cannot be deleted either (such teams don't even show in this list).
  - Deleting cannot be undone.

### 24.2 Auction
- A points auction, not real money. Each team has **50,000 points**, a pool of about **200** players, squads of about 18–20.
- The auction is **seeded**: the same seed always gives the same result; each season saves its seed and cursor.
- **Auto bidding** and **manual bidding** (bid yourself for your team).
- Each lot shows what every squad still needs (squad needs).
- **Role balance** (`rules: 2`):
  - BW + BWAL at least 40% (min 8, max 10).
  - Batting group (BAT / BTBW / BTAL / WK) at most 11.
  - A keeper's place is always kept free.
  - In tests with 2–10 franchises, the lowest bowling share was 42%.
- Older finalized seasons replay under their old rules.

### 24.3 Next season
- **Trades:** franchises swap players.
- **Retention:** each team may keep up to **4** players. Retention price = the player's fair value.
- **Mini-auction** for the rest.
- **Released players** leave the squad, but saved matches keep their names and numbers safe, and they are never picked again.
- The season shows its status, e.g. "Trades & retention".

## 25. App: Customise page

A Customise tile on Home, and a Customise button on the match action line. Everything is saved on this device and applies at once.

- **Colour theme (6):**

| Theme | Look |
|---|---|
| Classic Maroon | Maroon and light brown like the printed sheets (default) |
| Night Stadium | Dark navy and gold (dark) |
| Pitch Green | Grass green and white |
| Super League | Purple and orange |
| Ocean Breeze | Blue and teal |
| Retro Scoreboard | Black and amber (dark) |

  Outcome and dice colours keep their printed meaning in every theme.
- **Scoring layout (3):** Split · Pitch View · Face-to-face, each with a small drawing.
- **Bowling block:** Left / Right.
- **Animations:** On / Off.
- **Scorer:** Auto / Manual.
- **Back to default:** resets everything.
- On first open, the older Face-to-face and bowling-side choices are carried over.

## 26. App: data, backup and reset

- All matches, tournaments, teams and stats are saved **on this device** (IndexedDB). Nothing goes to a server.
- **Backup:** downloads a JSON file (`dice-cricket-backup-<date>.json`). **Restore** loads the same file back ("Restored N matches and M tournaments").
- **Weekly reminder:** "Last backup: … days ago"; it reminds you once a backup is a week old.
- **Auto backup:** when switched on, the backup downloads by itself once a week when Home opens.
- **Reset:** wipes all data, with a confirmation dialog.
- Theme, layout, scorer mode and animation choices live in the browser's local storage.

## 27. Sheets page

- All sheets, chosen by set and ground. Each sheet has a "Roll this sheet" button and both dice.
- Master sheets show in "MasterGrid": every cell lists all its lines, the big FOR ALL cell, and row F in purple.
- The Wonderful Shot and Great Delivery grids are here too.
- **"Which sheet?" rules:** Bowling, Batting, Middle overs, Row F wickets.
- **Power card rules:** Reroll ×2, Wonderful Shot ×2, Great Delivery ×2.
- In the app, sheets and chips use IBM Plex Sans Condensed and IBM Plex Sans, like the printed sheets.

## 28. Balance and simulation figures

- **Rule book analysis** (each cell: runs per over · balls per wicket):

| Situation | HSG | NSG | LSG |
|---|---|---|---|
| Middle: equal contest | 23 · 15 | 17 · 16 | 11 · 17 |
| Middle: bowler on top, hard matchup | 17 · 16 | 6 · 6 | 3 · 6 |
| Middle: batsman on top / Star | 26 · 14 | 24 · 14 | 18 · 15 |
| Middle: tail-ender batting | 13 · 8 | 11 · 7 | 6 · 8 |
| Powerplay: pacer v opener | 23 · 16 | 20 · 10 | 15 · 11 |
| Powerplay: spinner v opener | 25 · 15 | 24 · 15 | 18 · 16 |
| Slog: pacer v finisher | 24 · 11 | 20 · 7 | 15 · 7 |
| Slog: spinner v finisher | 25 · 10 | 23 · 6 | 17 · 7 |
| Slog: DB v finisher | 21 · 12 | 18 · 7 | 13 · 8 |
| Slog: DB v other batsman | 20 · 17 | 18 · 9 | 12 · 9 |
| Average innings 5 / 10 overs | 98 / 194 | 75 / 147 | 49 / 96 |

- **Batting lines** (runs per batting roll · chance of a 4 or 6, rows A–E):

| Line | HSG | NSG | LSG |
|---|---|---|---|
| HS/★ | 4.4 · 83% | 4.1 · 77% | 3.5 · 60% |
| NS | 4.0 · 73% | 3.7 · 67% | 2.5 · 40% |
| LS | 3.3 · 60% | 2.8 · 47% | 1.6 · 20% |
| BWAL/BW | 2.3 · 40% | 2.4 · 40% | 1.3 · 17% |
| PWPO | 4.5 · 83% | 4.2 · 77% | 3.5 · 60% |
| PWPR | 4.4 · 83% | 4.0 · 73% | 3.1 · 53% |
| SLG F | 4.7 · 80% | 4.3 · 77% | 3.5 · 60% |
| SLG R | 4.4 · 83% | 4.2 · 77% | 3.2 · 53% |
| BW (PP & Slog) | 2.8 · 47% | 2.8 · 50% | 1.7 · 27% |

- **Bowling lines** (dot % · wicket %, rows A–E):

| Line | HSG | NSG | LSG |
|---|---|---|---|
| BWD3 | 13% · 3% | 47% · 13% | 50% · 13% |
| EQ | 3% · 3% | 20% · 3% | 27% · 3% |
| BTD3 | 3% · 3% | 3% · 3% | 10% · 3% |
| PWP: PC | 13% · 3% | 13% · 7% | 20% · 7% |
| PWP: SP | 7% · 3% | 3% · 3% | 10% · 3% |
| SLG: PC | 10% · 3% | 17% · 7% | 23% · 7% |
| SLG: SP | 7% · 3% | 7% · 7% | 13% · 7% |
| SLG: DB | 20% · 3% | 23% · 7% | 30% · 7% |

- **App simulation** (after the extras change and star dominance; IND v PAK, equal stars):
  - 5 overs: HSG 104 · NSG 89 · LSG 64
  - 10 overs: HSG 203 · NSG 164 · LSG 113
  - Earlier targets were 5 overs 102/79/54 and 10 overs 201/157/107. HSG is on target; NSG and LSG are about 6–10 runs higher.
- **5-over scoring decision (option A):** the sheets were not changed. The high scores came from the line-up, which the Suggested 7 fixed.
- **Your targets:** a 5-over innings about 70–100, a 10-over innings about 140–200 (by ground, HSG > NSG > LSG).

**Strategy (rule book):**
- Open with pacers. A spinner in the Powerplay costs about 2–4 runs more per over on every ground.
- Keep the DB for the Slog. He saves about 1.5–3 runs an over against a Finisher. In 10 overs he can't bowl both overs 9 and 10, so a second DB covers the other.
- Domination decides the middle overs: on NSG a BW bowling to a weak matchup gives about 6 an over; a BTBW bowling to a set Star gives about 24.
- Turn the ball away: an LS line can halve a batsman's scoring.
- Have the Finisher at the crease when the Slog starts.
- Protect the tail in the Powerplay and Slog: a BW batsman there falls about every 4–6 balls.
- **Read the ground:** on HSG attack from the first ball; on NSG win the matchups (the right bowler is worth 10 runs an over); on LSG keep wickets in hand, where 90 in 10 overs is a good score.
- Attack the Star early: until he passes his listed runs he is a normal batsman.
- 7-a-side has only 6 wickets, so one bad over can end the innings.

## 29. Print files

- **12 master sheets** (4 × HSG/NSG/LSG), from the workbook v5 values. Colours: HSG red, NSG green, LSG yellow; row F purple.
- **Fonts:** IBM Plex Sans Condensed + IBM Plex Sans (free SIL OFL licence, no copyright claim). One size hierarchy across the set; letters centred in highlighted cells; FOR ALL cells no larger than the line cells.
- **Two versions:** home A4, and **print shop:** CMYK, 3 mm bleed, crop marks, TrimBox/BleedBox.
- **Rule book** "Dice Cricket King · Rule Book", 11 pages, in IBM Plex, A4 and print-shop CMYK. Contents: components, formats, grounds, starting a match, your first match step by step, playing a ball, bowling and batting lines, a cell-reading example, power cards, wicket codes, special rules (including each team's DBs), ground analysis, bowling lines, game plan, strategy, a balanced team, an over-by-over plan.
- **ZIP:** `Dice_Cricket_Print_Ready_IBM_Plex.zip`, containing Home_Office_A4, Print_Shop_CMYK and PRINT_GUIDE.txt.
- **Cards:** 87 cards, Bridge 57×89 mm. Print plan: 50 sets, in Delhi.
- A 10-page **font options PDF** was made; option 5 (IBM Plex) was chosen.

## 30. Future plans

- **Online multiplayer:** room code, two phones, each player on his own turn; first the Split layout, then in two stages.
- **Android Play Store:** PWABuilder/Bubblewrap (TWA) or Capacitor; first publish the app, add a manifest and icons. Floot does not allow a service worker, so this route needs checking.
- **T20 set:** 12 sheets (Powerplay 1–6, Middle 7–15, Slog 16–20; targets Low 130–150, Normal 160–180, High 190–220).
- **ODI set:** 12 sheets. Later perhaps a 5-day Test version (90 overs a day).
- **The app is not published yet.** It will be published only when you say so.

## 31. Work done so far, in order

Every step from the start to now, in the order it was done.

**Game design and printed material**
1. Designed the Dice Cricket game: two dice (red = row, blue = column), batting and bowling dice sheets, a 10-team Players Database of 20 players each, and wicket, fielding, skills and runs card decks.
2. Added the (F) Finisher marker in the Players Database.
3. Moved the team card colours away from the official kit colours.
4. Planned an 81-card deck (Wickets 25, Runs 16, Fielding 20, Skills 20) for print in Bridge size, 50 sets.
5. Added the copyright line "© 2026 Tanweer · Faiz Dice Games" to sheets and cards; made print-shop PDFs (3 mm bleed, crop marks, CMYK) alongside plain A4; labelled the sheets "For 5 and 10 overs".
6. Added power cards (first 9: Reroll, Wonderful Shot, Great Delivery ×3 each, deck of 90).
7. Named the game "Dice Cricket King by FDG"; made theme previews; chose the Royal Ivory Gold theme.
8. Built (and later abandoned and deleted) a separate 3D cricket video game, "FDG Cricket".
9. Reworked the sheet structure: 7 bowling domination sheets plus a captain sheet, and batting sheets (Powerplay, Slog, High/Moderate/Low, Vs BWAL/BW, Finisher, Star); removed captain-advantage cells; set Powerplay = over 1 / overs 1–2 and Slog = over 5 / overs 9–10.
10. Cut the power cards to 6 (deck of 87): 2 Reroll, 2 Great Delivery, 2 Wonderful Shot; dropped the toss-winner reroll and per-star card counts.
11. Set the scoring targets: 5 overs about 70–100, 10 overs about 140–200.
12. Switched the whole set to the Maroon & Light Brown theme (team bands keep their own colours).
13. Gave the fixed Suggested Playing XI for all 10 teams.
14. Ruled that only captains use power cards.
15. Changed captains (SA Siyabonga, NZ David, AFG Reza, WI Devnarain) and team colours (SA pink, BAN red, WI brown).
16. New sheet direction: 7 bowling domination lines and batting lines chosen by batting hand × bowling style matchup.
17. Chose the green "Cricket Pitch Green" theme for the sheets (red row headers, blue column headers); then matched the whole set to it.
18. Set the Finisher rule (only one Finisher, only in the Slog).
19. Kept domination by player type only; team stars are not part of the domination line.

**App foundation**
20. Built the app on Floot: matches, toss, playing XI, batting order, captain, ball-by-ball engine, scorecard, summary, ball-by-ball commentary, tournaments and stats, all saved on the device.
21. Added Auto and Manual scorer modes, and the death bowler (D) marker next to players.
22. 5-over matches: 7 players a side, all out at 6 wickets, two bowlers may bowl 2 overs and the rest 1 (with tests).
23. Planned the DPL: franchise teams, points auction, 50,000 points per team, 200-player pool, squads of about 18–20.
24. Super Over uses the Slog sheets.
25. Tournament fixtures show the match number and time.
26. Group formation: draw by slips, manual, or auto.
27. DPL auction engine with balanced squads and a manual bidding option; DPL setup, auction screen, squads and league start.
28. Delete a match: "match only" or "with all its stats".
29. Team rating and player rating for 5 and 10 overs, top 10 highlighted.
30. Power cards playable on the last ball of an over (also after an undo).
31. Compared the app by writing a master prompt for another AI to build the same app.

**Stars, grounds and extras features**
32. Dynamic team stars by win % rank in each format (1–4 = 5★, 5–8 = 4★, 9–10 = 3★), with a snapshot stored in each match; Form stars table on the Teams page.
33. Match completion time; weekly backup reminder and auto backup; scorecard share image/PDF; tournament Caps & awards (orange/purple caps) and Player rating tabs; DPL per-lot squad needs; Extras help card; Hindi commentary toggle.
34. Planned the three grounds: Normal = the existing sheets, plus Low and High sets filled in the Excel workbook.
35. Ground themes: NSG green, LSG yellow, HSG red, each sheet labelled with its ground.
36. Removed "No. N" numbering from all cards.
37. Every match and fixture asks for its ground (HSG/NSG/LSG) and uses that sheet set; stats got a ground filter; old matches count as NSG.
38. Set per-ground targets and added the SLG: DB line to Powerplay & Slog Bowling; sheet boxes use the space fully.
39. Built the rule book in a blue theme with large, readable letters, no empty gaps, a beginner step-by-step page and balanced-team pages.
40. Row F of Powerplay & Slog Bowling gives wicket types by bowling style, written as short forms (BLD, LBW, C&B, CB, R/O, plus CT, ST, HW), with Dot and Ball too, on all three grounds.
41. Rule: a row-F wicket needs no Wicket card; for CB, C&B and ST only a Skills card is drawn.
42. Chose matchup grid B for Master Batting (ball turning into the bat = higher scoring).
43. Made a 10-page font options PDF; chose IBM Plex Sans Condensed + IBM Plex Sans; redesigned the 12 sheets with a consistent size hierarchy, larger text and centred letters.
44. Made row F purple on every sheet.
45. Made the print-shop files for the sheets (CMYK, 3 mm bleed, crop marks).
46. Put the v2 ground sheets into the app as sheet set 2: row F by bowling style with wicket codes, the SLG: DB line, matchup grid B, hit wicket, DRS on a row-F LBW, and a Sheets page with the purple row F.

**Scoring screen and line-ups**
47. Bowler preview: tap a bowler to see his bowling line and the batting matchup for the striker and non-striker, then confirm.
48. Fixed Suggested 7 for 5-over matches, per team; chose option A for 5-over tuning (sheets unchanged); simulations put every ground inside its target range.
49. App sheets and chips in IBM Plex.
50. DPL next season: trades, retention of up to 4 players, mini-auction, and released players kept safe in saved matches.
51. Rule book rebuilt in IBM Plex (A4 and print shop); Print-Ready ZIP updated.
52. ICC-style Rankings page: top 10 batsmen, bowlers and all-rounders plus team rankings, by format and ground.
53. Bottom bar changed to Home, DPL, Rankings, Stats; Matches, Tournaments, Teams and Sheets moved to Home tiles.
54. DPL auction role balance: BW + BWAL at least 40% (8–10), batting group at most 11, a keeper's place reserved.
55. DPL page: Delete team next to Add team.
56. Made 5 scoring-layout mockups (current v. Split, Bottom Dock, Face-to-face, Tabs, Broadcast); chose Split.
57. Discussed online multiplayer and publishing to the Play Store (plans only).
58. Built the Split layout: bowling and batting blocks side by side, 52px buttons, over chips and batters before the sheet on a phone, sheet first in Manual mode.
59. Planned the T20 set (12 sheets) and an ODI set; T20 phases and targets agreed.
60. Added the bowling block Left/Right switch.
61. Star dominance: equal stars play equal, more stars dominate fewer (row F of Master Bowling); star line on the match page; star rule on the Sheets page; tests for 9 star pairs.
62. Manual scorer: only the two dice (ball and shot) are typed in; every card draw is automatic.

**Balance, Customise and animations**
63. Fewer extras: half of the "+" results now become a dot ball and the heavy extras were removed (app only, sheets unchanged).
64. Measured team tiers: 5★ teams average 66% wins, 4★ 45%, 3★ 21%; kept printed stars as the default, with form stars changing by performance.
65. After a wicket, bowling is on hold until the new batsman is confirmed.
66. Made three mockup sheets: 6 themes, 6 layouts (plus a tablet layout) and 6 animation storyboards.
67. Built the Customise page: 6 colour themes, 3 scoring layouts including the new Pitch View (striker and non-striker runs and balls, bowler's overs), bowling side, animations on/off, scorer mode, reset; Customise tile on Home and button on the match screen.
68. Fixed the bug where the new batsman was asked about on every ball; openers are never asked about.
69. Made the pitch shorter (a small ground with the dice below) and added ground animations: FOUR runs to the rope and bounces, SIX flies over, OUT shakes the stumps.
70. The wicket is now shown first and the new batsman is asked about after it.
71. FOUR and SIX now go all over the ground (12 shuffled zones with jitter).
72. The last ball of an over now shows its result and animation on the table before the next over starts.
73. Wrote this complete documentation file.

---
*© 2026 Tanweer · Faiz Dice Games · All rights reserved.*
