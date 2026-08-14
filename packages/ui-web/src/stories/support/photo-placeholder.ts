/**
 * ストーリー用のインタビュー写真プレースホルダ（データ URI の SVG）。
 *
 * 外部画像 URL を使うと VRT が取得タイミングで揺れ、オフラインでも壊れるため、
 * 決定的なデータ URI で代用する。実運用では実写真の URL を渡す。
 *
 * ratio は**掲載枠の比率に合わせる**こと。ズレた比率を渡すと自動トリミングで
 * 端が刈られ、プレースホルダの構図では「見切れ」に見える（2026-08-14 の指摘。
 * 実写真なら主題が中央にある限り問題にならない）。
 * 枠の比率: カード = 16:9 / 記事ヒーロー = 1.9:1 / 記事本文 = 3:2
 */
export function photoPlaceholder(
  label: string,
  tint: 'green' | 'sand' | 'blue' = 'green',
  ratio: '16:9' | '3:2' | '1.9:1' = '16:9',
): string {
  const palettes = {
    green: ['#dce4e2', '#c5d1cd', '#8fa39c', '#7d928b', '#b3c1bc', '#5c6b66'],
    sand: ['#e3ddd3', '#cfc6b8', '#a3937e', '#8f8069', '#bdb2a0', '#6e6250'],
    blue: ['#d9e0e8', '#bfcad6', '#7f93a8', '#6d8299', '#a5b4c4', '#54677a'],
  } as const;
  const heights = { '16:9': 180, '3:2': 213, '1.9:1': 168 } as const;
  const [bg, floor, head, torso, block, text] = palettes[tint];
  const h = heights[ratio];
  const floorY = Math.round(h * 0.66);
  const headY = Math.round(h * 0.48);
  const torsoY = headY + 26;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 ${h}">
<rect width="320" height="${h}" fill="${bg}"/>
<rect y="${floorY}" width="320" height="${h - floorY}" fill="${floor}"/>
<circle cx="118" cy="${headY}" r="26" fill="${head}"/>
<rect x="84" y="${torsoY}" width="68" height="52" rx="14" fill="${torso}"/>
<rect x="196" y="${Math.round(h * 0.39)}" width="76" height="${Math.round(h * 0.52)}" rx="6" fill="${block}"/>
<text x="14" y="24" font-size="11" fill="${text}" font-family="sans-serif">${label}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
