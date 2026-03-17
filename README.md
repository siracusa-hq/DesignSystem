# @polastack/design-system

BtoB業務アプリケーション向けReactデザインシステム。
高密度な業務UIを品質高く、素早く、ブランド統一して構築するためのコンポーネントライブラリ。

## 技術スタック

- **React 18/19** — コンポーネント基盤
- **Tailwind CSS v4** — ゼロランタイムスタイリング（`@theme` でトークン統合）
- **Radix UI** — アクセシビリティ基盤（ARIA/キーボード/フォーカス管理）
- **CVA** — 型安全なバリアント管理
- **TypeScript** — 完全な型定義

## Storybook

コンポーネントカタログ: https://tkaneko-siracusa.github.io/DesignSystem/

## インストール

GitHub Packages からインストールします。

```bash
# 1. .npmrc に GitHub Packages registry を設定
echo "@polastack:registry=https://npm.pkg.github.com" >> .npmrc

# 2. インストール
pnpm add @polastack/design-system
```

### CSS の読み込み

```ts
// アプリのエントリポイントで
import '@polastack/design-system/globals.css';
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
import { ThemeProvider, Button, Card, CardHeader, CardTitle, CardContent } from '@polastack/design-system';

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
Button, Badge, Avatar, Separator, Skeleton, Spinner, Card, Tooltip, Toast

### フォーム
Label, Input, Textarea, Checkbox, RadioGroup, Switch, Select, Combobox, DatePicker, NumberInput, FormField, DynamicFormField, FormLayout

### データ表示
Tabs, EmptyState, Table, DataTable, FilterBar

### ナビゲーション + レイアウト
Popover, DropdownMenu, Dialog, CommandPalette, Drawer, AppShell

### PWA
BottomNavigation, OfflineIndicator, InstallPrompt, PullToRefresh

### テーマ
ThemeProvider, useTheme

## ダークモード

`ThemeProvider` でライト/ダーク/システム連動の切り替えが可能です。

```tsx
import { ThemeProvider, useTheme } from '@polastack/design-system';

// アプリルートで
<ThemeProvider defaultTheme="system">
  <App />
</ThemeProvider>

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
import { colors, typography, spacing } from '@polastack/design-system/tokens';
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

メインカラー: **#1BA491**（ティール）

| カテゴリ | カラー |
|---------|--------|
| Primary | Teal (#1BA491) |
| Success | Green |
| Warning | Amber |
| Error | Red |
| Info | Blue |

## リリース

1. `CHANGELOG.md` を更新
2. GitHub で新しい Release を作成（タグ: `v0.x.x`）
3. GitHub Actions が自動的にテスト・ビルド・publish を実行

## ライセンス

UNLICENSED — 社内利用のみ
