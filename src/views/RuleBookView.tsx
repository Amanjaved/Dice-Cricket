// src/views/RuleBookView.tsx
import React, { useState } from 'react';
import { BookOpen, Download, Share2, Printer, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

export const RuleBookView: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 11;

  const ruleBookPages = [
    {
      page: 1,
      title: "1. What You Need & 2. Formats",
      content: `Two dice, four master sheets, three grounds and one deck of cards. Every ball is decided by the dice — every decision is yours.
• Red die = row A–F, blue die = column 1–6.
• 4 master sheets for each ground: Master Bowling, Master Batting, Powerplay & Slog Bowling, Powerplay & Slog Batting.
• Cards (87 total): Wickets 25 · Runs 16 · Fielding 20 · Skills 20 · Power cards 6 (2 Reroll, 2 Wonderful Shot, 2 Great Delivery).
• Formats:
  - 5 overs: 7 a side, 6 wickets all out, 2 bowlers max 2 overs (rest 1), Powerplay over 1, Slog over 5.
  - 10 overs: 11 a side, 10 wickets all out, max 2 overs each, Powerplay overs 1–2, Slog overs 9–10.`
    },
    {
      page: 2,
      title: "3. The Three Grounds & 4. Starting a Match",
      content: `The whole match uses the chosen ground's four sheets.
• HSG (High Scoring Ground, Red): 5 ov ~90 (75–110), 10 ov ~197 (170–225). Very few dots, fewer wickets, many 4s and 6s.
• NSG (Normal Scoring Ground, Green): 5 ov ~68 (56–80), 10 ov ~150 (130–170). The normal balanced game.
• LSG (Low Scoring Ground, Yellow): 5 ov ~42 (30–54), 10 ov ~95 (75–115). Many dots, more wickets, boundaries are hard to find.
• Starting a match: Choose ground -> do the toss -> pick Playing XI/7 -> batting order & captain. Toss winner bats or bowls first.`
    },
    {
      page: 3,
      title: "Your First Match · Step by Step",
      content: `1. Choose format and ground. Start with 5 overs on NSG — short, normal scoring, easy to learn.
2. Pick squad (7 or 11) using the balanced team plan: openers, Star, keeper, Finisher, all-rounders and bowlers with a DB.
3. Set batting order. Openers at 1–2, best batsmen next, all-rounders in middle, Finisher at 5–6, bowlers last.
4. Pick captain. BW/BWAL brings Great Delivery; BAT/BTBW/BTAL/WK brings Wonderful Shot. Both get one Reroll.
5. Toss. Winner chooses to bat or bowl.
6. Plan bowling: Pacers in Powerplay, spinners/all-rounders in middle, DB in Slog. Nobody bowls 2 overs in a row.
7. Play each ball: Bowling roll -> result -> Batting roll if Ball.
8. On wicket draw Wicket card -> Fielding & Skills if fielder involved. On extra draw Runs card.
9. Watch triggers: Star past listed runs, Slog overs starting (Finisher, DB), BW batsman coming in.
10. Use power cards only on captain's own roll, straight after the roll.`
    },
    {
      page: 4,
      title: "5. Every Ball in Three Steps & 6. Which Bowling Line?",
      content: `1. Bowling roll: Roll both dice on bowling sheet. Read only your line.
2. Result: 0 dot ball · X wicket card · + extra (Runs card) · Ball: go to step 3.
3. Batting roll: Roll again on batting sheet: 0, 1, 2, 3, 4, 6 runs or X wicket card.
• Middle overs Bowling Line:
  - Bowler Role x Batsman Role:
    BW vs BW -> BWD3; BW vs BWAL -> BWD2; BW vs BTAL/WK -> BWD1; BW vs BAT/BTBW -> EQ
    BTBW vs BAT/BTBW -> BTD3 (worst line for bowler).
• Powerplay & Slog Bowling (5 lines):
  - PWP: PC (pacer in Powerplay) · PWP: SP (spinner in Powerplay)
  - SLG: PC (pacer in Slog) · SLG: SP (spinner in Slog)
  - SLG: DB (death bowler in Slog, pacer or spinner)
• Row F: Master Bowling follows Star Dominance (5★ / 4★ / 3★); PP&Slog Bowling follows bowling style (LF/LFM, RF/RFM, RM/LM, RO/RL, LO/LC).`
    },
    {
      page: 5,
      title: "7. Which Batting Line? & 8. Reading a Cell",
      content: `• Middle overs Master Batting (4 lines):
  1. Star past listed runs -> HS/★
  2. BWAL or BW batsman -> BWAL/BW
  3. Everyone else -> Matchup Grid B:
     - RF/RFM: v RHB = NS, v LHB = LS
     - LF/LFM: v RHB = LS, v LHB = NS
     - RM: v RHB = HS/★, v LHB = NS
     - LM: v RHB = NS, v LHB = HS/★
     - RO/LC: v RHB = HS/★, v LHB = LS
     - LO/RL: v RHB = LS, v LHB = HS/★
• Powerplay & Slog Batting:
  - PWPO: openers in Powerplay
  - PWPR: everyone else in Powerplay
  - SLG F: the one Finisher in Slog
  - SLG R: everyone else in Slog
  - BW: a BW batsman in any of these overs
• Row F follows bowler's type (Middle) or batsman status (PP&Slog).`
    },
    {
      page: 6,
      title: "9. Power Cards & Wicket Codes",
      content: `• Captains only:
  - Reroll ×2 (one per captain): Cancel own roll and roll again — both dice, or red only / blue only (Half Reroll).
  - Wonderful Shot ×2: Batting captain on strike. Cancel batting roll, roll card: 30 of 36 are 4 or 6, no wicket.
  - Great Delivery ×2: Bowling captain bowling. Cancel bowling roll, roll card: 22 of 36 are wickets.
• Row F Wicket Short Forms:
  - BLD (Bowled), LBW (Leg before wicket), HW (Hit wicket) -> Out straight away!
  - CB (Caught behind) & ST (Stumped) -> Keeper known: draw only Skills card.
  - C&B (Caught & bowled) -> Bowler known: draw only Skills card.
  - CT (Caught) & R/O (Run out) -> Draw Fielding card, then Skills card.`
    },
    {
      page: 7,
      title: "10. Special Rules & Death Bowlers",
      content: `• Finisher (F): Only one F batsman is the Finisher, and only in the Slog (reads SLG F).
• Death Bowler (DB): In the Slog a DB reads the SLG: DB line — more dots and wickets than any other bowler.
• Star ★: Once past listed runs, reads HS/★ in middle overs and ★ on row F in PP and Slog.
• Review (DRS): Batting captain given out LBW or Caught Behind may spend his Reroll: roll 1 die, 5–6 = NOT OUT (dot ball).
• Super Over: 3 batsmen & 1 bowler each, one over, Slog sheets, 2 wickets end it. Tied again? Play another.
• Death Bowlers by Team:
  - AUS: Victor, Abhay · BAN: Ashish
  - SL: Milindu, Naveen · ENG: Eric
  - PAK: Huzaifa, Faizan · SA: Teboho
  - IND: Ojas, Javed · NZ: Ibrahim
  - AFG: Taimur · WI: Mohammad`
    },
    {
      page: 8,
      title: "11. Ground Analysis & 12. Batting Lines",
      content: `Each cell: runs per over · balls per wicket (A-E):
- Middle equal contest: HSG 23·15 | NSG 17·16 | LSG 11·17
- Middle bowler on top: HSG 17·16 | NSG 6·6 | LSG 3·6
- Middle batsman on top / Star: HSG 26·14 | NSG 24·14 | LSG 18·15
- Slog pacer v finisher: HSG 24·11 | NSG 20·7 | LSG 15·7
- Slog death bowler v finisher: HSG 21·12 | NSG 18·7 | LSG 13·8
• Batting lines (runs per roll · 4/6 %):
  - HS/★: HSG 4.4 (83%) | NSG 4.1 (77%) | LSG 3.5 (60%)
  - NS: HSG 4.0 (73%) | NSG 3.7 (67%) | LSG 2.5 (40%)
  - LS: HSG 3.3 (60%) | NSG 2.8 (47%) | LSG 1.6 (20%)
  - BWAL/BW: HSG 2.3 (40%) | NSG 2.4 (40%) | LSG 1.3 (17%)
  - SLG F: HSG 4.7 (80%) | NSG 4.3 (77%) | LSG 3.5 (60%)`
    },
    {
      page: 9,
      title: "13. Bowling Lines & 14. Game Plan by Ground",
      content: `Each cell: dot % · wicket % on bowling roll (rows A–E):
- BWD3: HSG 13%·3% | NSG 47%·13% | LSG 50%·13%
- EQ: HSG 3%·3% | NSG 20%·3% | LSG 27%·3%
- BTD3: HSG 3%·3% | NSG 3%·3% | LSG 10%·3%
- PWP: PC: HSG 13%·3% | NSG 13%·7% | LSG 20%·7%
- PWP: SP: HSG 7%·3% | NSG 3%·3% | LSG 10%·3%
- SLG: DB: HSG 20%·3% | NSG 23%·7% | LSG 30%·7%
• Game Plan:
  - HSG: Runs come easily — attack from ball one.
  - NSG: Balanced. Win the matchups: right bowler to right batsman is worth 10 runs an over.
  - LSG: Wickets fall fast. Keep wickets in hand; 90 in 10 overs is a good score.`
    },
    {
      page: 10,
      title: "15. Strategy & 16. More Smart Moves",
      content: `• Open with pacers. A spinner in Powerplay costs ~2–4 runs more per over on every ground.
• Keep the death bowler for the Slog. He saves 1.5–3 runs an over against a Finisher.
• Domination decides the middle overs. A BW to weak matchup gives ~6 an over; BTBW to set Star gives ~24.
• Turn the ball away. Use matchup grid: an LS line can halve scoring.
• Time your Finisher. Have the F batsman at the crease when the Slog starts.
• Protect the tail in PP and Slog. A BW batsman falls about every 4–6 balls.
• Choose captain for plan: BW/BWAL brings Great Delivery; batting captain brings Wonderful Shot.
• 7-a-side: only 6 wickets, so one bad over can end the innings.`
    },
    {
      page: 11,
      title: "17. Building a Balanced Team & Bowling Plan",
      content: `• 10 overs · Playing 11:
  - No. 1–2: Openers (O) — BAT / BTBW
  - No. 3: Star ★ batsman
  - No. 4: BAT / BTBW batsman
  - No. 5: Wicket-keeper (WK)
  - No. 6: Finisher (F)
  - No. 7: BTAL all-rounder
  - No. 8–9: BWAL all-rounders
  - No. 10–11: BW bowlers (at least one DB)
  - 5–6 bowlers in all: ≥3 pacers and 1–2 spinners. Two DBs cover overs 9 and 10.
• 5 overs · Playing 7: Opener (O), Star or BAT, WK, Finisher (best if bowls), BTAL, BWAL, BW death bowler.
• Bowling Plan:
  - 5 overs: Ov 1 BWAL pacer · Ov 2 BTAL · Ov 3 DB · Ov 4 BWAL · Ov 5 DB.
  - 10 overs: Ov 1–2 two pacers · Ov 3–8 spinners, BWAL, BTAL · Ov 9 DB 1 · Ov 10 DB 2.`
    }
  ];

  const currentPageData = ruleBookPages.find(p => p.page === currentPage) || ruleBookPages[0];

  const officialPdfs = [
    { name: "Dice Cricket King · Official Rule Book (A4)", path: "/assets/aistudio/Dice_Cricket_King_Rule_Book_A4_c557b177.pdf" },
    { name: "Master Sheets · NORMAL Scoring Ground (A4)", path: "/assets/aistudio/Dice_Cricket_Master_Sheets_NORMAL_Scoring_A4_991d1d4e.pdf" },
    { name: "Master Sheets · HIGH Scoring Ground (A4)", path: "/assets/aistudio/Dice_Cricket_Master_Sheets_HIGH_Scoring_A4_f3ea7c9f.pdf" },
    { name: "Master Sheets · LOW Scoring Ground (A4)", path: "/assets/aistudio/Dice_Cricket_Master_Sheets_LOW_Scoring_A4_a462deb2.pdf" },
    { name: "Players Database · 10 Nations (A4)", path: "/assets/aistudio/Dice_Cricket_Players_Database_A4-1_539c8897.pdf" },
    { name: "87 Tactical Cards Deck · Bridge Size (A4)", path: "/assets/aistudio/Dice_Cricket_87_Cards_A4_f4c4332b.pdf" }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6 select-none animate-fadeIn pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#272b26] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 text-[10px] font-black uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Rule Book &amp; Physical Print Hub</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Official Rule Book &amp; PDF Assets
          </h1>
          <p className="text-xs text-slate-400">
            11-Page Complete Guide in IBM Plex · Physical Print Shop Ready (CMYK &amp; Bleed)
          </p>
        </div>
      </div>

      {/* Interactive In-App Rule Book Reader */}
      <div className="bg-[#141814] border-2 border-[#c3f400]/40 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#c3f400] bg-[#c3f400]/10 px-2.5 py-0.5 rounded-full">
              Page {currentPage} of {totalPages}
            </span>
            <h2 className="text-lg font-black text-white">{currentPageData.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1.5 rounded-xl bg-[#1d211c] text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-mono text-xs font-bold text-white px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1.5 rounded-xl bg-[#1d211c] text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="bg-[#101410] border border-white/5 rounded-2xl p-5 min-h-[260px] font-sans text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
          {currentPageData.content}
        </div>

        <div className="text-[10px] text-slate-500 font-mono text-center pt-1">
          Dice Cricket King · © 2026 Tanweer Ahmad · Faiz Dice Games
        </div>
      </div>

      {/* Official PDF Assets Download Section */}
      <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-5 shadow-xl space-y-4">
        <div className="border-b border-white/10 pb-2">
          <h2 className="text-sm font-black text-white uppercase tracking-wider">
            Official Source PDFs (Included in App Package)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            View, share or print the original high-resolution vector PDFs directly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {officialPdfs.map((pdf, idx) => (
            <a
              key={idx}
              href={pdf.path}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-[#1d211c] hover:bg-[#272b26] border border-white/5 hover:border-[#c3f400]/40 rounded-2xl transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-rose-400" />
                <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate max-w-[240px]">
                  {pdf.name}
                </span>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:text-[#c3f400] shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
