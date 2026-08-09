/**
 * Astro 消費側結合テスト — `astro build` の生成物を検査する（stage5-workorder.md Slice 2）。
 *
 * `scripts/consumer-smoke.mjs`（renderToString ベース）は「dist の JS が SSR で動くか」
 * までしか見ていない。実際の LP は Astro のビルドを1枚挟んで世に出るので、
 * その経路で落ちる事故が別にある:
 *
 *   - CSS が bundle されず、あるいは Tailwind 構文を残したまま配信される
 *   - Netlify Forms の属性が Astro のレンダラを通る過程で消える
 *     （消えると **デプロイ時のフォーム検出が走らず、問い合わせが永久に届かない**。
 *      しかも画面上は正常に見えるので、気づくのは「反響が無いね」と言い出したとき）
 *   - client ディレクティブを付けたセクションのビルドがそもそも通らない
 *
 * どれも LP 側のプライベートリポジトリで起きるが、原因は工場（この DS）側にある。
 * LP に検査義務を課さないために、ここで毎回証明する。
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const dist = resolve(root, 'dist');

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

let files;
try {
  files = walk(dist);
} catch {
  console.error(
    'astro-verify: dist/ がありません。先に `pnpm --filter astro-consumer-test build` を実行してください。',
  );
  process.exit(1);
}

const htmlFiles = files.filter((f) => f.endsWith('.html'));
const cssFiles = files.filter((f) => f.endsWith('.css'));

/** ルート（'/', '/contact', '/cases'）から生成 HTML を引く */
function html(route) {
  const candidates =
    route === '/'
      ? ['index.html']
      : [`${route.slice(1)}/index.html`.split('/').join(sep), `${route.slice(1)}.html`];
  for (const c of candidates) {
    const hit = htmlFiles.find((f) => relative(dist, f) === c);
    if (hit) return readFileSync(hit, 'utf8');
  }
  throw new Error(
    `生成物に ${route} が見つかりません（存在するのは: ${htmlFiles
      .map((f) => relative(dist, f))
      .join(', ')}）`,
  );
}

const indexHtml = html('/');
const contactHtml = html('/contact');
const casesHtml = html('/cases');

/** dist 内の絶対パス URL（`/_astro/foo.css`）を実ファイルへ解決する */
function asset(url) {
  const hit = files.find((f) => `/${relative(dist, f).split(sep).join('/')}` === url);
  return hit ? readFileSync(hit, 'utf8') : null;
}

/**
 * 「配信される CSS」は、**トップページが実際に読み込むもの**だけを数える。
 * dist に .css が転がっているだけでは配信の証明にならないので、
 * `<link rel="stylesheet">` の href を実ファイルへ解決する。
 * Astro は小さいスタイルシートをインライン化する（inlineStylesheets: 'auto'）ので、
 * インライン <style> も同じ「配信される CSS」として合流させる。
 */
const linkedHrefs = [...indexHtml.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)]
  .map((m) => /href="([^"]+)"/.exec(m[0])?.[1])
  .filter(Boolean);
const linkedCss = linkedHrefs.map((h) => asset(h));
const inlineStyles = htmlFiles
  .map((f) => readFileSync(f, 'utf8'))
  .flatMap((h) => [...h.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]));
const css = [...linkedCss.filter(Boolean), ...inlineStyles].join('\n');

/* client:visible が指すアイランドのスクリプト。生成物に実在するかまで見る */
const islandTag = /<astro-island[^>]*>/.exec(casesHtml)?.[0] ?? '';
const islandAssets = ['component-url', 'renderer-url'].map(
  (attr) => new RegExp(`${attr}="([^"]+)"`).exec(islandTag)?.[1] ?? null,
);

/**
 * CSS Modules のハッシュ済みクラス名。JS 側の className と CSS 側のセレクタが
 * **同じ名前で**出ていることが、スタイルが実際に当たっている証拠になる
 * （tsup 設定不備で styles が {} になる事故を Stage 2 で踏んでいる）。
 */
const HASHED_CLASSES = ['page_page', 'container_container', 'cta_band_band'];

const checks = [
  /* --- HTML: 静的レンダリング経路 --------------------------------------- */
  [
    `HTML: ハッシュ済みクラスが出ている（${HASHED_CLASSES.join(' / ')}）`,
    HASHED_CLASSES.every((c) => indexHtml.includes(c)),
  ],
  ['HTML: data-brand="peerdesk-taxpeer"', indexHtml.includes('data-brand="peerdesk-taxpeer"')],
  ['HTML: data-tone="product"', indexHtml.includes('data-tone="product"')],
  ['HTML: 数値訴求の時点表記（asOf）が静的に出る（景表法）', indexHtml.includes('2026年7月末時点')],
  /*
   * 面リズムエンジン（Stage 3）が Astro のビルドを越えて効いていること。
   * Page は children を1件ずつ見て default ↔ muted を交互に割り当てるので、
   * 「React 側でコンポーズされている」ことがそのまま前提になる。
   * **.astro テンプレートで直接セクションを並べるとこれは効かない**（§7-11）。
   * ここが 0 件になったら、LP が全ページ真っ白（面の差が無い）になっている。
   */
  ['HTML: 面リズム（muted スロット）が割り当たっている', indexHtml.includes('page_slotMuted')],
  [
    `HTML: スタイルシートが実ファイルとして配信される（${linkedHrefs.join(', ') || 'link なし'}）`,
    linkedHrefs.length > 0 && linkedCss.every((c) => c !== null),
  ],
  /*
   * React は未知の props を DOM 属性としてそのまま出す（`offers="[object Object]"`）。
   * 画面には出ないので目視でもテストでも気づけないが、生成物には焼き付く。
   * Slice 2 で LandingPage の hero に実際に出ていた（§7-9）。
   */
  [
    'HTML: データ props が DOM 属性へ漏れていない（offers / numericValue / ichisanEnabled）',
    ['offers=', 'numericValue=', 'ichisanEnabled='].every((k) => !indexHtml.includes(k)),
  ],

  /* --- HTML: Netlify Forms（本命） -------------------------------------- */
  ['contact: data-netlify="true" が静的 HTML に出る', contactHtml.includes('data-netlify="true"')],
  [
    'contact: hidden の form-name input が静的 HTML に出る',
    /<input[^>]*type="hidden"[^>]*name="form-name"[^>]*>/.test(contactHtml),
  ],
  [
    'contact: honeypot（data-netlify-honeypot）が静的 HTML に出る',
    contactHtml.includes('data-netlify-honeypot="bot-field"'),
  ],
  [
    'contact: フォーム文言が既定の日本語で静的出力される（SSG 言語事故の再発防止。stage5-workorder §7-10）',
    contactHtml.includes('お名前') && !contactHtml.includes('Download Resource'),
  ],

  /* --- HTML: interactive 経路 ------------------------------------------- */
  [
    'cases: astro-island が client="visible" で出る',
    islandTag !== '' && /client="visible"/.test(islandTag),
  ],
  [
    `cases: アイランドが参照する JS が実在する（${islandAssets.join(', ')}）`,
    islandAssets.length === 2 && islandAssets.every((u) => u !== null && asset(u) !== null),
  ],
  [
    'cases: アイランドの中身が SSR 済み（hydrate 前でも中身が見える）',
    casesHtml.includes('case_study_list_card'),
  ],

  /* --- CSS -------------------------------------------------------------- */
  ['CSS: スロット定義を含む（--color-bg-brand-primary）', css.includes('--color-bg-brand-primary')],
  [
    'CSS: ブランドランプを含む（--ramp-peerdesk-taxpeer-500）',
    css.includes('--ramp-peerdesk-taxpeer-500'),
  ],
  [
    `CSS: HTML と同じハッシュ済みセレクタを含む（${HASHED_CLASSES.map((c) => `.${c}`).join(' / ')}）`,
    HASHED_CLASSES.every((c) => css.includes(`.${c}`)),
  ],
  [
    'CSS: Tailwind 構文（@theme / @custom-variant）が残っていない',
    !/@theme[\s{]/.test(css) && !/@custom-variant/.test(css),
  ],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? '✓' : '✗'} ${name}`);
  if (!ok) failed++;
}
console.log(
  `astro-verify: HTML ${htmlFiles.length} 枚 / 配信 CSS ${linkedCss.length} 枚（dist 内 .css は ${cssFiles.length} 枚）` +
    ` / インライン <style> ${inlineStyles.length} 件 を検査`,
);
if (failed) {
  console.error(`astro-verify: ${failed} 件失敗`);
  process.exit(1);
}
console.log('astro-verify: 全チェック通過');
