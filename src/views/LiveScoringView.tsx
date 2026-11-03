// src/views/LiveScoringView.tsx
import React, { useState, useEffect } from 'react';
import { 
  Play, RotateCcw, AlertTriangle, ArrowLeftRight, ChevronRight, Sparkles, 
  Layers, ShieldAlert, Award, Volume2, Mic, Eye, Zap, Flame, CheckCircle, RefreshCw
} from 'lucide-react';
import type { 
  MatchState, OverDelivery, Player, BatsmanInnings, BowlerFigures, GroundType 
} from '../types';
import { DiceCricketEngine } from '../engine';
import { storage } from '../services/storage';
import { soundEngine } from '../services/sound';
import { PitchView } from '../components/PitchView';
import { BowlerSelectModal } from '../components/BowlerSelectModal';
import { NewBatsmanModal } from '../components/NewBatsmanModal';
import { OverCompleteCard } from '../components/OverCompleteCard';
import { DrsModal } from '../components/DrsModal';
import { PowerCardModal } from '../components/PowerCardModal';

interface LiveScoringViewProps {
  match: MatchState;
  onUpdateMatch: (updatedMatch: MatchState) => void;
  onNavigateTab: (tab: 'scorecard' | 'summary' | 'ballbyball' | 'home') => void;
}

export const LiveScoringView: React.FC<LiveScoringViewProps> = ({
  match,
  onUpdateMatch,
  onNavigateTab
}) => {
  const settings = storage.getSettings();

  const [scoringLayout, setScoringLayout] = useState<'split' | 'pitch'>(
    settings.scoringLayout === 'split' ? 'split' : 'pitch'
  );
  const [scorerMode, setScorerMode] = useState<'auto' | 'manual'>(settings.scorerMode);

  // Active Innings pointers
  const isSecondInnings = match.currentInningsNo === 2;
  const currentInnings = isSecondInnings ? match.innings2 : match.innings1;
  const fieldingInnings = isSecondInnings ? match.innings1 : match.innings2;

  const is5Overs = match.format === '5_overs';
  const totalOvers = is5Overs ? 5 : 10;
  const maxWickets = is5Overs ? 6 : 10;

  // Modals & Flows
  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [showNewBatsmanModal, setShowNewBatsmanModal] = useState(false);
  const [showOverCompleteCard, setShowOverCompleteCard] = useState(false);
  const [showDrsModal, setShowDrsModal] = useState(false);
  const [showPowerModal, setShowPowerModal] = useState<'wonderful_shot' | 'great_delivery' | 'reroll' | null>(null);

  // Ball Resolution Pipeline States
  const [pipelineState, setPipelineState] = useState<'awaiting_bowling' | 'awaiting_batting' | 'wicket_flow'>('awaiting_bowling');
  const [pendingBowlingRoll, setPendingBowlingRoll] = useState<{ redDie: string; blueDie: number; result: string } | null>(null);
  const [lastCallout, setLastCallout] = useState<string>("Ready for delivery. Roll bowling dice to begin.");
  const [isRolling, setIsRolling] = useState(false);

  // Manual Dice Input state
  const [manualCell, setManualCell] = useState<{ row: string; col: number }>({ row: 'A', col: 1 });

  // Fall of wicket trigger
  const [pendingWicketInfo, setPendingWicketInfo] = useState<{ type: string; eligibleForDrs: boolean } | null>(null);

  const striker = currentInnings.battingCard[currentInnings.strikerIndex];
  const nonStriker = currentInnings.battingCard[currentInnings.nonStrikerIndex];

  // Current Bowler Figures
  const currentBowlerFig = currentInnings.bowlingFigures.find(
    f => f.player.name === currentInnings.currentBowlerName
  ) || currentInnings.bowlingFigures[0];

  const currentOverNo = currentInnings.completedOvers + 1;
  const isPowerplay = is5Overs ? (currentOverNo === 1) : (currentOverNo <= 2);
  const isSlog = is5Overs ? (currentOverNo === 5) : (currentOverNo >= 9);

  // Check if over completed or bowler needs to be chosen
  useEffect(() => {
    if (currentInnings.isCompleted) return;

    if (!currentInnings.currentBowlerName && currentInnings.ballsInCurrentOver === 0) {
      setShowBowlerModal(true);
    }
  }, [currentInnings.completedOvers, currentInnings.currentBowlerName]);

  // Handle Bowler selection
  const handleConfirmBowler = (bowler: Player) => {
    const updated = { ...match };
    const inn = updated.currentInningsNo === 1 ? updated.innings1 : updated.innings2;
    inn.currentBowlerName = bowler.name;
    setShowBowlerModal(false);
    setShowOverCompleteCard(false);
    setLastCallout(`Over ${currentOverNo}: ${bowler.name} takes the ball. Roll bowling sheet.`);
    onUpdateMatch(updated);
    storage.saveMatch(updated);
  };

  // Run rates calculation
  const totalBallsBowled = currentInnings.completedOvers * 6 + currentInnings.ballsInCurrentOver;
  const crr = totalBallsBowled > 0 ? (currentInnings.score / (totalBallsBowled / 6)).toFixed(2) : "0.00";
  const remainingBalls = (totalOvers * 6) - totalBallsBowled;
  const runsNeeded = match.targetRuns !== null ? Math.max(0, match.targetRuns - currentInnings.score) : null;
  const rrr = runsNeeded !== null && remainingBalls > 0 ? (runsNeeded / (remainingBalls / 6)).toFixed(2) : null;

  // 1. Bowling Roll
  const handleBowlingRoll = () => {
    if (!currentInnings.currentBowlerName || isRolling) return;
    setIsRolling(true);
    soundEngine.playDiceRoll();

    setTimeout(() => {
      let redDie = DiceCricketEngine.rollRow();
      let blueDie = DiceCricketEngine.rollDie();

      if (scorerMode === 'manual') {
        redDie = manualCell.row;
        blueDie = manualCell.col;
      }

      const bowler = currentBowlerFig.player;
      const result = DiceCricketEngine.resolveBowlingCell(
        match.ground,
        isPowerplay,
        isSlog,
        redDie,
        blueDie,
        bowler,
        striker.player,
        match.teamASnapshotStars,
        match.teamBSnapshotStars
      );

      setPendingBowlingRoll({ redDie, blueDie, result });
      setIsRolling(false);

      if (result === '0') {
        // Dot ball
        recordDelivery({
          runs: 0,
          isDot: true,
          bowlingRedDie: redDie,
          bowlingBlueDie: blueDie,
          bowlingResult: result,
          tag: '•'
        });
      } else if (result === '+') {
        // Extra (App-Now Engine)
        const rc = DiceCricketEngine.drawRunsCard();
        const extraKind = rc.extrasAppNow;
        handleExtraResult(extraKind, redDie, blueDie, result);
      } else if (result === 'X' || ['BLD', 'LBW', 'C&B', 'CB', 'ST', 'CT', 'R/O', 'HW'].includes(result)) {
        // Dismissal on Bowling Roll
        handleDismissalFlow(result, redDie, blueDie);
      } else {
        // 'B' / 'Ball' -> Proceed to Batting Roll
        soundEngine.playBallHit();
        setPipelineState('awaiting_batting');
        setLastCallout(`It's a Ball! Roll the shot on the Batting Sheet (${striker.player.name} on strike).`);
      }
    }, 400);
  };

  // 2. Batting Roll
  const handleBattingRoll = () => {
    if (!pendingBowlingRoll || isRolling) return;
    setIsRolling(true);
    soundEngine.playDiceRoll();

    setTimeout(() => {
      let redDie = DiceCricketEngine.rollRow();
      let blueDie = DiceCricketEngine.rollDie();

      if (scorerMode === 'manual') {
        redDie = manualCell.row;
        blueDie = manualCell.col;
      }

      const bowler = currentBowlerFig.player;
      const battingOutcome = DiceCricketEngine.resolveBattingCell(
        match.ground,
        isPowerplay,
        isSlog,
        redDie,
        blueDie,
        bowler,
        striker.player,
        striker.runs,
        null,
        striker.sheetRoleOverride
      );

      setIsRolling(false);

      if (battingOutcome === 'X') {
        handleDismissalFlow('X', pendingBowlingRoll.redDie, pendingBowlingRoll.blueDie, redDie, blueDie);
      } else {
        const runs = parseInt(battingOutcome, 10) || 0;
        if (runs === 6) soundEngine.playSix();
        else if (runs === 4) soundEngine.playFour();
        else soundEngine.playBallHit();

        recordDelivery({
          runs,
          isDot: runs === 0,
          bowlingRedDie: pendingBowlingRoll.redDie,
          bowlingBlueDie: pendingBowlingRoll.blueDie,
          bowlingResult: pendingBowlingRoll.result,
          battingRedDie: redDie,
          battingBlueDie: blueDie,
          battingResult: battingOutcome,
          tag: runs === 6 ? '6' : runs === 4 ? '4' : runs > 0 ? `${runs}` : '•'
        });
      }
    }, 400);
  };

  // Handle Extras resolution
  const handleExtraResult = (extraKind: string, redDie: string, blueDie: number, result: string) => {
    if (extraKind === 'DOT') {
      recordDelivery({
        runs: 0,
        isDot: true,
        bowlingRedDie: redDie,
        bowlingBlueDie: blueDie,
        bowlingResult: result,
        tag: '•'
      });
      setLastCallout("Runs Card drawn: Clean Dot ball conversion! No extra conceded.");
    } else if (extraKind === 'WIDE' || extraKind === 'WIDE +1' || extraKind === 'WIDE +2') {
      const extraRuns = extraKind === 'WIDE' ? 1 : extraKind === 'WIDE +1' ? 2 : 3;
      recordExtraDelivery('wide', extraRuns, redDie, blueDie, result);
    } else if (extraKind === 'NO BALL' || extraKind === 'NO BALL +1') {
      const extraRuns = extraKind === 'NO BALL' ? 1 : 2;
      recordExtraDelivery('no_ball', extraRuns, redDie, blueDie, result);
    } else if (extraKind === 'B1') {
      recordDelivery({
        runs: 0,
        extraRuns: 1,
        extraType: 'bye',
        bowlingRedDie: redDie,
        bowlingBlueDie: blueDie,
        bowlingResult: result,
        tag: 'B1'
      });
    } else if (extraKind === 'L1' || extraKind === 'L2') {
      const runs = extraKind === 'L1' ? 1 : 2;
      recordDelivery({
        runs: 0,
        extraRuns: runs,
        extraType: 'leg_bye',
        bowlingRedDie: redDie,
        bowlingBlueDie: blueDie,
        bowlingResult: result,
        tag: `L${runs}`
      });
    }
  };

  // Handle Dismissal sequence
  const handleDismissalFlow = (code: string, bRow: string, bCol: number, batRow?: string, batCol?: number) => {
    soundEngine.playWicket();
    let wicketType = "Caught";

    if (code === 'BLD' || code === 'bowled') wicketType = "Bowled";
    else if (code === 'LBW' || code === 'lbw') wicketType = "LBW";
    else if (code === 'C&B' || code === 'caughtAndBowled') wicketType = "Caught & Bowled";
    else if (code === 'CB' || code === 'caughtBehind') wicketType = "Caught Behind";
    else if (code === 'ST' || code === 'stumped') wicketType = "Stumped";
    else if (code === 'R/O' || code === 'runOutStriker') wicketType = "Run Out";
    else if (code === 'HW' || code === 'hitWicket') wicketType = "Hit Wicket";
    else {
      const card = DiceCricketEngine.drawWicketCard();
      wicketType = card.title;
    }

    const isEligibleForDrs = (wicketType === 'LBW' || wicketType === 'Caught Behind') && 
      striker.player.marks.includes('C') && 
      (match.powerCardsRemaining[currentInnings.team.id]?.reroll > 0);

    setPendingWicketInfo({ type: wicketType, eligibleForDrs: isEligibleForDrs });

    recordDelivery({
      runs: 0,
      isWicket: true,
      wicketType,
      dismissedPlayer: striker.player.name,
      bowlingRedDie: bRow,
      bowlingBlueDie: bCol,
      bowlingResult: code,
      battingRedDie: batRow,
      battingBlueDie: batCol,
      battingResult: 'X',
      tag: 'W'
    });
  };

  // Record delivery into match state
  const recordDelivery = (params: {
    runs: number;
    extraRuns?: number;
    extraType?: 'wide' | 'no_ball' | 'bye' | 'leg_bye';
    isDot?: boolean;
    isWicket?: boolean;
    wicketType?: string;
    dismissedPlayer?: string;
    bowlingRedDie: string;
    bowlingBlueDie: number;
    bowlingResult: string;
    battingRedDie?: string;
    battingBlueDie?: number;
    battingResult?: string;
    tag: string;
  }) => {
    const updated = { ...match };
    const inn = updated.currentInningsNo === 1 ? updated.innings1 : updated.innings2;

    const totalRunsThisBall = params.runs + (params.extraRuns || 0);
    inn.score += totalRunsThisBall;

    // Delivery object
    const delivery: OverDelivery = {
      ballNo: inn.ballsInCurrentOver + 1,
      overNo: currentOverNo,
      legalBallNumber: inn.deliveries.filter(d => d.isLegal).length + 1,
      isLegal: true,
      striker: striker.player.name,
      nonStriker: nonStriker.player.name,
      bowler: currentBowlerFig.player.name,
      bowlingRedDie: params.bowlingRedDie,
      bowlingBlueDie: params.bowlingBlueDie,
      bowlingResult: params.bowlingResult,
      battingRedDie: params.battingRedDie,
      battingBlueDie: params.battingBlueDie,
      battingResult: params.battingResult,
      runsScored: params.runs,
      extraRuns: params.extraRuns || 0,
      extraType: params.extraType,
      isWicket: !!params.isWicket,
      wicketType: params.wicketType,
      dismissedPlayer: params.dismissedPlayer,
      isFreeHit: false,
      commentaryEn: "",
      commentaryHi: "",
      displayTag: params.tag
    };

    const comm = DiceCricketEngine.generateCommentary(delivery, striker.player.name, currentBowlerFig.player.name, match.ground);
    delivery.commentaryEn = comm.en;
    delivery.commentaryHi = comm.hi;

    inn.deliveries.push(delivery);
    inn.ballsInCurrentOver++;

    // Update Striker Stats
    const strikerEntry = inn.battingCard[inn.strikerIndex];
    if (strikerEntry) {
      strikerEntry.runs += params.runs;
      strikerEntry.balls++;
      if (params.runs === 4) strikerEntry.fours++;
      if (params.runs === 6) strikerEntry.sixes++;
      strikerEntry.strikeRate = (strikerEntry.runs / strikerEntry.balls) * 100;
      if (params.isWicket) {
        strikerEntry.isOut = true;
        strikerEntry.dismissal = params.wicketType;
        strikerEntry.dismissalBowler = currentBowlerFig.player.name;
      }
    }

    // Update Bowler Stats
    const bowlerEntry = inn.bowlingFigures.find(f => f.player.name === currentBowlerFig.player.name);
    if (bowlerEntry) {
      bowlerEntry.runsConceded += totalRunsThisBall;
      if (params.isDot) bowlerEntry.dots++;
      if (params.isWicket) bowlerEntry.wickets++;
      const legalBowlerBalls = inn.deliveries.filter(d => d.bowler === bowlerEntry.player.name && d.isLegal).length;
      bowlerEntry.overs = parseFloat(`${Math.floor(legalBowlerBalls / 6)}.${legalBowlerBalls % 6}`);
      bowlerEntry.economy = legalBowlerBalls > 0 ? (bowlerEntry.runsConceded / (legalBowlerBalls / 6)) : 0;
    }

    // Check Wicket Fall
    if (params.isWicket) {
      inn.wickets++;
      inn.fallOfWickets.push({
        wicketNo: inn.wickets,
        score: inn.score,
        overs: `${inn.completedOvers}.${inn.ballsInCurrentOver}`,
        player: params.dismissedPlayer || striker.player.name
      });

      // Show locked new batsman modal after 1s delay
      if (inn.wickets < maxWickets) {
        setTimeout(() => {
          setShowNewBatsmanModal(true);
        }, 800);
      }
    }

    // Strike Rotation on Odd Runs
    if (params.runs % 2 !== 0 || (params.extraType === 'bye' && (params.extraRuns || 0) % 2 !== 0)) {
      const temp = inn.strikerIndex;
      inn.strikerIndex = inn.nonStrikerIndex;
      inn.nonStrikerIndex = temp;
    }

    // Check Over Complete (6 legal balls)
    if (inn.ballsInCurrentOver === 6) {
      inn.completedOvers++;
      inn.ballsInCurrentOver = 0;
      inn.lastBowlerName = inn.currentBowlerName;
      inn.currentBowlerName = null;

      // Strike rotates at over completion
      const temp = inn.strikerIndex;
      inn.strikerIndex = inn.nonStrikerIndex;
      inn.nonStrikerIndex = temp;

      setTimeout(() => {
        setShowOverCompleteCard(true);
      }, 750);
    }

    // Check Innings / Match Completion
    checkInningsCompletion(updated);

    // Reset pipeline
    setPipelineState('awaiting_bowling');
    setPendingBowlingRoll(null);
    onUpdateMatch(updated);
    storage.saveMatch(updated);
  };

  // Record Extra (Wide / No Ball)
  const recordExtraDelivery = (type: 'wide' | 'no_ball', extraRuns: number, bRow: string, bCol: number, result: string) => {
    const updated = { ...match };
    const inn = updated.currentInningsNo === 1 ? updated.innings1 : updated.innings2;

    inn.score += extraRuns;
    if (type === 'wide') inn.extras.wides += extraRuns;
    if (type === 'no_ball') inn.extras.noBalls += extraRuns;
    inn.extras.total += extraRuns;

    const delivery: OverDelivery = {
      ballNo: inn.ballsInCurrentOver,
      overNo: currentOverNo,
      legalBallNumber: inn.deliveries.filter(d => d.isLegal).length,
      isLegal: false,
      striker: striker.player.name,
      nonStriker: nonStriker.player.name,
      bowler: currentBowlerFig.player.name,
      bowlingRedDie: bRow,
      bowlingBlueDie: bCol,
      bowlingResult: result,
      runsScored: 0,
      extraRuns,
      extraType: type,
      isWicket: false,
      isFreeHit: type === 'no_ball',
      commentaryEn: type === 'wide' ? `Wide ball called (+${extraRuns}).` : `NO BALL called (+${extraRuns}). Free Hit!`,
      commentaryHi: type === 'wide' ? `वाइड गेंद (+${extraRuns})।` : `नो बॉल (+${extraRuns})। फ्री हिट!`,
      displayTag: type === 'wide' ? `Wd` : `Nb`
    };

    inn.deliveries.push(delivery);

    // Bowler charges
    const bowlerEntry = inn.bowlingFigures.find(f => f.player.name === currentBowlerFig.player.name);
    if (bowlerEntry) bowlerEntry.runsConceded += extraRuns;

    checkInningsCompletion(updated);

    setPipelineState('awaiting_bowling');
    setPendingBowlingRoll(null);
    onUpdateMatch(updated);
    storage.saveMatch(updated);
  };

  // Check Innings and Match Completion
  const checkInningsCompletion = (updated: MatchState) => {
    const inn = updated.currentInningsNo === 1 ? updated.innings1 : updated.innings2;
    const isAllOut = inn.wickets >= maxWickets;
    const isOversDone = inn.completedOvers >= totalOvers;

    if (updated.currentInningsNo === 1) {
      if (isAllOut || isOversDone) {
        inn.isCompleted = true;
        updated.currentInningsNo = 2;
        updated.targetRuns = inn.score + 1;
        setLastCallout(`Innings 1 Concluded! ${inn.team.name} scored ${inn.score}/${inn.wickets}. Target for ${updated.innings2.team.name}: ${updated.targetRuns} runs.`);
      }
    } else {
      // Innings 2 Chase
      const target = updated.targetRuns || 0;
      if (inn.score >= target) {
        // Chased down!
        inn.isCompleted = true;
        updated.status = 'COMPLETED';
        updated.winnerTeamId = inn.team.id;
        const wktMargin = maxWickets - inn.wickets;
        updated.winDescription = `${inn.team.name} won by ${wktMargin} wicket${wktMargin > 1 ? 's' : ''}!`;
      } else if (isAllOut || isOversDone) {
        inn.isCompleted = true;
        if (inn.score === target - 1) {
          // TIE! Super Over required
          updated.status = 'TIE_SUPER_OVER';
          updated.isSuperOver = true;
          updated.winDescription = "MATCH TIED! Super Over Activated!";
        } else {
          updated.status = 'COMPLETED';
          updated.winnerTeamId = updated.innings1.team.id;
          const runMargin = target - 1 - inn.score;
          updated.winDescription = `${updated.innings1.team.name} won by ${runMargin} run${runMargin > 1 ? 's' : ''}!`;
        }
      }
    }
  };

  // New Batsman confirmed
  const handleConfirmNewBatsman = (player: Player, isFinisher: boolean) => {
    const updated = { ...match };
    const inn = updated.currentInningsNo === 1 ? updated.innings1 : updated.innings2;

    const incomingIdx = inn.battingCard.findIndex(b => b.player.name === player.name);
    if (incomingIdx >= 0) {
      inn.strikerIndex = incomingIdx;
      if (isFinisher) {
        inn.battingCard[incomingIdx].sheetRoleOverride = 'treat_finisher';
      }
    }

    setShowNewBatsmanModal(false);
    setPendingWicketInfo(null);
    setLastCallout(`${player.name} is at the crease. Play resumes.`);
    onUpdateMatch(updated);
    storage.saveMatch(updated);
  };

  // Undo Last Delivery
  const handleUndo = () => {
    const updated = { ...match };
    const inn = updated.currentInningsNo === 1 ? updated.innings1 : updated.innings2;
    if (inn.deliveries.length === 0) return;

    const lastDel = inn.deliveries.pop()!;
    inn.score -= (lastDel.runsScored + lastDel.extraRuns);
    if (lastDel.isLegal) {
      if (inn.ballsInCurrentOver === 0 && inn.completedOvers > 0) {
        inn.completedOvers--;
        inn.ballsInCurrentOver = 5;
      } else {
        inn.ballsInCurrentOver = Math.max(0, inn.ballsInCurrentOver - 1);
      }
    }

    if (lastDel.isWicket) {
      inn.wickets = Math.max(0, inn.wickets - 1);
      inn.fallOfWickets.pop();
    }

    setPipelineState('awaiting_bowling');
    setPendingBowlingRoll(null);
    setLastCallout("Last delivery undone.");
    onUpdateMatch(updated);
    storage.saveMatch(updated);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 space-y-4 select-none animate-fadeIn pb-24">
      {/* Top Breadcrumb & Quick Controls */}
      <div className="flex items-center justify-between border-b border-[#272b26] pb-3">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => onNavigateTab('home')}
            className="text-slate-400 hover:text-white font-bold"
          >
            ← Matches Hub
          </button>
          <span className="text-slate-600">/</span>
          <span className="font-bold text-white">
            {match.teamA.code} vs {match.teamB.code} ({match.format.replace('_', ' ')})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Layout Toggle */}
          <div className="flex bg-[#101410] border border-white/10 rounded-full p-0.5 text-[11px] font-bold">
            <button
              onClick={() => setScoringLayout('pitch')}
              className={`px-3 py-1 rounded-full transition-all ${
                scoringLayout === 'pitch' ? 'bg-[#c3f400] text-black shadow-xs' : 'text-slate-400'
              }`}
            >
              Pitch View
            </button>
            <button
              onClick={() => setScoringLayout('split')}
              className={`px-3 py-1 rounded-full transition-all ${
                scoringLayout === 'split' ? 'bg-[#c3f400] text-black shadow-xs' : 'text-slate-400'
              }`}
            >
              Split View
            </button>
          </div>

          {/* Scorer Mode (Auto / Manual) */}
          <div className="flex bg-[#101410] border border-white/10 rounded-full p-0.5 text-[11px] font-bold">
            <button
              onClick={() => setScorerMode('auto')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                scorerMode === 'auto' ? 'bg-[#272b26] text-[#c3f400]' : 'text-slate-500'
              }`}
            >
              Auto
            </button>
            <button
              onClick={() => setScorerMode('manual')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                scorerMode === 'manual' ? 'bg-[#272b26] text-[#c3f400]' : 'text-slate-500'
              }`}
            >
              Manual
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb Badges Strip matching Stitch */}
      <section className="flex items-center justify-between gap-1.5 pt-1">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#191d18] border border-[#2e342c] shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ccff00] animate-beacon-pulse" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ccff00]">
            {isPowerplay ? `POWERPLAY · OV ${currentOverNo}/${totalOvers}` : isSlog ? `SLOG PHASE · OV ${currentOverNo}/${totalOvers}` : `MIDDLE OVERS · OV ${currentOverNo}/${totalOvers}`}
          </span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#191d18] border border-[#232821] text-[#9ba394]">
          <span className="material-symbols-outlined text-[14px] text-[#ccff00]">stadium</span>
          <span className="text-[10px] font-bold tracking-wider uppercase text-white">
            {match.ground} PITCH · {match.ground === 'HSG' ? '180-220' : match.ground === 'NSG' ? '130-170' : '90-130'}
          </span>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-[#232821] text-[#ccff00] border border-[#ccff00]/30 text-[10px] font-extrabold uppercase tracking-widest">
          ROW F
        </div>
      </section>

      {/* High-Impact Match Scoreboard Hero Card matching Stitch */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1c221a] to-[#131712] border border-[#2e3629] p-4 shadow-2xl space-y-3.5">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ccff00] to-transparent" />
        
        {/* Top Row: Team + Name + Live Score */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-12 h-12 rounded-2xl bg-[#232920] border border-[#374132] flex items-center justify-center text-2xl shadow-inner shrink-0">
              {currentInnings.team.code === 'IND' ? '🇮🇳' : currentInnings.team.code === 'PAK' ? '🇵🇰' : currentInnings.team.code === 'AUS' ? '🇦🇺' : '🏏'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-[22px] font-black text-white tracking-tight leading-none truncate">
                  {currentInnings.team.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#ccff00] text-[#101410] text-[10px] font-black tracking-wider uppercase shrink-0">
                  {match.currentInningsNo === 1 ? '1ST INN' : '2ND INN'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="material-symbols-outlined text-[13px] text-[#ccff00]">casino</span>
                <span className="text-[11px] font-semibold text-[#9ba394] truncate">
                  Toss: {match.tossWinnerId === match.teamA.id ? match.teamA.code : match.teamB.code} chose {match.tossDecision}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[34px] font-black text-[#ccff00] tracking-tight leading-none drop-shadow-[0_2px_8px_rgba(204,255,0,0.3)]">
                {currentInnings.score}/{currentInnings.wickets}
              </span>
              <span className="text-[13px] font-extrabold text-[#9ba394]">
                ({currentInnings.completedOvers}.{currentInnings.ballsInCurrentOver} ov)
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="px-2 py-0.5 rounded-md bg-[#101410] border border-[#2e342c] text-[10px] font-medium text-[#9ba394]">
                CRR <strong className="text-white font-bold">{crr}</strong>
              </span>
              {match.targetRuns ? (
                <span className="px-2 py-0.5 rounded-md bg-[#ccff00]/10 border border-[#ccff00]/30 text-[10px] font-bold text-[#ccff00]">
                  NEED <strong className="text-[#ccff00] font-black">{runsNeeded}</strong> off {remainingBalls}b
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-[#ccff00]/10 border border-[#ccff00]/30 text-[10px] font-bold text-[#ccff00]">
                  PROJ <strong className="text-[#ccff00] font-black">
                    {Math.round(parseFloat(crr) * totalOvers || (match.ground === 'HSG' ? 180 : 150))}
                  </strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Over Tracker Strip with circle pills matching Stitch */}
        <div className="bg-[#121611] rounded-2xl px-3 py-2 border border-[#232920] flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#9ba394]">
            OVER {currentOverNo} TRACKER
          </span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((ballIndex) => {
              const delivery = currentInnings.deliveries
                .filter(d => d.overNo === currentOverNo)[ballIndex - 1];
              const isCurrentBall = currentInnings.ballsInCurrentOver === ballIndex - 1;
              const isCompletedBall = currentInnings.ballsInCurrentOver >= ballIndex;

              return (
                <div
                  key={ballIndex}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    delivery?.isWicket ? 'bg-red-500 text-white font-black shadow-sm' :
                    delivery?.runsScored === 6 ? 'bg-amber-400 text-[#101410] font-black shadow-sm' :
                    delivery?.runsScored === 4 ? 'bg-[#c3f400] text-[#101410] font-black shadow-sm' :
                    delivery ? 'bg-[#232920] border border-[#2e3629] text-white' :
                    isCurrentBall ? 'bg-[#ccff00] text-[#101410] font-black neon-glow-sm ring-2 ring-[#ccff00]/60 scale-105 animate-subtle-pulse' :
                    'bg-[#232920] border border-[#2e3629] text-[#9ba394]'
                  }`}
                  title={delivery ? `Ball ${currentOverNo}.${ballIndex}: ${delivery.displayTag}` : `Ball ${currentOverNo}.${ballIndex}`}
                >
                  {delivery ? delivery.displayTag : `${currentOverNo}.${ballIndex}`}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tactical Pitch Matchup Banner matching Stitch */}
      <section className="relative py-2.5 px-3 rounded-2xl bg-gradient-to-r from-[#121611] via-[#1a2118] to-[#121611] border border-[#2e3728] flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#ccff00] animate-ping" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#ccff00]">
              TACTICAL MATCHUP
            </span>
            <span className="text-[11px] font-extrabold text-white uppercase tracking-wide truncate max-w-xs">
              {isPowerplay ? 'PWP: PC (PACER IN POWERPLAY) · OPENER DUEL' : isSlog ? 'SLG: DEATH SPECIALIST · ATTACK DUEL' : 'MID: REGULAR LINE & LENGTH DUEL'}
            </span>
          </div>
        </div>
        <span className="material-symbols-outlined text-[18px] text-[#ccff00]">bolt</span>
      </section>

      {/* Navigation Tabs (Live · Scorecard · Summary · Ball by ball) */}
      <div className="flex border-b border-[#272b26] gap-4 text-xs font-bold">
        {[
          { id: 'live', label: 'Live Arena' },
          { id: 'scorecard', label: 'Scorecard' },
          { id: 'summary', label: 'Summary & Worm' },
          { id: 'ballbyball', label: 'Ball-by-Ball Feed' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => onNavigateTab(tab.id as 'scorecard' | 'summary' | 'ballbyball' | 'home')}
            className={`pb-2.5 transition-all relative ${
              tab.id === 'live'
                ? 'text-[#c3f400] font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            {tab.id === 'live' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c3f400] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Match Win Banner */}
      {match.status === 'COMPLETED' && (
        <div className="bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-500 p-4 rounded-3xl text-black font-black text-center shadow-2xl animate-bounce">
          <div className="text-xl">🏆 {match.winDescription}</div>
          <div className="text-xs font-bold mt-1">Match Complete · All figures updated in database</div>
        </div>
      )}

      {/* Over N Complete Summary Card (Triggered after 6th delivery) */}
      {showOverCompleteCard && (
        <OverCompleteCard
          overNumber={currentInnings.completedOvers}
          bowler={currentBowlerFig}
          deliveries={currentInnings.deliveries.filter(d => d.overNo === currentInnings.completedOvers)}
          runsInOver={currentInnings.deliveries
            .filter(d => d.overNo === currentInnings.completedOvers)
            .reduce((acc, d) => acc + d.runsScored + d.extraRuns, 0)}
          wicketsInOver={currentInnings.deliveries
            .filter(d => d.overNo === currentInnings.completedOvers && d.isWicket).length}
          onNextOver={() => {
            setShowOverCompleteCard(false);
            setShowBowlerModal(true);
          }}
        />
      )}

      {/* LIVE SCORING MAIN ARENA (PITCH VIEW vs SPLIT VIEW) */}
      {scoringLayout === 'pitch' ? (
        <PitchView
          striker={striker}
          nonStriker={nonStriker}
          bowler={currentBowlerFig}
          lastBallResult={currentInnings.deliveries[currentInnings.deliveries.length - 1]?.displayTag || null}
          lastBallType={
            currentInnings.deliveries[currentInnings.deliveries.length - 1]?.isWicket ? 'wicket' :
            currentInnings.deliveries[currentInnings.deliveries.length - 1]?.runsScored === 6 ? 'six' :
            currentInnings.deliveries[currentInnings.deliveries.length - 1]?.runsScored === 4 ? 'four' :
            currentInnings.deliveries[currentInnings.deliveries.length - 1]?.extraType ? 'extra' : 'runs'
          }
          isAnimationsEnabled={settings.animationsEnabled}
        />
      ) : (
        /* Split Layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Bowling Block */}
          <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                BOWLING ATTACK
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {currentBowlerFig.wickets}/{currentBowlerFig.runsConceded} ({currentBowlerFig.overs} ov)
              </span>
            </div>
            <div>
              <div className="text-lg font-black text-white">{currentBowlerFig.player.name}</div>
              <div className="text-xs text-slate-400">{currentBowlerFig.player.bowl} · {currentBowlerFig.player.role}</div>
            </div>
            <div className="text-[11px] text-slate-400">
              Line: <strong>{DiceCricketEngine.resolveBowlingLine(match.ground, isPowerplay, isSlog, currentBowlerFig.player, striker.player, match.teamASnapshotStars, match.teamBSnapshotStars).lineName}</strong>
            </div>
          </div>

          {/* Batting Block */}
          <div className="bg-[#141814] border-2 border-[#c3f400]/40 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#c3f400]">
                ▶ STRIKER ON CREASE
              </span>
              <span className="text-xs font-mono font-black text-[#c3f400]">
                {striker.runs} ({striker.balls}b) · SR {striker.strikeRate.toFixed(1)}
              </span>
            </div>
            <div>
              <div className="text-lg font-black text-white">{striker.player.name}</div>
              <div className="text-xs text-slate-400">{striker.player.bat} · {striker.player.role}</div>
            </div>
            <div className="text-[11px] text-slate-400">
              Line: <strong>{DiceCricketEngine.resolveBattingLine(match.ground, isPowerplay, isSlog, currentBowlerFig.player, striker.player, striker.runs, null, striker.sheetRoleOverride).lineName}</strong>
            </div>
          </div>
        </div>
      )}

      {/* 3D Tactile Dual Dice Console matching Stitch */}
      <section className="rounded-3xl bg-[#191d18] border border-[#293024] p-4 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ccff00] text-[20px]">casino</span>
            <h3 className="text-[14px] font-black text-white uppercase tracking-wider">
              DUAL DICE CONSOLE
            </h3>
          </div>
          <div className="px-2.5 py-0.5 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] text-[10px] font-black uppercase tracking-wider">
            BALL {currentOverNo}.{currentInnings.ballsInCurrentOver + 1} READY
          </div>
        </div>

        {/* Dice Bay */}
        <div className="bg-[#121611] rounded-2xl p-4 border border-[#232920] flex flex-col items-center gap-3">
          <div className="w-full flex items-center justify-around py-1">
            {/* Red Die (Row Selector) */}
            <div className="flex flex-col items-center gap-2">
              <div
                onClick={pipelineState === 'awaiting_bowling' ? handleBowlingRoll : undefined}
                className={`relative w-20 h-20 rounded-2xl die-3d-red flex flex-col items-center justify-center select-none cursor-pointer transform active:scale-90 transition-transform ${
                  isRolling && pipelineState === 'awaiting_bowling' ? 'animate-dice-shake' : ''
                }`}
              >
                <span className="text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                  {pendingBowlingRoll ? pendingBowlingRoll.redDie : 'A'}
                </span>
                <div className="absolute bottom-1.5 px-2 py-0.2 rounded bg-black/30 backdrop-blur-sm text-[8px] font-black tracking-widest text-white/90 uppercase">
                  RED ROW
                </div>
              </div>
              <div className="text-center">
                <span className="text-[12px] font-bold text-white block">RED DIE</span>
                <span className="text-[10px] font-semibold text-[#9ba394] uppercase tracking-wider">Length (A-F)</span>
              </div>
            </div>

            {/* Matrix Center Cross */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-2xl bg-[#1d231a] border border-[#2f382a] flex items-center justify-center text-[#ccff00] font-black text-base shadow-inner">
                ✕
              </div>
              <span className="text-[9px] font-black text-[#9ba394] mt-1 uppercase tracking-wider">GRID CELL</span>
            </div>

            {/* Blue Die (Column Selector) */}
            <div className="flex flex-col items-center gap-2">
              <div
                onClick={pipelineState === 'awaiting_batting' ? handleBattingRoll : undefined}
                className={`relative w-20 h-20 rounded-2xl die-3d-blue flex flex-col items-center justify-center select-none cursor-pointer transform active:scale-90 transition-transform ${
                  isRolling && pipelineState === 'awaiting_batting' ? 'animate-dice-shake' : ''
                }`}
              >
                <span className="text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                  {pendingBowlingRoll ? pendingBowlingRoll.blueDie : '1'}
                </span>
                <div className="absolute bottom-1.5 px-2 py-0.2 rounded bg-black/30 backdrop-blur-sm text-[8px] font-black tracking-widest text-white/90 uppercase">
                  BLUE COL
                </div>
              </div>
              <div className="text-center">
                <span className="text-[12px] font-bold text-white block">BLUE DIE</span>
                <span className="text-[10px] font-semibold text-[#9ba394] uppercase tracking-wider">Line (1-6)</span>
              </div>
            </div>
          </div>

          {/* Rule Sheet Reference */}
          <div className="w-full bg-[#181e16] rounded-xl px-3 py-2 border border-[#283222] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ccff00] text-[16px]">table_chart</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9ba394]">SHEET RULE</span>
            </div>
            <span className="text-[11px] font-bold text-[#ccff00] truncate max-w-[210px]">
              {pipelineState === 'awaiting_bowling'
                ? DiceCricketEngine.resolveBowlingLine(match.ground, isPowerplay, isSlog, currentBowlerFig.player, striker.player, match.teamASnapshotStars, match.teamBSnapshotStars).lineName
                : DiceCricketEngine.resolveBattingLine(match.ground, isPowerplay, isSlog, currentBowlerFig.player, striker.player, striker.runs, null, striker.sheetRoleOverride).lineName}
            </span>
          </div>
        </div>

        {/* High-Impact Hero Call-To-Action Button matching Stitch */}
        <button
          disabled={isRolling || match.status === 'COMPLETED' || (!currentInnings.currentBowlerName && pipelineState === 'awaiting_bowling')}
          onClick={pipelineState === 'awaiting_bowling' ? handleBowlingRoll : handleBattingRoll}
          className={`w-full h-14 rounded-full bg-[#ccff00] hover:bg-[#b3ff00] active:scale-[0.98] text-[#101410] font-black text-[14px] tracking-wider uppercase flex items-center justify-center gap-2.5 neon-glow transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
            !isRolling && match.status !== 'COMPLETED' ? 'animate-subtle-pulse' : ''
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">casino</span>
          <span>
            {pipelineState === 'awaiting_bowling'
              ? `ROLL BALL ${currentOverNo}.${currentInnings.ballsInCurrentOver + 1} · ${currentBowlerFig.player.name} TO ${striker.player.name}`
              : `RESOLVE STRIKE · ROLL BATTING SHEET (${pendingBowlingRoll?.result || 'BAT'})`}
          </span>
          <span className="material-symbols-outlined text-[20px] font-bold">arrow_forward</span>
        </button>
      </section>

      {/* Callout Commentary Ribbon */}
      <div className="bg-[#191d18] border border-[#232920] rounded-2xl p-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse" />
          <span className="text-white font-semibold">{lastCallout}</span>
        </div>
        {pipelineState === 'awaiting_batting' && (
          <span className="bg-[#c3f400] text-[#101410] font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Ball in Play
          </span>
        )}
      </div>

      {/* Manual Input Selector (Shown when Manual Mode is active) */}
      {scorerMode === 'manual' && (
        <div className="bg-[#121611] border border-[#272b26] p-3 rounded-2xl flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300">Manual Dice Result:</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Red:</span>
              <select
                value={manualCell.row}
                onChange={e => setManualCell(prev => ({ ...prev, row: e.target.value }))}
                className="bg-[#1d211c] border border-white/20 text-white font-mono font-bold rounded-lg px-2 py-1"
              >
                {["A", "B", "C", "D", "E", "F"].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Blue:</span>
              <select
                value={manualCell.col}
                onChange={e => setManualCell(prev => ({ ...prev, col: parseInt(e.target.value, 10) }))}
                className="bg-[#1d211c] border border-white/20 text-white font-mono font-bold rounded-lg px-2 py-1"
              >
                {[1, 2, 3, 4, 5, 6].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Ribbon: Power Cards, DRS, Swap Strike, Undo */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#272b26]">
        <div className="flex items-center gap-2">
          {/* Power Card Trigger */}
          <button
            onClick={() => {
              const teamCards = match.powerCardsRemaining[currentInnings.team.id];
              if (teamCards?.wonderfulShot > 0) setShowPowerModal('wonderful_shot');
              else if (teamCards?.reroll > 0) setShowPowerModal('reroll');
              else alert("No power cards remaining for this team!");
            }}
            className="px-3.5 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-200 text-xs font-black flex items-center gap-1.5 transition-all animate-subtle-pulse-purple"
          >
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>Power Card</span>
          </button>

          {/* DRS Trigger (Active on dismissal) */}
          {pendingWicketInfo?.eligibleForDrs && (
            <button
              onClick={() => setShowDrsModal(true)}
              className="px-3.5 py-2 rounded-xl bg-red-950 hover:bg-red-900 border border-red-500 text-red-200 text-xs font-black flex items-center gap-1.5 transition-all animate-subtle-pulse"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>Review with DRS</span>
            </button>
          )}

          {/* Strike Swap */}
          <button
            onClick={() => {
              const updated = { ...match };
              const inn = updated.currentInningsNo === 1 ? updated.innings1 : updated.innings2;
              const temp = inn.strikerIndex;
              inn.strikerIndex = inn.nonStrikerIndex;
              inn.nonStrikerIndex = temp;
              onUpdateMatch(updated);
              storage.saveMatch(updated);
            }}
            className="px-3 py-2 rounded-xl bg-[#1d211c] hover:bg-[#272b26] border border-white/10 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Swap Strike between deliveries"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
            <span>Swap Strike</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Undo */}
          <button
            onClick={handleUndo}
            disabled={currentInnings.deliveries.length === 0}
            className="px-3 py-2 rounded-xl bg-[#1d211c] hover:bg-[#272b26] border border-white/10 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo Ball</span>
          </button>
        </div>
      </div>

      {/* MODALS */}
      {showBowlerModal && (
        <BowlerSelectModal
          overNumber={currentOverNo}
          totalOvers={totalOvers}
          is5Overs={is5Overs}
          ground={match.ground}
          bowlingSquad={(isSecondInnings ? match.teamA.players : match.teamB.players).slice(0, is5Overs ? 7 : 11)}
          allBowlerFigures={currentInnings.bowlingFigures}
          lastBowlerName={currentInnings.lastBowlerName}
          striker={striker.player}
          nonStriker={nonStriker.player}
          strikerRuns={striker.runs}
          nonStrikerRuns={nonStriker.runs}
          bowlingTeamStars={isSecondInnings ? match.teamASnapshotStars : match.teamBSnapshotStars}
          battingTeamStars={isSecondInnings ? match.teamBSnapshotStars : match.teamASnapshotStars}
          onConfirm={handleConfirmBowler}
          onCancel={() => setShowBowlerModal(false)}
        />
      )}

      {showNewBatsmanModal && (
        <NewBatsmanModal
          wicketNumber={currentInnings.wickets}
          incomingBattingOrderNo={currentInnings.wickets + 2}
          remainingBatsmen={currentInnings.battingCard.filter(b => !b.isOut && b !== striker && b !== nonStriker).map(b => b.player)}
          isSlog={isSlog}
          onConfirm={handleConfirmNewBatsman}
        />
      )}

      {showDrsModal && pendingWicketInfo && (
        <DrsModal
          captainName={currentInnings.team.captain}
          batsmanName={striker.player.name}
          bowlerName={currentBowlerFig.player.name}
          wicketType={pendingWicketInfo.type}
          onDecision={(isNotOut) => {
            setShowDrsModal(false);
            if (isNotOut) {
              // Revert wicket to dot ball!
              const updated = { ...match };
              const inn = updated.currentInningsNo === 1 ? updated.innings1 : updated.innings2;
              inn.wickets = Math.max(0, inn.wickets - 1);
              inn.fallOfWickets.pop();
              const strikerEntry = inn.battingCard[inn.strikerIndex];
              if (strikerEntry) {
                strikerEntry.isOut = false;
                strikerEntry.dismissal = undefined;
              }
              const bowlerEntry = inn.bowlingFigures.find(f => f.player.name === currentBowlerFig.player.name);
              if (bowlerEntry) bowlerEntry.wickets = Math.max(0, bowlerEntry.wickets - 1);

              // Burn reroll card
              if (updated.powerCardsRemaining[currentInnings.team.id]) {
                updated.powerCardsRemaining[currentInnings.team.id].reroll = 0;
              }

              setLastCallout("⚡ DRS OVERTURNED! NOT OUT! Batsman reinstated, ball counts as dot. ⚡");
              onUpdateMatch(updated);
              storage.saveMatch(updated);
            }
          }}
          onCancel={() => setShowDrsModal(false)}
        />
      )}

      {showPowerModal && (
        <PowerCardModal
          type={showPowerModal}
          captainName={currentInnings.team.captain}
          isBattingCaptain={["BAT", "BTBW", "BTAL", "WK"].includes(currentInnings.team.players.find(p => p.name === currentInnings.team.captain)?.role || "")}
          onExecuteWonderfulShot={({ redDie, blueDie, runs }) => {
            setShowPowerModal(null);
            recordDelivery({
              runs,
              bowlingRedDie: redDie,
              bowlingBlueDie: blueDie,
              bowlingResult: "B",
              battingRedDie: redDie,
              battingBlueDie: blueDie,
              battingResult: `${runs}`,
              tag: `${runs}`
            });
          }}
          onExecuteGreatDelivery={({ redDie, blueDie, outcome }) => {
            setShowPowerModal(null);
            if (outcome === 'X') {
              handleDismissalFlow('X', redDie, blueDie);
            } else if (outcome === 'D') {
              recordDelivery({
                runs: 0,
                isDot: true,
                bowlingRedDie: redDie,
                bowlingBlueDie: blueDie,
                bowlingResult: 'D',
                tag: '•'
              });
            } else if (outcome === '+') {
              handleExtraResult('WIDE', redDie, blueDie, '+');
            } else {
              setPipelineState('awaiting_batting');
            }
          }}
          onExecuteReroll={(mode) => {
            setShowPowerModal(null);
            // Burn reroll
            const updated = { ...match };
            if (updated.powerCardsRemaining[currentInnings.team.id]) {
              updated.powerCardsRemaining[currentInnings.team.id].reroll = 0;
            }
            onUpdateMatch(updated);
            storage.saveMatch(updated);
            setLastCallout(`Reroll deployed (${mode.replace('_', ' ')}). Roll dice again.`);
          }}
          onClose={() => setShowPowerModal(null)}
        />
      )}
    </div>
  );
};
