// src/engine/index.ts
import { SHEETS_DATA } from '../../scripts/sheets_data.js';
import { TEAMS_DATA, RULES_DATA, WICKET_CARDS, RUNS_CARDS, FIELDING_CARDS, SKILLS_CARDS, POWER_CARDS } from '../../scripts/master_data.js';
import type { 
  Team, Player, GroundType, MatchFormat, MatchState, OverDelivery, 
  BatsmanInnings, BowlerFigures, FormStarsRecord 
} from '../types';

export class DiceCricketEngine {
  // PRNG or manual dice
  static rollDie(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  static rollRow(): string {
    const rows = ["A", "B", "C", "D", "E", "F"];
    return rows[Math.floor(Math.random() * 6)];
  }

  static drawWicketCard() {
    return WICKET_CARDS[Math.floor(Math.random() * WICKET_CARDS.length)];
  }

  static drawFieldingCard(): number {
    return Math.floor(Math.random() * 20) + 1; // 1-20
  }

  static drawSkillsCard() {
    return SKILLS_CARDS[Math.floor(Math.random() * SKILLS_CARDS.length)];
  }

  static drawRunsCard() {
    return RUNS_CARDS[Math.floor(Math.random() * RUNS_CARDS.length)];
  }

  // 1. Get Active Sheets
  static getSheets(ground: GroundType) {
    return SHEETS_DATA[ground];
  }

  // 2. Bowling Line Resolution
  static resolveBowlingLine(
    ground: GroundType,
    isPowerplay: boolean,
    isSlog: boolean,
    bowler: Player,
    striker: Player,
    bowlingTeamStars: number,
    battingTeamStars: number
  ): {
    sheetName: string;
    lineName: string;
    explanation: string;
    isRowFSpecial: boolean;
  } {
    const isSpecialPhase = isPowerplay || isSlog;
    const sheetName = isSpecialPhase ? "Powerplay & Slog Bowling" : "Master Bowling";

    if (!isSpecialPhase) {
      // Middle overs
      let batCat: "BW" | "BWAL" | "BTAL_WK" | "BAT_BTBW" = "BAT_BTBW";
      if (striker.role === "BW") batCat = "BW";
      else if (striker.role === "BWAL") batCat = "BWAL";
      else if (striker.role === "BTAL" || striker.role === "WK") batCat = "BTAL_WK";

      const bowlerRole = bowler.role as "BW" | "BWAL" | "BTAL" | "BTBW";
      const lineName = RULES_DATA.dominationTable[bowlerRole]?.[batCat] || "EQ";

      // Star dominance for Row F
      let starLine = "4★";
      let starExplanation = "Equal Stars (Both teams have same ★)";
      if (bowlingTeamStars > battingTeamStars) {
        starLine = "5★";
        starExplanation = "Bowling team dominates on Stars (5★ line)";
      } else if (bowlingTeamStars < battingTeamStars) {
        starLine = "3★";
        starExplanation = "Batting team dominates on Stars (3★ line)";
      }

      return {
        sheetName,
        lineName,
        explanation: `Domination Line: ${lineName} (${bowler.role} vs ${striker.role}) · Row F: ${starExplanation}`,
        isRowFSpecial: true
      };
    } else {
      // Powerplay & Slog
      const isSpinner = RULES_DATA.spinners.includes(bowler.bowl || "");
      const isDeathBowler = bowler.marks.includes("D");

      let lineName = "PWP: PC";
      let explanation = "";

      if (isPowerplay) {
        if (isSpinner) {
          lineName = "PWP: SP";
          explanation = "Powerplay · Spinner";
        } else {
          lineName = "PWP: PC";
          explanation = "Powerplay · Pacer";
        }
      } else {
        // Slog
        if (isDeathBowler) {
          lineName = "SLG: DB";
          explanation = "Slog Overs · Death Bowler (DB)";
        } else if (isSpinner) {
          lineName = "SLG: SP";
          explanation = "Slog Overs · Spinner";
        } else {
          lineName = "SLG: PC";
          explanation = "Slog Overs · Pacer";
        }
      }

      return {
        sheetName,
        lineName,
        explanation,
        isRowFSpecial: true
      };
    }
  }

  // 3. Batting Line Resolution
  static resolveBattingLine(
    ground: GroundType,
    isPowerplay: boolean,
    isSlog: boolean,
    bowler: Player,
    striker: Player,
    strikerRuns: number,
    designatedFinisherName: string | null,
    sheetRoleOverride?: 'auto' | 'ignore' | 'force_star' | 'treat_finisher'
  ): {
    sheetName: string;
    lineName: string;
    explanation: string;
    isRowFSpecial: boolean;
  } {
    const isSpecialPhase = isPowerplay || isSlog;
    const sheetName = isSpecialPhase ? "Powerplay & Slog Batting" : "Master Batting";

    const marks = striker?.marks || [];
    const isStarPast = (marks.includes("★") && strikerRuns >= (striker?.starRuns || 20)) || (sheetRoleOverride === 'force_star');
    const isFinisher = (striker?.name === designatedFinisherName) || (sheetRoleOverride === 'treat_finisher');
    const isOpener = marks.includes("O") && sheetRoleOverride !== 'ignore';

    if (!isSpecialPhase) {
      // Middle overs
      if (isStarPast && sheetRoleOverride !== 'ignore') {
        return {
          sheetName,
          lineName: "HS/★",
          explanation: `★ Star column unlocked (scored ${strikerRuns} runs, needed ${striker.starRuns || 20})`,
          isRowFSpecial: true
        };
      }
      if (striker.role === "BWAL" || striker.role === "BW") {
        return {
          sheetName,
          lineName: "BWAL/BW",
          explanation: `Tailender / All-rounder batting line (${striker.role})`,
          isRowFSpecial: true
        };
      }

      // Matchup Grid B
      const bowlerStyle = bowler.bowl || "RM";
      const hand = striker.bat;
      const matchup = RULES_DATA.matchupGridB[bowlerStyle as keyof typeof RULES_DATA.matchupGridB];
      const lineName = matchup ? matchup[hand] : "NS";

      let rationale = "Neutral angle";
      if (lineName === "HS/★") rationale = "Ball turning / angling into the bat (High Scoring)";
      else if (lineName === "LS") rationale = "Ball turning / angling away from the bat (Low Scoring)";

      return {
        sheetName,
        lineName,
        explanation: `Matchup Grid B: ${bowlerStyle} vs ${hand} ──► ${lineName} (${rationale})`,
        isRowFSpecial: true
      };
    } else {
      // Powerplay / Slog
      if (striker.role === "BW") {
        return {
          sheetName,
          lineName: "BW",
          explanation: "BW batsman in Powerplay/Slog",
          isRowFSpecial: true
        };
      }
      if (isPowerplay) {
        const lineName = isOpener ? "PWPO" : "PWPR";
        return {
          sheetName,
          lineName,
          explanation: isOpener ? "Powerplay · Opener (PWPO)" : "Powerplay · Rest (PWPR)",
          isRowFSpecial: true
        };
      } else {
        // Slog
        const lineName = isFinisher ? "SLG F" : "SLG R";
        return {
          sheetName,
          lineName,
          explanation: isFinisher ? "Slog Overs · The Finisher (SLG F)" : "Slog Overs · Rest (SLG R)",
          isRowFSpecial: true
        };
      }
    }
  }

  // 4. Resolve a delivery completely
  static resolveBowlingCell(
    ground: GroundType,
    isPowerplay: boolean,
    isSlog: boolean,
    row: string,
    col: number,
    bowler: Player,
    striker: Player,
    bowlingTeamStars: number,
    battingTeamStars: number
  ): string {
    const sheet = (isPowerplay || isSlog)
      ? SHEETS_DATA[ground].powerplaySlogBowling
      : SHEETS_DATA[ground].masterBowling;

    const cell = (sheet.grid as Record<string, any>)[`${row}${col}`];
    if (!cell) return "B";

    if (cell.forAll !== undefined) {
      return cell.forAll;
    }

    if (row === "F") {
      if (!isPowerplay && !isSlog) {
        const line = (bowlingTeamStars > battingTeamStars) ? "5★" : (bowlingTeamStars === battingTeamStars) ? "4★" : "3★";
        return cell[line] || "B";
      } else {
        let grp = "RM/LM";
        if (bowler.bowl === "LF" || bowler.bowl === "LFM") grp = "LF/LFM";
        else if (bowler.bowl === "RF" || bowler.bowl === "RFM") grp = "RF/RFM";
        else if (bowler.bowl === "RM" || bowler.bowl === "LM") grp = "RM/LM";
        else if (bowler.bowl === "RO" || bowler.bowl === "RL") grp = "RO/RL";
        else if (bowler.bowl === "LO" || bowler.bowl === "LC") grp = "LO/LC";
        return cell[grp] || "B";
      }
    }

    // Rows A-E
    const { lineName } = this.resolveBowlingLine(ground, isPowerplay, isSlog, bowler, striker, bowlingTeamStars, battingTeamStars);
    return cell[lineName] || "B";
  }

  static resolveBattingCell(
    ground: GroundType,
    isPowerplay: boolean,
    isSlog: boolean,
    row: string,
    col: number,
    bowler: Player,
    striker: Player,
    strikerRuns: number,
    designatedFinisherName: string | null,
    sheetRoleOverride?: 'auto' | 'ignore' | 'force_star' | 'treat_finisher'
  ): string {
    const sheet = (isPowerplay || isSlog)
      ? SHEETS_DATA[ground].powerplaySlogBatting
      : SHEETS_DATA[ground].masterBatting;

    const cell = (sheet.grid as Record<string, any>)[`${row}${col}`];
    if (!cell) return "0";

    if (cell.forAll !== undefined) {
      return cell.forAll;
    }

    if (row === "F") {
      if (!isPowerplay && !isSlog) {
        const line = `v ${bowler.role}`;
        return cell[line] || "0";
      } else {
        const isStarPast = (striker.marks.includes("★") && strikerRuns >= (striker.starRuns || 20)) || (sheetRoleOverride === 'force_star');
        let line = "REST";
        if (isStarPast) line = "★";
        else if (striker.role === "BW") line = "BW";
        else if (striker.role === "BWAL") line = "BWAL";
        return cell[line] || "0";
      }
    }

    // Rows A-E
    const { lineName } = this.resolveBattingLine(ground, isPowerplay, isSlog, bowler, striker, strikerRuns, designatedFinisherName, sheetRoleOverride);
    return cell[lineName] || "0";
  }

  // 5. Wonderful Shot Grid (Batting Captain on Strike)
  static rollWonderfulShot(): { redDie: string; blueDie: number; runs: number } {
    const rIdx = Math.floor(Math.random() * 6);
    const cIdx = Math.floor(Math.random() * 6);
    const rows = ["A", "B", "C", "D", "E", "F"];
    const card = POWER_CARDS.find(c => c.name === "Wonderful Shot");
    const val = card?.grid?.[rIdx]?.[cIdx] || "4";
    return {
      redDie: rows[rIdx],
      blueDie: cIdx + 1,
      runs: parseInt(val, 10) || 4
    };
  }

  // 6. Great Delivery Grid (Bowling Captain Bowling)
  static rollGreatDelivery(): { redDie: string; blueDie: number; result: string } {
    const rIdx = Math.floor(Math.random() * 6);
    const cIdx = Math.floor(Math.random() * 6);
    const rows = ["A", "B", "C", "D", "E", "F"];
    const card = POWER_CARDS.find(c => c.name === "Great Delivery");
    const val = card?.grid?.[rIdx]?.[cIdx] || "X";
    return {
      redDie: rows[rIdx],
      blueDie: cIdx + 1,
      result: val // 'X' (wicket), 'D' (dot), 'B' (ball), '+' (extra)
    };
  }

  // 7. DRS Review (Batting Captain reviews LBW or Caught Behind)
  static rollDrsReview(): { die: number; isNotOut: boolean; verdict: string } {
    const die = this.rollDie();
    const isNotOut = die >= 5; // 5 or 6 = Not Out (dot ball)
    return {
      die,
      isNotOut,
      verdict: isNotOut ? "Decision Overturned · NOT OUT (Dot Ball)" : "Decision Upheld · OUT"
    };
  }

  // 8. Commentary Generator
  static generateCommentary(
    delivery: OverDelivery,
    striker: string,
    bowler: string,
    ground: GroundType
  ): { en: string; hi: string } {
    const runs = delivery.runsScored;
    if (delivery.isWicket) {
      const type = delivery.wicketType || "Out";
      return {
        en: `WICKET! ${bowler} strikes! ${delivery.dismissedPlayer || striker} is OUT (${type})!`,
        hi: `विकेट! ${bowler} ने सफलता दिलाई! ${delivery.dismissedPlayer || striker} आउट (${type})!`
      };
    }
    if (delivery.extraType === 'wide') {
      return {
        en: `${bowler} sprays it down the leg side. Wide called (+${delivery.extraRuns} run).`,
        hi: `${bowler} ने दिशा भटकाई, अंपायर का इशारा वाइड (+${delivery.extraRuns} रन)।`
      };
    }
    if (delivery.extraType === 'no_ball') {
      return {
        en: `NO BALL! Overstepping by ${bowler}. Penalty run awarded and FREE HIT next!`,
        hi: `नो बॉल! ${bowler} का पैर क्रीज से बाहर। अगली गेंद फ्री हिट होगी!`
      };
    }
    if (runs === 6) {
      return {
        en: `SIX! Massive blow from ${striker}! High, handsome and deep into the stands!`,
        hi: `छक्का! ${striker} का गगनचुंबी प्रहार! गेंद सीधे दर्शकों के बीच!`
      };
    }
    if (runs === 4) {
      return {
        en: `FOUR! Crisp shot by ${striker}, beats the inner ring and races away to the fence!`,
        hi: `चौका! ${striker} का दर्शनीय शॉट, गेंद गोली की रफ्तार से बाउंड्री के पार!`
      };
    }
    if (runs === 0) {
      return {
        en: `Dot ball. Good delivery from ${bowler}, defended solidly back down the pitch.`,
        hi: `डॉट गेंद। ${bowler} की सटीक लाइन, बल्लेबाज ने सम्मान दिया।`
      };
    }
    return {
      en: `${runs} run${runs > 1 ? 's' : ''}. Pushed into the gap by ${striker}, sharp running between wickets.`,
      hi: `${runs} रन। ${striker} ने गेंद को गैप में ढकेला, दौड़कर रन पूरा किया।`
    };
  }
}
