// scripts/sheets_data.js

// Results:
// '0': dot
// 'X': wicket
// '+': extra
// 'B': ball (in bowling sheet)
// '1', '2', '3', '4', '6': runs (in batting sheet)
// Wicket codes in row F: 'BLD', 'LBW', 'C&B', 'CB', 'ST', 'CT', 'R/O', 'HW'

export const SHEETS_DATA = {
  NSG: {
    ground: "NSG",
    name: "Normal Scoring Ground",
    color: "#22c55e",
    masterBowling: {
      id: "NSG_MB",
      name: "Master Bowling Sheet",
      ground: "NSG",
      type: "bowling",
      phase: "middle",
      grid: {
        A1: { BWD3: "0", BWD2: "B", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        A2: { BWD3: "0", BWD2: "0", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        A3: { forAll: "B" },
        A4: { forAll: "B" },
        A5: { forAll: "B" },
        A6: { forAll: "B" },

        B1: { BWD3: "0", BWD2: "0", BWD1: "0", EQ: "0", BTD1: "0", BTD2: "B", BTD3: "B" },
        B2: { BWD3: "0", BWD2: "B", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        B3: { BWD3: "X", BWD2: "X", BWD1: "X", EQ: "0", BTD1: "0", BTD2: "0", BTD3: "0" },
        B4: { forAll: "B" },
        B5: { BWD3: "0", BWD2: "B", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        B6: { forAll: "B" },

        C1: { BWD3: "X", BWD2: "0", BWD1: "0", EQ: "0", BTD1: "0", BTD2: "0", BTD3: "B" },
        C2: { BWD3: "B", BWD2: "B", BWD1: "B", EQ: "+", BTD1: "+", BTD2: "+", BTD3: "+" },
        C3: { BWD3: "0", BWD2: "0", BWD1: "0", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        C4: { BWD3: "0", BWD2: "0", BWD1: "0", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        C5: { BWD3: "0", BWD2: "0", BWD1: "0", EQ: "0", BTD1: "B", BTD2: "B", BTD3: "B" },
        C6: { BWD3: "0", BWD2: "0", BWD1: "0", EQ: "0", BTD1: "0", BTD2: "B", BTD3: "B" },

        D1: { BWD3: "0", BWD2: "0", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        D2: { BWD3: "0", BWD2: "B", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        D3: { BWD3: "0", BWD2: "0", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        D4: { BWD3: "0", BWD2: "0", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        D5: { BWD3: "B", BWD2: "B", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "+", BTD3: "+" },
        D6: { forAll: "B" },

        E1: { forAll: "X" },
        E2: { BWD3: "X", BWD2: "X", BWD1: "0", EQ: "0", BTD1: "0", BTD2: "0", BTD3: "B" },
        E3: { BWD3: "B", BWD2: "B", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "+" },
        E4: { BWD3: "0", BWD2: "0", BWD1: "0", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        E5: { forAll: "B" },
        E6: { forAll: "+" },

        // Row F (Star Dominance: 5★ / 4★ / 3★)
        F1: { "5★": "0", "4★": "0", "3★": "+" },
        F2: { "5★": "0", "4★": "0", "3★": "B" },
        F3: { "5★": "0", "4★": "B", "3★": "B" },
        F4: { "5★": "B", "4★": "B", "3★": "B" },
        F5: { "5★": "B", "4★": "+", "3★": "+" },
        F6: { "5★": "X", "4★": "X", "3★": "0" }
      }
    },
    masterBatting: {
      id: "NSG_MBat",
      name: "Master Batting Sheet",
      ground: "NSG",
      type: "batting",
      phase: "middle",
      grid: {
        A1: { forAll: "4" },
        A2: { "HS/★": "4", NS: "4", LS: "3", "BWAL/BW": "1" },
        A3: { forAll: "6" },
        A4: { forAll: "6" },
        A5: { forAll: "6" },
        A6: { "HS/★": "2", NS: "1", LS: "0", "BWAL/BW": "X" },

        B1: { "HS/★": "6", NS: "6", LS: "4", "BWAL/BW": "4" },
        B2: { "HS/★": "4", NS: "2", LS: "1", "BWAL/BW": "0" },
        B3: { "HS/★": "6", NS: "4", LS: "4", "BWAL/BW": "4" },
        B4: { "HS/★": "4", NS: "2", LS: "1", "BWAL/BW": "1" },
        B5: { "HS/★": "4", NS: "4", LS: "4", "BWAL/BW": "3" },
        B6: { "HS/★": "0", NS: "0", LS: "X", "BWAL/BW": "X" },

        C1: { "HS/★": "4", NS: "4", LS: "1", "BWAL/BW": "1" },
        C2: { "HS/★": "4", NS: "4", LS: "1", "BWAL/BW": "1" },
        C3: { "HS/★": "4", NS: "4", LS: "1", "BWAL/BW": "1" },
        C4: { "HS/★": "4", NS: "4", LS: "4", "BWAL/BW": "2" },
        C5: { "HS/★": "4", NS: "4", LS: "2", "BWAL/BW": "1" },
        C6: { forAll: "X" },

        D1: { "HS/★": "4", NS: "3", LS: "1", "BWAL/BW": "1" },
        D2: { "HS/★": "2", NS: "1", LS: "1", "BWAL/BW": "0" },
        D3: { "HS/★": "1", NS: "1", LS: "0", "BWAL/BW": "X" },
        D4: { "HS/★": "6", NS: "6", LS: "4", "BWAL/BW": "4" },
        D5: { "HS/★": "6", NS: "6", LS: "6", "BWAL/BW": "4" },
        D6: { forAll: "6" },

        E1: { "HS/★": "3", NS: "1", LS: "1", "BWAL/BW": "0" },
        E2: { "HS/★": "3", NS: "1", LS: "1", "BWAL/BW": "0" },
        E3: { forAll: "4" },
        E4: { forAll: "6" },
        E5: { "HS/★": "4", NS: "4", LS: "1", "BWAL/BW": "1" },
        E6: { "HS/★": "6", NS: "6", LS: "4", "BWAL/BW": "4" },

        // Row F by bowler type (v BW, v BWAL, v BTAL, v BTBW)
        F1: { "v BW": "0", "v BWAL": "0", "v BTAL": "1", "v BTBW": "4" },
        F2: { "v BW": "0", "v BWAL": "1", "v BTAL": "1", "v BTBW": "4" },
        F3: { "v BW": "0", "v BWAL": "2", "v BTAL": "4", "v BTBW": "4" },
        F4: { "v BW": "1", "v BWAL": "3", "v BTAL": "4", "v BTBW": "6" },
        F5: { "v BW": "2", "v BWAL": "4", "v BTAL": "6", "v BTBW": "6" },
        F6: { "v BW": "3", "v BWAL": "6", "v BTAL": "6", "v BTBW": "6" }
      }
    },
    powerplaySlogBowling: {
      id: "NSG_PSB",
      name: "Powerplay & Slog Bowling Sheet",
      ground: "NSG",
      type: "bowling",
      phase: "pp_slog",
      grid: {
        A1: { forAll: "B" },
        A2: { "PWP: PC": "B", "PWP: SP": "B", "SLG: PC": "B", "SLG: SP": "B", "SLG: DB": "0" },
        A3: { forAll: "B" },
        A4: { "PWP: PC": "0", "PWP: SP": "B", "SLG: PC": "0", "SLG: SP": "0", "SLG: DB": "0" },
        A5: { "PWP: PC": "0", "PWP: SP": "B", "SLG: PC": "0", "SLG: SP": "B", "SLG: DB": "0" },
        A6: { forAll: "+" },

        B1: { "PWP: PC": "B", "PWP: SP": "+", "SLG: PC": "B", "SLG: SP": "B", "SLG: DB": "B" },
        B2: { "PWP: PC": "0", "PWP: SP": "B", "SLG: PC": "0", "SLG: SP": "B", "SLG: DB": "0" },
        B3: { forAll: "B" },
        B4: { forAll: "B" },
        B5: { forAll: "B" },
        B6: { forAll: "B" },

        C1: { forAll: "B" },
        C2: { forAll: "B" },
        C3: { forAll: "B" },
        C4: { "PWP: PC": "0", "PWP: SP": "B", "SLG: PC": "0", "SLG: SP": "0", "SLG: DB": "0" },
        C5: { forAll: "B" },
        C6: { forAll: "B" },

        D1: { forAll: "B" },
        D2: { "PWP: PC": "B", "PWP: SP": "B", "SLG: PC": "B", "SLG: SP": "B", "SLG: DB": "0" },
        D3: { "PWP: PC": "X", "PWP: SP": "0", "SLG: PC": "X", "SLG: SP": "X", "SLG: DB": "X" },
        D4: { forAll: "B" },
        D5: { forAll: "B" },
        D6: { forAll: "B" },

        E1: { "PWP: PC": "B", "PWP: SP": "B", "SLG: PC": "0", "SLG: SP": "B", "SLG: DB": "0" },
        E2: { forAll: "X" },
        E3: { forAll: "B" },
        E4: { forAll: "B" },
        E5: { forAll: "B" },
        E6: { forAll: "B" },

        // Row F by bowling style group (LF/LFM, RF/RFM, RM/LM, RO/RL, LO/LC)
        F1: { "LF/LFM": "BLD", "RF/RFM": "LBW", "RM/LM": "C&B", "RO/RL": "ST", "LO/LC": "ST" },
        F2: { "LF/LFM": "0", "RF/RFM": "0", "RM/LM": "0", "RO/RL": "0", "LO/LC": "0" },
        F3: { "LF/LFM": "B", "RF/RFM": "B", "RM/LM": "B", "RO/RL": "B", "LO/LC": "B" },
        F4: { "LF/LFM": "B", "RF/RFM": "B", "RM/LM": "B", "RO/RL": "B", "LO/LC": "B" },
        F5: { "LF/LFM": "B", "RF/RFM": "B", "RM/LM": "B", "RO/RL": "B", "LO/LC": "B" },
        F6: { "LF/LFM": "CB", "RF/RFM": "CB", "RM/LM": "LBW", "RO/RL": "LBW", "LO/LC": "BLD" }
      }
    },
    powerplaySlogBatting: {
      id: "NSG_PSBat",
      name: "Powerplay & Slog Batting Sheet",
      ground: "NSG",
      type: "batting",
      phase: "pp_slog",
      grid: {
        A1: { PWPO: "6", PWPR: "6", "SLG F": "6", "SLG R": "6", BW: "4" },
        A2: { PWPO: "4", PWPR: "4", "SLG F": "4", "SLG R": "4", BW: "1" },
        A3: { PWPO: "6", PWPR: "4", "SLG F": "6", "SLG R": "6", BW: "4" },
        A4: { forAll: "6" },
        A5: { PWPO: "4", PWPR: "4", "SLG F": "4", "SLG R": "4", BW: "1" },
        A6: { forAll: "6" },

        B1: { forAll: "6" },
        B2: { PWPO: "4", PWPR: "4", "SLG F": "4", "SLG R": "4", BW: "1" },
        B3: { PWPO: "1", PWPR: "0", "SLG F": "X", "SLG R": "0", BW: "X" },
        B4: { PWPO: "4", PWPR: "4", "SLG F": "4", "SLG R": "4", BW: "2" },
        B5: { forAll: "X" },
        B6: { PWPO: "2", PWPR: "1", "SLG F": "0", "SLG R": "1", BW: "X" },

        C1: { PWPO: "4", PWPR: "4", "SLG F": "6", "SLG R": "4", BW: "3" },
        C2: { forAll: "6" },
        C3: { PWPO: "4", PWPR: "4", "SLG F": "4", "SLG R": "4", BW: "1" },
        C4: { PWPO: "4", PWPR: "3", "SLG F": "4", "SLG R": "4", BW: "0" },
        C5: { forAll: "6" },
        C6: { PWPO: "3", PWPR: "2", "SLG F": "2", "SLG R": "3", BW: "X" },

        D1: { PWPO: "4", PWPR: "4", "SLG F": "6", "SLG R": "4", BW: "4" },
        D2: { PWPO: "6", PWPR: "6", "SLG F": "6", "SLG R": "6", BW: "4" },
        D3: { PWPO: "4", PWPR: "4", "SLG F": "6", "SLG R": "4", BW: "4" },
        D4: { PWPO: "2", PWPR: "2", "SLG F": "1", "SLG R": "2", BW: "X" },
        D5: { PWPO: "0", PWPR: "X", "SLG F": "X", "SLG R": "X", BW: "X" },
        D6: { PWPO: "4", PWPR: "4", "SLG F": "6", "SLG R": "6", BW: "4" },

        E1: { PWPO: "6", PWPR: "6", "SLG F": "6", "SLG R": "6", BW: "4" },
        E2: { PWPO: "4", PWPR: "4", "SLG F": "4", "SLG R": "4", BW: "3" },
        E3: { forAll: "6" },
        E4: { PWPO: "6", PWPR: "6", "SLG F": "6", "SLG R": "6", BW: "4" },
        E5: { PWPO: "3", PWPR: "3", "SLG F": "3", "SLG R": "3", BW: "0" },
        E6: { PWPO: "6", PWPR: "6", "SLG F": "6", "SLG R": "6", BW: "4" },

        // Row F by batsman (★, BW, BWAL, REST)
        F1: { "★": "0", BW: "0", BWAL: "0", REST: "0" },
        F2: { "★": "4", BW: "0", BWAL: "0", REST: "1" },
        F3: { "★": "4", BW: "0", BWAL: "1", REST: "2" },
        F4: { "★": "6", BW: "1", BWAL: "4", REST: "3" },
        F5: { "★": "6", BW: "X", BWAL: "6", REST: "4" },
        F6: { "★": "6", BW: "X", BWAL: "X", REST: "6" }
      }
    }
  },
  HSG: {
    ground: "HSG",
    name: "High Scoring Ground",
    color: "#ef4444",
    masterBowling: {
      id: "HSG_MB",
      name: "Master Bowling Sheet",
      ground: "HSG",
      type: "bowling",
      phase: "middle",
      grid: {
        A1: { forAll: "B" },
        A2: { forAll: "B" },
        A3: { forAll: "B" },
        A4: { forAll: "B" },
        A5: { forAll: "B" },
        A6: { forAll: "B" },

        B1: { BWD3: "B", BWD2: "B", BWD1: "B", EQ: "+", BTD1: "+", BTD2: "+", BTD3: "+" },
        B2: { forAll: "B" },
        B3: { forAll: "B" },
        B4: { forAll: "X" },
        B5: { forAll: "B" },
        B6: { forAll: "B" },

        C1: { forAll: "0" },
        C2: { BWD3: "0", BWD2: "0", BWD1: "0", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        C3: { BWD3: "0", BWD2: "B", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        C4: { BWD3: "B", BWD2: "B", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "+", BTD3: "+" },
        C5: { BWD3: "0", BWD2: "0", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        C6: { forAll: "B" },

        D1: { forAll: "B" },
        D2: { forAll: "B" },
        D3: { forAll: "B" },
        D4: { forAll: "B" },
        D5: { forAll: "B" },
        D6: { forAll: "B" },

        E1: { BWD3: "B", BWD2: "B", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "+" },
        E2: { forAll: "+" },
        E3: { BWD3: "B", BWD2: "B", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "+" },
        E4: { forAll: "B" },
        E5: { BWD3: "B", BWD2: "B", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "+", BTD3: "+" },
        E6: { forAll: "B" },

        F1: { "5★": "0", "4★": "0", "3★": "+" },
        F2: { "5★": "0", "4★": "B", "3★": "+" },
        F3: { "5★": "B", "4★": "B", "3★": "B" },
        F4: { "5★": "B", "4★": "B", "3★": "B" },
        F5: { "5★": "B", "4★": "+", "3★": "+" },
        F6: { "5★": "X", "4★": "X", "3★": "0" }
      }
    },
    masterBatting: {
      id: "HSG_MBat",
      name: "Master Batting Sheet",
      ground: "HSG",
      type: "batting",
      phase: "middle",
      grid: {
        A1: { "HS/★": "6", NS: "6", LS: "4", "BWAL/BW": "4" },
        A2: { "HS/★": "6", NS: "4", LS: "4", "BWAL/BW": "4" },
        A3: { "HS/★": "4", NS: "4", LS: "4", "BWAL/BW": "1" },
        A4: { "HS/★": "4", NS: "2", LS: "1", "BWAL/BW": "0" },
        A5: { "HS/★": "0", NS: "0", LS: "0", "BWAL/BW": "X" },
        A6: { "HS/★": "6", NS: "6", LS: "6", "BWAL/BW": "4" },

        B1: { "HS/★": "6", NS: "6", LS: "4", "BWAL/BW": "4" },
        B2: { "HS/★": "2", NS: "1", LS: "1", "BWAL/BW": "0" },
        B3: { "HS/★": "6", NS: "4", LS: "4", "BWAL/BW": "3" },
        B4: { "HS/★": "6", NS: "6", LS: "4", "BWAL/BW": "4" },
        B5: { "HS/★": "4", NS: "2", LS: "1", "BWAL/BW": "0" },
        B6: { forAll: "6" },

        C1: { "HS/★": "1", NS: "1", LS: "1", "BWAL/BW": "X" },
        C2: { "HS/★": "4", NS: "4", LS: "1", "BWAL/BW": "1" },
        C3: { "HS/★": "4", NS: "4", LS: "2", "BWAL/BW": "1" },
        C4: { forAll: "6" },
        C5: { "HS/★": "4", NS: "3", LS: "1", "BWAL/BW": "0" },
        C6: { "HS/★": "4", NS: "4", LS: "4", "BWAL/BW": "1" },

        D1: { forAll: "6" },
        D2: { forAll: "6" },
        D3: { "HS/★": "6", NS: "6", LS: "6", "BWAL/BW": "4" },
        D4: { forAll: "X" },
        D5: { "HS/★": "4", NS: "4", LS: "4", "BWAL/BW": "1" },
        D6: { "HS/★": "3", NS: "1", LS: "1", "BWAL/BW": "0" },

        E1: { "HS/★": "4", NS: "4", LS: "3", "BWAL/BW": "1" },
        E2: { forAll: "6" },
        E3: { "HS/★": "4", NS: "4", LS: "4", "BWAL/BW": "2" },
        E4: { "HS/★": "6", NS: "6", LS: "4", "BWAL/BW": "4" },
        E5: { "HS/★": "4", NS: "4", LS: "1", "BWAL/BW": "0" },
        E6: { "HS/★": "4", NS: "4", LS: "4", "BWAL/BW": "1" },

        F1: { "v BW": "0", "v BWAL": "1", "v BTAL": "2", "v BTBW": "4" },
        F2: { "v BW": "0", "v BWAL": "2", "v BTAL": "3", "v BTBW": "4" },
        F3: { "v BW": "1", "v BWAL": "3", "v BTAL": "4", "v BTBW": "6" },
        F4: { "v BW": "2", "v BWAL": "4", "v BTAL": "6", "v BTBW": "6" },
        F5: { "v BW": "3", "v BWAL": "6", "v BTAL": "4", "v BTBW": "6" },
        F6: { "v BW": "4", "v BWAL": "4", "v BTAL": "6", "v BTBW": "6" }
      }
    },
    powerplaySlogBowling: {
      id: "HSG_PSB",
      name: "Powerplay & Slog Bowling Sheet",
      ground: "HSG",
      type: "bowling",
      phase: "pp_slog",
      grid: {
        A1: { forAll: "B" },
        A2: { "PWP: PC": "0", "PWP: SP": "B", "SLG: PC": "0", "SLG: SP": "B", "SLG: DB": "0" },
        A3: { forAll: "B" },
        A4: { forAll: "B" },
        A5: { forAll: "+" },
        A6: { forAll: "0" },

        B1: { forAll: "B" },
        B2: { forAll: "B" },
        B3: { forAll: "B" },
        B4: { "PWP: PC": "B", "PWP: SP": "+", "SLG: PC": "B", "SLG: SP": "+", "SLG: DB": "B" },
        B5: { forAll: "B" },
        B6: { forAll: "B" },

        C1: { forAll: "X" },
        C2: { forAll: "B" },
        C3: { forAll: "B" },
        C4: { "PWP: PC": "B", "PWP: SP": "B", "SLG: PC": "B", "SLG: SP": "B", "SLG: DB": "0" },
        C5: { forAll: "0" },
        C6: { forAll: "B" },

        D1: { forAll: "B" },
        D2: { forAll: "B" },
        D3: { "PWP: PC": "0", "PWP: SP": "B", "SLG: PC": "B", "SLG: SP": "B", "SLG: DB": "0" },
        D4: { forAll: "B" },
        D5: { forAll: "B" },
        D6: { forAll: "B" },

        E1: { "PWP: PC": "B", "PWP: SP": "B", "SLG: PC": "B", "SLG: SP": "B", "SLG: DB": "0" },
        E2: { forAll: "B" },
        E3: { forAll: "B" },
        E4: { forAll: "B" },
        E5: { forAll: "B" },
        E6: { forAll: "B" },

        F1: { "LF/LFM": "BLD", "RF/RFM": "LBW", "RM/LM": "C&B", "RO/RL": "ST", "LO/LC": "ST" },
        F2: { "LF/LFM": "B", "RF/RFM": "B", "RM/LM": "B", "RO/RL": "B", "LO/LC": "B" },
        F3: { "LF/LFM": "B", "RF/RFM": "B", "RM/LM": "B", "RO/RL": "B", "LO/LC": "B" },
        F4: { "LF/LFM": "B", "RF/RFM": "B", "RM/LM": "B", "RO/RL": "B", "LO/LC": "B" },
        F5: { "LF/LFM": "B", "RF/RFM": "B", "RM/LM": "B", "RO/RL": "B", "LO/LC": "B" },
        F6: { "LF/LFM": "CB", "RF/RFM": "CB", "RM/LM": "LBW", "RO/RL": "LBW", "LO/LC": "BLD" }
      }
    },
    powerplaySlogBatting: {
      id: "HSG_PSBat",
      name: "Powerplay & Slog Batting Sheet",
      ground: "HSG",
      type: "batting",
      phase: "pp_slog",
      grid: {
        A1: { forAll: "6" },
        A2: { PWPO: "4", PWPR: "4", "SLG F": "4", "SLG R": "4", BW: "1" },
        A3: { forAll: "X" },
        A4: { PWPO: "4", PWPR: "4", "SLG F": "6", "SLG R": "4", BW: "2" },
        A5: { forAll: "6" },
        A6: { PWPO: "6", PWPR: "6", "SLG F": "6", "SLG R": "6", BW: "4" },

        B1: { forAll: "6" },
        B2: { PWPO: "4", PWPR: "4", "SLG F": "6", "SLG R": "4", BW: "1" },
        B3: { PWPO: "6", PWPR: "6", "SLG F": "6", "SLG R": "6", BW: "4" },
        B4: { PWPO: "4", PWPR: "4", "SLG F": "3", "SLG R": "4", BW: "0" },
        B5: { forAll: "6" },
        B6: { PWPO: "3", PWPR: "3", "SLG F": "2", "SLG R": "3", BW: "X" },

        C1: { PWPO: "0", PWPR: "0", "SLG F": "X", "SLG R": "0", BW: "X" },
        C2: { PWPO: "6", PWPR: "4", "SLG F": "6", "SLG R": "4", BW: "3" },
        C3: { PWPO: "4", PWPR: "4", "SLG F": "4", "SLG R": "4", BW: "0" },
        C4: { PWPO: "4", PWPR: "4", "SLG F": "6", "SLG R": "4", BW: "1" },
        C5: { PWPO: "6", PWPR: "6", "SLG F": "6", "SLG R": "6", BW: "4" },
        C6: { forAll: "6" },

        D1: { PWPO: "4", PWPR: "4", "SLG F": "6", "SLG R": "4", BW: "3" },
        D2: { PWPO: "1", PWPR: "1", "SLG F": "0", "SLG R": "1", BW: "X" },
        D3: { PWPO: "4", PWPR: "4", "SLG F": "4", "SLG R": "4", BW: "1" },
        D4: { forAll: "6" },
        D5: { PWPO: "4", PWPR: "4", "SLG F": "4", "SLG R": "4", BW: "0" },
        D6: { PWPO: "4", PWPR: "4", "SLG F": "4", "SLG R": "4", BW: "0" },

        E1: { PWPO: "6", PWPR: "4", "SLG F": "6", "SLG R": "4", BW: "4" },
        E2: { PWPO: "6", PWPR: "6", "SLG F": "6", "SLG R": "6", BW: "4" },
        E3: { forAll: "6" },
        E4: { forAll: "6" },
        E5: { PWPO: "6", PWPR: "6", "SLG F": "6", "SLG R": "6", BW: "4" },
        E6: { PWPO: "2", PWPR: "2", "SLG F": "1", "SLG R": "2", BW: "X" },

        F1: { "★": "0", BW: "0", BWAL: "0", REST: "0" },
        F2: { "★": "4", BW: "0", BWAL: "0", REST: "1" },
        F3: { "★": "6", BW: "1", BWAL: "1", REST: "4" },
        F4: { "★": "6", BW: "3", BWAL: "6", REST: "4" },
        F5: { "★": "6", BW: "X", BWAL: "6", REST: "4" },
        F6: { "★": "6", BW: "X", BWAL: "X", REST: "6" }
      }
    }
  },
  LSG: {
    ground: "LSG",
    name: "Low Scoring Ground",
    color: "#eab308",
    masterBowling: {
      id: "LSG_MB",
      name: "Master Bowling Sheet",
      ground: "LSG",
      type: "bowling",
      phase: "middle",
      grid: {
        A1: { BWD3: "0", BWD2: "0", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        A2: { BWD3: "0", BWD2: "0", BWD1: "0", EQ: "0", BTD1: "0", BTD2: "0", BTD3: "B" },
        A3: { forAll: "B" },
        A4: { BWD3: "0", BWD2: "0", BWD1: "0", EQ: "0", BTD1: "B", BTD2: "B", BTD3: "B" },
        A5: { BWD3: "0", BWD2: "0", BWD1: "0", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        A6: { BWD3: "0", BWD2: "B", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },

        B1: { BWD3: "0", BWD2: "0", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        B2: { forAll: "X" },
        B3: { BWD3: "B", BWD2: "B", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "+", BTD3: "+" },
        B4: { BWD3: "0", BWD2: "0", BWD1: "0", EQ: "0", BTD1: "0", BTD2: "B", BTD3: "B" },
        B5: { BWD3: "B", BWD2: "B", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "+" },
        B6: { BWD3: "0", BWD2: "0", BWD1: "0", EQ: "0", BTD1: "0", BTD2: "B", BTD3: "B" },

        C1: { BWD3: "0", BWD2: "0", BWD1: "0", EQ: "0", BTD1: "0", BTD2: "0", BTD3: "B" },
        C2: { BWD3: "0", BWD2: "0", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        C3: { BWD3: "0", BWD2: "0", BWD1: "0", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        C4: { BWD3: "0", BWD2: "B", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        C5: { BWD3: "X", BWD2: "0", BWD1: "0", EQ: "0", BTD1: "0", BTD2: "0", BTD3: "0" },
        C6: { forAll: "B" },

        D1: { BWD3: "0", BWD2: "0", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        D2: { BWD3: "0", BWD2: "0", BWD1: "0", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        D3: { forAll: "B" },
        D4: { BWD3: "X", BWD2: "X", BWD1: "X", EQ: "0", BTD1: "0", BTD2: "0", BTD3: "0" },
        D5: { BWD3: "0", BWD2: "B", BWD1: "B", EQ: "B", BTD1: "B", BTD2: "B", BTD3: "B" },
        D6: { forAll: "B" },

        E1: { forAll: "B" },
        E2: { forAll: "+" },
        E3: { BWD3: "B", BWD2: "B", BWD1: "B", EQ: "+", BTD1: "+", BTD2: "+", BTD3: "+" },
        E4: { BWD3: "X", BWD2: "X", BWD1: "0", EQ: "0", BTD1: "0", BTD2: "0", BTD3: "0" },
        E5: { forAll: "B" },
        E6: { forAll: "B" },

        F1: { "5★": "0", "4★": "0", "3★": "+" },
        F2: { "5★": "0", "4★": "0", "3★": "B" },
        F3: { "5★": "0", "4★": "0", "3★": "B" },
        F4: { "5★": "0", "4★": "B", "3★": "0" },
        F5: { "5★": "B", "4★": "+", "3★": "+" },
        F6: { "5★": "X", "4★": "X", "3★": "0" }
      }
    },
    masterBatting: {
      id: "LSG_MBat",
      name: "Master Batting Sheet",
      ground: "LSG",
      type: "batting",
      phase: "middle",
      grid: {
        A1: { "HS/★": "6", NS: "6", LS: "4", "BWAL/BW": "4" },
        A2: { "HS/★": "4", NS: "4", LS: "1", "BWAL/BW": "1" },
        A3: { "HS/★": "6", NS: "6", LS: "4", "BWAL/BW": "4" },
        A4: { "HS/★": "4", NS: "1", LS: "1", "BWAL/BW": "0" },
        A5: { "HS/★": "4", NS: "2", LS: "1", "BWAL/BW": "1" },
        A6: { forAll: "X" },

        B1: { "HS/★": "4", NS: "2", LS: "1", "BWAL/BW": "1" },
        B2: { "HS/★": "6", NS: "6", LS: "4", "BWAL/BW": "4" },
        B3: { "HS/★": "1", NS: "1", LS: "0", "BWAL/BW": "0" },
        B4: { "HS/★": "1", NS: "1", LS: "0", "BWAL/BW": "0" },
        B5: { "HS/★": "1", NS: "0", LS: "0", "BWAL/BW": "0" },
        B6: { "HS/★": "4", NS: "4", LS: "1", "BWAL/BW": "1" },

        C1: { "HS/★": "2", NS: "1", LS: "1", "BWAL/BW": "0" },
        C2: { "HS/★": "4", NS: "4", LS: "1", "BWAL/BW": "1" },
        C3: { "HS/★": "4", NS: "3", LS: "1", "BWAL/BW": "1" },
        C4: { "HS/★": "2", NS: "1", LS: "1", "BWAL/BW": "0" },
        C5: { "HS/★": "3", NS: "1", LS: "1", "BWAL/BW": "0" },
        C6: { forAll: "6" },

        D1: { "HS/★": "1", NS: "1", LS: "0", "BWAL/BW": "0" },
        D2: { "HS/★": "0", NS: "0", LS: "X", "BWAL/BW": "X" },
        D3: { "HS/★": "6", NS: "4", LS: "2", "BWAL/BW": "1" },
        D4: { "HS/★": "4", NS: "1", LS: "1", "BWAL/BW": "1" },
        D5: { "HS/★": "3", NS: "1", LS: "1", "BWAL/BW": "0" },
        D6: { "HS/★": "1", NS: "0", LS: "0", "BWAL/BW": "X" },

        E1: { "HS/★": "1", NS: "0", LS: "0", "BWAL/BW": "X" },
        E2: { "HS/★": "6", NS: "4", LS: "3", "BWAL/BW": "2" },
        E3: { "HS/★": "6", NS: "4", LS: "4", "BWAL/BW": "3" },
        E4: { forAll: "6" },
        E5: { "HS/★": "4", NS: "1", LS: "1", "BWAL/BW": "1" },
        E6: { "HS/★": "4", NS: "4", LS: "1", "BWAL/BW": "1" },

        F1: { "v BW": "0", "v BWAL": "0", "v BTAL": "0", "v BTBW": "0" },
        F2: { "v BW": "0", "v BWAL": "0", "v BTAL": "0", "v BTBW": "1" },
        F3: { "v BW": "0", "v BWAL": "1", "v BTAL": "1", "v BTBW": "2" },
        F4: { "v BW": "0", "v BWAL": "2", "v BTAL": "2", "v BTBW": "4" },
        F5: { "v BW": "1", "v BWAL": "3", "v BTAL": "4", "v BTBW": "6" },
        F6: { "v BW": "2", "v BWAL": "4", "v BTAL": "6", "v BTBW": "6" }
      }
    },
    powerplaySlogBowling: {
      id: "LSG_PSB",
      name: "Powerplay & Slog Bowling Sheet",
      ground: "LSG",
      type: "bowling",
      phase: "pp_slog",
      grid: {
        A1: { "PWP: PC": "0", "PWP: SP": "B", "SLG: PC": "0", "SLG: SP": "0", "SLG: DB": "0" },
        A2: { forAll: "B" },
        A3: { forAll: "B" },
        A4: { forAll: "0" },
        A5: { forAll: "B" },
        A6: { forAll: "B" },

        B1: { forAll: "0" },
        B2: { forAll: "B" },
        B3: { forAll: "B" },
        B4: { forAll: "B" },
        B5: { forAll: "B" },
        B6: { forAll: "B" },

        C1: { "PWP: PC": "X", "PWP: SP": "0", "SLG: PC": "X", "SLG: SP": "X", "SLG: DB": "X" },
        C2: { forAll: "B" },
        C3: { "PWP: PC": "B", "PWP: SP": "B", "SLG: PC": "B", "SLG: SP": "B", "SLG: DB": "0" },
        C4: { "PWP: PC": "B", "PWP: SP": "B", "SLG: PC": "B", "SLG: SP": "B", "SLG: DB": "0" },
        C5: { forAll: "B" },
        C6: { "PWP: PC": "0", "PWP: SP": "B", "SLG: PC": "0", "SLG: SP": "0", "SLG: DB": "0" },

        D1: { forAll: "B" },
        D2: { "PWP: PC": "B", "PWP: SP": "+", "SLG: PC": "B", "SLG: SP": "B", "SLG: DB": "B" },
        D3: { forAll: "B" },
        D4: { forAll: "B" },
        D5: { forAll: "B" },
        D6: { forAll: "B" },

        E1: { "PWP: PC": "0", "PWP: SP": "B", "SLG: PC": "0", "SLG: SP": "B", "SLG: DB": "0" },
        E2: { forAll: "+" },
        E3: { forAll: "X" },
        E4: { forAll: "B" },
        E5: { "PWP: PC": "B", "PWP: SP": "B", "SLG: PC": "0", "SLG: SP": "B", "SLG: DB": "0" },
        E6: { "PWP: PC": "0", "PWP: SP": "B", "SLG: PC": "0", "SLG: SP": "B", "SLG: DB": "0" },

        F1: { "LF/LFM": "BLD", "RF/RFM": "LBW", "RM/LM": "C&B", "RO/RL": "ST", "LO/LC": "ST" },
        F2: { "LF/LFM": "0", "RF/RFM": "0", "RM/LM": "0", "RO/RL": "0", "LO/LC": "0" },
        F3: { "LF/LFM": "B", "RF/RFM": "B", "RM/LM": "B", "RO/RL": "B", "LO/LC": "B" },
        F4: { "LF/LFM": "B", "RF/RFM": "B", "RM/LM": "B", "RO/RL": "B", "LO/LC": "B" },
        F5: { "LF/LFM": "0", "RF/RFM": "0", "RM/LM": "0", "RO/RL": "0", "LO/LC": "0" },
        F6: { "LF/LFM": "CB", "RF/RFM": "CB", "RM/LM": "LBW", "RO/RL": "LBW", "LO/LC": "BLD" }
      }
    },
    powerplaySlogBatting: {
      id: "LSG_PSBat",
      name: "Powerplay & Slog Batting Sheet",
      ground: "LSG",
      type: "batting",
      phase: "pp_slog",
      grid: {
        A1: { PWPO: "6", PWPR: "6", "SLG F": "6", "SLG R": "6", BW: "4" },
        A2: { PWPO: "1", PWPR: "1", "SLG F": "1", "SLG R": "0", BW: "X" },
        A3: { PWPO: "6", PWPR: "4", "SLG F": "6", "SLG R": "6", BW: "4" },
        A4: { PWPO: "6", PWPR: "6", "SLG F": "6", "SLG R": "6", BW: "4" },
        A5: { PWPO: "4", PWPR: "3", "SLG F": "4", "SLG R": "3", BW: "1" },
        A6: { PWPO: "4", PWPR: "4", "SLG F": "6", "SLG R": "4", BW: "2" },

        B1: { PWPO: "6", PWPR: "6", "SLG F": "6", "SLG R": "6", BW: "4" },
        B2: { PWPO: "4", PWPR: "3", "SLG F": "4", "SLG R": "3", BW: "1" },
        B3: { PWPO: "6", PWPR: "6", "SLG F": "6", "SLG R": "6", BW: "4" },
        B4: { PWPO: "1", PWPR: "0", "SLG F": "0", "SLG R": "0", BW: "X" },
        B5: { PWPO: "3", PWPR: "2", "SLG F": "2", "SLG R": "1", BW: "0" },
        B6: { PWPO: "4", PWPR: "4", "SLG F": "4", "SLG R": "4", BW: "1" },

        C1: { PWPO: "0", PWPR: "0", "SLG F": "X", "SLG R": "0", BW: "X" },
        C2: { forAll: "6" },
        C3: { PWPO: "4", PWPR: "4", "SLG F": "4", "SLG R": "4", BW: "1" },
        C4: { forAll: "X" },
        C5: { forAll: "6" },
        C6: { PWPO: "2", PWPR: "1", "SLG F": "1", "SLG R": "1", BW: "0" },

        D1: { PWPO: "3", PWPR: "2", "SLG F": "3", "SLG R": "2", BW: "0" },
        D2: { PWPO: "1", PWPR: "0", "SLG F": "0", "SLG R": "0", BW: "X" },
        D3: { PWPO: "1", PWPR: "1", "SLG F": "1", "SLG R": "1", BW: "0" },
        D4: { PWPO: "6", PWPR: "6", "SLG F": "6", "SLG R": "6", BW: "4" },
        D5: { PWPO: "4", PWPR: "4", "SLG F": "6", "SLG R": "4", BW: "3" },
        D6: { PWPO: "6", PWPR: "4", "SLG F": "6", "SLG R": "6", BW: "3" },

        E1: { PWPO: "2", PWPR: "1", "SLG F": "1", "SLG R": "1", BW: "0" },
        E2: { PWPO: "1", PWPR: "1", "SLG F": "1", "SLG R": "1", BW: "0" },
        E3: { PWPO: "0", PWPR: "X", "SLG F": "X", "SLG R": "X", BW: "X" },
        E4: { PWPO: "4", PWPR: "4", "SLG F": "4", "SLG R": "4", BW: "1" },
        E5: { PWPO: "4", PWPR: "4", "SLG F": "6", "SLG R": "4", BW: "1" },
        E6: { PWPO: "4", PWPR: "4", "SLG F": "4", "SLG R": "4", BW: "1" },

        F1: { "★": "0", BW: "0", BWAL: "0", REST: "0" },
        F2: { "★": "0", BW: "0", BWAL: "0", REST: "0" },
        F3: { "★": "4", BW: "0", BWAL: "1", REST: "1" },
        F4: { "★": "6", BW: "X", BWAL: "2", REST: "2" },
        F5: { "★": "6", BW: "X", BWAL: "4", REST: "3" },
        F6: { "★": "6", BW: "X", BWAL: "X", REST: "4" }
      }
    }
  }
};
