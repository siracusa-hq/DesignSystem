/**
 * ストーリー用のインタビュー写真プレースホルダ（データ URI の SVG）。
 *
 * 外部画像 URL を使うと VRT が取得タイミングで揺れ、オフラインでも壊れるため、
 * 決定的なデータ URI で代用する。実運用では実写真の URL を渡す。
 */
export function photoPlaceholder(label: string, tint: 'green' | 'sand' | 'blue' = 'green'): string {
  const palettes = {
    green: ['#dce4e2', '#c5d1cd', '#8fa39c', '#7d928b', '#b3c1bc', '#5c6b66'],
    sand: ['#e3ddd3', '#cfc6b8', '#a3937e', '#8f8069', '#bdb2a0', '#6e6250'],
    blue: ['#d9e0e8', '#bfcad6', '#7f93a8', '#6d8299', '#a5b4c4', '#54677a'],
  } as const;
  const [bg, floor, head, torso, block, text] = palettes[tint];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180">
<rect width="320" height="180" fill="${bg}"/>
<rect y="118" width="320" height="62" fill="${floor}"/>
<circle cx="118" cy="86" r="26" fill="${head}"/>
<rect x="84" y="112" width="68" height="52" rx="14" fill="${torso}"/>
<rect x="196" y="70" width="76" height="94" rx="6" fill="${block}"/>
<text x="14" y="24" font-size="11" fill="${text}" font-family="sans-serif">${label}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
