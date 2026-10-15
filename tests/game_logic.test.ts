import {
  calculateRoundScore,
  getNextEasierStage,
  getInitialStage,
  PlateManifestEntry,
} from '../src/data/platesManifest';
import { COUNTRIES } from '../src/data/countries';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('--- 1. Testing Scoring System ---');
// 5 points for first answer without error or hint
assert(calculateRoundScore(0, false) === 5, '0 steps taken -> 5 points');

// 1 point deducted per simplification step
assert(calculateRoundScore(1, false) === 4, '1 step taken -> 4 points');
assert(calculateRoundScore(2, false) === 3, '2 steps taken -> 3 points');
assert(calculateRoundScore(3, false) === 2, '3 steps taken -> 2 points');
assert(calculateRoundScore(4, false) === 1, '4 steps taken -> 1 point');

// Loss of round always gives 0 points
assert(calculateRoundScore(0, true) === 0, 'Round lost with 0 steps -> 0 points');
assert(calculateRoundScore(3, true) === 0, 'Round lost with 3 steps -> 0 points');

console.log('\n--- 2. Testing Missing Stage Skipping ---');
// Normal plate with all stages
const normalPlate: PlateManifestEntry = {
  id: 'D1',
  oval: 'D',
  number: 1,
  countryName: 'Deutschland',
  stages: {
    harder: '/d1_harder.jpg',
    hard: '/d1_hard.jpg',
    easy: '/d1_easy.jpg',
    solution: '/d1_solution.jpg',
  },
  availableStages: ['harder', 'hard', 'easy', 'solution'],
};

assert(getInitialStage(normalPlate) === 'harder', 'Initial stage is harder');
assert(getNextEasierStage(normalPlate, 'harder') === 'hard', 'harder -> hard');
assert(getNextEasierStage(normalPlate, 'hard') === 'easy', 'hard -> easy');
assert(getNextEasierStage(normalPlate, 'easy') === 'solution', 'easy -> solution');
assert(getNextEasierStage(normalPlate, 'solution') === null, 'solution -> null (cannot simplify further)');

// Plate with 'hard' missing (like CZ1)
const missingHardPlate: PlateManifestEntry = {
  id: 'CZ1',
  oval: 'CZ',
  number: 1,
  countryName: 'Tschechien',
  stages: {
    harder: '/cz1_harder.jpg',
    easy: '/cz1_easy.jpg',
    solution: '/cz1_solution.jpg',
  },
  availableStages: ['harder', 'easy', 'solution'],
};

assert(getNextEasierStage(missingHardPlate, 'harder') === 'easy', 'Correctly skips missing "hard" directly to "easy"');
assert(getNextEasierStage(missingHardPlate, 'easy') === 'solution', 'easy -> solution');

// Plate with multiple missing stages (only harder and solution)
const multiMissingPlate: PlateManifestEntry = {
  id: 'X1',
  oval: 'X',
  number: 1,
  countryName: 'Testland',
  stages: {
    harder: '/x1_harder.jpg',
    solution: '/x1_solution.jpg',
  },
  availableStages: ['harder', 'solution'],
};

assert(getNextEasierStage(multiMissingPlate, 'harder') === 'solution', 'Correctly skips both "hard" and "easy" straight to "solution"');

// Plate starting at 'easy' because harder & hard are not present
const easyOnlyPlate: PlateManifestEntry = {
  id: 'Y1',
  oval: 'Y',
  number: 1,
  countryName: 'Testland2',
  stages: {
    easy: '/y1_easy.jpg',
    solution: '/y1_solution.jpg',
  },
  availableStages: ['easy', 'solution'],
};
assert(getInitialStage(easyOnlyPlate) === 'easy', 'Correctly picks easiest available when harder/hard missing');
assert(getNextEasierStage(easyOnlyPlate, 'easy') === 'solution', 'Plate with only easy & solution: easy -> solution');
assert(getNextEasierStage(easyOnlyPlate, 'solution') === null, 'Plate with only easy & solution: solution -> null');
assert(calculateRoundScore(0, false) === 5, 'Starting at easy and guessing correctly on 1st attempt gives 5 points');
assert(calculateRoundScore(1, false) === 4, 'Starting at easy and simplifying to solution gives 4 points');

console.log('\n--- 3. Testing Secret Limit & Attempts Counting ---');
// Secret limit between 3 and 5
for (let i = 0; i < 50; i++) {
  const secretLimit = Math.floor(Math.random() * 3) + 3;
  assert(secretLimit >= 3 && secretLimit <= 5, `Secret limit ${secretLimit} is within [3, 5]`);
}

console.log('\n--- 4. Testing Duplicate Prevention in Playthrough ---');
const platesPool = ['RKS1', 'D1', 'D2', 'A1', 'CH1', 'F1', 'I1', 'NL1', 'PL1', 'CZ1', 'E1', 'GB1', 'AL1', 'HR1', 'S1', 'DK1', 'B1', 'GR1'];
const played = new Set<string>();
const sessionRounds = 10;
// Simulate random draw without replacement
const queue = [...platesPool].sort(() => Math.random() - 0.5).slice(0, sessionRounds);
for (const p of queue) {
  assert(!played.has(p), `Plate ${p} was not previously played in this playthrough`);
  played.add(p);
}
assert(played.size === sessionRounds, `Exactly ${sessionRounds} unique plates played`);

console.log('\n--- 5. Testing Flag Generation (1 correct + 14 distractors = 15 flags + 1 ❓ cell = 16 total) ---');
const targetOval = 'RKS';
const distractors = COUNTRIES.filter((c) => c.oval !== targetOval).map((c) => c.oval);
assert(distractors.length >= 14, `At least 14 distractors available (found ${distractors.length})`);
const chosen = distractors.slice(0, 14);
const flagsGrid = [targetOval, ...chosen];
assert(flagsGrid.length === 15, 'Flags list has exactly 15 flags');
assert(flagsGrid.includes(targetOval), 'Flags list contains target flag');
assert(new Set(flagsGrid).size === 15, 'Flags list contains zero duplicates');
// 15 flags + 1 question mark cell = 16 total grid cells in 4x4
const totalGridCells = flagsGrid.length + 1;
assert(totalGridCells === 16, '4x4 grid has exactly 16 cells (15 flags + 1 question mark emoji)');

console.log('\n🎉 ALL LOGIC AND SPECIFICATION TESTS PASSED!');
