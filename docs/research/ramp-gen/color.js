/**
 * 色空間変換・コントラスト・色差のユーティリティ（依存なし・素の Node）
 *
 * 扱う空間:
 *   sRGB(hex) <-> linear sRGB <-> OKLab/OKLCH
 *   sRGB(hex) -> CIE XYZ(D65) -> CIE Lab -> ΔE2000
 *
 * 参照:
 *   OKLab: Björn Ottosson の定義（https://bottosson.github.io/posts/oklab/）
 *   コントラスト比: WCAG 2.x
 */

// ---------- sRGB ----------

/** '#rrggbb' -> [0..1, 0..1, 0..1]（ガンマ付き） */
export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}

/** [0..1]^3（ガンマ付き）-> '#rrggbb'。範囲外は clamp */
export function rgbToHex(rgb) {
  return (
    '#' +
    rgb
      .map((c) => {
        const v = Math.round(Math.min(1, Math.max(0, c)) * 255);
        return v.toString(16).padStart(2, '0');
      })
      .join('')
  );
}

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);

// ---------- OKLab / OKLCH ----------

/** linear sRGB -> OKLab */
function linearToOklab([r, g, b]) {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  ];
}

/** OKLab -> linear sRGB（色域外だと成分が 0..1 を外れる） */
function oklabToLinear([L, a, b]) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

/** '#rrggbb' -> { L, C, H }（L: 0..1, C: 0..~0.4, H: 0..360） */
export function hexToOklch(hex) {
  const [L, a, b] = linearToOklab(hexToRgb(hex).map(toLinear));
  const C = Math.hypot(a, b);
  let H = (Math.atan2(b, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L, C, H };
}

/** OKLCH -> linear sRGB（clamp なし） */
function oklchToLinear({ L, C, H }) {
  const rad = (H * Math.PI) / 180;
  return oklabToLinear([L, C * Math.cos(rad), C * Math.sin(rad)]);
}

const IN_GAMUT_EPS = 1e-6;
const inGamut = (lin) => lin.every((c) => c >= -IN_GAMUT_EPS && c <= 1 + IN_GAMUT_EPS);

/** その (L, H) で sRGB に収まる最大彩度を二分探索で求める */
export function maxChroma(L, H, hi = 0.45) {
  if (!inGamut(oklchToLinear({ L, C: 0, H }))) return 0; // L 自体が範囲外
  let lo = 0;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklchToLinear({ L, C: mid, H }))) lo = mid;
    else hi = mid;
  }
  return lo;
}

/**
 * OKLCH -> hex。sRGB 色域外なら L と H を保ったまま C だけを落として収める
 * （CSS Color 4 の gamut mapping と同方針。明度と色相は絶対に変えない）。
 *
 * 戻り値の clipped は「彩度を落とした量」。0 なら無加工。
 */
export function oklchToHex({ L, C, H }) {
  const lin = oklchToLinear({ L, C, H });
  if (inGamut(lin)) {
    return { hex: rgbToHex(lin.map(toGamma)), clipped: 0, chroma: C };
  }
  const cMax = maxChroma(L, H, C);
  const mapped = oklchToLinear({ L, C: cMax, H });
  return { hex: rgbToHex(mapped.map(toGamma)), clipped: C - cMax, chroma: cMax };
}

// ---------- WCAG コントラスト ----------

export function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a, b) {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// ---------- CIE Lab / ΔE2000 ----------

/** '#rrggbb' -> CIE Lab（D65 白色点） */
export function hexToLab(hex) {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  const X = 0.4123908 * r + 0.3575843 * g + 0.1804808 * b;
  const Y = 0.2126390 * r + 0.7151687 * g + 0.0721923 * b;
  const Z = 0.0193308 * r + 0.1191948 * g + 0.9505322 * b;
  const [xn, yn, zn] = [0.9504559, 1.0, 1.0890578];
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (841 / 108) * t + 4 / 29);
  const fx = f(X / xn);
  const fy = f(Y / yn);
  const fz = f(Z / zn);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

/** CIEDE2000 色差。おおよそ 1.0 未満は「人間の目にほぼ同一」 */
export function deltaE2000(hexA, hexB) {
  const [L1, a1, b1] = hexToLab(hexA);
  const [L2, a2, b2] = hexToLab(hexB);
  const kL = 1, kC = 1, kH = 1;
  const C1 = Math.hypot(a1, b1);
  const C2 = Math.hypot(a2, b2);
  const Cbar = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cbar ** 7 / (Cbar ** 7 + 25 ** 7)));
  const a1p = (1 + G) * a1;
  const a2p = (1 + G) * a2;
  const C1p = Math.hypot(a1p, b1);
  const C2p = Math.hypot(a2p, b2);
  const deg = (r) => ((r * 180) / Math.PI + 360) % 360;
  const h1p = C1p === 0 ? 0 : deg(Math.atan2(b1, a1p));
  const h2p = C2p === 0 ? 0 : deg(Math.atan2(b2, a2p));

  const dLp = L2 - L1;
  const dCp = C2p - C1p;
  let dhp = 0;
  if (C1p * C2p !== 0) {
    dhp = h2p - h1p;
    if (dhp > 180) dhp -= 360;
    else if (dhp < -180) dhp += 360;
  }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp * Math.PI) / 360);

  const Lbp = (L1 + L2) / 2;
  const Cbp = (C1p + C2p) / 2;
  let hbp;
  if (C1p * C2p === 0) hbp = h1p + h2p;
  else if (Math.abs(h1p - h2p) <= 180) hbp = (h1p + h2p) / 2;
  else hbp = h1p + h2p < 360 ? (h1p + h2p + 360) / 2 : (h1p + h2p - 360) / 2;

  const rad = (d) => (d * Math.PI) / 180;
  const T =
    1 -
    0.17 * Math.cos(rad(hbp - 30)) +
    0.24 * Math.cos(rad(2 * hbp)) +
    0.32 * Math.cos(rad(3 * hbp + 6)) -
    0.2 * Math.cos(rad(4 * hbp - 63));
  const dTheta = 30 * Math.exp(-(((hbp - 275) / 25) ** 2));
  const Rc = 2 * Math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7));
  const Sl = 1 + (0.015 * (Lbp - 50) ** 2) / Math.sqrt(20 + (Lbp - 50) ** 2);
  const Sc = 1 + 0.045 * Cbp;
  const Sh = 1 + 0.015 * Cbp * T;
  const Rt = -Math.sin(rad(2 * dTheta)) * Rc;

  return Math.sqrt(
    (dLp / (kL * Sl)) ** 2 +
      (dCp / (kC * Sc)) ** 2 +
      (dHp / (kH * Sh)) ** 2 +
      Rt * (dCp / (kC * Sc)) * (dHp / (kH * Sh)),
  );
}
