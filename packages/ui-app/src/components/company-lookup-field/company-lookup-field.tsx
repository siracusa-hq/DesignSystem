import * as React from 'react';
import {
  Autocomplete,
  type AutocompleteOption,
  type AutocompleteProps,
} from '@/components/autocomplete';

/**
 * 会社名の入力補完。
 *
 * 打ちながら候補（社名・法人番号・所在地）を出し、選ぶと社名を入力欄に反映して
 * `onCompanySelect` で候補をそのまま呼び出し側へ渡す。フォーム側はそれを法人番号欄や住所欄に入れる
 * （入れた後の編集はフォームの責務）。部品は候補を表示するだけで、業務ロジックを持たない。
 *
 * 候補の供給は `searchCompanies` で外から渡す。Polastack では PolaCast の公的レジストリ照会
 * （`GET /api/v1/registry/corporations?name=`）をサーバ側で呼び、`@polastack/sdk` の
 * `toCompanyCandidate` で本コンポーネントの候補形に写像する（閉鎖法人は Polastack 側で除外済み）。
 */
export interface CompanyAddress {
  postCode?: string | null;
  prefecture?: string | null;
  city?: string | null;
  street?: string | null;
}

export interface CompanyCandidate {
  /** 法人番号（13 桁）。候補の一意キーにもなる */
  corporateNumber: string;
  /** 社名（正式な商号） */
  name: string;
  /** 登記上の本店所在地 */
  address?: CompanyAddress | null;
  /** 表示はしないが、選択時にそのまま渡す（会社名カナ欄のある画面向け） */
  kana?: string | null;
  /** 表示はしないが、選択時にそのまま渡す（英語商号欄のある画面向け） */
  englishName?: string | null;
}

export interface CompanyLookupFieldProps extends Omit<
  AutocompleteProps<CompanyCandidate>,
  'loadOptions' | 'onSelect' | 'renderOption'
> {
  /** 候補の供給。`signal` は次の照会が始まったときに abort される */
  searchCompanies: (query: string, signal: AbortSignal) => Promise<CompanyCandidate[]>;
  /** 候補を選んだとき（社名は `onValueChange` で入力欄に反映済み） */
  onCompanySelect?: (candidate: CompanyCandidate) => void;
}

/** 候補行に出す所在地（都道府県＋市区町村＋番地。郵便番号は出さない） */
function addressLine(address?: CompanyAddress | null): string {
  if (!address) return '';
  return [address.prefecture, address.city, address.street].filter(Boolean).join('');
}

function toOption(candidate: CompanyCandidate): AutocompleteOption<CompanyCandidate> {
  return {
    value: candidate.corporateNumber,
    label: candidate.name,
    description: addressLine(candidate.address),
    data: candidate,
  };
}

function renderCompany(option: AutocompleteOption<CompanyCandidate>) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-medium text-[var(--color-on-surface)]">{option.label}</span>
        <span className="shrink-0 whitespace-nowrap font-mono text-xs text-[var(--color-on-surface-muted)]">
          {option.value}
        </span>
      </div>
      {option.description && (
        <span className="text-xs text-[var(--color-on-surface-muted)]">{option.description}</span>
      )}
    </div>
  );
}

export const CompanyLookupField = React.forwardRef<HTMLInputElement, CompanyLookupFieldProps>(
  (
    {
      searchCompanies,
      onCompanySelect,
      placeholder = '会社名を入力して検索',
      emptyMessage = '該当する法人が見つかりません（このまま入力を続けられます）',
      ...props
    },
    ref,
  ) => {
    const loadOptions = React.useCallback(
      async (query: string, signal: AbortSignal) =>
        (await searchCompanies(query, signal)).map(toOption),
      [searchCompanies],
    );

    return (
      <Autocomplete<CompanyCandidate>
        ref={ref}
        placeholder={placeholder}
        emptyMessage={emptyMessage}
        loadOptions={loadOptions}
        onSelect={(option) => {
          if (option.data) onCompanySelect?.(option.data);
        }}
        renderOption={renderCompany}
        {...props}
      />
    );
  },
);
CompanyLookupField.displayName = 'CompanyLookupField';
