import fs from 'fs';
import path from 'path';

const COUNTRY_NAMES: Record<string, string> = {
  RKS: 'Kosovo',
  D: 'Deutschland',
  A: 'Österreich',
  CH: 'Schweiz',
  F: 'Frankreich',
  I: 'Italien',
  NL: 'Niederlande',
  PL: 'Polen',
  CZ: 'Tschechien',
  E: 'Spanien',
  GB: 'Großbritannien',
  UK: 'Großbritannien',
  AL: 'Albanien',
  HR: 'Kroatien',
  S: 'Schweden',
  DK: 'Dänemark',
  B: 'Belgien',
  GR: 'Griechenland',
  N: 'Norwegen',
  FIN: 'Finnland',
  IRL: 'Irland',
  P: 'Portugal',
  H: 'Ungarn',
  RO: 'Rumänien',
  BG: 'Bulgarien',
  SK: 'Slowakei',
  SLO: 'Slowenien',
  EST: 'Estland',
  LV: 'Lettland',
  LT: 'Litauen',
  BIH: 'Bosnien & Herzegowina',
  SRB: 'Serbien',
  MNE: 'Montenegro',
  NMK: 'Nordmazedonien',
  IS: 'Island',
  TR: 'Türkei',
  UA: 'Ukraine',
  L: 'Luxemburg',
  CHN: 'China',
  CY: 'Zypern',
  FL: 'Liechtenstein',
  LAR: 'Libyen',
  M: 'Malta',
  MA: 'Marokko',
  MD: 'Moldau',
  OM: 'Oman',
  TN: 'Tunesien',
  UAE: 'Ver. Arab. Emirate',
  UZ: 'Usbekistan',
  NGR: 'Nigeria',
  IL: 'Israel',
  RL: 'Libanon',
  ROK: 'Südkorea',
  KZ: 'Kasachstan',
  IR: 'Iran',
  SGP: 'Singapur',
};

const STAGES = ['harder', 'hard', 'easy', 'solution'];

/**
 * Copies source directory contents to destination directory
 */
function copyDirSync(src: string, dest: string) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export function scanDirectories() {
  const projectRoot = process.cwd();
  const rootDir = path.resolve(projectRoot, 'kennzeichen_game');
  const publicDir = path.resolve(projectRoot, 'public', 'kennzeichen_game');

  // Synchronize from root to public if root exists (e.g. user uploaded to /kennzeichen_game)
  if (fs.existsSync(rootDir)) {
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // If root has subfolders, sync them into public
    const subfolders = fs.readdirSync(rootDir, { withFileTypes: true });
    for (const sub of subfolders) {
      if (!sub.isDirectory()) continue;
      const srcSub = path.join(rootDir, sub.name);
      const destSub = path.join(publicDir, sub.name);

      // Clean dest if src was modified
      if (fs.existsSync(destSub)) {
        // remove existing files in destSub to avoid stale deleted files
        const destFiles = fs.readdirSync(destSub);
        for (const df of destFiles) {
          fs.unlinkSync(path.join(destSub, df));
        }
      }
      copyDirSync(srcSub, destSub);
    }
  }

  // Scan public directory (which now has all active files)
  const scanTarget = fs.existsSync(publicDir) ? publicDir : rootDir;
  const platesMap = new Map<
    string,
    {
      oval: string;
      number: number;
      countryName: string;
      stages: Record<string, string>;
    }
  >();

  if (fs.existsSync(scanTarget)) {
    const subfolders = fs.readdirSync(scanTarget, { withFileTypes: true });
    for (const sub of subfolders) {
      if (!sub.isDirectory()) continue;
      const oval = sub.name.toUpperCase();
      const folderPath = path.join(scanTarget, sub.name);

      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        // Match schema: OVAL[NUM]_[STAGE][optional space/number].ext
        const match = file.match(/^([A-Z0-9]+?)(?:(\d+))?_([a-zA-Z]+)(?:\s*\d*)?\.(jpe?g|png|webp)$/i);
        if (!match) continue;

        const [, , numStr, stageRaw] = match;
        const num = numStr ? parseInt(numStr, 10) : 1;
        let stage = stageRaw.toLowerCase();
        if (stage === 'original') stage = 'solution';

        const plateKey = `${oval}${num}`;

        if (!STAGES.includes(stage)) continue;

        if (!platesMap.has(plateKey)) {
          platesMap.set(plateKey, {
            oval,
            number: num,
            countryName: COUNTRY_NAMES[oval] || oval,
            stages: {},
          });
        }

        const entry = platesMap.get(plateKey)!;
        // Exact case-sensitive URL path
        entry.stages[stage] = `/kennzeichen_game/${sub.name}/${file}`;
      }
    }
  }

  const plates = Array.from(platesMap.values());
  const manifest = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    plates,
  };

  // Write manifest.json to both public and root
  const candidates = [publicDir, rootDir];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) {
      const outPath = path.join(dir, 'manifest.json');
      fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));
      console.log(`Manifest updated at: ${outPath} (${plates.length} plates detected)`);
    }
  }

  return manifest;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  scanDirectories();
}
