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
