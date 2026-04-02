# PWA対応ガイドライン

> Polastackデザインシステムが提供するPWA対応機能と、アプリ側で必要な設定のガイド。

---

## デザインシステムの責務

デザインシステムは**UIコンポーネントとフック**を提供します。以下はデザインシステムに含まれます:

| カテゴリ | 提供物 |
|---------|--------|
| **トークン** | Safe Area変数、タッチターゲットサイズ、ビューポート高さ変数 |
| **カスタムバリアント** | `touch:` — タッチデバイス向けスタイル (`@media (pointer: coarse)`) |
| **フック** | `useDisplayMode`, `useOnlineStatus`, `useViewportHeight`, `useInstallPrompt` |
| **コンポーネント** | `BottomNavigation`, `OfflineIndicator`, `InstallPrompt`, `PullToRefresh` |
| **タッチ最適化** | Button(44px最小タッチターゲット), Toast(モバイル中央下配置), Tooltip(タッチ非表示) |

## アプリ側の責務

以下はアプリケーション側で設定してください:

### 1. Web App Manifest (`manifest.json`)

```json
{
  "name": "Your App Name",
  "short_name": "App",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#13C3A0",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

HTMLに追加:
```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#13C3A0" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

> **重要:** `viewport-fit=cover` を指定することで、Safe Area Insetsが有効になります。

### 2. Service Worker

Service Workerはアプリ側で登録・管理します。推奨ライブラリ:
- [Workbox](https://developer.chrome.com/docs/workbox/) — Google提供、キャッシュ戦略が豊富
- Next.js: `next-pwa` パッケージ

### 3. アイコン生成

PWAアイコン（192px, 512px）はアプリ側で用意してください。

---

## トークンの使い方

### Safe Area Insets

ノッチやホームインジケータのある端末での余白確保:

```tsx
// CSS変数として利用可能
<div className="pb-[var(--safe-area-bottom)]">
  {/* Safe Area下部を避けるコンテンツ */}
</div>
```

デザインシステムの `BottomNavigation`, `Toast`, `InstallPrompt` は自動でSafe Areaを考慮します。

### タッチターゲット

タッチデバイスでの最小タップ領域（44px）:

```tsx
// touch: バリアントでタッチデバイスのみ適用
<button className="h-8 touch:min-h-[var(--touch-target-min)]">
  Tap me
</button>
```

`Button` コンポーネントはこれを自動適用済みです。

### ビューポート高さ

モバイルブラウザのアドレスバーを考慮した正確な高さ:

```tsx
// CSS変数
<div className="h-[var(--viewport-height, 100dvh)]">
  Full height content
</div>

// フック（JavaScript値が必要な場合）
const vh = useViewportHeight();
```

---

## フックの使い方

### useDisplayMode

```tsx
import { useDisplayMode } from '@polastack/design-system';

function App() {
  const mode = useDisplayMode();
  // mode: 'standalone' | 'minimal-ui' | 'fullscreen' | 'browser'

  return mode === 'standalone' ? <BottomNavigation /> : <Sidebar />;
}
```

### useOnlineStatus

```tsx
import { useOnlineStatus } from '@polastack/design-system';

function App() {
  const { isOnline, isOffline } = useOnlineStatus();

  return (
    <>
      <OfflineIndicator isOffline={isOffline} />
      {/* アプリコンテンツ */}
    </>
  );
}
```

### useInstallPrompt

```tsx
import { useInstallPrompt } from '@polastack/design-system';

function App() {
  const { canInstall, promptInstall, isDismissed, dismiss } = useInstallPrompt();

  return (
    <InstallPrompt
      canInstall={canInstall && !isDismissed}
      onInstall={promptInstall}
      onDismiss={dismiss}
    />
  );
}
```

---

## コンポーネントの使い方

### BottomNavigation

スタンドアロンモードでのモバイルナビゲーション:

```tsx
import { BottomNavigation, BottomNavigationItem } from '@polastack/design-system';

<BottomNavigation>
  <BottomNavigationItem
    icon={<HomeIcon />}
    label="ホーム"
    active
    onClick={() => navigate('/')}
  />
  <BottomNavigationItem
    icon={<ListIcon />}
    label="一覧"
    onClick={() => navigate('/list')}
  />
</BottomNavigation>
```

### PullToRefresh

リストのプルダウン更新:

```tsx
import { PullToRefresh } from '@polastack/design-system';

<PullToRefresh onRefresh={async () => await refetchData()}>
  <ItemList items={items} />
</PullToRefresh>
```

---

## レスポンシブ戦略

Polastackはデスクトップファーストの業務アプリです。モバイル対応はPWAとしてネイティブ品質を目指します。

| ブレークポイント | 幅 | 用途 |
|----------------|-----|------|
| デフォルト | < 640px | モバイル（PWA standalone） |
| `sm` | ≥ 640px | 小型タブレット |
| `md` | ≥ 768px | タブレット |
| `lg` | ≥ 1024px | デスクトップ |
| `xl` | ≥ 1280px | ワイドデスクトップ |

### 推奨パターン

```tsx
const mode = useDisplayMode();
const bp = useBreakpoint();

// デスクトップ: サイドバー + コンテンツ
// モバイル(standalone): BottomNavigation + コンテンツ
if (mode === 'standalone' && (bp === 'xs' || bp === 'sm')) {
  return <MobileLayout />;
}
return <DesktopLayout />;
```

---

## チェックリスト

アプリをPWA対応する際の確認事項:

- [ ] `manifest.json` を配置し、`<link rel="manifest">` を追加
- [ ] `<meta name="viewport" content="..., viewport-fit=cover">` を設定
- [ ] `<meta name="theme-color">` を設定
- [ ] Service Workerを登録
- [ ] PWAアイコン（192px, 512px）を用意
- [ ] `useOnlineStatus` + `OfflineIndicator` でオフライン状態を表示
- [ ] `useInstallPrompt` + `InstallPrompt` でインストール誘導
- [ ] モバイル表示で `BottomNavigation` を検討
- [ ] タッチ操作の多い画面で `PullToRefresh` を検討
- [ ] Lighthouse PWAスコアを確認
