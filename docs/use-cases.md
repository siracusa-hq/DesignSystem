# ユースケースドキュメント

Polastack Design Systemを使った典型的な業務画面の構築パターン。

## 1. CRUD画面（一覧 + 作成/編集ダイアログ）

業務アプリで最も頻出するパターン。DataTable で一覧表示し、Dialog で作成・編集を行う。

### 構成コンポーネント

```
DataTable          — データ一覧（ソート、ページネーション、行選択）
FilterBar          — フィルタリングUI
Dialog             — 作成/編集フォーム
FormField          — フォームフィールド（ラベル + 入力 + エラー）
FormLayout         — フォームレイアウト
Button             — アクション
Toast              — 操作結果通知
```

### 基本構造

```tsx
import {
  DataTable, Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogFooter, DialogClose,
  FormLayout, FormSection, FormActions, FormField, FormLabel,
  FormControl, FormMessage, Input, Button, useToast,
} from '@polastack/design-system';
import type { ColumnDef } from '@tanstack/react-table';

// 1. カラム定義
const columns: ColumnDef<Item>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
  // ...
];

// 2. 画面構成
function ItemListPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);

  return (
    <div className="flex flex-col gap-4">
      {/* ヘッダー + 作成ボタン */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Items</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>New Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Item</DialogTitle>
            </DialogHeader>
            <FormLayout layout="vertical">
              <FormField required>
                <FormLabel>Name</FormLabel>
                <FormControl><Input /></FormControl>
                <FormMessage />
              </FormField>
            </FormLayout>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={() => toast({ title: 'Created!' })}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* データテーブル */}
      <DataTable
        columns={columns}
        data={items}
        enableSorting
        enablePagination
        pageSize={20}
      />
    </div>
  );
}
```

### ポイント

- `DataTable` の `columns` はコンポーネント外で定義（再レンダリング防止）
- `Dialog` は Radix UI の controlled/uncontrolled 両方に対応
- `FormField` の `error` prop でバリデーションエラーを表示
- 操作完了後は `toast()` で通知

## 2. 設定画面（タブ + フォーム + スイッチ）

アプリケーション設定やユーザープロフィール編集で使うパターン。

### 構成コンポーネント

```
Tabs               — 設定カテゴリの切り替え
FormLayout         — フォームレイアウト（vertical/horizontal）
FormSection        — セクション分割（fieldset）
FormField          — フォームフィールド
Switch             — トグル設定
Select             — 選択肢
FormActions        — 保存/キャンセルボタン
```

### 基本構造

```tsx
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
  FormLayout, FormSection, FormActions,
  FormField, FormLabel, FormControl, FormDescription,
  Input, Switch, Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem, Button,
} from '@polastack/design-system';

function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <FormLayout layout="vertical" size="md">
            <FormSection title="Profile" description="Your public information">
              <FormField>
                <FormLabel>Display Name</FormLabel>
                <FormControl><Input defaultValue="John Doe" /></FormControl>
              </FormField>
              <FormField>
                <FormLabel>Language</FormLabel>
                <FormControl>
                  <Select defaultValue="ja">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormField>
            </FormSection>

            <FormActions align="right">
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </FormActions>
          </FormLayout>
        </TabsContent>

        <TabsContent value="notifications">
          <FormLayout layout="vertical">
            <FormSection title="Email Notifications">
              <FormField>
                <div className="flex items-center justify-between">
                  <div>
                    <FormLabel>Marketing emails</FormLabel>
                    <FormDescription>Receive product updates</FormDescription>
                  </div>
                  <FormControl><Switch /></FormControl>
                </div>
              </FormField>
            </FormSection>
          </FormLayout>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### ポイント

- `Tabs` でカテゴリ分割、各 `TabsContent` 内に `FormLayout` を配置
- `FormSection` の `title`/`description` でセクションの意味を明示
- `Switch` は `FormField` 内で横並びレイアウト（`flex items-center justify-between`）
- `FormLayout layout="horizontal"` でラベル左・入力右の2カラムレイアウトも可能

## 3. ダッシュボード画面（AppShell + Card + DataTable）

アプリケーションのメインレイアウトとダッシュボード。

### 構成コンポーネント

```
AppShell           — アプリケーション骨格（サイドバー + ヘッダー + コンテンツ）
Card               — メトリクスカード
DataTable          — 最近のアクティビティ
Badge              — ステータス表示
```

### 基本構造

```tsx
import {
  AppShell, AppShellSidebar, AppShellHeader, AppShellContent,
  Card, CardHeader, CardTitle, CardContent,
  DataTable, Badge, Button,
} from '@polastack/design-system';

function DashboardApp() {
  return (
    <AppShell>
      <AppShellSidebar>
        <nav className="flex flex-col gap-1 p-4">
          <a href="#" className="px-3 py-2 rounded-md bg-[--color-surface-muted]">Dashboard</a>
          <a href="#" className="px-3 py-2 rounded-md">Projects</a>
          <a href="#" className="px-3 py-2 rounded-md">Settings</a>
        </nav>
      </AppShellSidebar>

      <div className="flex flex-col flex-1">
        <AppShellHeader>
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </AppShellHeader>

        <AppShellContent>
          {/* メトリクスカード */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-[--color-on-surface-secondary]">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">¥1,234,567</p>
              </CardContent>
            </Card>
            {/* 他のカード... */}
          </div>

          {/* 最近のアクティビティ */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={activityColumns} data={activities} enablePagination pageSize={5} />
            </CardContent>
          </Card>
        </AppShellContent>
      </div>
    </AppShell>
  );
}
```

### ポイント

- `AppShell` はモバイルで自動的にサイドバーを Drawer に変換
- メトリクスカードは `grid` で配置、レスポンシブに列数を調整
- `Card` 内に `DataTable` を配置して統合的なUIを構成
- セマンティックカラートークンを使用してダークモード自動対応
