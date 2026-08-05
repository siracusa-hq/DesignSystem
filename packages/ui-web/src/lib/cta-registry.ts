import * as React from 'react';

/**
 * CTA ラベルレジストリ — 「プライマリ CTA のラベルは2種類まで」の dev 検査
 * （composition-redesign.md §3-3）。
 *
 * LP 実測の標準形は「同じ2種のラベルをセクション区切りごとに反復する」
 * （反復回数の中央値 15〜16本）。したがって**回数は数えない**。
 * 数えるのはラベルの種類だけで、3種類目が現れたら dev 警告を出す。
 *
 * Page が Provider を張り、MarketingButton（variant="cta"）が
 * マウント時に自分のラベルを登録する。Page の外では何もしない。
 */

export interface CTALabelRegistry {
  register(label: string): void;
}

export const CTARegistryContext = React.createContext<CTALabelRegistry | null>(null);

export function createCTALabelRegistry(): CTALabelRegistry {
  const labels = new Set<string>();
  let warned = false;
  return {
    register(label: string) {
      const normalized = label.replace(/\s+/g, ' ').trim();
      if (!normalized) return;
      labels.add(normalized);
      if (labels.size >= 3 && !warned) {
        warned = true;
        console.warn(
          `[Page] プライマリCTA（variant="cta"）のラベルが3種類以上あります: ${[...labels]
            .map((l) => `「${l}」`)
            .join(' ')}。` +
            'ラベルは2種類までに絞ってください。同じラベルの反復は自由です（composition-redesign.md §3-3）。',
        );
      }
    },
  };
}
