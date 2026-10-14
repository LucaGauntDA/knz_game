import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

interface PlateConfig {
  oval: string;
  number: number;
  countryName: string;
  plateText: string;
  bandColor?: string; // EU blue band or national flag strip
  bandText?: string;  // e.g. "RKS", "D", "A", "CH"
  bandSymbol?: 'stars' | 'shield' | 'none';
  hasRedBorder?: boolean;
  plateBg?: string; // usually white or yellow (GB rear, NL)
  textColor?: string;
  fontFamily?: string;
  missingStages?: string[]; // to test missing stages support
}

const PLATES: PlateConfig[] = [
  {
    oval: 'RKS',
    number: 1,
    countryName: 'Kosovo',
    plateText: '01 123-AB',
    bandColor: '#002B7F',
    bandText: 'RKS',
    bandSymbol: 'stars',
    plateBg: '#FFFFFF',
    textColor: '#111827',
  },
  {
    oval: 'D',
    number: 1,
    countryName: 'Deutschland',
    plateText: 'B MW 8842',
    bandColor: '#003399',
    bandText: 'D',
    bandSymbol: 'stars',
    plateBg: '#FFFFFF',
    textColor: '#111827',
  },
  {
    oval: 'D',
    number: 2,
    countryName: 'Deutschland',
    plateText: 'M XY 750E',
    bandColor: '#003399',
    bandText: 'D',
    bandSymbol: 'stars',
    plateBg: '#FFFFFF',
    textColor: '#111827',
  },
  {
    oval: 'A',
    number: 1,
    countryName: 'Österreich',
    plateText: 'W 54892 K',
    bandColor: '#003399',
    bandText: 'A',
    bandSymbol: 'stars',
    plateBg: '#FFFFFF',
    textColor: '#111827',
    hasRedBorder: true,
  },
  {
    oval: 'CH',
    number: 1,
    countryName: 'Schweiz',
    plateText: 'ZH 481 920',
    bandColor: '#D52B1E',
    bandText: '+',
    bandSymbol: 'shield',
    plateBg: '#FFFFFF',
    textColor: '#111827',
  },
  {
    oval: 'F',
    number: 1,
    countryName: 'Frankreich',
    plateText: 'AA-229-AA',
    bandColor: '#003399',
    bandText: 'F',
    bandSymbol: 'stars',
    plateBg: '#FFFFFF',
    textColor: '#111827',
  },
  {
    oval: 'I',
    number: 1,
    countryName: 'Italien',
    plateText: 'GA 324 TX',
    bandColor: '#003399',
    bandText: 'I',
    bandSymbol: 'stars',
    plateBg: '#FFFFFF',
    textColor: '#111827',
  },
  {
    oval: 'NL',
    number: 1,
    countryName: 'Niederlande',
    plateText: 'G-742-NZ',
    bandColor: '#003399',
    bandText: 'NL',
    bandSymbol: 'stars',
    plateBg: '#F3B505', // Yellow Dutch plate
    textColor: '#111827',
  },
  {
    oval: 'PL',
    number: 1,
    countryName: 'Polen',
    plateText: 'WI 94812',
    bandColor: '#003399',
    bandText: 'PL',
    bandSymbol: 'stars',
    plateBg: '#FFFFFF',
    textColor: '#111827',
  },
  {
    oval: 'CZ',
    number: 1,
    countryName: 'Tschechien',
    plateText: '1AX 8942',
    bandColor: '#003399',
    bandText: 'CZ',
    bandSymbol: 'stars',
    plateBg: '#FFFFFF',
    textColor: '#111827',
    missingStages: ['hard'], // deliberately missing 'hard' to test stage skipping!
  },
  {
    oval: 'E',
    number: 1,
    countryName: 'Spanien',
    plateText: '8492 KMG',
    bandColor: '#003399',
    bandText: 'E',
    bandSymbol: 'stars',
    plateBg: '#FFFFFF',
    textColor: '#111827',
  },
  {
    oval: 'GB',
    number: 1,
    countryName: 'Großbritannien',
    plateText: 'LD19 VXZ',
    bandColor: '#00247D',
    bandText: 'UK',
    bandSymbol: 'shield',
    plateBg: '#FCD116', // Yellow rear British plate
    textColor: '#0B0C10',
  },
  {
    oval: 'AL',
    number: 1,
    countryName: 'Albanien',
    plateText: 'AA 981 BL',
    bandColor: '#CC0000',
    bandText: 'AL',
    bandSymbol: 'shield',
    plateBg: '#FFFFFF',
    textColor: '#111827',
  },
  {
    oval: 'HR',
    number: 1,
    countryName: 'Kroatien',
    plateText: 'ZG 5920-ET',
    bandColor: '#003399',
    bandText: 'HR',
    bandSymbol: 'stars',
    plateBg: '#FFFFFF',
    textColor: '#111827',
  },
  {
    oval: 'S',
    number: 1,
    countryName: 'Schweden',
    plateText: 'MLB 842',
    bandColor: '#003399',
    bandText: 'S',
    bandSymbol: 'stars',
    plateBg: '#FFFFFF',
    textColor: '#111827',
  },
  {
    oval: 'DK',
    number: 1,
    countryName: 'Dänemark',
    plateText: 'CE 48 912',
    bandColor: '#003399',
    bandText: 'DK',
    bandSymbol: 'stars',
    plateBg: '#FFFFFF',
    textColor: '#111827',
    hasRedBorder: true,
  },
  {
    oval: 'B',
    number: 1,
    countryName: 'Belgien',
    plateText: '1-ABC-492',
    bandColor: '#003399',
    bandText: 'B',
    bandSymbol: 'stars',
    plateBg: '#FFFFFF',
    textColor: '#8B0000', // Belgian Ruby red characters
  },
  {
    oval: 'GR',
    number: 1,
    countryName: 'Griechenland',
    plateText: 'ZHA 4920',
    bandColor: '#003399',
    bandText: 'GR',
    bandSymbol: 'stars',
    plateBg: '#FFFFFF',
    textColor: '#111827',
  },
];

function generateSvg(p: PlateConfig): string {
  const width = 800;
  const height = 220;
  const rx = 16;
  const bandWidth = p.bandColor ? 96 : 0;
  const redBorderStroke = p.hasRedBorder ? 'stroke="#D52B1E" stroke-width="6"' : 'stroke="#333333" stroke-width="4"';

  let bandContent = '';
  if (p.bandColor) {
    let symbol = '';
    if (p.bandSymbol === 'stars') {
      // 12 stars in circle
      const starsArr = [];
      const cx = bandWidth / 2;
      const cy = 46;
      const r = 24;
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30 * Math.PI) / 180;
        const sx = cx + r * Math.sin(angle);
        const sy = cy - r * Math.cos(angle);
        starsArr.push(`<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="2.8" fill="#FFCC00" />`);
      }
      symbol = starsArr.join('');
    } else if (p.bandSymbol === 'shield') {
      symbol = `
        <rect x="${bandWidth/2 - 12}" y="32" width="24" height="24" rx="4" fill="#FFFFFF" />
        <rect x="${bandWidth/2 - 3}" y="36" width="6" height="16" fill="${p.bandColor}" />
        <rect x="${bandWidth/2 - 8}" y="41" width="16" height="6" fill="${p.bandColor}" />
      `;
    }

    bandContent = `
      <g>
        <path d="M 0 0 H ${bandWidth} V ${height} H 0 Z" fill="${p.bandColor}" clip-path="url(#plateClip)" />
        ${symbol}
        <text x="${bandWidth / 2}" y="172" fill="#FFFFFF" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="34" text-anchor="middle" letter-spacing="1">${p.bandText || p.oval}</text>
      </g>
    `;
  }

  // Realistic embossed bevel/shadow effect and bold German/FE-Schrift style lettering
  const textX = (width + bandWidth) / 2;
  const textY = 145;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="plateClip">
          <rect x="0" y="0" width="${width}" height="${height}" rx="${rx}" ry="${rx}" />
        </clipPath>
        <linearGradient id="metalSheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3" />
          <stop offset="50%" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.12" />
        </linearGradient>
        <filter id="emboss" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="1" dy="2" stdDeviation="1" flood-color="#000000" flood-opacity="0.35" />
        </filter>
      </defs>
      
      <!-- Outer Plate Background with rounded corners -->
      <rect x="2" y="2" width="${width - 4}" height="${height - 4}" rx="${rx}" ry="${rx}" fill="${p.plateBg || '#FFFFFF'}" ${redBorderStroke} />
      
      <!-- Clip inner content to rounded plate -->
      <g clip-path="url(#plateClip)">
        ${bandContent}
        
        <!-- Registration characters with authentic spacing and stamped look -->
        <text x="${textX}" y="${textY}" fill="${p.textColor || '#111827'}" font-family="'Plus Jakarta Sans', 'Arial Black', Impact, sans-serif" font-weight="900" font-size="94" text-anchor="middle" letter-spacing="9" filter="url(#emboss)">${p.plateText}</text>
        
        <!-- Metallic plate sheen overlay -->
        <rect x="0" y="0" width="${width}" height="${height}" fill="url(#metalSheen)" pointer-events="none" />
      </g>
    </svg>
  `;
}

async function buildDataset() {
  const root = process.cwd();
  const targets = [
    path.resolve(root, 'public', 'kennzeichen_game'),
    path.resolve(root, 'kennzeichen_game'),
  ];

  for (const target of targets) {
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }
  }

  const manifestEntries: Array<{
    oval: string;
    number: number;
    countryName: string;
    stages: Record<string, string>;
  }> = [];

  for (const plate of PLATES) {
    const oval = plate.oval;
    const num = plate.number;
    const plateId = `${oval}${num}`;

    // Target folders
    for (const root of targets) {
      const folder = path.join(root, oval);
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }
    }

    const svg = generateSvg(plate);
    const baseSharp = sharp(Buffer.from(svg));

    // Define stages and their blur intensities
    // solution = 0 blur (sharp)
    // easy = slight blur (approx sigma 4)
    // hard = medium blur (approx sigma 14)
    // harder = heavy blur (approx sigma 28)
    const stagesDef: Array<{ name: string; sigma: number }> = [
      { name: 'solution', sigma: 0 },
      { name: 'easy', sigma: 4 },
      { name: 'hard', sigma: 14 },
      { name: 'harder', sigma: 28 },
    ];

    const availableStages: Record<string, string> = {};

    for (const stage of stagesDef) {
      // Check if this plate explicitly omits this stage to test skipping logic
      if (plate.missingStages && plate.missingStages.includes(stage.name)) {
        console.log(`Skipping omitted stage: ${plateId}_${stage.name}.jpg (for testing skipping requirement)`);
        continue;
      }

      const fileName = `${plateId}_${stage.name}.jpg`;
      const webPath = `/kennzeichen_game/${oval}/${fileName}`;

      let pipeline = sharp(Buffer.from(svg)).resize(800, 220);
      if (stage.sigma > 0) {
        pipeline = pipeline.blur(stage.sigma);
      }

      const jpegBuffer = await pipeline.jpeg({ quality: 88 }).toBuffer();

      for (const root of targets) {
        const filePath = path.join(root, oval, fileName);
        fs.writeFileSync(filePath, jpegBuffer);
      }

      availableStages[stage.name] = webPath;
    }

    manifestEntries.push({
      oval,
      number: num,
      countryName: plate.countryName,
      stages: availableStages,
    });
  }

  // Write manifest.json to both public and root
  const manifestData = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    plates: manifestEntries,
  };

  for (const root of targets) {
    const manifestPath = path.join(root, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2));
  }

  console.log(`Generated ${PLATES.length} plates in ${targets.join(' & ')}`);
}

buildDataset().catch(console.error);
