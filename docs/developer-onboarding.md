# 開発者オンボーディングガイド

Polastack Design Systemへの新規開発者向けガイド。

## 環境セットアップ

### 前提条件

- Node.js >= 20.0.0
- pnpm 9.x

### 初回セットアップ

```bash
git clone <repository-url>
cd DesignSystem
pnpm install
```

### 動作確認

```bash
pnpm typecheck    # 型チェック
pnpm test         # テスト実行
pnpm build        # ビルド
pnpm storybook    # Storybook起動（http://localhost:6006）
```

## プロジェクト構成

```
src/
├── components/          # UIコンポーネント
│   └── {name}/
│       ├── {name}.tsx       # 実装
│       ├── {name}.test.tsx  # テスト
│       └── index.ts         # バレルエクスポート
├── hooks/               # カスタムフック
├── stories/             # Storybookストーリー
├── tokens/              # デザイントークン（TypeScript定数）
├── styles/
│   └── globals.css      # Tailwind CSS v4 @theme + セマンティックトークン
├── lib/                 # ユーティリティ
│   ├── cn.ts            # clsx + tailwind-merge
│   └── create-context.ts # 型安全コンテキストファクトリ
└── test/
    └── setup.ts         # Vitest セットアップ
```

### 主要な設定ファイル

| ファイル | 用途 |
|---------|------|
| `tsup.config.ts` | ビルド設定（ESM出力、2エントリポイント） |
| `tsconfig.json` | TypeScript設定（パスエイリアス `@/*` → `src/*`） |
| `vitest.config.ts` | テスト設定（jsdom、セットアップファイル） |
| `.storybook/` | Storybook設定（ダークモードトグル含む） |
| `.size-limit.json` | バンドルサイズ制限 |

## コンポーネント作成ガイドライン

### ファイル構成

新しいコンポーネント `MyComponent` を作成する場合:

```
src/components/my-component/
├── my-component.tsx       # 実装
├── my-component.test.tsx  # テスト
└── index.ts               # バレルエクスポート
```

### 実装パターン

```tsx
// my-component.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const myComponentVariants = cva(
  'base-classes-here',
  {
    variants: {
      variant: {
        default: 'variant-classes',
      },
      size: {
        md: 'size-classes',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof myComponentVariants> {}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(myComponentVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
MyComponent.displayName = 'MyComponent';

export { MyComponent, myComponentVariants };
```

### 必須パターン

1. **`React.forwardRef`** — 全コンポーネントでrefを転送
2. **`displayName`** — DevToolsでの識別用
3. **CVA** — バリアント管理に使用
4. **`cn()`** — クラス名のマージに使用（`className` propを最後に適用）
5. **セマンティックカラートークン** — `bg-white` ではなく `bg-[--color-surface-raised]` を使用

### バレルエクスポート

```ts
// index.ts
export { MyComponent, myComponentVariants, type MyComponentProps } from './my-component';
```

`src/index.ts` にもエクスポートを追加:

```ts
export { MyComponent, myComponentVariants, type MyComponentProps } from './components/my-component';
```

## デザイントークンの使い方

### CSSクラスでの使用

セマンティックトークンを優先して使用:

| 用途 | クラス |
|------|--------|
| メイン背景 | `bg-[--color-surface]` |
| カード/ダイアログ背景 | `bg-[--color-surface-raised]` |
| 凹み背景 | `bg-[--color-surface-sunken]` |
| ホバー背景 | `bg-[--color-surface-muted]` |
| メインテキスト | `text-[--color-on-surface]` |
| 補足テキスト | `text-[--color-on-surface-secondary]` |
| プレースホルダー | `text-[--color-on-surface-muted]` |
| ボーダー | `border-[--color-border]` |
| 入力ボーダー | `border-[--color-border-input]` |
| フォーカスリング | `ring-[--color-ring]` |

これらのトークンはダークモードで自動的に切り替わります。

### プライマリカラーの直接使用

ブランドカラーを直接使う場合は `primary-{shade}` を使用:

```tsx
<div className="bg-primary-500 text-white">Brand element</div>
```

ダークモードで色を変える必要がある場合は `dark:` プレフィックスを追加:

```tsx
<div className="bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
  Tinted element
</div>
```

## テスト

### テストの書き方

```tsx
// my-component.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as matchers from 'vitest-axe/matchers';
import { axe } from 'vitest-axe';
import { MyComponent } from './my-component';

expect.extend(matchers);

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent>Hello</MyComponent>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<MyComponent>Hello</MyComponent>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<MyComponent tabIndex={0}>Focusable</MyComponent>);
    await user.tab();
    expect(screen.getByText('Focusable')).toHaveFocus();
  });
});
```

### 品質ゲート（全コンポーネント必須）

- [ ] ユニットテスト（レンダリング、props、バリアント）
- [ ] axe-core アクセシビリティテスト
- [ ] キーボードナビゲーション検証
- [ ] Storybookストーリー（全バリアント）
- [ ] TypeScript Props型定義

## Storybookでの開発

### ストーリーの書き方

```tsx
// src/stories/my-component.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from '../components/my-component';

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {
  args: { children: 'Hello' },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <MyComponent variant="default">Default</MyComponent>
    </div>
  ),
};
```

### ダークモード確認

Storybookツールバーの「Theme」トグルでライト/ダークを切り替えて確認できます。

## 複合コンポーネントパターン

`createContext()` ファクトリを使った複合コンポーネント:

```tsx
import { createContext } from '@/lib/create-context';

const [MyProvider, useMyContext] = createContext<{ variant: string }>('MyComponent');

function MyParent({ variant, children }) {
  return <MyProvider value={{ variant }}>{children}</MyProvider>;
}

function MyChild() {
  const { variant } = useMyContext();
  // variant に基づいたレンダリング
}
```

使用例: Tabs, FormField, Avatar, AppShell

## コマンドリファレンス

```bash
pnpm storybook       # Storybook起動（ポート6006）
pnpm build           # tsupビルド（ESM + .d.ts）
pnpm test            # Vitestテスト実行
pnpm test:watch      # テストウォッチモード
pnpm typecheck       # TypeScript型チェック
pnpm size            # バンドルサイズ確認
pnpm clean           # dist/ 削除
```
