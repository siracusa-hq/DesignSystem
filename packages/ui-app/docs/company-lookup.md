# 会社名の入力補完（CompanyLookupField）と仕組み

> 会社名を打つと候補が下に出て、選ぶとフォームの法人番号欄や住所欄に自動で入る。入った後の値は自由に直せる。
> 部品は候補を表示するだけ。候補の供給は Polastack（PolaCast 公的レジストリ照会）、両者を繋ぐのはアプリのサーバ側コード。

---

## 3 層の役割

| 層               | 何をするか                                                                                                                    | どこにあるか                                                                                    |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **UI 部品**      | 入力欄・候補リスト（社名・法人番号・所在地）・キーボード操作・間引き・abort・同一文字列の再利用。通信も業務ロジックも持たない | `@siracusahq/design-system` の `CompanyLookupField`（基盤は `Autocomplete`）                    |
| **アプリの配線** | 部品の `searchCompanies` に「サーバ側で Polastack を呼ぶ関数」を渡し、選ばれた候補を自分のフォーム欄・列に入れる              | 各アプリ（Next.js なら Server Action）                                                          |
| **Polastack**    | 国税庁の法人番号システムを引く共通 API。アプリケーション ID は Polastack だけが持つ。閉鎖法人は返さない                       | PolaCast `GET /api/v1/registry/corporations?name=`（SDK: `client.registry.searchCorporations`） |

ブラウザから Polastack を直接叩かない。テナントのトークンも国税庁の ID もサーバ側にあるためで、
部品が通信を知らない設計はこの制約から来ている。

## 使い方（Next.js の例）

### 1. サーバ側で候補を作る

```ts
// app/actions/companies.ts
'use server';
import { createClient, toCompanyCandidate } from '@polastack/sdk';
import type { CompanyCandidate } from '@siracusahq/design-system';

export async function searchCompanies(query: string): Promise<CompanyCandidate[]> {
  const client = createClient({
    apiBaseUrl: process.env.POLASTACK_API_URL,
    accessToken: await currentAccessToken(),
  });
  const { corporations } = await client.registry.searchCorporations({ name: query });
  return corporations.map(toCompanyCandidate);
}
```

自前の API ラッパーを持つアプリ（taxpeer 等）は SDK を使わず、同じエンドポイントを
`GET /registry/corporations?name=…` で呼んで同じ形に写像すればよい。

### 2. 画面で部品を使い、選んだ候補をフォームに入れる

```tsx
'use client';
import { CompanyLookupField, type CompanyCandidate } from '@siracusahq/design-system';
import { searchCompanies } from '@/app/actions/companies';

<CompanyLookupField
  value={form.name}
  onValueChange={(name) => setForm({ ...form, name })}
  searchCompanies={(q) => searchCompanies(q)}
  onCompanySelect={(c: CompanyCandidate) =>
    setForm({
      ...form,
      name: c.name,
      corporateNumber: c.corporateNumber,
      postCode: c.address?.postCode ?? '',
      prefecture: c.address?.prefecture ?? '',
      city: c.address?.city ?? '',
      street: c.address?.street ?? '',
    })
  }
/>;
```

候補に入っている `kana` / `englishName` は行には出ないが、会社名カナ欄・英語商号欄のある画面ではそのまま入れられる。
登記の本店所在地と実際の事業所が違うことはあるので、入った後の欄はどれも編集できる状態にしておく。

## 挙動の規約

- **候補が無くても入力はそのまま有効**。個人事業主・海外法人・未登記の先は候補に出ない。
- **候補は社名・法人番号・所在地の 3 つだけ表示**。所在地は都道府県＋市区町村＋番地で、郵便番号は行に出さない（フォームには渡る）。
- **閉鎖法人（廃業・合併）は候補に出ない**（Polastack 側で除外する。部品は判定を持たない）。
- **最低 2 文字・300ms の間引き・直前の照会は abort・同じ文字列はコンポーネント内で再利用**。
  Polastack 側はキャッシュを持たないので、打鍵ごとの照会を減らす手当はすべて部品側にある。
  必要なら `minChars` / `debounceMs` で調整する。
- **ひらがなで打っても引ける**（国税庁側のあいまい検索）。英語表記の検索は Polastack 側の
  `script=en` を使い、別の入力モードとして扱う。
- **出典表示**。国税庁の利用規約が求める文言は Polastack のレスポンス `meta.attribution` にある。
  候補を採用する画面のどこかに出す（部品は表示しない。文言の置き場は画面の責務）。

## API

### `CompanyLookupField`

`Autocomplete` の props（`value` / `onValueChange` / `minChars` / `debounceMs` / `emptyMessage` など）に加えて:

| prop              | 型                                                                    | 説明                                                        |
| ----------------- | --------------------------------------------------------------------- | ----------------------------------------------------------- |
| `searchCompanies` | `(query: string, signal: AbortSignal) => Promise<CompanyCandidate[]>` | 候補の供給（必須）                                          |
| `onCompanySelect` | `(candidate: CompanyCandidate) => void`                               | 候補を選んだとき。社名は `onValueChange` で入力欄に反映済み |

`CompanyCandidate`: `corporateNumber` / `name` / `address?{ postCode, prefecture, city, street }` / `kana?` / `englishName?`。

### `Autocomplete<T>`

会社名以外にも使える汎用の非同期入力補完（取引先マスタ・勘定科目・担当者など）。

| prop                                               | 型                                                    | 説明                                       |
| -------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------ |
| `value` / `onValueChange`                          | `string` / `(v: string) => void`                      | 入力欄（制御）                             |
| `loadOptions`                                      | `(query, signal) => Promise<AutocompleteOption<T>[]>` | 候補の供給                                 |
| `onSelect`                                         | `(option: AutocompleteOption<T>) => void`             | 候補を選んだとき                           |
| `renderOption`                                     | `(option, { active }) => ReactNode`                   | 候補行の描画（既定は label + description） |
| `minChars` / `debounceMs`                          | `number`                                              | 既定 2 / 300                               |
| `emptyMessage` / `loadingMessage` / `errorMessage` | `string`                                              | 各状態の表示                               |
