/**
 * pageSurface 契約 — セクションが「自分で暗面を塗る」ことを Page に申告する口。
 *
 * Page は面リズム（default ↔ muted の交互割当）を子の走査で行うが、
 * ModuleOverview や CTASection のように自分で暗面を塗るセクションには
 * 割り当ててはならない。塗る/塗らないの判断がコンポーネント内部に
 * 閉じている（Stage 2 で background props を削除した）ため、
 * 外から検出する手段としてコンポーネントの静的プロパティを使う。
 *
 * 申告できるのは以下だけ。muted は Page だけが割り当てる。
 *
 * - `default`: 塗らない（Page のリズム対象）
 * - `dark`:    自分で暗面を塗る（リズム除外 + 暗面連続の検査対象）
 * - `accent`:  自分で強調面（暗くない）を塗る（リズム除外。CTABand 等）
 */

export type PageSurface = 'default' | 'dark' | 'accent';

export type PageSurfaceResolver<P> = PageSurface | ((props: P) => PageSurface);

const KEY = 'pageSurface';

interface PageSurfaceCarrier<P> {
  [KEY]?: PageSurfaceResolver<P>;
}

/** コンポーネント定義の直後に呼び、自己申告を付与する */
export function markPageSurface<C, P>(component: C, surface: PageSurfaceResolver<P>): C {
  (component as PageSurfaceCarrier<P>)[KEY] = surface;
  return component;
}

/** Page 側: 子要素の type と props から面を解決する。未申告は default */
export function resolvePageSurface(type: unknown, props: unknown): PageSurface {
  if (type == null || (typeof type !== 'function' && typeof type !== 'object')) {
    return 'default';
  }
  const declared = (type as PageSurfaceCarrier<unknown>)[KEY];
  if (declared == null) return 'default';
  if (typeof declared === 'function') return declared(props);
  return declared;
}
