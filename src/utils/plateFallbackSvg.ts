// Fallback SVG data generator for resilience if an image file fails to load

export function createFallbackPlateSvg(oval: string, stage: string): string {
  const width = 800;
  const height = 220;
  const blurMap: Record<string, number> = {
    harder: 18,
    hard: 9,
    easy: 3,
    solution: 0,
  };
  const blur = blurMap[stage] ?? 0;

  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${blur > 0 ? `<filter id="b"><feGaussianBlur stdDeviation="${blur}" /></filter>` : ''}
      </defs>
      <rect x="4" y="4" width="${width - 8}" height="${height - 8}" rx="14" fill="#FFFFFF" stroke="#1F2937" stroke-width="6" />
      <g ${blur > 0 ? 'filter="url(#b)"' : ''}>
        <rect x="4" y="4" width="96" height="${height - 8}" rx="14" fill="#003399" />
        <rect x="50" y="4" width="50" height="${height - 8}" fill="#003399" />
        <circle cx="52" cy="50" r="16" fill="none" stroke="#FBBF24" stroke-width="3" stroke-dasharray="3,3" />
        <text x="52" y="160" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="36" text-anchor="middle">${oval}</text>
        <text x="450" y="145" fill="#111827" font-family="sans-serif" font-weight="900" font-size="88" text-anchor="middle" letter-spacing="8">${oval} 489-KM</text>
      </g>
    </svg>
  `)}`;
}
