# @siracusahq/design-system

BtoB業務アプリケーション向けReactデザインシステム。
高密度な業務UIを品質高く、素早く、ブランド統一して構築するためのコンポーネントライブラリ。

## 技術スタック

- **React 18/19** — コンポーネント基盤
- **Tailwind CSS v4** — ゼロランタイムスタイリング（`@theme` でトークン統合）
- **Radix UI** — アクセシビリティ基盤（ARIA/キーボード/フォーカス管理）
- **CVA** — 型安全なバリアント管理
- **TypeScript** — 完全な型定義

## Storybook

コンポーネントカタログ: https://siracusa-design-system.netlify.app/app/

## インストール

```bash
pnpm add @siracusahq/design-system
```

### CSS の読み込み

```css
/* index.css */
@import '@siracusahq/design-system/globals.css';
@source "../node_modules/@siracusahq/design-system/dist";
```

### フォント

Inter（欧文）と Noto Sans JP（和文）を読み込んでください。

```html
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap"
  rel="stylesheet"
/>
```

## 基本的な使い方

```tsx
import {
  ThemeProvider,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@siracusahq/design-system';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Card>
        <CardHeader>
          <CardTitle>Hello Polastack</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Click me</Button>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}
```

## コンポーネント一覧

### コアアトム

Button, Badge, Avatar, AvatarGroup, Separator, Skeleton, Spinner, Card, Tooltip, Toast

### フォーム

Label, Input, Textarea, Checkbox, RadioGroup, Switch, Select, Combobox, DatePicker, NumberInput, FormField, DynamicFormField, FormLayout

### データ表示

Tabs, EmptyState, Table, DataTable, FilterBar

### ナビゲーション + レイアウト

Popover, DropdownMenu, Dialog, CommandPalette, Drawer, AppShell

### PWA

BottomNavigation, OfflineIndicator, InstallPrompt, PullToRefresh

### チャート / ダッシュボード

StatCard, ChartContainer, chartColors (tokens)

### テーマ

ThemeProvider, useTheme

## ダークモード

`ThemeProvider` でライト/ダーク/システム連動の切り替えが可能です。

```tsx
import { ThemeProvider, useTheme } from '@siracusahq/design-system';

// アプリルートで
<ThemeProvider defaultTheme="system">
  <App />
</ThemeProvider>;

// コンポーネント内で
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle</Button>;
}
```

CSS変数ベースのセマンティックトークンにより、全コンポーネントが自動的にダークモードに対応します。

## デザイントークン

TypeScript定数としても利用可能です。

```ts
import { colors, typography, spacing } from '@siracusahq/design-system/tokens';
```

## 開発

```bash
# Storybook 起動（コンポーネントカタログ）
pnpm storybook

# テスト実行
pnpm test

# 型チェック
pnpm typecheck

# ビルド
pnpm build

# バンドルサイズ確認
pnpm size
```

## ブランドカラー

メインカラー: **#008575**（ティール）。値の正本は
[`@siracusahq/tokens`](https://www.npmjs.com/package/@siracusahq/tokens)。

| カテゴリ | カラー               | 備考                                  |
| -------- | -------------------- | ------------------------------------- |
| Primary  | Teal (#008575)       | 500 単独で白文字 4.55:1、WCAG AA 適合 |
| Success  | True Green (#22b43b) | primary と44°の色相差で区別           |
| Warning  | Amber (#f59e0b)      |                                       |
| Error    | Red (#ef4444)        |                                       |
| Info     | Blue (#3b82f6)       |                                       |

装飾用の `brand` スケール（#13c3a0 系）は Web/LP 専用のため、
本パッケージには意図的に含めていない。

## リリース

モノレポ化に伴い changesets 運用に移行した。
**手で `package.json` の version を編集したり `git tag` を打ったりしないこと。**

1. 変更を入れた PR に changeset を添える（リポジトリルートで `pnpm changeset`）
2. main にマージすると Release ワークフローが version 更新と CHANGELOG 生成を行い、
   `changeset-release/main` ブランチに push する
3. そのブランチから Version PR を手動で作る（org ポリシーにより自動作成は不可）

   ```bash
   gh pr create --base main --head changeset-release/main \
     --title "chore: release packages" --fill
   ```

4. その PR をマージすると npm publish とタグ作成まで自動実行される

詳細はリポジトリルートの [CLAUDE.md](../../CLAUDE.md) を参照。

## ライセンス

MIT License
