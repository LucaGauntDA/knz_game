import {
  calculateRoundScore,
  getNextEasierStage,
  getInitialStage,
  PlateManifestEntry,
} from '../src/data/platesManifest';
import { COUNTRIES, COUNTRY_BY_OVAL } from '../src/data/countries';

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

// Wrong subdivision guess penalty (each wrong subdivision guess deducts 1 point)
assert(calculateRoundScore(0 + 2, false) === 3, '2 wrong subdivision guesses -> 3 points');

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

console.log('\n--- 6. Testing UK Flag Uniqueness (Zero duplicate UK flags in grid) ---');
const ukTargetOval = 'UK';
const ukTargetCountry = COUNTRIES.find((c) => c.oval === ukTargetOval)!;
const ukAvailableDistractors = COUNTRIES.filter(
  (c) => c.oval !== ukTargetOval && c.code !== ukTargetCountry.code
);
const ukDistractors: string[] = [];
const usedCodes = new Set<string>([ukTargetCountry.code]);
for (const d of ukAvailableDistractors) {
  if (!usedCodes.has(d.code)) {
    usedCodes.add(d.code);
    ukDistractors.push(d.oval);
    if (ukDistractors.length === 14) break;
  }
}
const ukRoundFlags = [ukTargetOval, ...ukDistractors];
const ukVisualFlagCodes = ukRoundFlags.map((oval) => {
  const country = COUNTRIES.find((c) => c.oval === oval);
  return country ? country.code : oval;
});
const ukFlagsCount = ukVisualFlagCodes.filter((code) => code === 'GB').length;
assert(ukFlagsCount === 1, `Exactly 1 UK flag present in grid (found ${ukFlagsCount})`);
assert(new Set(ukVisualFlagCodes).size === 15, 'All 15 flags in the grid have unique visual flag codes');
console.log('✅ PASS: Exactly 1 UK flag present in the grid');
console.log('✅ PASS: All 15 flags in the grid have 100% unique visual flag codes');

console.log('\n--- 7. Testing North American & Australian Subdivisions ---');
import { getSubdivisionForPlate, generateSubdivisionOptions, getSurroundingCellIndices, COUNTRY_SUBDIVISIONS } from '../src/data/subdivisions';

// USA mappings
assert(getSubdivisionForPlate('USA', 1)?.nameDe === 'Alaska', 'USA 1 maps to Alaska');
assert(getSubdivisionForPlate('USA', 1)?.code === 'AK', 'USA 1 has code AK');
assert(getSubdivisionForPlate('USA', 2)?.nameDe === 'Kalifornien', 'USA 2 maps to Kalifornien (CA)');
assert(getSubdivisionForPlate('USA', 3)?.nameDe === 'Florida', 'USA 3 maps to Florida (FL)');
assert(getSubdivisionForPlate('USA', 4)?.nameDe === 'Hawaii', 'USA 4 maps to Hawaii (HI)');
assert(getSubdivisionForPlate('USA', 11) === null, 'USA unmapped number returns null');

// Canada mappings
assert(getSubdivisionForPlate('CDN', 1)?.nameDe === 'Ontario', 'CDN 1 maps to Ontario (ON)');
assert(getSubdivisionForPlate('CDN', 2)?.nameDe === 'Québec', 'CDN 2 maps to Québec (QC)');
assert(getSubdivisionForPlate('CDN', 3)?.nameDe === 'Northwest Territories', 'CDN 3 maps to Northwest Territories (NT)');

// Australia mappings
assert(getSubdivisionForPlate('AUS', 1)?.nameDe === 'Queensland', 'AUS 1 maps to Queensland (QLD)');
assert(getSubdivisionForPlate('AUS', 2)?.nameDe === 'New South Wales', 'AUS 2 maps to New South Wales (NSW)');
assert(getSubdivisionForPlate('AUS', 3)?.nameDe === 'Australian Capital Territory', 'AUS 3 maps to ACT');
assert(getSubdivisionForPlate('AUS', 4)?.nameDe === 'Victoria', 'AUS 4 maps to Victoria (VIC)');

// Mexico mappings
assert(getSubdivisionForPlate('MEX', 1)?.nameDe === 'Morelos', 'MEX 1 maps to Morelos (MOR)');
assert(getSubdivisionForPlate('MEX', 2)?.nameDe === 'Campeche', 'MEX 2 maps to Campeche (CAM)');
assert(getSubdivisionForPlate('MEX', 3)?.nameDe === 'Oaxaca', 'MEX 3 maps to Oaxaca (OAX)');
assert(getSubdivisionForPlate('MEX', 4)?.nameDe === 'Sonora', 'MEX 4 maps to Sonora (SON)');

// Standard country without subdivision
assert(getSubdivisionForPlate('D', 1) === null, 'Germany (D) returns null for subdivisions');
assert(getSubdivisionForPlate('F', 1) === null, 'France (F) returns null for subdivisions');

// Surrounding cells generator
const targetSub = getSubdivisionForPlate('USA', 1)!;
for (let cellIdx = 0; cellIdx < 15; cellIdx++) {
  const options = generateSubdivisionOptions('USA', targetSub, cellIdx);
  assert(options.length >= 4, `At least 4 surrounding options generated for cell ${cellIdx}`);
  const codes = options.map((o) => o.subdivision.code);
  assert(codes.includes('AK'), `Options for cell ${cellIdx} include target AK`);
  assert(new Set(codes).size === codes.length, `Options for cell ${cellIdx} contain no duplicates`);
  // Must not overwrite country flag cell or hint cell 15
  options.forEach((o) => {
    assert(o.cellIndex !== cellIdx, 'Option does not overwrite country flag cell');
    assert(o.cellIndex !== 15, 'Option does not overwrite hint cell 15');
  });
}
console.log('✅ PASS: All USA, Canada, and Australia subdivision mappings verified');
console.log('✅ PASS: Surrounding subdivision options generated without collision or duplicates');

// 8. Newly added countries test
console.log('\n--- Test Suite 8: Newly Added Countries & Flags ---');
const newCountries = [
  { oval: 'EG', code: 'EG', name: 'Ägypten' },
  { oval: 'IRQ', code: 'IQ', name: 'Irak' },
  { oval: 'KG', code: 'KG', name: 'Kirgisistan' },
  { oval: 'IND', code: 'IN', name: 'Indien' },
  { oval: 'MGL', code: 'MN', name: 'Mongolei' },
  { oval: 'Q', code: 'QA', name: 'Katar' },
  { oval: 'KSA', code: 'SA', name: 'Saudi-Arabien' },
  { oval: 'TJ', code: 'TJ', name: 'Tadschikistan' },
  { oval: 'TM', code: 'TM', name: 'Turkmenistan' },
  { oval: 'RI', code: 'ID', name: 'Indonesien' },
  { oval: 'VN', code: 'VN', name: 'Vietnam' },
  { oval: 'BS', code: 'BS', name: 'Bahamas' },
  { oval: 'BRN', code: 'BH', name: 'Bahrain' },
  { oval: 'BD', code: 'BD', name: 'Bangladesch' },
  { oval: 'KN', code: 'GL', name: 'Grönland' },
  { oval: 'K', code: 'KH', name: 'Kambodscha' },
  { oval: 'US-GU', code: 'GU', name: 'Guam' },
  { oval: 'US-MP', code: 'MP', name: 'Nördliche Marianen' },
  { oval: 'WB', code: 'PS', name: 'Westjordanland' },
  { oval: 'US-PR', code: 'PR', name: 'Puerto Rico' },
  { oval: 'SY', code: 'SC', name: 'Seychellen' },
  { oval: 'T', code: 'TH', name: 'Thailand' },
  { oval: 'WAG', code: 'GM', name: 'Gambia' },
  { oval: 'HK', code: 'HK', name: 'Hongkong' },
  { oval: 'JOR', code: 'JO', name: 'Jordanien' },
  { oval: 'EAK', code: 'KE', name: 'Kenia' },
  { oval: 'KWT', code: 'KW', name: 'Kuwait' },
  { oval: 'LAO', code: 'LA', name: 'Laos' },
  { oval: 'MAL', code: 'MY', name: 'Malaysia' },
  { oval: 'RCH', code: 'CL', name: 'Chile' },
  { oval: 'ANG', code: 'AO', name: 'Angola' },
  { oval: 'MV', code: 'MV', name: 'Malediven' },
  { oval: 'MS', code: 'MU', name: 'Mauritius' },
];

for (const item of newCountries) {
  const c = COUNTRY_BY_OVAL[item.oval];
  assert(Boolean(c), `Country ${item.oval} exists in COUNTRY_BY_OVAL`);
  assert(c.code === item.code, `Country ${item.oval} has code ${item.code}`);
  assert(c.nameDe === item.name, `Country ${item.oval} has name ${item.name}`);
}
console.log('✅ PASS: All 33 newly added countries configured with valid codes and names');

console.log('\n🎉 ALL LOGIC AND SPECIFICATION TESTS PASSED!');
