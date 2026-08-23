import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { STORYBOOK_DIR } from './playwright.config';

/**
 * ページ単位の VRT（stage5-workorder.md §3 / §4 Slice 0）。
 *
 * 検証単位は**ページ**。コンポーネント単体は対象にしない（統一感はページを
 * 並べて初めて判定できる、という Stage 5 の決定事項）。
 *
 * 対象は Storybook の index.json から動的に列挙する。ページ単位ストーリーを
 * 足したら、テスト側に手を入れなくても VRT の網に入る（= 入れ忘れが起きない）。
 */

interface StorybookIndex {
  entries: Record<string, { id: string; title: string; name: string; type: string }>;
}

/** ページ単位ストーリーの所在。ここに無いものはコンポーネント単体とみなして対象外 */
const PAGE_STORY_PREFIXES = [
  'patterns-landingpage--',
  'patterns-corporatepage--',
  'patterns-contentpage--',
  'patterns-worstcase--',
  'examples-corporatetop',
];

/** 対象から外すストーリー（現在なし。除外するときは理由をここに書く） */
const EXCLUDED_STORY_IDS: string[] = [];

function listPageStories(): { id: string; label: string }[] {
  const index = JSON.parse(
    readFileSync(join(STORYBOOK_DIR, 'index.json'), 'utf8'),
  ) as StorybookIndex;

  return Object.values(index.entries)
    .filter((entry) => entry.type === 'story')
    .filter((entry) => PAGE_STORY_PREFIXES.some((prefix) => entry.id.startsWith(prefix)))
    .filter((entry) => !EXCLUDED_STORY_IDS.includes(entry.id))
    .map((entry) => ({ id: entry.id, label: `${entry.title} / ${entry.name}` }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

/** 全角括弧など、OS によって扱いが変わりうる文字をファイル名から追い出す */
function snapshotName(storyId: string): string {
  return `${storyId.replace(/[（）()\s/\\:*?"<>|]+/g, '-').replace(/-+/g, '-')}.png`;
}

/**
 * IntersectionObserver 起点の演出（AnimateOnScroll / AnimatedCounter）は、
 * 一度も画面に入っていない要素が初期状態（opacity: 0）のままになる。
 * フルページ撮影では「下半分が真っ白な基準 PNG」ができてしまうため、
 * 一度ページ全体をスクロールして全セクションを可視状態にしてから先頭に戻す。
 */
async function revealLazySections(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = window.innerHeight;
    const height = () => document.documentElement.scrollHeight;
    for (let y = 0; y < height(); y += step) {
      window.scrollTo(0, y);
      // IntersectionObserver のコールバックは rAF 後に配送される。
      // 2フレーム相当（≒32ms）では遅い環境があるため 100ms 置く
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 200));
  });
}

/**
 * requestAnimationFrame に渡す時刻を未来へ飛ばし、経過時間ベースの JS アニメーションを
 * 最初の1フレームで完了させる。
 *
 * AnimatedCounter は rAF で数値を数え上げる JS 実装で、`prefers-reduced-motion` を
 * 見ていない（workorder §7）。「テキストが変化しなくなるまで待つ」方式も試したが、
 * CPU が混むと 150ms のあいだ1フレームも配送されず、止まったように見えて
 * 途中の数値で撮ってしまうことがあった（実際に 1回目の比較で 1,262px の差分が出た）。
 *
 * 待ち時間を伸ばすのは「遅くて、たまに落ちる VRT」を作るだけなので、
 * 時間そのものを進める。elapsed が duration を超えるため progress は必ず 1 になり、
 * 数値は最終値で確定する。コンポーネント側には手を入れない。
 */
async function completeTimeBasedAnimations(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const original = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (callback: FrameRequestCallback): number =>
      /* 10,000 秒ぶん進める。既定の duration（2000ms）はもちろん、
         現実的に設定しうる長さをすべて超える */
      original(() => callback(performance.now() + 10_000_000));
  });
}

/**
 * 動的テキストが確定したことの最終確認。
 * completeTimeBasedAnimations で即座に確定するはずなので、ここは保険。
 * 止まらない演出が新たに入ったら、黙って撮らずにここで落ちる。
 */
async function waitForStableText(page: Page): Promise<void> {
  const intervalMs = 150;
  /* AnimatedCounter の既定 duration は 2000ms。その3倍を上限にして、
     止まらない演出が混ざったら「安定しなかった」と落とす */
  const maxAttempts = 40;
  let previous: string | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const current = await page.evaluate(() => document.body.innerText);
    if (current === previous) return;
    previous = current;
    await page.waitForTimeout(intervalMs);
  }
  throw new Error('テキストが安定しませんでした（カウントアップか動的テキストが止まっていない）');
}

/**
 * Web フォント（Inter / Noto Sans JP）が実際に読み込まれたことを確認する。
 *
 * .storybook/preview-head.html が Google Fonts を参照しているため、
 * 取得に失敗するとフォールバックのシステムフォントで描画され、
 * 「基準 PNG と全く違う絵」が出る。黙って差分として出すと原因調査に時間を食うので、
 * ここで明示的に落として理由を出す。
 */
async function assertWebFontsLoaded(page: Page): Promise<void> {
  const state = await page.evaluate(() => {
    const loaded = new Set<string>();
    document.fonts.forEach((face) => {
      if (face.status === 'loaded') loaded.add(face.family.replace(/['"]/g, ''));
    });
    return {
      loaded: [...loaded],
      hasJapanese: /[぀-ヿ一-龯]/.test(document.body.innerText),
    };
  });

  expect(state.loaded, 'Inter（欧文）が読み込まれていない').toContain('Inter');
  if (state.hasJapanese) {
    expect(state.loaded, 'Noto Sans JP（和文）が読み込まれていない').toContain('Noto Sans JP');
  }
}

async function openStory(page: Page, storyId: string): Promise<void> {
  await completeTimeBasedAnimations(page);
  await page.goto(`/iframe.html?viewMode=story&id=${encodeURIComponent(storyId)}`, {
    waitUntil: 'load',
  });
  await page.waitForSelector('#storybook-root > *', { state: 'attached' });

  await revealLazySections(page);

  /* 遅延読み込み画像（loading="lazy"）はスクロール後に走るため、走査の後で待つ */
  await page.evaluate(() =>
    Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise<void>((resolve) => {
              img.addEventListener('load', () => resolve(), { once: true });
              img.addEventListener('error', () => resolve(), { once: true });
            }),
        ),
    ).then(() => undefined),
  );

  /* サブセット分割された和文フォントは、テキストが版組みされた後に要求が飛ぶ。
     スクロール走査のあとに待つこと（先に待つと未要求のサブセットを取りこぼす） */
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await assertWebFontsLoaded(page);

  await waitForStableText(page);
}

const stories = listPageStories();

test.describe('ページ単位のビジュアル回帰', () => {
  /* 対象が 0 件なら「全部緑」ではなく設定ミス。index.json の形式が変わったときに気付けるようにする */
  test('対象ストーリーが列挙できている', () => {
    expect(stories.length).toBeGreaterThan(5);
  });

  for (const story of stories) {
    test(story.label, async ({ page }) => {
      await openStory(page, story.id);

      await expect(page).toHaveScreenshot(snapshotName(story.id), {
        fullPage: true,
        /* CSS アニメーション / トランジションを最終フレームで止める。
           reducedMotion だけでは JS 駆動の演出が残るため両方かける */
        animations: 'disabled',
        caret: 'hide',
        /* デバイスピクセル比に関わらず CSS ピクセルで撮る */
        scale: 'css',
      });
    });
  }
});
