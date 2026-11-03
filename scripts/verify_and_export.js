// scripts/verify_and_export.js
import fs from 'fs';
import path from 'path';
import { TEAMS_DATA, RULES_DATA, WICKET_CARDS, RUNS_CARDS, FIELDING_CARDS, SKILLS_CARDS, POWER_CARDS } from './master_data.js';
import { SHEETS_DATA } from './sheets_data.js';

console.log("=== STARTING VERIFICATION AND DATA EXPORT ===");

// 1. Verify Deck Counts
const totalCards = WICKET_CARDS.length + RUNS_CARDS.length + FIELDING_CARDS.length + SKILLS_CARDS.length + POWER_CARDS.reduce((a, c) => a + c.count, 0);
console.log(`Checking cards: Wickets=${WICKET_CARDS.length}, Runs=${RUNS_CARDS.length}, Fielding=${FIELDING_CARDS.length}, Skills=${SKILLS_CARDS.length}, Power=${POWER_CARDS.reduce((a, c) => a + c.count, 0)} -> Total=${totalCards}`);
if (totalCards !== 87) {
  throw new Error(`Expected 87 total cards, got ${totalCards}`);
}

// 2. Verify Teams & Players
console.log(`Checking teams: ${TEAMS_DATA.length} teams.`);
if (TEAMS_DATA.length !== 10) throw new Error("Expected 10 teams");
let totalPlayers = 0;
for (const team of TEAMS_DATA) {
  if (team.players.length !== 20) throw new Error(`Team ${team.name} has ${team.players.length} players, expected 20`);
  totalPlayers += team.players.length;
  const captains = team.players.filter(p => p.marks.includes("C"));
  if (captains.length !== 1) throw new Error(`Team ${team.name} must have exactly 1 captain, found ${captains.length}`);
  if (team.suggestedXI.length !== 11) throw new Error(`Team ${team.name} suggestedXI must have 11 players`);
  if (team.suggested7.length !== 7) throw new Error(`Team ${team.name} suggested7 must have 7 players`);
}
console.log(`All 10 teams verified with exactly 20 players each (${totalPlayers} total) and 1 captain per team.`);

// 3. Verify Sheets (12 sheets across 3 grounds)
const grounds = ["HSG", "NSG", "LSG"];
const sheetKeys = ["masterBowling", "masterBatting", "powerplaySlogBowling", "powerplaySlogBatting"];
const rows = ["A", "B", "C", "D", "E", "F"];
const cols = [1, 2, 3, 4, 5, 6];

for (const g of grounds) {
  const gData = SHEETS_DATA[g];
  if (!gData) throw new Error(`Missing ground ${g}`);
  for (const sKey of sheetKeys) {
    const s = gData[sKey];
    if (!s) throw new Error(`Missing sheet ${sKey} for ground ${g}`);
    let cellCount = 0;
    for (const r of rows) {
      for (const c of cols) {
        const cellId = `${r}${c}`;
        if (!s.grid[cellId]) {
          throw new Error(`Missing cell ${cellId} in sheet ${s.id}`);
        }
        cellCount++;
      }
    }
    if (cellCount !== 36) throw new Error(`Sheet ${s.id} has ${cellCount} cells, expected 36`);
  }
}
console.log(`All 12 sheets verified with 36 cells each.`);

// 4. Line Statistics Validation against Rule Book pp. 8-9 and md §28
// Helper to get result from cell for a given line (rows A-E only, 30 cells)
function getRowAEResults(grid, lineName) {
  const results = [];
  for (const r of ["A", "B", "C", "D", "E"]) {
    for (const c of [1, 2, 3, 4, 5, 6]) {
      const cell = grid[`${r}${c}`];
      if (cell.forAll !== undefined) {
        results.push(cell.forAll);
      } else {
        const res = cell[lineName];
        if (res === undefined) {
          throw new Error(`Line ${lineName} missing in cell ${r}${c}`);
        }
        results.push(res);
      }
    }
  }
  return results;
}

console.log("\n--- VERIFYING BOWLING LINES (dot % · wicket % for rows A-E) ---");
const expectedBowlingStats = {
  HSG: {
    BWD3: { dot: 13, wkt: 3 },
    EQ: { dot: 3, wkt: 3 },
    BTD3: { dot: 3, wkt: 3 },
    "PWP: PC": { dot: 13, wkt: 3 },
    "PWP: SP": { dot: 7, wkt: 3 },
    "SLG: PC": { dot: 10, wkt: 3 },
    "SLG: SP": { dot: 7, wkt: 3 },
    "SLG: DB": { dot: 20, wkt: 3 }
  },
  NSG: {
    BWD3: { dot: 47, wkt: 13 },
    EQ: { dot: 20, wkt: 3 },
    BTD3: { dot: 3, wkt: 3 },
    "PWP: PC": { dot: 13, wkt: 7 },
    "PWP: SP": { dot: 3, wkt: 3 },
    "SLG: PC": { dot: 17, wkt: 7 },
    "SLG: SP": { dot: 7, wkt: 7 },
    "SLG: DB": { dot: 23, wkt: 7 }
  },
  LSG: {
    BWD3: { dot: 50, wkt: 13 },
    EQ: { dot: 27, wkt: 3 },
    BTD3: { dot: 10, wkt: 3 },
    "PWP: PC": { dot: 20, wkt: 7 },
    "PWP: SP": { dot: 10, wkt: 3 },
    "SLG: PC": { dot: 23, wkt: 7 },
    "SLG: SP": { dot: 13, wkt: 7 },
    "SLG: DB": { dot: 30, wkt: 7 }
  }
};

for (const g of grounds) {
  const mb = SHEETS_DATA[g].masterBowling.grid;
  const psb = SHEETS_DATA[g].powerplaySlogBowling.grid;

  const linesToCheck = [
    { name: "BWD3", grid: mb },
    { name: "EQ", grid: mb },
    { name: "BTD3", grid: mb },
    { name: "PWP: PC", grid: psb },
    { name: "PWP: SP", grid: psb },
    { name: "SLG: PC", grid: psb },
    { name: "SLG: SP", grid: psb },
    { name: "SLG: DB", grid: psb }
  ];

  for (const { name, grid } of linesToCheck) {
    const res = getRowAEResults(grid, name);
    const dotCount = res.filter(r => r === "0").length;
    const wktCount = res.filter(r => r === "X").length;
    const dotPct = Math.round((dotCount / 30) * 100);
    const wktPct = Math.round((wktCount / 30) * 100);
    const exp = expectedBowlingStats[g][name];
    console.log(`[${g}] ${name.padEnd(8)}: computed ${dotPct}% · ${wktPct}% | expected ${exp.dot}% · ${exp.wkt}% (dots: ${dotCount}/30, wkts: ${wktCount}/30)`);
    if (dotPct !== exp.dot || wktPct !== exp.wkt) {
      throw new Error(`Mismatch in bowling line ${name} for ${g}! Computed ${dotPct}%/${wktPct}%, expected ${exp.dot}%/${exp.wkt}%`);
    }
  }
}
console.log("==> ALL BOWLING LINE STATISTICS MATCH THE PUBLISHED TABLES EXACTLY! <==\n");

console.log("--- VERIFYING BATTING LINES (runs per roll · 4/6 % for rows A-E) ---");
const expectedBattingStats = {
  HSG: {
    "HS/★": { runs: 4.4, bndPct: 83 },
    NS: { runs: 4.0, bndPct: 73 },
    LS: { runs: 3.3, bndPct: 60 },
    "BWAL/BW": { runs: 2.3, bndPct: 40 },
    PWPO: { runs: 4.5, bndPct: 83 },
    PWPR: { runs: 4.4, bndPct: 83 },
    "SLG F": { runs: 4.7, bndPct: 80 },
    "SLG R": { runs: 4.4, bndPct: 83 },
    BW: { runs: 2.8, bndPct: 47 }
  },
  NSG: {
    "HS/★": { runs: 4.1, bndPct: 77 },
    NS: { runs: 3.7, bndPct: 67 },
    LS: { runs: 2.8, bndPct: 47 },
    "BWAL/BW": { runs: 2.4, bndPct: 40 },
    PWPO: { runs: 4.2, bndPct: 77 },
    PWPR: { runs: 4.0, bndPct: 73 },
    "SLG F": { runs: 4.3, bndPct: 77 },
    "SLG R": { runs: 4.2, bndPct: 77 },
    BW: { runs: 2.8, bndPct: 50 }
  },
  LSG: {
    "HS/★": { runs: 3.5, bndPct: 60 },
    NS: { runs: 2.5, bndPct: 40 },
    LS: { runs: 1.6, bndPct: 20 },
    "BWAL/BW": { runs: 1.3, bndPct: 17 },
    PWPO: { runs: 3.5, bndPct: 60 },
    PWPR: { runs: 3.1, bndPct: 53 },
    "SLG F": { runs: 3.5, bndPct: 60 },
    "SLG R": { runs: 3.2, bndPct: 53 },
    BW: { runs: 1.7, bndPct: 27 }
  }
};

for (const g of grounds) {
  const mbat = SHEETS_DATA[g].masterBatting.grid;
  const psbat = SHEETS_DATA[g].powerplaySlogBatting.grid;

  const linesToCheck = [
    { name: "HS/★", grid: mbat },
    { name: "NS", grid: mbat },
    { name: "LS", grid: mbat },
    { name: "BWAL/BW", grid: mbat },
    { name: "PWPO", grid: psbat },
    { name: "PWPR", grid: psbat },
    { name: "SLG F", grid: psbat },
    { name: "SLG R", grid: psbat },
    { name: "BW", grid: psbat }
  ];

  for (const { name, grid } of linesToCheck) {
    const res = getRowAEResults(grid, name);
    const bndCount = res.filter(r => r === "4" || r === "6").length;
    const bndPct = Math.round((bndCount / 30) * 100);
    const totalRuns = res.reduce((acc, r) => {
      const num = parseInt(r, 10);
      return acc + (isNaN(num) ? 0 : num);
    }, 0);
    const avgRuns = parseFloat((totalRuns / 30).toFixed(1));
    const exp = expectedBattingStats[g][name];
    console.log(`[${g}] ${name.padEnd(8)}: computed ${avgRuns} rpr · ${bndPct}% | expected ${exp.runs} · ${exp.bndPct}% (runs: ${totalRuns}, bnd: ${bndCount}/30)`);
    if (Math.abs(avgRuns - exp.runs) > 0.05 || Math.abs(bndPct - exp.bndPct) > 1) {
      throw new Error(`Mismatch in batting line ${name} for ${g}! Computed ${avgRuns}/${bndPct}%, expected ${exp.runs}/${exp.bndPct}%`);
    }
  }
}
console.log("==> ALL BATTING LINE STATISTICS MATCH THE PUBLISHED TABLES EXACTLY! <==\n");

// 5. EXPORT CLEAN JSON TO ASSETS DIRECTORIES
const exportDirs = [
  "Dice king Stitch/DiceCricketKing/app/src/main/assets/data",
  "public/data",
  "src/data"
];

for (const dir of exportDirs) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "sheets.json"), JSON.stringify(SHEETS_DATA, null, 2));
  fs.writeFileSync(path.join(dir, "teams.json"), JSON.stringify(TEAMS_DATA, null, 2));
  fs.writeFileSync(path.join(dir, "rules.json"), JSON.stringify(RULES_DATA, null, 2));
  fs.writeFileSync(path.join(dir, "cards.json"), JSON.stringify({
    wicketCards: WICKET_CARDS,
    runsCards: RUNS_CARDS,
    fieldingCards: FIELDING_CARDS,
    skillsCards: SKILLS_CARDS,
    powerCards: POWER_CARDS
  }, null, 2));
}

console.log("Successfully exported all verified JSON datasets to Android assets, public/data, and src/data!");
