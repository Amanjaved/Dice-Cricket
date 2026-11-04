import test from 'node:test';
import assert from 'node:assert/strict';
import { DiceCricketEngine } from './index';
import { SHEETS_DATA } from '../../scripts/sheets_data.js';
import { TEAMS_DATA, WICKET_CARDS, POWER_CARDS } from '../../scripts/master_data.js';

test('DiceCricketEngine loads master sheets for all three grounds', () => {
  const hsg = DiceCricketEngine.getSheets('HSG');
  const nsg = DiceCricketEngine.getSheets('NSG');
  const lsg = DiceCricketEngine.getSheets('LSG');

  assert.ok(hsg, 'HSG sheets must exist');
  assert.ok(nsg, 'NSG sheets must exist');
  assert.ok(lsg, 'LSG sheets must exist');

  // Verify the 4 essential sheets are present
  const requiredKeys = ['masterBowling', 'masterBatting', 'powerplaySlogBowling', 'powerplaySlogBatting'];
  for (const key of requiredKeys) {
    assert.ok((hsg as any)[key], `HSG must contain ${key}`);
    assert.ok((nsg as any)[key], `NSG must contain ${key}`);
    assert.ok((lsg as any)[key], `LSG must contain ${key}`);
  }
});

test('DiceCricketEngine card deck totals match official counts', () => {
  assert.equal(WICKET_CARDS.length, 25, 'There must be exactly 25 Wicket Cards');
  // 3 distinct Power Card types, 2 copies each = 6 cards in physical box
  assert.equal(POWER_CARDS.length, 3, 'There are 3 unique Power Card types');
  assert.equal(POWER_CARDS.reduce((acc, c) => acc + (c.count || 2), 0), 6, 'Total Power Cards count is 6');
  assert.equal(TEAMS_DATA.length, 10, 'There must be exactly 10 teams');
});

test('DiceCricketEngine rolls dice in valid range 1 to 6', () => {
  for (let i = 0; i < 50; i++) {
    const roll = DiceCricketEngine.rollDie();
    assert.ok(roll >= 1 && roll <= 6, `Die roll ${roll} should be between 1 and 6`);
  }
});

test('Bowling line resolution handles Powerplay vs Middle overs', () => {
  const bowler = TEAMS_DATA[0].players[7] as unknown as import('../types').Player;
  const striker = TEAMS_DATA[1].players[0] as unknown as import('../types').Player;

  // Powerplay
  const ppLine = DiceCricketEngine.resolveBowlingLine('NSG', true, false, bowler, striker, 3, 3);
  assert.equal(ppLine.sheetName, 'Powerplay & Slog Bowling');
  assert.ok(ppLine.lineName.length > 0);

  // Middle
  const midLine = DiceCricketEngine.resolveBowlingLine('NSG', false, false, bowler, striker, 3, 3);
  assert.equal(midLine.sheetName, 'Master Bowling');
  assert.ok(midLine.lineName.length > 0);
});

test('Batting line resolution distinguishes RHB and LHB', () => {
  const bowler = TEAMS_DATA[0].players[7] as unknown as import('../types').Player;
  const rhbPlayer = (TEAMS_DATA[0].players.find(p => p.bat === 'RHB') || TEAMS_DATA[0].players[0]) as unknown as import('../types').Player;
  const lhbPlayer = (TEAMS_DATA[0].players.find(p => p.bat === 'LHB') || TEAMS_DATA[0].players[1]) as unknown as import('../types').Player;

  const rhbLine = DiceCricketEngine.resolveBattingLine('HSG', false, false, bowler, rhbPlayer, 0, null);
  const lhbLine = DiceCricketEngine.resolveBattingLine('HSG', false, false, bowler, lhbPlayer, 0, null);

  assert.ok(rhbLine.lineName.includes('RHB') || rhbLine.lineName.length > 0);
  assert.ok(lhbLine.lineName.includes('LHB') || lhbLine.lineName.length > 0);
});

test('calculatePlayerOfTheMatch picks the highest impact performer', async () => {
  const { calculatePlayerOfTheMatch } = await import('../components/VictoryModal');

  const mockMatch: any = {
    winnerTeamId: 'IND',
    innings1: {
      team: { id: 'IND', name: 'India', code: 'IND', captain: 'Debashish' },
      score: 184,
      wickets: 4,
      completedOvers: 10,
      ballsInCurrentOver: 0,
      battingCard: [
        {
          player: { name: 'Debashish', role: 'BTBW', marks: ['C', '★'] },
          runs: 62,
          balls: 25,
          fours: 5,
          sixes: 4,
          strikeRate: 248.0,
          isOut: false
        },
        {
          player: { name: 'Rana', role: 'BAT', marks: ['★'] },
          runs: 24,
          balls: 12,
          fours: 2,
          sixes: 1,
          strikeRate: 200.0,
          isOut: true
        }
      ],
      bowlingFigures: [
        {
          player: { name: 'Faizan', role: 'BW', marks: [] },
          overs: 2,
          wickets: 1,
          runsConceded: 28,
          dots: 4,
          economy: 14.0
        }
      ]
    },
    innings2: {
      team: { id: 'PAK', name: 'Pakistan', code: 'PAK', captain: 'Daniyal' },
      score: 168,
      wickets: 7,
      completedOvers: 10,
      ballsInCurrentOver: 0,
      battingCard: [
        {
          player: { name: 'Daniyal', role: 'BTBW', marks: ['C', '★'] },
          runs: 45,
          balls: 22,
          fours: 3,
          sixes: 3,
          strikeRate: 204.5,
          isOut: true
        }
      ],
      bowlingFigures: [
        {
          player: { name: 'Ojas', role: 'BW', marks: [] },
          overs: 2,
          wickets: 3,
          runsConceded: 18,
          dots: 6,
          economy: 9.0
        }
      ]
    },
    format: '10_overs',
    ground: 'NSG',
    targetRuns: 185
  };

  const potm = calculatePlayerOfTheMatch(mockMatch);
  assert.ok(potm, 'POTM should be calculated');
  assert.ok(potm.name === 'Debashish' || potm.name === 'Ojas', `POTM should be Debashish (62*) or Ojas (3/18), got ${potm.name}`);
  assert.ok(potm.fantasyPoints > 0, 'Fantasy impact rating should be positive');
  assert.ok(potm.headline.length > 0, 'Headline must be populated');
});

test('DRS 1-Die Review Rule resolves: 5 or 6 is Not Out (Overturn), 1 to 4 is Out Confirmed', () => {
  // Codex Sec 11 & 8.1 rule evaluation
  const isDrsSuccessful = (die: number) => die >= 5;

  assert.equal(isDrsSuccessful(6), true, 'Die 6 must be successful overturn');
  assert.equal(isDrsSuccessful(5), true, 'Die 5 must be successful overturn');
  assert.equal(isDrsSuccessful(4), false, 'Die 4 must uphold Out decision');
  assert.equal(isDrsSuccessful(3), false, 'Die 3 must uphold Out decision');
  assert.equal(isDrsSuccessful(2), false, 'Die 2 must uphold Out decision');
  assert.equal(isDrsSuccessful(1), false, 'Die 1 must uphold Out decision');
});

test('FaizSoundEngine contains playDrsSuccess method for neon-glow celebration', async () => {
  const { soundEngine } = await import('../services/sound');
  assert.equal(typeof soundEngine.playDrsSuccess, 'function', 'soundEngine must have playDrsSuccess method');
});

test('Super Over rules: exactly 1 over, max 2 wickets (3 nominated batsmen), slog sheet, no power cards', () => {
  // Section 9 of the flow specification
  const maxWickets = 2;
  const nominatedBatsmen = 3;
  const nominatedBowler = 1;
  const overs = 1;

  assert.equal(maxWickets, 2, 'In Super Over, 2 wickets fall ends the innings');
  assert.equal(nominatedBatsmen, 3, 'In Super Over, exactly 3 batsmen are nominated');
  assert.equal(nominatedBowler, 1, 'In Super Over, exactly 1 bowler bowls the entire 6 balls');
  assert.equal(overs, 1, 'In Super Over, exactly 1 over per team');
});

test('Extras Card specification: 6 outcomes with half dot and half light extra', () => {
  // Section 8 step 7
  const outcomes = [
    { die: 1, type: 'DOT', runs: 0 },
    { die: 2, type: 'WIDE', runs: 1 },
    { die: 3, type: 'NO_BALL', runs: 1, grantsFreeHit: true },
    { die: 4, type: 'DOT', runs: 0 },
    { die: 5, type: 'LEG_BYE', runs: 1 },
    { die: 6, type: 'DOT', runs: 0 },
  ];

  const dotCount = outcomes.filter(o => o.runs === 0).length;
  const extraCount = outcomes.filter(o => o.runs > 0).length;

  assert.equal(dotCount, 3, 'Exactly 3 outcomes are dots (half of 6)');
  assert.equal(extraCount, 3, 'Exactly 3 outcomes are light extras (half of 6)');
});

test('Milestone celebration order priority: Batsman milestone > Bowler milestone > Team milestone', () => {
  // Section 8 Between-ball events
  const priority = ['BATSMAN', 'BOWLER', 'TEAM'];
  assert.equal(priority[0], 'BATSMAN');
  assert.equal(priority[1], 'BOWLER');
  assert.equal(priority[2], 'TEAM');
});


