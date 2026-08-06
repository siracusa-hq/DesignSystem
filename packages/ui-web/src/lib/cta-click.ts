import type * as React from 'react';

/**
 * CTA クリックの委譲（stage4-workorder.md §3）。
 *
 * `data-cta` を持つ要素のクリックだけを拾い、識別子・ラベル・遷移先を渡す。
 * capture フェーズのハンドラとして使うので、途中の stopPropagation や
 * リンク遷移より先に必ず届く。context もマウント時コストも要らず SSR で安全。
 *
 * **計測タグ（GA4 / GTM 等）はこのパッケージには同梱しない。**
 * ベンダーの選択は利用側の決定であり、デザインシステムが決めてはならない。
 */

/** クリックされた CTA の素性 */
export interface PageCTA {
  /** `data-cta` の値。セクションが自動割当する（例: `hero-0` / `closing-1`） */
  id: string;
  /** 要素の表示文字列（textContent を空白正規化したもの） */
  label: string;
  /** リンク（`<a>`）の場合のみ入る。`<button>` では undefined */
  href?: string;
}

export type PageCTAClickHandler = (cta: PageCTA, event: React.MouseEvent) => void;

/**
 * capture フェーズ用のクリックハンドラを組み立てる。
 * `onCTAClick` が未指定でも、呼び出し側が渡した `onClickCapture` は素通しする。
 */
export function createCTAClickCapture<T extends Element>(
  onCTAClick: PageCTAClickHandler | undefined,
  onClickCapture: React.MouseEventHandler<T> | undefined,
): React.MouseEventHandler<T> {
  return (event) => {
    onClickCapture?.(event);
    if (!onCTAClick) return;
    const target = event.target as Element | null;
    // SVG アイコン等でも closest は使えるが、テキストノードや非 Element には無い
    if (typeof target?.closest !== 'function') return;
    const el = target.closest('[data-cta]');
    const id = el?.getAttribute('data-cta');
    if (!el || !id) return;
    onCTAClick(
      {
        id,
        label: (el.textContent ?? '').replace(/\s+/g, ' ').trim(),
        href: el.getAttribute('href') ?? undefined,
      },
      event,
    );
  };
}
