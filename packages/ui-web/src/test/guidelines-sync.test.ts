import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PAGE_BRANDS, PAGE_TONES } from '@/components/layout/page';
import { LANDING_PAGE_PATTERNS } from '@/patterns';

/**
 * 規範ファイルの同期テスト（Stage 6 Slice 0）。
 *
 * AGENTS.md / GUIDELINES.md は npm の配布物に同梱され、利用側の AI エージェントが
 * これを読んでページを組む。**文書が型より古くなると、エージェントは存在しない
 * ブランドやページ型を書く。** それはリポジトリの外で起きるので、こちらからは見えない。
 *
 * そこで「文書が列挙している語彙」と「型の実体」を CI で突き合わせる。
 * 網羅的なコンポーネント一覧は文書に持たせない方針なので、検査対象は
 * **語彙（ブランド / トーン / ページ型）と dev 警告の数**の2つだけに絞る。
 * 数え方は壊れにくさを優先し、行数・見出し・表の行数といった粗い単位で見る。
 */

/* jsdom 環境では import.meta.url が http スキームになり fileURLToPath が使えない。
   vitest の root はパッケージディレクトリなので cwd を使い、取り違えを name で確かめる */
const pkgRoot = process.cwd();
const read = (name: string) => readFileSync(`${pkgRoot}/${name}`, 'utf8');

const AGENTS = read('AGENTS.md');
const GUIDELINES = read('GUIDELINES.md');

/** バッククォートで囲まれた識別子を拾う */
const backticked = (text: string): string[] =>
  [...text.matchAll(/`([^`]+)`/g)].map((m) => m[1]);

/** 表の1行（marker を含む行）のセルを返す */
function tableRow(doc: string, marker: string): string[] {
  const line = doc.split('\n').find((l) => l.startsWith('|') && l.includes(marker));
  if (!line) throw new Error(`表の行が見つからない: ${marker}`);
  return line.split('|').slice(1, -1).map((c) => c.trim());
}

/** `## 2. …` から `## 3. …` の手前までを切り出す */
function section(doc: string, heading: string): string {
  const lines = doc.split('\n');
  const start = lines.findIndex((l) => l.startsWith(`## ${heading}`));
  if (start < 0) throw new Error(`節が見つからない: ## ${heading}`);
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => l.startsWith('## '));
  return (end < 0 ? rest : rest.slice(0, end)).join('\n');
}

const sorted = (values: readonly string[]) => [...values].sort();

it('cwd がこのパッケージのルートを指している（検査対象の取り違え防止）', () => {
  expect((JSON.parse(read('package.json')) as { name: string }).name).toBe(
    '@siracusahq/gtm-design-system',
  );
});

describe('AGENTS.md の語彙表が型の実体と一致する', () => {
  /* 語彙表は AGENTS.md にしかない（正本は1つ。GUIDELINES.md は §2 の節見出しで
     ページ型を、冒頭の「語彙」行でブランドとトーンを持つ） */
  it('ブランド4', () => {
    expect(sorted(backticked(tableRow(AGENTS, 'ブランド `brand`')[1]))).toEqual(
      sorted(PAGE_BRANDS),
    );
  });

  it('トーン3', () => {
    expect(sorted(backticked(tableRow(AGENTS, 'トーン `tone`')[1]))).toEqual(sorted(PAGE_TONES));
  });

  it('ページ型5', () => {
    expect(sorted(backticked(tableRow(AGENTS, 'ページ型 `pattern`')[1]))).toEqual(
      sorted(LANDING_PAGE_PATTERNS),
    );
  });
});

describe('GUIDELINES.md の語彙が型の実体と一致する', () => {
  const vocab = GUIDELINES.split('\n').find((l) => l.startsWith('**語彙**'));

  it('冒頭の語彙行にブランド4とトーン3が正しく並ぶ', () => {
    expect(vocab).toBeDefined();
    const [brandsPart, tonesPart] = vocab!.split('トーン3 =');
    expect(tonesPart).toBeDefined();
    expect(sorted(backticked(brandsPart))).toEqual(sorted(PAGE_BRANDS));
    expect(sorted(backticked(tonesPart))).toEqual(sorted(PAGE_TONES));
  });

  it('§2 にページ型ごとの節が1つずつある', () => {
    /* 各節の見出しは `### \`product\` — 単一製品の LP` の形。
       見出しの先頭のバッククォート語をページ型として読む */
    const headings = section(GUIDELINES, '2. ')
      .split('\n')
      .filter((l) => l.startsWith('### '))
      .map((l) => backticked(l)[0]);
    expect(sorted(headings)).toEqual(sorted(LANDING_PAGE_PATTERNS));
  });
});

describe('GUIDELINES.md §6 の dev 警告一覧が実装と一致する', () => {
  /* 「どの警告か」までは機械的に突き合わせられない（文言は文書用に短くしてある）。
     壊れにくく、かつ実際に効く単位として **件数** を見る。
     警告を1つ足して文書に書き忘れれば、ここで落ちる。 */
  function countDevWarnings(): number {
    const src = `${pkgRoot}/src`;
    const files = readdirSync(src, { recursive: true, encoding: 'utf8' })
      .filter((f) => /\.tsx?$/.test(f))
      .filter((f) => !/\.(test|stories)\.tsx?$/.test(f));
    return files.reduce(
      (sum, f) => sum + (readFileSync(`${src}/${f}`, 'utf8').match(/console\.warn\(/g)?.length ?? 0),
      0,
    );
  }

  it('表の行数 = 実装の console.warn 件数', () => {
    const rows = section(GUIDELINES, '6. ')
      .split('\n')
      .filter((l) => /^\|\s*\d+\s*\|/.test(l));
    expect(rows.length).toBe(countDevWarnings());
  });

  it('見出しにも同じ件数が書かれている', () => {
    const heading = section(GUIDELINES, '6. ')
      .split('\n')
      .find((l) => l.startsWith('### dev ビルドで'));
    expect(heading).toContain(`（${countDevWarnings()}種）`);
  });
});

describe('規範ファイルが配布物に含まれる', () => {
  /* npm pack の実内容は scripts/consumer-smoke.mjs が検証する（pack は約4秒かかるので
     ユニットテストでは回さない）。ここは宣言側だけを見る。 */
  it('package.json の files に列挙されている', () => {
    const pkg = JSON.parse(read('package.json')) as { files: string[] };
    expect(pkg.files).toContain('AGENTS.md');
    expect(pkg.files).toContain('GUIDELINES.md');
  });

  it('AGENTS.md から GUIDELINES.md へ到達できる', () => {
    expect(AGENTS).toContain('./GUIDELINES.md');
  });
});
