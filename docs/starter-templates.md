# スターターテンプレートガイド

Polastack Design Systemを使ったアプリケーション構築の出発点。

## 1. 標準アプリ構成（デスクトップ中心）

### 推奨スタック

| レイヤー | 技術 |
|---------|------|
| フレームワーク | Next.js (App Router) or Vite + React Router |
| スタイリング | Tailwind CSS v4 |
| UIコンポーネント | @polastack/design-system |
| フォーム | react-hook-form + zod |
| データフェッチ | TanStack Query |

### セットアップ手順

#### 1. プロジェクト作成

```bash
# Vite の場合
pnpm create vite my-app --template react-ts
cd my-app

# Next.js の場合
pnpm create next-app my-app --typescript --tailwind --app
cd my-app
```

#### 2. デザインシステムのインストール

```bash
pnpm add @polastack/design-system
```

#### 3. CSS読み込み

```ts
// src/main.tsx (Vite) or app/layout.tsx (Next.js)
import '@polastack/design-system/globals.css';
```

#### 4. フォント設定

```html
<!-- index.html (Vite) or app/layout.tsx (Next.js) -->
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap"
  rel="stylesheet"
/>
```

#### 5. アプリルート構成

```tsx
import {
  ThemeProvider,
  AppShell,
  AppShellSidebar,
  AppShellHeader,
  AppShellContent,
  Toaster,
} from '@polastack/design-system';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <AppShell>
        <AppShellSidebar>
          {/* ナビゲーション */}
        </AppShellSidebar>
        <div className="flex flex-col flex-1">
          <AppShellHeader>
            {/* ヘッダー */}
          </AppShellHeader>
          <AppShellContent>
            {/* ルーターアウトレット */}
          </AppShellContent>
        </div>
      </AppShell>
      <Toaster />
    </ThemeProvider>
  );
}
```

### 典型的な画面構成

```
/                → Dashboard（Card + DataTable）
/items           → 一覧画面（DataTable + FilterBar）
/items/new       → 作成画面（FormLayout + FormField）
/items/:id       → 詳細/編集（Tabs + FormLayout）
/settings        → 設定画面（Tabs + Switch + Select）
```

## 2. PWAアプリ構成（モバイル対応）

### 追加で必要なコンポーネント

```tsx
import {
  BottomNavigation,
  BottomNavigationItem,
  OfflineIndicator,
  InstallPrompt,
  PullToRefresh,
} from '@polastack/design-system';
```

### セットアップ手順

#### 1. PWA プラグイン

```bash
# Vite の場合
pnpm add -D vite-plugin-pwa
```

```ts
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'My App',
        short_name: 'MyApp',
        theme_color: '#1BA491',
        display: 'standalone',
      },
    }),
  ],
});
```

#### 2. PWAレイアウト構成

```tsx
import {
  ThemeProvider,
  AppShell,
  AppShellHeader,
  AppShellContent,
  BottomNavigation,
  BottomNavigationItem,
  OfflineIndicator,
  PullToRefresh,
  Toaster,
} from '@polastack/design-system';

function MobileApp() {
  return (
    <ThemeProvider defaultTheme="system">
      <AppShell withBottomNav>
        <div className="flex flex-col flex-1">
          <AppShellHeader>
            <h1 className="text-lg font-semibold">My App</h1>
          </AppShellHeader>

          <AppShellContent>
            <PullToRefresh onRefresh={async () => { /* reload data */ }}>
              {/* ページコンテンツ */}
            </PullToRefresh>
          </AppShellContent>
        </div>
      </AppShell>

      <BottomNavigation>
        <BottomNavigationItem icon={<HomeIcon />} label="Home" active />
        <BottomNavigationItem icon={<SearchIcon />} label="Search" />
        <BottomNavigationItem icon={<SettingsIcon />} label="Settings" />
      </BottomNavigation>

      <OfflineIndicator />
      <Toaster />
    </ThemeProvider>
  );
}
```

### PWA特有の考慮事項

| 項目 | 対応方法 |
|------|---------|
| タッチターゲット | `touch:min-h-[--touch-target-min]` で44px保証（Button自動対応） |
| Safe Area | `globals.css` で `env(safe-area-inset-*)` を変数化済み |
| オフライン | `OfflineIndicator` + `useOnlineStatus()` フック |
| インストール促進 | `InstallPrompt` + `useInstallPrompt()` フック |
| Pull-to-Refresh | `PullToRefresh` コンポーネント |
| ビューポート高さ | `useViewportHeight()` でアドレスバー考慮 |

## 3. 共通パターン

### ダークモード対応

すべてのテンプレートで `ThemeProvider` を使用。セマンティックカラートークンにより自動対応。

```tsx
// テーマ切替UI例
import { useTheme, Button } from '@polastack/design-system';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </Button>
  );
}
```

### トースト通知

アプリルートに `<Toaster />` を配置し、任意のコンポーネントから `toast()` で通知:

```tsx
import { useToast } from '@polastack/design-system';

function MyComponent() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({ title: 'Saved!', description: 'Changes have been saved.' });
  };
}
```

### コマンドパレット

Cmd+K / Ctrl+K でのクイックナビゲーション:

```tsx
import {
  CommandPalette,
  CommandPaletteGroup,
  CommandPaletteItem,
} from '@polastack/design-system';
```

消費側で `open` 状態とキーボードショートカットを管理。
