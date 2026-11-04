// src/views/LiveScoringView.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Play, RotateCcw, AlertTriangle, ArrowLeftRight, ChevronRight, Sparkles, 
  Layers, ShieldAlert, Award, Volume2, Eye, Zap, Flame, CheckCircle, 
  RefreshCw, Trash2, Shield, Settings, HelpCircle, UserCheck
} from 'lucide-react';
import type { 
  MatchState, OverDelivery, Player, BatsmanInnings, BowlerFigures, GroundType, ScoringLayout 
} from '../types';
import { DiceCricketEngine } from '../engine';
import { storage } from '../services/storage';
import { soundEngine } from '../services/sound';
import { PitchView } from '../components/PitchView';
import { BowlerSelectModal } from '../components/BowlerSelectModal';
import { NewBatsmanModal } from '../components/NewBatsmanModal';
import { OverCompleteCard } from '../components/OverCompleteCard';
import { DrsModal } from '../components/DrsModal';
import { DrsSuccessOverlay } from '../components/DrsSuccessOverlay';
import { PowerCardModal } from '../components/PowerCardModal';
import { VictoryModal, calculatePlayerOfTheMatch } from '../components/VictoryModal';
import { ResultStripAnimation, MilestoneCard, Milestone } from '../components/ResultStripAnimation';
import { SuperOverModal } from '../components/SuperOverModal';

interface LiveScoringViewProps {
  match: MatchState;
  onUpdateMatch: (updatedMatch: MatchState) => void;
  onNavigateTab: (tab: 'scorecard' | 'summary' | 'ballbyball' | 'home' | 'matches' | 'customise') => void;
}

type PipelineStep = 
  | 'bowler' 
  | 'bowl' 
  | 'bat' 
  | 'power' 
  | 'wicketCard' 
  | 'fielderCard' 
  | 'skillCard' 
  | 'runsCard' 
  | 'extrasCard' 
  | 'freeHit';

export const LiveScoringView: React.FC<LiveScoringViewProps> = ({
  match,
  onUpdateMatch,
  onNavigateTab
}) => {
  const settings = storage.getSettings();

  const [scoringLayout, setScoringLayout] = useState<ScoringLayout>(settings.scoringLayout || 'split');
  const [bowlingSide, setBowlingSide] = useState<'left' | 'right'>(settings.bowlingBlockSide || 'left');
  const [scorerMode, setScorerMode] = useState<'auto' | 'manual'>(settings.scorerMode || 'auto');

  // Active Innings pointers
  const isSecondInnings = match.currentInningsNo === 2;
  const currentInnings = isSecondInnings ? match.innings2 : match.innings1;
  const fieldingInnings = isSecondInnings ? match.innings1 : match.innings2;

  const is5Overs = match.format === '5_overs';
  const totalOvers = is5Overs ? 5 : 10;
  const maxWickets = is5Overs ? 6 : 10;

  // Modals & Flows
  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [showNewBatsmanCard, setShowNewBatsmanCard] = useState(false);
  const [incomingBatsmanNo, setIncomingBatsmanNo] = useState<number>(3);
  const [selectedIncomingPlayer, setSelectedIncomingPlayer] = useState<Player | null>(null);
  const [incomingIsFinisher, setIncomingIsFinisher] = useState<boolean>(false);

  const [showOverCompleteCard, setShowOverCompleteCard] = useState(false);
  const [showDrsModal, setShowDrsModal] = useState(false);
  const [showDrsSuccessOverlay, setShowDrsSuccessOverlay] = useState(false);
  const [drsSuccessData, setDrsSuccessData] = useState<{
    batsmanName: string;
    bowlerName: string;
    wicketType: string;
    rolledDie: number;
  }>({
    batsmanName: '',
    bowlerName: '',
    wicketType: 'LBW',
    rolledDie: 6
  });
  const [showPowerModal, setShowPowerModal] = useState<'wonderful_shot' | 'great_delivery' | 'reroll' | null>(null);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(match.status === 'COMPLETED');
  const [showSuperOverModal, setShowSuperOverModal] = useState<boolean>(match.status === 'TIE_SUPER_OVER');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCustomBallModal, setShowCustomBallModal] = useState(false);
  const [showBattingOrderModal, setShowBattingOrderModal] = useState(false);

  // Ball Step Pipeline (Section 5)
  const [currentStep, setCurrentStep] = useState<PipelineStep>('bowl');
  const [pendingBowlingRoll, setPendingBowlingRoll] = useState<{ redDie: string; blueDie: number; result: string } | null>(null);
  const [pendingBattingRoll, setPendingBattingRoll] = useState<{ redDie: string; blueDie: number; result: string } | null>(null);
  
  // Drawn Cards State (Section 5.3)
  const [drawnWicketCard, setDrawnWicketCard] = useState<{ id: number; type: string; title: string; desc: string; chance: string } | null>(null);
  const [drawnFieldingNumber, setDrawnFieldingNumber] = useState<number | null>(null);
  const [drawnFielderPlayer, setDrawnFielderPlayer] = useState<Player | null>(null);
  const [isNoFielder, setIsNoFielder] = useState(false);
  const [drawnSkillCard, setDrawnSkillCard] = useState<any | null>(null);
  const [skillOutcomeTaken, setSkillOutcomeTaken] = useState<boolean | null>(null);
  const [drawnRunsCard, setDrawnRunsCard] = useState<any | null>(null);

  // Milestone Celebration queue (Section 6.4)
  const [milestoneQueue, setMilestoneQueue] = useState<Milestone[]>([]);
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);

  // Manual Dice Input state
  const [manualCell, setManualCell] = useState<{ row: string; col: number }>({ row: 'A', col: 1 });
  const [halfRerollKeptDie, setHalfRerollKeptDie] = useState<'red' | 'blue' | null>(null);

  const [callout, setCallout] = useState<string>("Ready for delivery. Roll bowling sheet.");
  const [isRolling, setIsRolling] = useState(false);

  // Fall of wicket tracking for DRS eligibility
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
    if (currentInnings.isCompleted || match.status === 'COMPLETED' || match.status === 'TIE_SUPER_OVER') return;

    if (!currentInnings.currentBowlerName && currentInnings.ballsInCurrentOver === 0) {
      setCurrentStep('bowler');
      setShowBowlerModal(true);
    }
  }, [currentInnings.completedOvers, currentInnings.currentBowlerName, currentInnings.isCompleted, match.status]);

  // Milestone Queue Processing (Section 6.4: batsman first, then bowler, then team)
  useEffect(() => {
    if (milestoneQueue.length > 0 && !activeMilestone) {
      const nextMilestone = milestoneQueue[0];
      setActiveMilestone(nextMilestone);
      setMilestoneQueue(prev => prev.slice(1));

      const timer = setTimeout(() => {
        setActiveMilestone(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [milestoneQueue, activeMilestone]);

  // Handle Bowler selection
  const handleConfirmBowler = (bowler: Player) => {
    const updated = { ...match };
    const inn = updated.currentInningsNo === 1 ? updated.innings1 : updated.innings2;
    inn.currentBowlerName = bowler.name;
    setShowBowlerModal(false);
    setShowOverCompleteCard(false);
    setCurrentStep('bowl');
    setCallout(`Over ${currentOverNo}: ${bowler.name} takes the ball. Roll bowling sheet.`);
    onUpdateMatch(updated);
    storage.saveMatch(updated);
  };

  // Run rates calculation
  const totalBallsBowled = currentInnings.completedOvers * 6 + currentInnings.ballsInCurrentOver;
  const crr = totalBallsBowled > 0 ? (currentInnings.score / (totalBallsBowled / 6)).toFixed(2) : "0.00";
  const remainingBalls = (totalOvers * 6) - totalBallsBowled;
  const runsNeeded = match.targetRuns !== null ? Math.max(0, match.targetRuns - currentInnings.score) : null;
  const rrr = runsNeeded !== null && remainingBalls > 0 ? (runsNeeded / (remainingBalls / 6)).toFixed(2) : null;

  // Star Dominance description (Section 7.1 & Section 18)
  const starLineDesc = (() => {
    const batStars = isSecondInnings ? match.teamBSnapshotStars : match.teamASnapshotStars;
    const bowlStars = isSecondInnings ? match.teamASnapshotStars : match.teamBSnapshotStars;
    const batCode = currentInnings.team.code;
    const bowlCode = fieldingInnings.team.code;

    if (batStars === bowlStars) {
      return `★ ${batCode} ${batStars}★ v ${bowlCode} ${bowlStars}★ · equal stars: even match`;
    } else if (batStars > bowlStars) {
      return `★ ${batCode} ${batStars}★ v ${bowlCode} ${bowlStars}★ · ${batCode} dominates on stars (+1 tier)`;
    } else {
      return `★ ${bowlCode} ${bowlStars}★ v ${batCode} ${batStars}★ · ${bowlCode} bowling dominates on stars`;
    }
  })();

  // -------------------------------------------------------------
  // STEP 1: BOWLING ROLL (Section 5.1)
  // -------------------------------------------------------------
  const handleBowlingRoll = () => {
    if (!currentInnings.currentBowlerName || isRolling || showNewBatsmanCard) return;
    setIsRolling(true);
    soundEngine.playDiceRoll();

    setTimeout(() => {
      let redDie = DiceCricketEngine.rollRow();
      let blueDie = DiceCricketEngine.rollDie();

      if (halfRerollKeptDie === 'red' && pendingBowlingRoll) {
        redDie = pendingBowlingRoll.redDie;
      } else if (halfRerollKeptDie === 'blue' && pendingBowlingRoll) {
        blueDie = pendingBowlingRoll.blueDie;
      }

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
      setHalfRerollKeptDie(null);
      setIsRolling(false);

      if (result === '0' || result === 'D') {
        // Dot ball
        recordDelivery({
          runs: 0,
          isDot: true,
          bowlingRedDie: redDie,
          bowlingBlueDie: blueDie,
          bowlingResult: result,
          tag: '•'
        });
        setCallout(`Dot ball to ${striker.player.name}. Solid defense.`);
      } else if (result === 'B') {
        // "Ball" -> Batsman plays shot
        soundEngine.playBallHit();
        setCurrentStep('bat');
        setCallout(`It's a Ball! Roll the shot on Batting Sheet (${striker.player.name} on strike).`);
      } else if (result === '+') {
        // Extra -> Draw Runs card
        setCurrentStep('extrasCard');
        setCallout("Extra signaled! Draw a Runs card for extra runs & type.");
      } else if (result === 'X') {
        // Direct Wicket on bowling sheet -> Draw Wicket card
        setCurrentStep('wicketCard');
        setCallout("Wicket chance (X)! Draw a Wicket card to determine dismissal.");
      } else {
        // Named Row-F code: BLD, LBW, HW, CB, ST, C&B, CT, R/O (Section 5.1)
        handleRowFWicketCode(result, redDie, blueDie);
      }
    }, 350);
  };

  // -------------------------------------------------------------
  // STEP 2: BATTING ROLL (Section 5.2)
  // -------------------------------------------------------------
  const handleBattingRoll = () => {
    if (!pendingBowlingRoll || isRolling || showNewBatsmanCard) return;
    setIsRolling(true);
    soundEngine.playDiceRoll();

    setTimeout(() => {
      let redDie = DiceCricketEngine.rollRow();
      let blueDie = DiceCricketEngine.rollDie();

      if (halfRerollKeptDie === 'red' && pendingBattingRoll) {
        redDie = pendingBattingRoll.redDie;
      } else if (halfRerollKeptDie === 'blue' && pendingBattingRoll) {
        blueDie = pendingBattingRoll.blueDie;
      }

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

      setPendingBattingRoll({ redDie, blueDie, result: battingOutcome });
      setHalfRerollKeptDie(null);
      setIsRolling(false);

      if (battingOutcome === 'X') {
        setCurrentStep('wicketCard');
        setCallout("Edge or false shot! Wicket (X) on batting sheet! Draw a Wicket card.");
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

        if (runs === 6) setCallout(`SIX! Massive strike by ${striker.player.name}! 98m over the ropes!`);
        else if (runs === 4) setCallout(`FOUR! Beautiful timing by ${striker.player.name} through the covers!`);
        else if (runs === 0) setCallout(`Dot ball. Well bowled by ${currentBowlerFig.player.name}.`);
        else setCallout(`${runs} run${runs > 1 ? 's' : ''} scored by ${striker.player.name}.`);
      }
    }, 350);
  };

  // -------------------------------------------------------------
  // STEP 3: WICKET CODE & WICKET CARD (Section 5.3)
  // -------------------------------------------------------------
  const handleRowFWicketCode = (code: string, bRow: string, bCol: number) => {
    if (code === 'BLD') {
      finalizeWicket("Bowled", currentBowlerFig.player.name, undefined, bRow, bCol);
    } else if (code === 'LBW') {
      finalizeWicket("LBW", currentBowlerFig.player.name, undefined, bRow, bCol);
    } else if (code === 'HW') {
      finalizeWicket("Hit Wicket", currentBowlerFig.player.name, undefined, bRow, bCol);
    } else if (code === 'CB') {
      // Caught Behind: Keeper is known
      const keeper = fieldingInnings.team.players.find(p => p.role === 'WK') || 
        fieldingInnings.team.players[fieldingInnings.team.players.length - 1];
      setDrawnFielderPlayer(keeper);
      setDrawnWicketCard({ id: 19, type: 'caughtBehind', title: 'Caught Behind', desc: 'By the keeper', chance: 'keeper_catch' });
      setCurrentStep('skillCard');
      setCallout(`Caught behind appeal for ${keeper.name} (Keeper)! Draw Skills card.`);
    } else if (code === 'ST') {
      // Stumping: Keeper is known
      const keeper = fieldingInnings.team.players.find(p => p.role === 'WK') || 
        fieldingInnings.team.players[fieldingInnings.team.players.length - 1];
      setDrawnFielderPlayer(keeper);
      setDrawnWicketCard({ id: 16, type: 'stumped', title: 'Stumping', desc: 'By the keeper', chance: 'conditional' });
      setCurrentStep('skillCard');
      setCallout(`Stumping chance for ${keeper.name} (Keeper)! Draw Skills card.`);
    } else if (code === 'C&B') {
      // Caught & Bowled: Bowler is known
      setDrawnFielderPlayer(currentBowlerFig.player);
      setDrawnWicketCard({ id: 21, type: 'caughtAndBowled', title: 'Caught & Bowled', desc: 'By the bowler', chance: 'bowler_catch' });
      setCurrentStep('skillCard');
      setCallout(`Caught & bowled chance for ${currentBowlerFig.player.name}! Draw Skills card.`);
    } else if (code === 'CT') {
      // Catch in field -> draw fielding card
      setDrawnWicketCard({ id: 5, type: 'caught', title: 'Catch', desc: 'In the field', chance: 'fielder_catch' });
      setCurrentStep('fielderCard');
      setCallout("Catch in the deep! Draw Fielding card (1–20) to identify fielder.");
    } else if (code === 'R/O') {
      // Run Out -> draw fielding card
      setDrawnWicketCard({ id: 22, type: 'runOutStriker', title: 'Run Out', desc: "At striker's end", chance: 'fielder_run_out' });
      setCurrentStep('fielderCard');
      setCallout("Run-out direct hit chance! Draw Fielding card (1–20).");
    }
  };

  // Draw Wicket Card (Section 5.3.1)
  const handleDrawWicketCard = () => {
    const card = DiceCricketEngine.drawWicketCard();
    setDrawnWicketCard(card);
    soundEngine.playCardDraw();

    if (card.type === 'bowled') {
      finalizeWicket("Bowled", currentBowlerFig.player.name);
    } else if (card.type === 'lbW' || card.type === 'lbw') {
      finalizeWicket("LBW", currentBowlerFig.player.name);
    } else if (card.type === 'hitWicket') {
      finalizeWicket("Hit Wicket", currentBowlerFig.player.name);
    } else if (card.type === 'caughtBehind') {
      const keeper = fieldingInnings.team.players.find(p => p.role === 'WK') || 
        fieldingInnings.team.players[fieldingInnings.team.players.length - 1];
      setDrawnFielderPlayer(keeper);
      setCurrentStep('skillCard');
      setCallout(`Caught behind chance! Keeper ${keeper.name} involved. Draw Skills card.`);
    } else if (card.type === 'stumpingOrCaughtBehind') {
      const keeper = fieldingInnings.team.players.find(p => p.role === 'WK') || 
        fieldingInnings.team.players[fieldingInnings.team.players.length - 1];
      setDrawnFielderPlayer(keeper);
      setCurrentStep('skillCard');
      setCallout(`Keeper chance (${card.title})! Draw Skills card.`);
    } else if (card.type === 'caughtAndBowled') {
      setDrawnFielderPlayer(currentBowlerFig.player);
      setCurrentStep('skillCard');
      setCallout(`Caught & bowled chance for ${currentBowlerFig.player.name}! Draw Skills card.`);
    } else {
      // Catch or Run Out in outfield
      setCurrentStep('fielderCard');
      setCallout(`${card.title}! Draw Fielding card (1–20) to see which fielder is positioned.`);
    }
  };

  // -------------------------------------------------------------
  // STEP 4: FIELDING CARD (1–20 squad number) (Section 5.3.2)
  // -------------------------------------------------------------
  const handleDrawFieldingCard = () => {
    const fldNo = DiceCricketEngine.drawFieldingCard();
    setDrawnFieldingNumber(fldNo);
    soundEngine.playCardDraw();

    // Check if squad number is in the active Playing XI
    const activeFielder = fieldingInnings.team.players.find(p => p.no === fldNo);
    const isInXI = activeFielder !== undefined && (
      (is5Overs && fieldingInnings.team.suggested7.includes(activeFielder.name)) ||
      (!is5Overs && fieldingInnings.team.suggestedXI.includes(activeFielder.name)) ||
      fieldingInnings.bowlingFigures.some(f => f.player.name === activeFielder.name)
    );

    if (activeFielder && isInXI) {
      setDrawnFielderPlayer(activeFielder);
      setIsNoFielder(false);
      setCurrentStep('skillCard');
      setCallout(`Fielder #${fldNo} ${activeFielder.name} (${activeFielder.ct} skill) positioned! Draw Skills card.`);
    } else {
      // "No fielder": chance goes begging (Section 5.3.2)
      setIsNoFielder(true);
      setDrawnFielderPlayer(null);
      setCurrentStep('runsCard');
      setCallout(`Fielder #${fldNo} is not in the XI! NO FIELDER in position! Chance goes begging! Draw Runs card.`);
    }
  };

  // -------------------------------------------------------------
  // STEP 5: SKILLS CARD (Section 5.3.3)
  // -------------------------------------------------------------
  const handleDrawSkillsCard = () => {
    const sc = DiceCricketEngine.drawSkillsCard();
    setDrawnSkillCard(sc);
    soundEngine.playCardDraw();

    const fielder = drawnFielderPlayer || currentBowlerFig.player;
    const isKeeper = fielder.role === 'WK';
    const isBowlerCatch = drawnWicketCard?.type === 'caughtAndBowled';
    const isCatch = drawnWicketCard?.type === 'caught' || isBowlerCatch;
    const isRunOut = drawnWicketCard?.type?.includes('runOut');
    const isStump = drawnWicketCard?.type?.includes('stump');

    let skillList: string[] = [];
    if (isKeeper) {
      if (isStump) skillList = sc.wkStump;
      else if (isRunOut) skillList = sc.wkRunOut;
      else skillList = sc.wkCatch;
    } else {
      if (isRunOut) skillList = sc.fldRunOut;
      else skillList = sc.fldCatch;
    }

    const fielderColor = isKeeper && isStump 
      ? (fielder.wkSt || 'Green') 
      : isRunOut 
      ? fielder.rt 
      : fielder.ct;

    const isTaken = skillList.includes(fielderColor);
    setSkillOutcomeTaken(isTaken);

    if (isTaken) {
      // Chance Taken!
      soundEngine.playWicket();
      const wktTitle = drawnWicketCard?.title || (isCatch ? "Catch" : isRunOut ? "Run Out" : "Wicket");
      finalizeWicket(wktTitle, currentBowlerFig.player.name, fielder.name);
    } else {
      // Missed Chance (Section 5.3.4)
      setCurrentStep('runsCard');
      setCallout(`CHANCE MISSED! ${fielder.name} (${fielderColor}) drops/misses! Draw Runs card for runs scored.`);
    }
  };

  // -------------------------------------------------------------
  // STEP 6: RUNS CARD (Missed chance or Extra) (Section 5.3.4 & 5.4)
  // -------------------------------------------------------------
  const handleDrawRunsCard = () => {
    const rc = DiceCricketEngine.drawRunsCard();
    setDrawnRunsCard(rc);
    soundEngine.playCardDraw();

    if (currentStep === 'extrasCard') {
      const extraKind = rc.extrasAppNow;
      handleExtraResult(extraKind);
    } else if (currentStep === 'freeHit') {
      // Free hit draw
      const isBwStriker = striker.player.role === 'BW';
      const freeHitRuns = isBwStriker ? rc.freeHitBowler : rc.freeHitOthers;
      recordDelivery({
        runs: freeHitRuns,
        isDot: freeHitRuns === 0,
        bowlingRedDie: pendingBowlingRoll?.redDie || 'A',
        bowlingBlueDie: pendingBowlingRoll?.blueDie || 1,
        bowlingResult: 'FH',
        tag: `FH${freeHitRuns}`
      });
      setCallout(`Free Hit ball! ${freeHitRuns} run${freeHitRuns > 1 ? 's' : ''} scored off the free hit!`);
      resetCardPipeline();
    } else {
      // Runs scored on missed chance or no fielder (Section 5.3.4)
      let runsScored = 0;
      if (isNoFielder) {
        runsScored = rc.noFielderCatch || 2;
      } else {
        runsScored = rc.catchDroppedFielder || 1;
      }

      recordDelivery({
        runs: runsScored,
        isDot: runsScored === 0,
        bowlingRedDie: pendingBowlingRoll?.redDie || 'A',
        bowlingBlueDie: pendingBowlingRoll?.blueDie || 1,
        bowlingResult: pendingBowlingRoll?.result || 'B',
        battingRedDie: pendingBattingRoll?.redDie,
        battingBlueDie: pendingBattingRoll?.blueDie,
        battingResult: pendingBattingRoll?.result,
        tag: `${runsScored}`
      });
      setCallout(`Missed chance resulted in ${runsScored} run${runsScored > 1 ? 's' : ''}. Play continues.`);
      resetCardPipeline();
    }
  };

  // Handle Extras Draw (Section 5.4)
  const handleExtraResult = (extraKind: string) => {
    const bRow = pendingBowlingRoll?.redDie || 'A';
    const bCol = pendingBowlingRoll?.blueDie || 1;
    const bRes = pendingBowlingRoll?.result || '+';

    if (extraKind === 'DOT') {
      recordDelivery({
        runs: 0,
        isDot: true,
        bowlingRedDie: bRow,
        bowlingBlueDie: bCol,
        bowlingResult: bRes,
        tag: '•'
      });
      setCallout("Runs Card drawn: Clean Dot ball conversion! No extra conceded.");
    } else if (extraKind === 'WIDE' || extraKind === 'WIDE +1' || extraKind === 'WIDE +2') {
      const extraRuns = extraKind === 'WIDE' ? 1 : extraKind === 'WIDE +1' ? 2 : 3;
      recordExtraDelivery('wide', extraRuns, bRow, bCol, bRes);
      setCallout(`Wide called (+${extraRuns} runs). Extra delivery required.`);
    } else if (extraKind === 'NO BALL' || extraKind === 'NO BALL +1') {
      const extraRuns = extraKind === 'NO BALL' ? 1 : 2;
      recordExtraDelivery('no_ball', extraRuns, bRow, bCol, bRes);
      setCallout(`NO BALL called (+${extraRuns} runs)! NEXT BALL IS A FREE HIT!`);
    } else if (extraKind === 'B1') {
      recordDelivery({
        runs: 0,
        extraRuns: 1,
        extraType: 'bye',
        bowlingRedDie: bRow,
        bowlingBlueDie: bCol,
        bowlingResult: bRes,
        tag: 'B1'
      });
      setCallout("1 Bye scored. Legal ball.");
    } else if (extraKind === 'L1' || extraKind === 'L2') {
      const runs = extraKind === 'L1' ? 1 : 2;
      recordDelivery({
        runs: 0,
        extraRuns: runs,
        extraType: 'leg_bye',
        bowlingRedDie: bRow,
        bowlingBlueDie: bCol,
        bowlingResult: bRes,
        tag: `L${runs}`
      });
      setCallout(`${runs} Leg byes scored. Legal ball.`);
    }
    resetCardPipeline();
  };

  const resetCardPipeline = () => {
    setDrawnWicketCard(null);
    setDrawnFieldingNumber(null);
    setDrawnFielderPlayer(null);
    setIsNoFielder(false);
    setDrawnSkillCard(null);
    setSkillOutcomeTaken(null);
    setDrawnRunsCard(null);
    setPendingBowlingRoll(null);
    setPendingBattingRoll(null);
    setCurrentStep('bowl');
  };

  // Finalize Wicket
  const finalizeWicket = (type: string, bowlerName: string, fielderName?: string, bRow?: string, bCol?: number) => {
    const isEligibleForDrs = (type === 'LBW' || type === 'Caught Behind' || type === 'Caught') &&
      striker.player.marks.includes('C') &&
      (match.powerCardsRemaining[currentInnings.team.id]?.reroll > 0);

    setPendingWicketInfo({ type, eligibleForDrs: isEligibleForDrs });

    recordDelivery({
      runs: 0,
      isWicket: true,
      wicketType: type,
      dismissedPlayer: striker.player.name,
      bowlingRedDie: bRow || pendingBowlingRoll?.redDie || 'A',
      bowlingBlueDie: bCol || pendingBowlingRoll?.blueDie || 1,
      bowlingResult: pendingBowlingRoll?.result || 'X',
      battingRedDie: pendingBattingRoll?.redDie,
      battingBlueDie: pendingBattingRoll?.blueDie,
      battingResult: pendingBattingRoll?.result,
      tag: 'W'
    });

    setCallout(`OUT! ${striker.player.name} dismissed (${type})!`);
    resetCardPipeline();
  };

  // Record Delivery (Section 5.6)
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
    const prevScore = inn.score;
    inn.score += totalRunsThisBall;

    // Milestone checks (Section 6.4)
    const newMilestones: Milestone[] = [];

    // Batsman Milestones (50, 100, 150, 200)
    const strikerEntry = inn.battingCard[inn.strikerIndex];
    if (strikerEntry) {
      const prevRuns = strikerEntry.runs;
      const nextRuns = prevRuns + params.runs;
      [50, 100, 150, 200].forEach(m => {
        if (prevRuns < m && nextRuns >= m) {
          newMilestones.push({
            type: 'batsman',
            title: m === 50 ? 'FIFTY!' : m === 100 ? 'CENTURY!' : m === 150 ? '150!' : 'DOUBLE CENTURY!',
            subtitle: `${strikerEntry.player.name} reaches ${m} runs!`,
            tier: m as any
          });
        }
      });
    }

    // Bowler Milestones (3 wickets, 5 wickets - not run outs)
    const bowlerEntry = inn.bowlingFigures.find(f => f.player.name === currentBowlerFig.player.name);
    if (bowlerEntry && params.isWicket && params.wicketType !== 'Run Out') {
      const nextWkts = bowlerEntry.wickets + 1;
      if (nextWkts === 3) {
        newMilestones.push({
          type: 'bowler',
          title: 'THREE WICKETS!',
          subtitle: `${bowlerEntry.player.name} picks up 3rd wicket!`,
          tier: 3
        });
      } else if (nextWkts === 5) {
        newMilestones.push({
          type: 'bowler',
          title: 'FIVE WICKETS!',
          subtitle: `${bowlerEntry.player.name} takes a magnificent fifer!`,
          tier: 5
        });
      }
    }

    // Team Milestones (50, 100, 150, 200)
    [50, 100, 150, 200].forEach(m => {
      if (prevScore < m && inn.score >= m) {
        newMilestones.push({
          type: 'team',
          title: `TEAM ${m}!`,
          subtitle: `${inn.team.name} crosses the ${m} mark!`,
          tier: m as any
        });
      }
    });

    if (newMilestones.length > 0) {
      setMilestoneQueue(prev => [...prev, ...newMilestones]);
    }

    // Build delivery
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

    // Update Striker figures
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

    // Update Bowler figures
    if (bowlerEntry) {
      bowlerEntry.runsConceded += totalRunsThisBall;
      if (params.isDot) bowlerEntry.dots++;
      if (params.isWicket && params.wicketType !== 'Run Out') bowlerEntry.wickets++;
      const legalBalls = inn.deliveries.filter(d => d.bowler === bowlerEntry.player.name && d.isLegal).length;
      bowlerEntry.overs = parseFloat(`${Math.floor(legalBalls / 6)}.${legalBalls % 6}`);
      bowlerEntry.economy = legalBalls > 0 ? (bowlerEntry.runsConceded / (legalBalls / 6)) : 0;
    }

    // Check Fall of Wicket (Section 6.1: Wicket shown first, then new batsman card)
    if (params.isWicket) {
      inn.wickets++;
      inn.fallOfWickets.push({
        wicketNo: inn.wickets,
        score: inn.score,
        overs: `${inn.completedOvers}.${inn.ballsInCurrentOver}`,
        player: params.dismissedPlayer || striker.player.name
      });

      if (inn.wickets < maxWickets) {
        setIncomingBatsmanNo(inn.wickets + 2);
        // Find next batsman in order
        const availableBatsmen = inn.battingCard
          .filter(b => !b.isOut && b.player.name !== striker.player.name && b.player.name !== nonStriker.player.name)
          .map(b => b.player);
        setSelectedIncomingPlayer(availableBatsmen[0] || null);
        setIncomingIsFinisher(availableBatsmen[0]?.marks.includes('F') || false);

        setTimeout(() => {
          setShowNewBatsmanCard(true);
        }, 800);
      }
    }

    // Strike Rotation on Odd Runs
    if (params.runs % 2 !== 0 || (params.extraType === 'bye' && (params.extraRuns || 0) % 2 !== 0)) {
      const temp = inn.strikerIndex;
      inn.strikerIndex = inn.nonStrikerIndex;
      inn.nonStrikerIndex = temp;
    }

    // Check Over Complete (6 legal balls) (Section 6.2)
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
      }, 700);
    }

    checkInningsCompletion(updated);
    onUpdateMatch(updated);
    storage.saveMatch(updated);
  };

  // Record Extra Delivery
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

    const bowlerEntry = inn.bowlingFigures.find(f => f.player.name === currentBowlerFig.player.name);
    if (bowlerEntry) bowlerEntry.runsConceded += extraRuns;

    if (type === 'no_ball') {
      setCurrentStep('freeHit');
    }

    checkInningsCompletion(updated);
    onUpdateMatch(updated);
    storage.saveMatch(updated);
  };

  // Check Innings & Match Completion (Section 4.2 & Section 9)
  const checkInningsCompletion = (updated: MatchState) => {
    const inn = updated.currentInningsNo === 1 ? updated.innings1 : updated.innings2;
    const isAllOut = inn.wickets >= maxWickets;
    const isOversDone = inn.completedOvers >= totalOvers;

    if (updated.currentInningsNo === 1) {
      if (isAllOut || isOversDone) {
        inn.isCompleted = true;
        updated.currentInningsNo = 2;
        updated.targetRuns = inn.score + 1;
        setCallout(`Innings 1 complete! ${inn.team.name} scored ${inn.score}/${inn.wickets}. Target: ${updated.targetRuns} runs.`);
      }
    } else {
      // Innings 2 Chase
      const target = updated.targetRuns || 0;
      if (inn.score >= target) {
        inn.isCompleted = true;
        updated.status = 'COMPLETED';
        updated.winnerTeamId = inn.team.id;
        const wktMargin = maxWickets - inn.wickets;
        updated.winDescription = `${inn.team.name} won by ${wktMargin} wicket${wktMargin > 1 ? 's' : ''}!`;
        updated.playerOfTheMatch = calculatePlayerOfTheMatch(updated);
        setShowVictoryModal(true);
      } else if (isAllOut || isOversDone) {
        inn.isCompleted = true;
        if (inn.score === target - 1) {
          // TIE! Super Over Trigger (Section 9)
          updated.status = 'TIE_SUPER_OVER';
          updated.isSuperOver = true;
          updated.winDescription = "MATCH TIED! Super Over Activated!";
          setShowSuperOverModal(true);
        } else {
          updated.status = 'COMPLETED';
          updated.winnerTeamId = updated.innings1.team.id;
          const runMargin = target - 1 - inn.score;
          updated.winDescription = `${updated.innings1.team.name} won by ${runMargin} run${runMargin > 1 ? 's' : ''}!`;
          updated.playerOfTheMatch = calculatePlayerOfTheMatch(updated);
          setShowVictoryModal(true);
        }
      }
    }
  };

  // Confirm incoming batsman (Section 6.1)
  const handleConfirmIncomingBatsman = () => {
    if (!selectedIncomingPlayer) return;
    const updated = { ...match };
    const inn = updated.currentInningsNo === 1 ? updated.innings1 : updated.innings2;

    const incomingIdx = inn.battingCard.findIndex(b => b.player.name === selectedIncomingPlayer.name);
    if (incomingIdx >= 0) {
      inn.strikerIndex = incomingIdx;
      if (incomingIsFinisher) {
        inn.battingCard[incomingIdx].sheetRoleOverride = 'treat_finisher';
      }
    }

    setShowNewBatsmanCard(false);
    setPendingWicketInfo(null);
    setCallout(`${selectedIncomingPlayer.name} comes in at No. ${incomingBatsmanNo}. Bowling resumes.`);
    onUpdateMatch(updated);
    storage.saveMatch(updated);
  };

  // Swap Strike (Section 7.6)
  const handleSwapStrike = () => {
    const updated = { ...match };
    const inn = updated.currentInningsNo === 1 ? updated.innings1 : updated.innings2;
    const temp = inn.strikerIndex;
    inn.strikerIndex = inn.nonStrikerIndex;
    inn.nonStrikerIndex = temp;
    onUpdateMatch(updated);
    storage.saveMatch(updated);
    setCallout("Strike swapped manually between batsmen.");
  };

  // Undo (Section 7.6)
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

    setShowNewBatsmanCard(false);
    resetCardPipeline();
    setCallout("Last delivery undone. Ready to bowl again.");
    onUpdateMatch(updated);
    storage.saveMatch(updated);
  };

  // Delete match handler
  const handleDeleteCurrentMatch = () => {
    if (match.tournamentId && match.fixtureId) {
      const tourneys = storage.getAllTournaments();
      const tourney = tourneys.find(t => t.id === match.tournamentId);
      if (tourney) {
        const fix = tourney.fixtures.find(f => f.id === match.fixtureId);
        if (fix) {
          fix.isPlayed = false;
          fix.matchId = undefined;
          fix.winnerTeamId = undefined;
          storage.saveTournament(tourney);
        }
      }
    }
    storage.deleteMatch(match.id);
    onNavigateTab('matches');
  };

  // Keyboard Space Shortcut (Section 7.6)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        // Prevent default page scroll
        e.preventDefault();
        if (showNewBatsmanCard || showOverCompleteCard || showBowlerModal || showVictoryModal) return;

        if (currentStep === 'bowl') handleBowlingRoll();
        else if (currentStep === 'bat') handleBattingRoll();
        else if (currentStep === 'wicketCard') handleDrawWicketCard();
        else if (currentStep === 'fielderCard') handleDrawFieldingCard();
        else if (currentStep === 'skillCard') handleDrawSkillsCard();
        else if (currentStep === 'runsCard' || currentStep === 'extrasCard' || currentStep === 'freeHit') handleDrawRunsCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, showNewBatsmanCard, showOverCompleteCard, showBowlerModal, showVictoryModal, isRolling]);

  // Last ball delivery
  const lastDelivery = currentInnings.deliveries[currentInnings.deliveries.length - 1] || null;

  // Remaining unused batsmen for new batsman dropdown
  const availableIncomingBatsmen = currentInnings.battingCard
    .filter(b => !b.isOut && b.player.name !== striker.player.name && b.player.name !== nonStriker.player.name)
    .map(b => b.player);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 space-y-4 select-none animate-fadeIn pb-24">
      {/* 7.1 Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#272b26] pb-3">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => onNavigateTab('matches')}
            className="text-slate-400 hover:text-white font-bold flex items-center gap-1"
          >
            <span>← Matches</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="font-bold text-white">
            {match.teamA.code} vs {match.teamB.code} ({match.format.replace('_', ' ')})
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-[#c3f400] font-mono font-bold">{match.ground} Ground</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Scorer Mode (Auto / Manual) (Section 7.3) */}
          <div className="flex bg-[#101410] border border-white/10 rounded-full p-0.5 text-[11px] font-bold">
            <button
              onClick={() => { setScorerMode('auto'); storage.saveSettings({ ...settings, scorerMode: 'auto' }); }}
              className={`px-2.5 py-1 rounded-full transition-all ${
                scorerMode === 'auto' ? 'bg-[#c3f400] text-black font-black' : 'text-slate-500 hover:text-white'
              }`}
            >
              Auto
            </button>
            <button
              onClick={() => { setScorerMode('manual'); storage.saveSettings({ ...settings, scorerMode: 'manual' }); }}
              className={`px-2.5 py-1 rounded-full transition-all ${
                scorerMode === 'manual' ? 'bg-[#c3f400] text-black font-black' : 'text-slate-500 hover:text-white'
              }`}
            >
              Manual
            </button>
          </div>

          {/* Layout Toggle (Section 7.4) */}
          <div className="flex bg-[#101410] border border-white/10 rounded-full p-0.5 text-[11px] font-bold">
            <button
              onClick={() => setScoringLayout('split')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                scoringLayout === 'split' ? 'bg-[#272b26] text-white font-black' : 'text-slate-500 hover:text-white'
              }`}
            >
              Split
            </button>
            <button
              onClick={() => setScoringLayout('pitch')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                scoringLayout === 'pitch' ? 'bg-[#272b26] text-[#c3f400] font-black' : 'text-slate-500 hover:text-white'
              }`}
            >
              Pitch
            </button>
            <button
              onClick={() => setScoringLayout('facetoface')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                scoringLayout === 'facetoface' ? 'bg-[#272b26] text-amber-300 font-black' : 'text-slate-500 hover:text-white'
              }`}
            >
              180° Table
            </button>
          </div>

          {/* Delete Button (Section 7.1) */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            title="Delete Match"
            className="w-8 h-8 rounded-full bg-red-950/40 text-red-400 hover:bg-red-900/60 flex items-center justify-center transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 7.1 Scoreboard Hero Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1c221a] to-[#131712] border border-[#2e3629] p-4 shadow-2xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-2xl border border-white/15 flex items-center justify-center text-base font-black text-white shadow-inner"
              style={{ backgroundColor: currentInnings.team.color || '#232920' }}
            >
              {currentInnings.team.code}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{currentInnings.team.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-[#c3f400] text-black text-[10px] font-black uppercase">
                  {isSecondInnings ? '2nd Innings' : '1st Innings'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                <span>Toss: {match.tossWinnerId === match.teamA.id ? match.teamA.code : match.teamB.code} chose {match.tossDecision}</span>
                {isSecondInnings && (
                  <>
                    <span>•</span>
                    <span className="text-white font-mono font-bold">1st Inn: {match.innings1.score}/{match.innings1.wickets}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-[#c3f400] font-mono leading-none">
                {currentInnings.score}/{currentInnings.wickets}
              </span>
              <span className="text-xs text-slate-400 font-mono font-bold">
                ({currentInnings.completedOvers}.{currentInnings.ballsInCurrentOver} ov)
              </span>
            </div>
            <div className="flex items-center justify-end gap-2 mt-1 text-[11px]">
              <span className="text-slate-400">CRR: <strong className="text-white font-mono">{crr}</strong></span>
              {match.targetRuns && (
                <span className="text-[#c3f400] font-bold">
                  Target {match.targetRuns} · Need {runsNeeded} off {remainingBalls}b {rrr && `(RRR ${rrr})`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Star Dominance Line (Section 7.1 & Section 18) */}
        <div className="bg-[#121611] rounded-2xl px-3 py-1.5 border border-[#232920] flex items-center justify-between text-[11px]">
          <span className="text-slate-300 font-semibold">{starLineDesc}</span>
          <span className="text-[#c3f400] font-bold uppercase text-[10px]">
            {isPowerplay ? 'Phase: Powerplay' : isSlog ? 'Phase: Slog Overs' : 'Phase: Middle Overs'}
          </span>
        </div>

        {/* Over Delivery Chips (Section 7.7) */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
            Over {currentOverNo} Balls
          </span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5, 6].map(ballIdx => {
              const delivery = currentInnings.deliveries.filter(d => d.overNo === currentOverNo)[ballIdx - 1];
              const isCurrent = currentInnings.ballsInCurrentOver === ballIdx - 1;
              return (
                <div
                  key={ballIdx}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-all ${
                    delivery?.isWicket ? 'bg-red-500 text-white font-black' :
                    delivery?.runsScored === 6 ? 'bg-amber-400 text-black font-black' :
                    delivery?.runsScored === 4 ? 'bg-[#c3f400] text-black font-black' :
                    delivery ? 'bg-[#232920] text-white border border-white/10' :
                    isCurrent ? 'bg-[#c3f400] text-black font-black ring-2 ring-[#c3f400]/60 scale-105' :
                    'bg-[#191d18] text-slate-500 border border-white/5'
                  }`}
                >
                  {delivery ? delivery.displayTag : `${currentOverNo}.${ballIdx}`}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Navigation Tabs (Section 7.1: Live · Scorecard · Summary · Ball by ball) */}
      <div className="flex border-b border-[#272b26] gap-4 text-xs font-bold">
        {[
          { id: 'live', label: 'Live' },
          { id: 'scorecard', label: 'Scorecard' },
          { id: 'summary', label: 'Summary' },
          { id: 'ballbyball', label: 'Ball by ball' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => onNavigateTab(tab.id as any)}
            className={`pb-2.5 transition-all relative ${
              tab.id === 'live' ? 'text-[#c3f400] font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            {tab.id === 'live' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c3f400] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 6.5 Innings Break Banner */}
      {match.currentInningsNo === 1 && currentInnings.isCompleted && (
        <div className="bg-gradient-to-r from-[#191d18] via-[#272b26] to-[#191d18] border-2 border-[#c3f400] p-4 rounded-3xl text-center space-y-2 animate-slideUp">
          <div className="text-sm font-black text-white uppercase tracking-wider">
            Innings 1 Complete · {currentInnings.team.name} scored {currentInnings.score}/{currentInnings.wickets}
          </div>
          <p className="text-xs text-slate-300">
            Target for {match.innings2.team.name}: <strong>{match.targetRuns} runs</strong> in {totalOvers} overs.
          </p>
          <button
            onClick={() => {
              const updated = { ...match, currentInningsNo: 2 as const };
              onUpdateMatch(updated);
              storage.saveMatch(updated);
            }}
            className="px-6 py-2.5 rounded-full bg-[#c3f400] text-black font-black text-xs uppercase tracking-wider hover:bg-[#d4ff1a]"
          >
            Start 2nd Innings →
          </button>
        </div>
      )}

      {/* 6.4 Milestone Celebration Card */}
      {activeMilestone && (
        <MilestoneCard
          milestone={activeMilestone}
          animationsEnabled={settings.animationsEnabled}
          onClose={() => setActiveMilestone(null)}
        />
      )}

      {/* 6.3 Result-Strip Animation */}
      <ResultStripAnimation
        delivery={lastDelivery}
        animationsEnabled={settings.animationsEnabled}
      />

      {/* 6.1 New Batsman Card Walking In (Locks rolls until confirmed) */}
      {showNewBatsmanCard && (
        <div className="bg-gradient-to-r from-red-950/60 via-[#1c221b] to-red-950/60 border-2 border-red-500/60 p-4 rounded-3xl space-y-3 animate-slideUp shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-black text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>WICKET! NEW BATSMAN WALKING IN · NO. {incomingBatsmanNo}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Rolls Locked</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Select Incoming Batsman</label>
              <select
                value={selectedIncomingPlayer?.name || ''}
                onChange={e => {
                  const p = availableIncomingBatsmen.find(b => b.name === e.target.value);
                  if (p) {
                    setSelectedIncomingPlayer(p);
                    setIncomingIsFinisher(p.marks.includes('F'));
                  }
                }}
                className="w-full bg-[#101410] text-white border border-white/20 rounded-xl px-3 py-2 text-xs font-bold outline-none"
              >
                {availableIncomingBatsmen.map((p, idx) => (
                  <option key={p.no} value={p.name}>
                    #{idx + incomingBatsmanNo}: {p.name} ({p.role} · {p.bat}) {p.marks.length > 0 ? `[${p.marks.join(' ')}]` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* In Slog: Finisher designation question (Section 6.1) */}
            {isSlog && availableIncomingBatsmen.filter(p => p.marks.includes('F')).length > 1 && (
              <div>
                <label className="text-amber-400 font-bold block mb-1">Who goes in as the Finisher?</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIncomingIsFinisher(true)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${
                      incomingIsFinisher ? 'bg-[#c3f400] text-black font-black' : 'bg-[#101410] text-slate-400'
                    }`}
                  >
                    Yes (SLG F line)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIncomingIsFinisher(false)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${
                      !incomingIsFinisher ? 'bg-[#c3f400] text-black font-black' : 'bg-[#101410] text-slate-400'
                    }`}
                  >
                    No (SLG Rest line)
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleConfirmIncomingBatsman}
            className="w-full py-2.5 rounded-full bg-[#c3f400] text-black font-black text-xs uppercase tracking-wider hover:bg-[#d4ff1a] shadow-lg shadow-[#c3f400]/20"
          >
            Confirm: {selectedIncomingPlayer?.name} comes in at No. {incomingBatsmanNo}
          </button>
        </div>
      )}

      {/* 6.2 Over Complete Card */}
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

      {/* 7.4 Scoring Arena Layouts (Split, Pitch View, Face-to-Face) */}
      {scoringLayout === 'pitch' && (
        <PitchView
          striker={striker}
          nonStriker={nonStriker}
          bowler={currentBowlerFig}
          lastBallResult={lastDelivery?.displayTag || null}
          lastBallType={
            lastDelivery?.isWicket ? 'wicket' :
            lastDelivery?.runsScored === 6 ? 'six' :
            lastDelivery?.runsScored === 4 ? 'four' :
            lastDelivery?.extraType ? 'extra' : 'runs'
          }
          isAnimationsEnabled={settings.animationsEnabled}
          onTriggerDrsReview={() => {
            setDrsSuccessData({
              batsmanName: striker.player.name,
              bowlerName: currentBowlerFig.player.name,
              wicketType: pendingWicketInfo?.type || 'LBW',
              rolledDie: 6
            });
            setShowDrsSuccessOverlay(true);
          }}
        />
      )}

      {/* Primary Dice Rolling Action Console */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${
        scoringLayout === 'facetoface' ? 'space-y-4 sm:space-y-0' : ''
      }`}>
        {/* Bowling Block (rotated 180° in Face-to-Face) */}
        <div className={`bg-[#141814] border-2 ${currentStep === 'bowl' ? 'border-red-500/60 shadow-lg shadow-red-500/10' : 'border-[#272b26]'} rounded-3xl p-5 shadow-xl space-y-3 ${
          bowlingSide === 'right' ? 'sm:order-2' : 'sm:order-1'
        } ${
          scoringLayout === 'facetoface' ? 'rotate-180 transition-transform' : ''
        }`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${currentStep === 'bowl' ? 'bg-red-500 animate-beacon-pulse' : 'bg-slate-600'}`} />
              BOWLING ATTACK · {currentStep === 'bowl' ? 'READY TO BOWL' : 'WAITING'}
            </span>
            <span className="text-xs font-mono font-bold text-white">
              {currentBowlerFig.wickets}/{currentBowlerFig.runsConceded} ({currentBowlerFig.overs} ov)
            </span>
          </div>
          <div>
            <div className="text-lg font-black text-white flex items-center gap-1.5">
              <span>{currentBowlerFig.player.name}</span>
              {currentBowlerFig.player.marks.includes('C') && (
                <span className="bg-blue-400/20 text-blue-300 text-[10px] px-1.5 py-0.2 rounded font-bold">C</span>
              )}
            </div>
            <div className="text-xs text-slate-400">{currentBowlerFig.player.bowl} · {currentBowlerFig.player.role}</div>
          </div>

          <button
            onClick={handleBowlingRoll}
            disabled={currentStep !== 'bowl' || showNewBatsmanCard || isRolling}
            className={`w-full h-[52px] rounded-2xl ${currentStep === 'bowl' ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white font-black shadow-lg shadow-red-600/30 ring-2 ring-red-400' : 'bg-[#1d211c] text-slate-400 border border-white/10'} disabled:opacity-40 disabled:cursor-not-allowed font-black text-xs uppercase flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer`}
          >
            <span className="material-symbols-outlined text-[18px] text-white">casino</span>
            <span>Roll Bowling Dice</span>
          </button>
        </div>

        {/* Batting Block */}
        <div className={`bg-[#141814] border-2 ${currentStep === 'bat' ? 'border-[#c3f400] shadow-lg shadow-[#c3f400]/15' : 'border-white/10'} rounded-3xl p-5 shadow-xl space-y-3 ${
          bowlingSide === 'right' ? 'sm:order-1' : 'sm:order-2'
        }`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#c3f400] flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${currentStep === 'bat' ? 'bg-[#c3f400] animate-beacon-pulse' : 'bg-slate-600'}`} />
              ▶ STRIKER · {currentStep === 'bat' ? 'YOUR SHOT' : 'WAITING'}
            </span>
            <span className="text-xs font-mono font-black text-[#c3f400]">
              {striker.runs} ({striker.balls}b) · SR {striker.strikeRate.toFixed(1)}
            </span>
          </div>
          <div>
            <div className="text-lg font-black text-white flex items-center gap-1.5">
              <span>{striker.player.name}</span>
              {striker.player.marks.includes('C') && (
                <span className="bg-blue-400/20 text-blue-300 text-[10px] px-1.5 py-0.2 rounded font-bold">C</span>
              )}
              {striker.player.marks.includes('★') && (
                <span className="bg-amber-400/20 text-amber-300 text-[10px] px-1.5 py-0.2 rounded font-bold">★ @ {striker.player.starRuns}r</span>
              )}
            </div>
            <div className="text-xs text-slate-400">{striker.player.bat} · {striker.player.role}</div>
          </div>

          <button
            onClick={handleBattingRoll}
            disabled={currentStep !== 'bat' || showNewBatsmanCard || isRolling}
            className={`w-full h-[52px] rounded-2xl ${currentStep === 'bat' ? 'bg-[#c3f400] text-black font-black shadow-lg shadow-[#c3f400]/30 ring-2 ring-white/50' : 'bg-[#1d211c] text-slate-400 border border-white/10'} disabled:opacity-40 disabled:cursor-not-allowed font-black text-xs uppercase flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer`}
          >
            <span className="material-symbols-outlined text-[18px]">sports_cricket</span>
            <span>Roll Batting Dice (Shot)</span>
          </button>
        </div>
      </div>

      {/* 7.5 Middle Section: Callout & Card Draw Pipeline Controls */}
      <div className="bg-[#141814] border border-[#272b26] rounded-3xl p-4 shadow-xl space-y-3">
        {/* Callout Line (Section 6.5) */}
        <div className="bg-[#101410] border border-white/10 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#c3f400] text-[20px]">info</span>
            <span className="text-xs font-bold text-white">{callout}</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase bg-[#1d211c] px-2 py-0.5 rounded-full">
            Step: {currentStep}
          </span>
        </div>

        {/* Drawn Cards Display Strip */}
        {(drawnWicketCard || drawnFieldingNumber || drawnSkillCard || drawnRunsCard) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 animate-fadeIn">
            {drawnWicketCard && (
              <div className="bg-red-950/40 border border-red-500/40 p-2.5 rounded-2xl text-center">
                <span className="text-[9px] uppercase font-bold text-red-400 block">Wicket Card</span>
                <span className="text-xs font-black text-white mt-0.5 block">{drawnWicketCard.title}</span>
                <span className="text-[10px] text-slate-300">{drawnWicketCard.desc}</span>
              </div>
            )}
            {drawnFieldingNumber && (
              <div className="bg-blue-950/40 border border-blue-500/40 p-2.5 rounded-2xl text-center">
                <span className="text-[9px] uppercase font-bold text-blue-400 block">Fielding Card</span>
                <span className="text-xs font-black text-white mt-0.5 block">#{drawnFieldingNumber}</span>
                <span className="text-[10px] text-slate-300">
                  {isNoFielder ? "No Fielder!" : drawnFielderPlayer?.name}
                </span>
              </div>
            )}
            {drawnSkillCard && (
              <div className="bg-purple-950/40 border border-purple-500/40 p-2.5 rounded-2xl text-center">
                <span className="text-[9px] uppercase font-bold text-purple-400 block">Skills Card</span>
                <span className={`text-xs font-black mt-0.5 block ${skillOutcomeTaken ? 'text-emerald-400' : 'text-red-400'}`}>
                  {skillOutcomeTaken ? "CHANCE TAKEN" : "MISSED"}
                </span>
                <span className="text-[10px] text-slate-300">Card #{drawnSkillCard.card}</span>
              </div>
            )}
            {drawnRunsCard && (
              <div className="bg-amber-950/40 border border-amber-500/40 p-2.5 rounded-2xl text-center">
                <span className="text-[9px] uppercase font-bold text-amber-400 block">Runs Card</span>
                <span className="text-xs font-black text-amber-300 mt-0.5 block">Card #{drawnRunsCard.card}</span>
                <span className="text-[10px] text-slate-300">{drawnRunsCard.extrasAppNow || 'Runs'}</span>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Card Draw Buttons (Section 7.5) */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {currentStep === 'wicketCard' && (
            <button
              onClick={handleDrawWicketCard}
              className="flex-1 py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">style</span>
              <span>Draw Wicket Card</span>
            </button>
          )}

          {currentStep === 'fielderCard' && (
            <button
              onClick={handleDrawFieldingCard}
              className="flex-1 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">person_search</span>
              <span>Draw Fielding Card (1–20)</span>
            </button>
          )}

          {currentStep === 'skillCard' && (
            <button
              onClick={handleDrawSkillsCard}
              className="flex-1 py-3 px-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">shield</span>
              <span>Draw Skills Card</span>
            </button>
          )}

          {(currentStep === 'runsCard' || currentStep === 'extrasCard' || currentStep === 'freeHit') && (
            <button
              onClick={handleDrawRunsCard}
              className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">sports_score</span>
              <span>
                {currentStep === 'freeHit' ? "Draw Runs Card (Free Hit)" : currentStep === 'extrasCard' ? "Draw Runs Card (Extras)" : "Draw Runs Card"}
              </span>
            </button>
          )}

          {/* Captain Power Cards & DRS Action Triggers (Section 5.5) */}
          <div className="flex items-center gap-2 ml-auto">
            {pendingWicketInfo?.eligibleForDrs && (
              <button
                onClick={() => setShowDrsModal(true)}
                className="py-2.5 px-3.5 rounded-2xl bg-[#c3f400] text-black font-black text-xs flex items-center gap-1.5 shadow-md shadow-[#c3f400]/25"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Review (DRS)</span>
              </button>
            )}

            {/* Wonderful Shot for Batting Captain on strike */}
            {striker.player.marks.includes('C') && match.powerCardsRemaining[currentInnings.team.id]?.wonderfulShot > 0 && currentStep === 'bat' && (
              <button
                onClick={() => setShowPowerModal('wonderful_shot')}
                className="py-2.5 px-3 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold hover:bg-amber-400/30"
              >
                Wonderful Shot
              </button>
            )}

            {/* Great Delivery for Bowling Captain bowling */}
            {currentBowlerFig.player.marks.includes('C') && match.powerCardsRemaining[fieldingInnings.team.id]?.greatDelivery > 0 && currentStep === 'bowl' && (
              <button
                onClick={() => setShowPowerModal('great_delivery')}
                className="py-2.5 px-3 rounded-2xl bg-purple-400/20 text-purple-300 border border-purple-400/40 text-xs font-bold hover:bg-purple-400/30"
              >
                Great Delivery
              </button>
            )}

            {/* Captain Reroll */}
            {((currentStep === 'bat' && striker.player.marks.includes('C')) || (currentStep === 'bowl' && currentBowlerFig.player.marks.includes('C'))) && (
              <button
                onClick={() => setShowPowerModal('reroll')}
                className="py-2.5 px-3 rounded-2xl bg-white/10 text-white hover:bg-white/20 text-xs font-bold border border-white/10"
              >
                Reroll
              </button>
            )}
          </div>
        </div>

        {/* Manual Dice Cell Picker (if Manual Scorer enabled) (Section 7.3) */}
        {scorerMode === 'manual' && (
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
            <span>Manual Dice Cell:</span>
            <div className="flex items-center gap-2">
              <select
                value={manualCell.row}
                onChange={e => setManualCell(prev => ({ ...prev, row: e.target.value }))}
                className="bg-[#101410] border border-white/20 rounded-xl px-2 py-1 text-white font-mono font-bold"
              >
                {['A', 'B', 'C', 'D', 'E', 'F'].map(r => (
                  <option key={r} value={r}>Row {r}</option>
                ))}
              </select>
              <select
                value={manualCell.col}
                onChange={e => setManualCell(prev => ({ ...prev, col: parseInt(e.target.value, 10) }))}
                className="bg-[#101410] border border-white/20 rounded-xl px-2 py-1 text-white font-mono font-bold"
              >
                {[1, 2, 3, 4, 5, 6].map(c => (
                  <option key={c} value={c}>Col {c}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 7.6 Action Line */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#141814] border border-[#272b26] rounded-2xl text-xs">
        <div className="flex items-center gap-2">
          {/* Undo */}
          <button
            onClick={handleUndo}
            disabled={currentInnings.deliveries.length === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#191d18] hover:bg-[#232821] disabled:opacity-40 text-slate-300 hover:text-white border border-white/5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>

          {/* Swap Strike */}
          <button
            onClick={handleSwapStrike}
            disabled={showNewBatsmanCard}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#191d18] hover:bg-[#232821] text-slate-300 hover:text-white border border-white/5"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Swap Strike</span>
          </button>

          {/* Batting Order */}
          <button
            onClick={() => setShowBattingOrderModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#191d18] hover:bg-[#232821] text-slate-300 hover:text-white border border-white/5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Batting Order</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Bowling Block Side Left / Right Toggle */}
          <button
            onClick={() => {
              const next = bowlingSide === 'left' ? 'right' : 'left';
              setBowlingSide(next);
              storage.saveSettings({ ...settings, bowlingBlockSide: next });
            }}
            className="px-3 py-1.5 rounded-xl bg-[#191d18] hover:bg-[#232821] text-slate-300 hover:text-white border border-white/5"
          >
            Bowl: {bowlingSide === 'left' ? 'Left' : 'Right'}
          </button>

          {/* Customise link */}
          <button
            onClick={() => onNavigateTab('customise')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#191d18] hover:bg-[#232821] text-slate-300 hover:text-white border border-white/5"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Customise</span>
          </button>
        </div>
      </div>

      {/* 7.7 Side Panels: At the Crease Sheet-Role Override */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#141814] border border-[#272b26] p-4 rounded-3xl">
        {/* Striker Role */}
        <div className="bg-[#191d18] p-3 rounded-2xl border border-white/5 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-black text-[#c3f400]">▶ Striker: {striker.player.name}</span>
            <span className="text-[10px] text-slate-400 font-mono">#{striker.player.no}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>SR: {striker.strikeRate.toFixed(1)} · 4s: {striker.fours} · 6s: {striker.sixes}</span>
            <span>★ at {striker.player.starRuns || 20}r</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-white/5">
            <span className="text-[10px] text-slate-400">Sheet Role:</span>
            <select
              value={striker.sheetRoleOverride || 'auto'}
              onChange={e => {
                const val = e.target.value as any;
                const updated = { ...match };
                const inn = updated.currentInningsNo === 1 ? updated.innings1 : updated.innings2;
                inn.battingCard[inn.strikerIndex].sheetRoleOverride = val;
                onUpdateMatch(updated);
                storage.saveMatch(updated);
              }}
              className="bg-[#101410] text-xs text-white border border-white/10 rounded-lg px-2 py-0.5 outline-none"
            >
              <option value="auto">Auto</option>
              <option value="ignore">Ignore Star/Opener/Finisher</option>
              <option value="treat_finisher">Treat as Finisher</option>
              <option value="force_star">Force Star ★</option>
            </select>
          </div>
        </div>

        {/* Non-Striker Role */}
        <div className="bg-[#191d18] p-3 rounded-2xl border border-white/5 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white">Non-Striker: {nonStriker.player.name}</span>
            <span className="text-[10px] text-slate-400 font-mono">#{nonStriker.player.no}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>SR: {nonStriker.strikeRate.toFixed(1)} · 4s: {nonStriker.fours} · 6s: {nonStriker.sixes}</span>
            <span>★ at {nonStriker.player.starRuns || 20}r</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-white/5">
            <span className="text-[10px] text-slate-400">Sheet Role:</span>
            <select
              value={nonStriker.sheetRoleOverride || 'auto'}
              onChange={e => {
                const val = e.target.value as any;
                const updated = { ...match };
                const inn = updated.currentInningsNo === 1 ? updated.innings1 : updated.innings2;
                inn.battingCard[inn.nonStrikerIndex].sheetRoleOverride = val;
                onUpdateMatch(updated);
                storage.saveMatch(updated);
              }}
              className="bg-[#101410] text-xs text-white border border-white/10 rounded-lg px-2 py-0.5 outline-none"
            >
              <option value="auto">Auto</option>
              <option value="ignore">Ignore Star/Opener/Finisher</option>
              <option value="treat_finisher">Treat as Finisher</option>
              <option value="force_star">Force Star ★</option>
            </select>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* 1. Bowler Select Modal */}
      {showBowlerModal && (
        <BowlerSelectModal
          overNumber={currentOverNo}
          totalOvers={totalOvers}
          is5Overs={is5Overs}
          ground={match.ground}
          bowlingSquad={fieldingInnings.team.players}
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

      {/* 2. DRS Review Modal */}
      {showDrsModal && pendingWicketInfo && (
        <DrsModal
          captainName={currentInnings.team.captain}
          batsmanName={striker.player.name}
          bowlerName={currentBowlerFig.player.name}
          wicketType={pendingWicketInfo.type}
          onDecision={(isNotOut, rolledDie) => {
            setShowDrsModal(false);

            // Spend 1 reroll
            const updated = { ...match };
            const teamId = currentInnings.team.id;
            if (updated.powerCardsRemaining[teamId]) {
              updated.powerCardsRemaining[teamId].reroll = Math.max(0, updated.powerCardsRemaining[teamId].reroll - 1);
            }

            if (isNotOut) {
              // Decision Overturned: Dot ball!
              const lastDel = updated.currentInningsNo === 1 ? updated.innings1.deliveries.pop() : updated.innings2.deliveries.pop();
              const inn = updated.currentInningsNo === 1 ? updated.innings1 : updated.innings2;
              inn.wickets = Math.max(0, inn.wickets - 1);
              inn.fallOfWickets.pop();
              striker.isOut = false;
              striker.dismissal = undefined;

              // Record as dot ball delivery
              recordDelivery({
                runs: 0,
                isDot: true,
                bowlingRedDie: pendingBowlingRoll?.redDie || 'A',
                bowlingBlueDie: pendingBowlingRoll?.blueDie || 1,
                bowlingResult: 'DRS_NOT_OUT',
                tag: '•'
              });

              setDrsSuccessData({
                batsmanName: striker.player.name,
                bowlerName: currentBowlerFig.player.name,
                wicketType: pendingWicketInfo.type,
                rolledDie: rolledDie
              });
              setShowDrsSuccessOverlay(true);
              soundEngine.playDrsSuccess();
              setCallout(`DRS OVERTURNED! Die rolled ${rolledDie} (5-6) -> NOT OUT!`);
            } else {
              soundEngine.playWicket();
              setCallout(`DRS UPHELD! Die rolled ${rolledDie} -> OUT CONFIRMED.`);
            }

            onUpdateMatch(updated);
            storage.saveMatch(updated);
          }}
          onCancel={() => setShowDrsModal(false)}
        />
      )}

      {/* 3. DRS Success Celebration Overlay */}
      {showDrsSuccessOverlay && (
        <DrsSuccessOverlay
          isOpen={showDrsSuccessOverlay}
          batsmanName={drsSuccessData.batsmanName}
          bowlerName={drsSuccessData.bowlerName}
          wicketType={drsSuccessData.wicketType}
          rolledDie={drsSuccessData.rolledDie}
          onClose={() => setShowDrsSuccessOverlay(false)}
        />
      )}

      {/* 4. Power Card Modal */}
      {showPowerModal && (
        <PowerCardModal
          type={showPowerModal}
          captainName={showPowerModal === 'great_delivery' ? fieldingInnings.team.captain : currentInnings.team.captain}
          isBattingCaptain={showPowerModal !== 'great_delivery'}
          onExecuteWonderfulShot={(res) => {
            setShowPowerModal(null);
            const updated = { ...match };
            const teamId = currentInnings.team.id;
            if (updated.powerCardsRemaining[teamId]) {
              updated.powerCardsRemaining[teamId].wonderfulShot = Math.max(0, updated.powerCardsRemaining[teamId].wonderfulShot - 1);
            }
            recordDelivery({
              runs: res.runs,
              bowlingRedDie: pendingBowlingRoll?.redDie || 'A',
              bowlingBlueDie: pendingBowlingRoll?.blueDie || 1,
              bowlingResult: 'WS',
              battingRedDie: res.redDie,
              battingBlueDie: res.blueDie,
              battingResult: `${res.runs}`,
              tag: `${res.runs}`
            });
            setCallout(`WONDERFUL SHOT! ${res.runs} runs scored!`);
            onUpdateMatch(updated);
            storage.saveMatch(updated);
          }}
          onExecuteGreatDelivery={(res) => {
            setShowPowerModal(null);
            const updated = { ...match };
            const teamId = fieldingInnings.team.id;
            if (updated.powerCardsRemaining[teamId]) {
              updated.powerCardsRemaining[teamId].greatDelivery = Math.max(0, updated.powerCardsRemaining[teamId].greatDelivery - 1);
            }
            if (res.outcome === 'X') {
              setCurrentStep('wicketCard');
              setCallout("GREAT DELIVERY struck! Wicket (X) chance! Draw Wicket card.");
            } else if (res.outcome === 'D') {
              recordDelivery({
                runs: 0,
                isDot: true,
                bowlingRedDie: res.redDie,
                bowlingBlueDie: res.blueDie,
                bowlingResult: 'D',
                tag: '•'
              });
              setCallout("GREAT DELIVERY produced a lethal Dot ball!");
            }
            onUpdateMatch(updated);
            storage.saveMatch(updated);
          }}
          onExecuteReroll={(mode: 'both' | 'red_only' | 'blue_only') => {
            setShowPowerModal(null);
            const updated = { ...match };
            const teamId = currentStep === 'bat' ? currentInnings.team.id : fieldingInnings.team.id;
            if (updated.powerCardsRemaining[teamId]) {
              updated.powerCardsRemaining[teamId].reroll = Math.max(0, updated.powerCardsRemaining[teamId].reroll - 1);
            }
            onUpdateMatch(updated);
            storage.saveMatch(updated);
            if (mode === 'both') {
              setCallout("Reroll chosen! Re-rolling both dice now.");
            } else {
              setHalfRerollKeptDie(mode === 'red_only' ? 'blue' : 'red');
              setCallout(`Half Reroll chosen! Kept one die locked. Ready to re-roll.`);
            }
          }}
          onClose={() => setShowPowerModal(null)}
        />
      )}

      {/* 5. Super Over Modal (Section 9) */}
      {showSuperOverModal && (
        <SuperOverModal
          match={match}
          superOverNumber={match.superOversHistory ? match.superOversHistory.length + 1 : 1}
          isKnockout={!!match.tournamentId}
          onStartSuperOver={(config) => {
            setShowSuperOverModal(false);
            const updated = { ...match };
            updated.isSuperOver = true;
            // Initialize 1 over for each team
            const teamAId = updated.teamA.id;
            const teamBId = updated.teamB.id;
            const batFirstId = config.battingFirstTeamId;
            const bowlFirstId = batFirstId === teamAId ? teamBId : teamAId;

            const initSuperOverInnings = (tId: string) => {
              const team = tId === teamAId ? updated.teamA : updated.teamB;
              const batsmen = config.team3Batsmen[tId] || team.players.slice(0, 3);
              const bowler = config.teamBowler[tId === teamAId ? teamBId : teamAId];
              return {
                team,
                score: 0,
                wickets: 0,
                completedOvers: 0,
                ballsInCurrentOver: 0,
                deliveries: [],
                battingCard: batsmen.map((p, idx) => ({
                  player: p,
                  runs: 0,
                  balls: 0,
                  fours: 0,
                  sixes: 0,
                  isOut: false,
                  strikeRate: 0,
                  battingOrder: idx + 1
                })),
                bowlingFigures: [
                  { player: bowler, overs: 0, maidens: 0, runsConceded: 0, wickets: 0, dots: 0, economy: 0 }
                ],
                fallOfWickets: [],
                extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, total: 0 },
                strikerIndex: 0,
                nonStrikerIndex: 1,
                currentBowlerName: bowler.name,
                lastBowlerName: null,
                isCompleted: false
              };
            };

            updated.innings1 = initSuperOverInnings(batFirstId);
            updated.innings2 = initSuperOverInnings(bowlFirstId);
            updated.currentInningsNo = 1;
            updated.targetRuns = null;
            updated.status = 'IN_PROGRESS';
            setCallout(`Super Over commenced! ${updated.innings1.team.name} batting first.`);
            onUpdateMatch(updated);
            storage.saveMatch(updated);
          }}
          onLeaveAsTie={() => {
            setShowSuperOverModal(false);
            const updated = { ...match, status: 'COMPLETED' as const, winDescription: "Match ended in a Tie." };
            onUpdateMatch(updated);
            storage.saveMatch(updated);
          }}
        />
      )}

      {/* 6. Delete Match Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#141814] border border-red-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-red-400">
              <Trash2 className="w-5 h-5" />
              <h3 className="text-base font-black text-white">Delete This Match?</h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete this match between <strong>{match.teamA.code}</strong> and <strong>{match.teamB.code}</strong>?
              {match.tournamentId && " This will reset the tournament fixture back to unplayed."}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-full text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCurrentMatch}
                className="px-5 py-2 rounded-full text-xs font-black bg-red-600 hover:bg-red-500 text-white uppercase tracking-wider"
              >
                Delete Match
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Batting Order Modal */}
      {showBattingOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#141814] border border-[#272b26] rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="text-sm font-black text-white uppercase">Batting Order · {currentInnings.team.name}</h3>
              <button onClick={() => setShowBattingOrderModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-1.5">
              {currentInnings.battingCard.map((entry, idx) => (
                <div
                  key={entry.player.no}
                  className={`flex items-center justify-between p-2 rounded-xl border text-xs ${
                    idx === currentInnings.strikerIndex ? 'bg-[#c3f400]/15 border-[#c3f400]/40 text-[#c3f400]' :
                    idx === currentInnings.nonStrikerIndex ? 'bg-white/10 border-white/20 text-white' :
                    entry.isOut ? 'bg-[#101410] opacity-50 border-white/5 text-slate-500' :
                    'bg-[#191d18] border-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold w-5">#{idx + 1}</span>
                    <span className="font-bold">{entry.player.name}</span>
                    {idx === currentInnings.strikerIndex && <span className="text-[10px] bg-[#c3f400] text-black px-1 rounded font-black">STRIKE</span>}
                    {idx === currentInnings.nonStrikerIndex && <span className="text-[10px] bg-white text-black px-1 rounded font-black">NON-STR</span>}
                  </div>
                  <span className="font-mono">{entry.runs} ({entry.balls}b)</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowBattingOrderModal(false)}
              className="w-full py-2.5 rounded-full bg-[#191d18] hover:bg-[#232821] text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
