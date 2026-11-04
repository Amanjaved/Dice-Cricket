# Dice Cricket · Faiz Dice Games: App Flow and Features Guide

Written for the developer building the Android-ready version. It describes the app exactly as it works today: every screen, every option, and the flow from a single ball up to tournaments, DPL, history and rankings.

How to use this with the companion file **Dice_Cricket_King_Complete_Documentation.md**: that file holds the full rule tables (sheets, cards, all 200 players, simulation figures). This file holds the **flow**: what the user sees, what they can choose, and what happens next.

---

## Contents

1. What the app is
2. Screen map and navigation
3. Home screen
4. Match flow, start to finish
5. The ball-by-ball loop (the core engine)
6. What happens between balls (events and prompts)
7. The live scoring screen: every option
8. Scorecard, Summary, Ball by ball
9. Super Over and ties
10. Tournament flow
11. DPL (Dice Premier League) flow
12. Teams and players
13. History, Stats, Records, Ratings, Rankings
14. Player profile
15. Customise
16. Data, backup and reset
17. Sheets page
18. Rules the engine must follow (summary)
19. What the Android version needs (from the current app)
20. Decisions to confirm with Tanweer

---

## 1. What the app is

- A **scorer and companion** for the physical dice-and-cards game *Dice Cricket King* (by Faiz Dice Games). Two dice (red = row A–F, blue = column 1–6) are rolled on a printed sheet; cards decide wickets, fielders, skills, runs and extras.
- In the app the user either lets the **app roll the dice** (Auto) or **types in what their real dice showed** (Manual). In both modes the app draws all the cards itself.
- Two formats: **5 overs** (7 a side) and **10 overs** (11 a side). Three grounds: **HSG** (high scoring), **NSG** (normal), **LSG** (low scoring).
- Ten national teams are built in (200 players); the user can add teams and players.
- Everything is stored **on the device** (no server, no login). Backup is a downloadable JSON file.

## 2. Screen map and navigation

| Screen | Where it is | What it is for |
|---|---|---|
| Home | Bottom bar (phone) / top menu | Start a match or tournament, resume, backup |
| Matches | Top menu (large screen) | In-progress and finished matches: resume or open |
| Match page | From Matches, Home, a tournament fixture, or a profile row | Live scoring, Scorecard, Summary, Ball by ball |
| Tournaments | Top menu | Create and run tournaments |
| Tournament page | From Tournaments | Fixtures, points table, knockouts, Caps & awards, Player rating |
| Teams | Top menu | Players Database, team pages, add team |
| Team page | From Teams | Squad, records, form stars |
| Player page | From a team or a stat row | Profile, stats, Last 5 innings |
| DPL | Bottom bar / top menu | Franchise seasons, auction, next season |
| Rankings | Bottom bar / top menu | Top 10 batsmen, bowlers, all-rounders, teams |
| Stats | Bottom bar / top menu | Player and team stats, records, MVP, ratings |
| Sheets | Top menu | All sheets, roll-a-sheet |
| Customise | Home tile, top menu, match action line | Themes, layouts, bowling side, animations, scorer mode |

- **Phone bottom bar (4 tabs):** Home, DPL, Rankings, Stats.
- **Top menu (large screen):** Home, Matches, Tournaments, Teams, DPL, Rankings, Stats, Sheets, Customise.
- **Header:** red-and-blue dice logo, "Dice Cricket", "Faiz Dice Games". **Footer:** "© 2026 Tanweer Ahmad · Faiz Dice Games".

## 3. Home screen

1. **Hero:** "Faiz Dice Games presents · Dice Cricket", the power-card strips, and two big buttons: **Play a match** and **New tournament**.
2. **Resume:** the last 3 matches still in progress, each with a Delete button.
3. **Tiles:**
   - Matches (counts of in progress and completed; New match, Resume/history)
   - Tournaments (running and finished; New tournament, Resume)
   - Teams
   - Sheets
   - Customise
4. **Your data:** backup, restore, weekly reminder, auto backup, reset (section 16).

## 4. Match flow, start to finish

```
New match setup
  → overs, ground, two teams, Playing XI, batting order, captain, toss
  → Live: innings 1  (loop of overs, each ball = section 5)
  → Innings break ("Start 2nd innings")
  → Live: innings 2  (chasing the target)
  → Result banner
        ├─ Win  → "Back to tournament" or "New match"
        └─ Tie  → Super Over (section 9) or "Leave it as a tie" (league/friendly only)
```

### 4.1 New match setup (step by step)

1. **Overs:** 5 or 10.
2. **Ground:** High scoring (HSG), Normal (NSG), Low scoring (LSG).
3. **Pick two teams.** Each shows its **form stars** for the chosen format ("Stars shown are form stars for 5/10 overs").
4. **Playing XI:** 7 for 5 overs, 11 for 10 overs. The default is the printed *Suggested 7* / *Suggested XI*; any change is made from the bench. Markers: **C** captain, **F** finisher, **O** opener, **★** star, **D** death bowler.
5. **Batting order** and **captain** (one captain per team).
6. **Toss:** the winner chooses to bat or bowl. The toss line is shown on the match page.
7. Every new match uses the newest sheet set (set 2) and saves a **snapshot of both teams' stars**. They do not change during the match.

### 4.2 Innings structure

- **5 overs:** Powerplay = over 1, Slog = over 5. All out at 6 wickets.
- **10 overs:** Powerplay = overs 1–2, Slog = overs 9–10. All out at 10 wickets.
- Everything between is the **middle overs**.
- In the app, Powerplay = the first fifth of the innings, Slog = the last fifth.
- **Bowling limits:** 5 overs: two bowlers may bowl 2 overs, everyone else 1. 10 overs: max 2 each. **Nobody bowls two overs in a row.**
- An innings ends when the batting team is **all out**, the **overs are used up**, or the **target is reached**.

### 4.3 Over structure

1. At the start of every over the app shows **"Choose the bowler for over N"** (section 7.2).
2. Six legal balls are bowled (wides and no-balls do not count as legal balls).
3. After the last ball the result stays on the table and an **"Over N complete"** card offers **"Start the next over · choose the bowler"** (section 6.2).

## 5. The ball-by-ball loop (the core engine)

Each ball moves through these **steps**. The screen shows exactly one step at a time.

| Step | What the user does | Next step |
|---|---|---|
| `bowler` | Choose the bowler (start of each over) | `bowl` |
| `bowl` | Roll both dice on the **bowling sheet** | see below |
| `bat` | Roll both dice on the **batting sheet** (only after a **B** result) | see below |
| `power` | Roll on a power-card grid (Wonderful Shot / Great Delivery) | as a `bowl` or `bat` result |
| `wicketCard` | Draw a **Wicket card** | `fielderCard`, or the wicket is final |
| `fielderCard` | Draw a **Fielding card** (1–20) | `skillCard` |
| `skillCard` | Draw a **Skills card** | wicket is out, or `runsCard` when the chance is missed |
| `runsCard` | Draw a **Runs card** (runs after a missed chance, or runs completed on a run-out) | next ball |
| `extrasCard` | Draw a **Runs card** for the kind of extra | next ball (or a free hit) |
| `freeHit` | Draw a **Runs card**, free-hit column | next ball |
| `none` | Match over | – |

### 5.1 The bowling roll (`bowl`)

The sheet and line are chosen automatically (see section 18). The cell shows one of:

| Result | Meaning | Goes to |
|---|---|---|
| `D` or `0` | Dot ball | next ball |
| `B` | "Ball": the batsman now plays a shot | `bat` |
| `X` | Wicket | `wicketCard` |
| `+` | Extra | `extrasCard` |
| Row-F code: `BLD`, `LBW`, `HW`, `CB`, `ST`, `C&B`, `CT`, `R/O` | A named wicket | No Wicket card; straight to the next needed card (section 5.3) |

Row F is the purple row (red die = F). Which list it reads depends on stars, bowling style or the batsman (section 18).

### 5.2 The batting roll (`bat`)

The result is **0, 1, 2, 3, 4, 6** runs, or **X** (wicket → `wicketCard`).

### 5.3 The wicket sequence

1. **Wicket card** says how the batsman is out (unless row F already named it).
2. If a fielder is involved:
   - **Catch / run-out:** draw a **Fielding card** (1–20 = squad number). If that number is not in the Playing XI the result is **"No fielder"**: the chance goes begging.
   - **Caught behind / stumping:** the **keeper** is known already.
   - **Caught & bowled:** the **bowler** is known already.
3. **Skills card:** the fielder's colour (Red = Best, Green = Good, Blue = Average) decides whether the chance is **taken or missed**.
4. **Missed chance** (dropped catch, missed stumping, missed run-out, no fielder): draw a **Runs card** for the runs scored.
5. **Run-out direct hit:** the Runs card gives the runs completed before the batsman is out.
6. Kinds of wicket: **Bowled, LBW, Catch, Caught behind, Stumping, Caught & bowled, Run out (striker's end), Run out (non-striker's end), Hit wicket.**

### 5.4 Extras and the free hit

- A `+` result draws a Runs card. In the app **half of those draws give a plain dot ball** (no extra, a legal ball); the other half give a light extra: **W, W+1, W+2, NB, NB+1, B1, L1, L2**. (Printed cards still carry the old heavy extras; this is an app-only change to keep extras realistic.)
- **A no-ball makes the next ball a FREE HIT.** The free-hit ball draws a Runs card from the free-hit column (a BW batsman has his own column).
- Codes: `W` wide · `NB` no ball · `B` byes · `L` leg byes; "+N" means N more runs.

### 5.5 Power cards and Review (DRS)

- **Only captains** play them, **straight after** the roll, before anything else happens. None in a Super Over.
- **Reroll** (2 in total, one per captain): cancel your own roll and roll again, both dice or only one die (**Half Reroll**: the kept die stays locked and shown as "kept").
- **Wonderful Shot** (2): a batting captain, while on strike, cancels the batting roll and rolls the card's grid (30 of 36 cells are a 4 or 6, no wicket).
- **Great Delivery** (2): a bowling captain (BW/BWAL), while bowling, cancels the bowling roll and rolls the card's grid (22 of 36 cells are wickets).
- **Review (DRS):** a batting captain given out **LBW or caught behind** may spend his Reroll to review. One die: **5–6 = not out** (dot ball).
- Power cards can also be played on the **last ball of an over**, and after an undo.

### 5.6 After the ball

The engine updates runs, wickets, balls, extras, the batsman's and bowler's figures, the over chips and the strike (normal cricket rules: odd runs and the end of the over; the **Swap strike** button corrects it by hand). Then the next step is chosen automatically.

## 6. What happens between balls (events and prompts)

### 6.1 New batsman after a wicket

1. The **wicket is shown first** (the OUT line, the cards, the result).
2. About a second later a card appears below: **"Wicket! New batsman walking in · No. N"**.
3. Until it is confirmed, the **roll buttons and the Space key are disabled**.
4. The user may change the batsman from a dropdown. In the Slog, if more than one F batsman is available, the card also asks **"Who goes in as the Finisher?"** (anyone not picked reads the Slog "Rest" line).
5. Bowling resumes only after **"Confirm: [name] comes in at No. N"**.
6. It is asked **once** per new batsman, only straight after the wicket ball. **Openers (No. 1 and 2) are fixed by the batting order and never asked.**

### 6.2 End of an over

- The last ball's result stays on the table; the bowler stays at his end with updated figures; roll buttons are disabled.
- An **"Over N complete"** card shows that over's balls and the button **"Start the next over · choose the bowler"**.
- If the last ball was a wicket, the new batsman must be confirmed first.
- Power cards and DRS can still be played now.

### 6.3 Result-strip animations (new)

Shown inside the result line (where the last ball's text appears), only when **Animations = On** in Customise (and never on a phone set to "reduce motion"). Everything else on the screen stays still.

| Last ball | Animation |
|---|---|
| 1, 2 or 3 runs | Two batsmen run between the wickets, one crossing per run |
| FOUR | The umpire's signal: an arm waved across the chest, with a small "4" badge |
| SIX | The umpire's signal: both arms straight up, with a small "6" badge |
| Wicket, dot, extra | No animation |

(The earlier ball-flying, rope, wicket-scene and shake/flash animations were removed.)

### 6.4 Milestone celebrations (new)

A celebration card appears above the result line for about 5 seconds (tap to close). If several happen on the same ball they come one after another: **batsman first, then bowler, then team**. They are **not** repeated on reload or after Undo.

| Who | Marks | Look |
|---|---|---|
| **Team** | 50, 100, 150, 200 | Trophy and badge. 50 = sparks; 100 = confetti; 150 = gold fireworks and confetti; 200 = crown, three fireworks, heavy confetti |
| **Batsman** | 50, 100, 150, 200 | Batsman figure and badge ("FIFTY!", "CENTURY!", "150!", "DOUBLE CENTURY!"), with the same growing effects |
| **Bowler** | 3 wickets, 5 wickets | Stumps-and-ball figure and badge ("THREE WICKETS!", "FIVE WICKETS!"); 5 is the biggest |

- With Animations Off, only the static badge is shown.
- Run-outs are not credited to the bowler's wickets.

### 6.5 Other prompts

- **Innings break:** a banner offers **"Start 2nd innings"**.
- **Callout line:** always tells the user what to do now, e.g. "It's a ball! Roll the shot on …", "It's an X! Draw a wicket card", "Catch chance for … Draw a skill card", "Extra? Draw a runs card …", "Free hit …", "OUT! …", "Dot ball to …", "Next ball: …".

## 7. The live scoring screen: every option

### 7.1 Top of the page

- **Breadcrumb:** ← Matches (or ← tournament · fixture), both teams, overs, and a **Delete** button.
- **Delete match:** asks for confirmation. For a tournament match the fixture becomes unplayed again and later fixtures that depended on it are cleared.
- **Scoreboard:** batting team and its stars, score/wickets, overs, CRR; in a chase RRR, "Need X off Y balls", target; the first-innings score.
- **Toss line**, and the **star line** ("★ IND 5★ v PAK 5★ · equal stars: even match").
- **Tabs:** Live · Scorecard · Summary · Ball by ball.

### 7.2 Choosing the bowler

- Shows "Choose the bowler for over N", the quota rule and "Not two overs in a row".
- Each bowler shows name, type, style and figures (or "Quota done" / "Bowled last over").
- **Tap a bowler to preview:** the bowling line (BWD/EQ/BTD or PWP/SLG) and the batting matchup for both the striker and the non-striker. Then **Confirm** or **Clear**.

### 7.3 Scorer: Auto or Manual

- **Auto:** the app rolls the dice (with a rolling animation) and draws cards.
- **Manual:** the user rolls **real dice** and taps the matching cell on the sheet shown. Only the **two physical dice** (the ball roll, the shot roll, and power-card rolls) are typed in. In a Half Reroll the kept die is locked. The sheet is shown first on a phone.
- In both modes the **Wicket, Fielding, Skills, Runs, Extras and Free-hit cards are drawn by the app.**
- The switch is at the top of the live screen and in Customise.

### 7.4 Layouts (set in Customise; changeable from the match screen)

- **Split (default):** bowling and batting blocks side by side. Each block: team, "Bowling/Batting", "Your roll/Waiting", player name, type, style, figures or runs (balls), captain line, both dice, a 52px-tall button.
- **Pitch View:** a small ground on top (green field, rope, short pitch with stumps) with the last result in the middle and three cards: **Non-striker** runs (balls), **Bowler** overs · wickets/runs, **▶ Striker** runs (balls). Dice and buttons sit below.
- **Face-to-face:** one block above the other, the bowling side turned 180° for the player across the table.
- **Bowling block Left/Right** (Split and Pitch View; disabled in Face-to-face).

### 7.5 Middle section

- Callout, the drawn cards (Wicket, Fielder, Skill, Runs) with a drawing animation, and **flags** that explain the sheet chosen: "★ Star column", "Slog overs · Finisher", "Powerplay · Opener", "BW batsman".
- **Power card** and **Review (DRS)** buttons.
- **Draw buttons** (red / blue / normal): Draw wicket card, fielding card, skill card, runs card, free-hit runs card.
- **Sheet grid:** the current sheet with the last roll highlighted; during the batting roll a faded bowling sheet shows underneath.

### 7.6 Action line

**Undo** (step back) · **Custom ball** (enter any ball result by hand, including Hit wicket) · **Batting order** (not in a Super Over) · **Swap strike** (between balls only) · **Bowling on the left/right** · **Face-to-face** · **Customise**. **Keyboard:** Space = next roll or draw.

### 7.7 Side panels

- **Over N:** chips for this over's balls.
- **Power cards:** what both teams still hold.
- **At the crease:** striker (▶) and non-striker with number, type, hand, strike rate, 4s, 6s, "Star at N", Extras, "Next in", and a **sheet-role dropdown**: Auto · Ignore Star/Opener/Finisher · Treat as Finisher · Force Star ★.

## 8. Scorecard, Summary, Ball by ball

- **Scorecard:** both innings, batsmen with how out, bowlers, extras, fall of wickets, start and completion time. **Share image / PDF** (printing hides the menus and buttons). Each Super Over has its own scorecard.
- **Summary:** match summary and Super Over results.
- **Ball by ball:** commentary for every ball with an **English / Hindi toggle**; Super Overs shown separately.

## 9. Super Over and ties

1. A tied match goes to a **Super Over**: each team nominates **3 batsmen and 1 bowler**; **1 over**, Slog sheets, **2 wickets end it**, **no power cards**.
2. A tied Super Over means **another Super Over**; players from the previous one sit out.
3. The app says which side bats first.
4. A **knockout** match needs a winner (as many Super Overs as it takes). A league or friendly match may **"Leave it as a tie"**.
5. Each Super Over appears separately in the Scorecard, Summary and Ball by ball tabs.

## 10. Tournament flow

```
New tournament → teams & groups → fixtures generated
  → play each fixture (opens the match setup pre-filled)
  → result saved to the fixture → points table (with NRR) updates
  → qualifiers → knockouts → final → Champion
  → Caps & awards, Player rating
```

1. **Create:** name, overs (5/10), teams, ground (each fixture has its own), type (groups + knockout etc.), number of groups, qualifiers per group.
2. **Forming groups:** **Auto** (seeded by pick order) · **Manual** (choose each team's group; incomplete manual falls back to Auto) · **Draw by slips** (pick a slip for Group A/B).
3. **Fixtures:** each shows match number and time. Tapping a fixture starts or resumes its match.
4. **Points table** with **NRR**.
5. **Knockouts:** a knockout match always ends with a winner (Super Overs).
6. **Champion** is shown after the final; Home shows tournaments as "running · finished".
7. **Tournament tabs:** fixtures and table, **Caps & awards** (Orange cap = most runs, Purple cap = most wickets, other awards) and **Player rating**.
8. Tournament matches also feed **MVP points** and records.
9. **Deleting a match** in a tournament makes its fixture unplayed again and clears later fixtures that depended on it.

## 11. DPL (Dice Premier League) flow

```
Create franchise teams → New DPL season → Auction (50,000 points each)
  → squads of ~18–20 → season fixtures & matches → results
  → Next season: Trades → Retention (up to 4) → Mini-auction
```

- **Franchises:** create franchise teams and start a season (tested with 2 to 10 franchises). **Delete team** (next to Add team) turns on delete mode; each team asks for confirmation. A team that is in a DPL season, a saved match or a tournament cannot be deleted.
- **Auction:** points only, no real money. **50,000 points** per team, a pool of about **200** players, squads of about 18–20. It is **seeded** (the same seed always gives the same result; each season saves its seed and position).
  - **Auto bidding** or **manual bidding** for your own team.
  - Each lot shows what every squad still needs.
  - **Role balance:** bowlers (BW + BWAL) at least 40% (min 8, max 10); batting group at most 11; a keeper's place is always kept free.
- **Next season:** **Trades** (franchises swap players) → **Retention** (keep up to **4**, price = the player's fair value) → **Mini-auction** for the rest. Released players leave the squad but their names and numbers stay safe in saved matches, and they are never picked again.
- The season shows a status such as "Trades & retention".

## 12. Teams and players

- **Teams page:** the Players Database. Each team card: colour, stars, captain, Star players, then squad, records and player profiles. A **Form stars** table (5 / 10 overs) shows printed stars, current stars, rank, matches, wins, win %, NRR and movement.
- **Add team:** name, code, stars (3/4/5), colour (14 suggestions) and logo (preset emblem or your own picture). Printed teams keep their name, stars and colour; only the logo can change and new players can be added.
- **Add player:** name (up to 24 letters, no duplicate in the squad); role (BAT, BTBW, BTAL, WK, BWAL, BW); hand (RHB/LHB); bowling style (needed for bowling roles); fielding skills; keeping skills (needed for a WK); **Star runs (1–200)**; Finisher, Death bowler, Opener, Captain flags. One captain per team.
- **Squad numbers are never reused**, not even a released player's. New players on printed teams get numbers after the printed 20.
- A team used in saved matches cannot be deleted.

**Stars and form stars**
- Printed stars: 5★ India, Pakistan, Sri Lanka, Australia · 4★ Bangladesh, England, South Africa, New Zealand · 3★ Afghanistan, West Indies.
- **Form stars:** per format (5 and 10 overs separately), teams with **2+ completed matches** are ranked by win % (tie = half a win; then NRR, printed stars, code). **Rank 1–4 = 5★, 5–8 = 4★, 9+ = 3★.** Fewer than 2 matches keeps the printed stars. Stars are snapshotted when a match starts.
- **Star dominance:** equal stars play on equal terms; more stars dominate fewer. It is applied through row F of the middle-overs bowling sheet (section 18).

## 13. History, Stats, Records, Ratings, Rankings

- **History:** the Matches list holds every match (in progress and finished) and each can be opened or resumed. Tournament matches also appear inside their tournament.
- **Stats page:** player and team stats, **5 and 10 overs separately**, a **ground filter**, records, MVP points, ratings. Only **finished** matches count.
- **Player rating / Team rating:** the top 10 are highlighted in each format.
- **Rankings page** (like the ICC tables): Top 10 batsmen, bowlers, all-rounders, and team rankings, 5 and 10 overs separately, all grounds or one ground.
  - Each innings is compared with the average for that format and ground; recent innings count more (each older innings ×0.9); an average player is about 500; reliability builds up over 5 innings; at least 2 innings are needed to be listed; all-rounder = batting × bowling / 1000; team rankings add 20% squad strength (stars); teams with no matches are shown faded.
- **Tournament awards:** Orange cap, Purple cap and others (section 10).

## 14. Player profile

Opened from a team page or any stat row. From top to bottom:

1. **Header:** squad number and shirt, team, name, role, hand and style, flags (Captain, Finisher, Opener, Death bowler, "★ Star from N runs"), sheet types.
2. **Skills:** catching, run-out, and keeper skills.
3. **Filters:** overs (5/10) and "Against" a team.
4. **Tiles:** Runs, Average, Strike rate, Best, Wickets.
5. **Last 5 innings (new):** two lists, newest first, from finished matches and respecting the filters.
   - **Batting:** runs (balls) then the opponent, e.g. `45 (32)  v AUS · 10 ov`; a `*` marks not out.
   - **Bowling** (only for players who bowl): wickets/runs and overs then the opponent, e.g. `2/28 (4.0 ov)  v IND · 10 ov`.
   - **Tap any row to open that match directly.**
   - With no innings yet: "No batting innings yet." / "No bowling innings yet."
6. **Tables:** Batting, Bowling, Fielding, split by format.

## 15. Customise

Opened from the Home tile, the top menu, or the match action line. Saved on the device and applied at once.

| Option | Choices |
|---|---|
| **Colour theme** (6) | Classic Maroon (default) · Night Stadium (dark navy and gold) · Pitch Green · Super League (purple and orange) · Ocean Breeze (blue and teal) · Retro Scoreboard (black and amber). Outcome and dice colours keep their printed meaning in every theme |
| **Scoring layout** (3) | Split · Pitch View · Face-to-face |
| **Bowling block** | Left / Right |
| **Animations** | On / Off (runners, umpire signals, milestone celebrations) |
| **Scorer** | Auto / Manual |
| **Back to default** | Resets everything |

## 16. Data, backup and reset

- All matches, tournaments, teams, DPL seasons and stats live **on the device** (browser IndexedDB). Nothing goes to a server.
- **Backup:** downloads `dice-cricket-backup-<date>.json`. **Restore:** loads the same file back ("Restored N matches and M tournaments").
- **Weekly reminder:** "Last backup: … days ago" once a backup is a week old. **Auto backup** (optional) downloads by itself once a week when Home opens.
- **Reset:** wipes all data, with a confirmation dialog.
- Theme, layout, scorer mode and animation choices are stored separately (browser local storage).

## 17. Sheets page

- All sheets, chosen by set and ground, each with a **"Roll this sheet"** button and both dice. The four master sheets show every line in each cell (the big FOR ALL cell, and row F in purple). The Wonderful Shot and Great Delivery grids are here too.
- It also lists the "Which sheet?" rules and the power-card rules.

## 18. Rules the engine must follow (summary)

Full tables are in the companion documentation file; this is the decision logic.

**Which bowling sheet and line**
- **Middle overs, Master Bowling:** line from bowler type × the batsman on strike (BWD3 … EQ … BTD3). Team stars affect only row F.
- **Powerplay and Slog, Bowling:** PWP: PC / SP, SLG: PC / SP, and **SLG: DB** for a death bowler in the Slog. Pacers: RF, RFM, RM, LF, LFM, LM. Spinners: RO, RL, LO, LC.

**Which batting sheet and line**
- **Middle overs, Master Batting:** a ★ Star past his runs reads **HS/★**; a BW or BWAL batsman reads **BWAL/BW**; everyone else reads **HS, NS or LS** from the bowler-type × batting-hand grid.
- **Powerplay:** openers (O) read **PWPO**, others **PWPR**. **Slog:** the one Finisher reads **SLG F**, everyone else **SLG R**; a BW batsman reads the **BW** line in any of these overs.

**Row F (purple)**
- Master Bowling (new matches): **star dominance**: bowling team has more stars → 5★ list; equal → middle 4★ list; fewer → 3★ list.
- Master Batting: read by the bowler's type.
- Powerplay/Slog Bowling: read by the bowling style group; may print a wicket code.
- Powerplay/Slog Batting: read by the batsman (★, BW, BWAL, Rest).
- Older saved matches keep their older sheet set and rules (matches with no recorded set count as set 1; no ground counts as NSG).

**Special players:** ★ Star, O Opener (3 per team), F Finisher (only one is the Finisher, only in the Slog), D Death bowler, C Captain, WK keeper (if the XI has none, the last player keeps).

## 19. What the Android version needs (from the current app)

These are requirements implied by how the app works today. They are not design decisions.

1. **Works offline and keeps everything on the device.** No login, no server.
2. **A real database** for matches, tournaments, teams, players, DPL seasons and settings, with the same data shapes (the JSON backup is the contract).
3. **Backup / restore** of one JSON file, plus the weekly reminder and optional auto backup. On Android this needs a file save/open flow and, if auto backup is wanted, a background or on-open trigger.
4. **Undo** for every scoring step (the match is a list of actions that can be replayed).
5. **Seeded, repeatable DPL auction** (same seed, same result).
6. **Printing/sharing:** Scorecard as an image or PDF.
7. **Hindi and English** commentary toggle in Ball by ball.
8. **Fonts:** IBM Plex Sans and IBM Plex Sans Condensed (to match the printed sheets).
9. **Touch targets:** the scoring buttons are 52px tall; the live screen must work on a phone in portrait with both hands.
10. **Reduced motion:** respect the system's "reduce motion" setting.
11. **Three layouts** (Split, Pitch View, Face-to-face with the bowling side rotated 180°) and **six themes**.
12. **All rule logic** of sections 5, 9, 18 and the companion file must behave identically (the current app has tests for the engine, stars, DPL, rankings and milestones that can be used as a reference).

## 20. Decisions to confirm with Tanweer

- Whether online multiplayer is wanted (discussed earlier, **not built**; currently single-device only).
- Whether Play Store publishing needs a different app name, icon or copyright wording.
- The printed rule book still says row F is read by "the bowling team's stars"; it needs a line about **star dominance** if the app and the book should say the same thing.
- Which animations the Android version should keep (the web app now has only the umpire signals, the two runners and the milestone celebrations).
- Whether Android should keep the "sheet" colours and fonts exactly as printed.

---

© 2026 Tanweer Ahmad · Faiz Dice Games · All rights reserved
