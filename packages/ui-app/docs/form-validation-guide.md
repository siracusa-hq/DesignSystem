# フォームバリデーション統合ガイド

> Polastack Design Systemのフォームコンポーネントと react-hook-form + zod を連携する方法。

---

## 概要

デザインシステムのフォームコンポーネントは**バリデーションライブラリに依存しません**。
推奨する連携パターンとして `react-hook-form` + `zod` の組み合わせを紹介します。

## セットアップ

```bash
pnpm add react-hook-form zod @hookform/resolvers
```

## 基本パターン

### 1. Zodスキーマ定義

```typescript
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1, '名前を入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  age: z.number().min(0).max(120).optional(),
  department: z.string().min(1, '部署を選択してください'),
  agree: z.boolean().refine((v) => v, '利用規約に同意してください'),
});

type UserFormValues = z.infer<typeof userSchema>;
```

### 2. react-hook-form + FormField

```tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  NumberInput,
  FormLayout,
  FormActions,
  Button,
} from '@polastack/design-system';

function UserForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      age: undefined,
      department: '',
      agree: false,
    },
  });

  const onSubmit = (data: UserFormValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormLayout>
        {/* テキスト入力 */}
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <FormField error={fieldState.error?.message} required>
              <FormLabel>名前</FormLabel>
              <FormControl>
                <Input {...field} placeholder="山田太郎" />
              </FormControl>
              <FormMessage />
            </FormField>
          )}
        />

        {/* メール入力 */}
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <FormField error={fieldState.error?.message} required>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="taro@example.com" />
              </FormControl>
              <FormMessage />
            </FormField>
          )}
        />

        {/* 数値入力 */}
        <Controller
          control={control}
          name="age"
          render={({ field, fieldState }) => (
            <FormField error={fieldState.error?.message}>
              <FormLabel>年齢</FormLabel>
              <FormControl>
                <NumberInput
                  value={field.value}
                  onChange={field.onChange}
                  min={0}
                  max={120}
                />
              </FormControl>
              <FormMessage />
            </FormField>
          )}
        />

        {/* セレクト */}
        <Controller
          control={control}
          name="department"
          render={({ field, fieldState }) => (
            <FormField error={fieldState.error?.message} required>
              <FormLabel>部署</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eng">エンジニアリング</SelectItem>
                    <SelectItem value="sales">営業</SelectItem>
                    <SelectItem value="hr">人事</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormField>
          )}
        />

        {/* チェックボックス */}
        <Controller
          control={control}
          name="agree"
          render={({ field, fieldState }) => (
            <FormField error={fieldState.error?.message}>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>利用規約に同意する</FormLabel>
              </div>
              <FormMessage />
            </FormField>
          )}
        />

        <FormActions>
          <Button type="submit">送信</Button>
        </FormActions>
      </FormLayout>
    </form>
  );
}
```

## DynamicFormFieldとの連携

```tsx
import { useForm, Controller } from 'react-hook-form';
import { DynamicFormField } from '@polastack/design-system';

// フィールド定義（APIやConfigから動的に生成可能）
const fieldDefs = [
  { type: 'text', name: 'name', label: '名前', required: true },
  { type: 'email', name: 'email', label: 'メール', required: true },
  { type: 'select', name: 'role', label: '役割', options: [...] },
];

function DynamicForm() {
  const { control, handleSubmit } = useForm({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fieldDefs.map((def) => (
        <Controller
          key={def.name}
          control={control}
          name={def.name}
          render={({ field, fieldState }) => (
            <DynamicFormField
              {...def}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
      ))}
    </form>
  );
}
```

## ポイント

### aria-invalidの自動適用

`FormControl`は`error`が存在するとき自動的に`aria-invalid="true"`を子要素に付与します。
Input/Textarea/SelectTriggerはこの属性に応じてエラースタイル（赤いボーダー・フォーカスリング）を適用します。

```css
/* 自動適用されるスタイル */
aria-[invalid=true]:border-error-500
aria-[invalid=true]:focus-visible:ring-error-500
```

### aria-describedbyの自動構成

`FormControl`は`FormDescription`と`FormMessage`のIDを自動的に`aria-describedby`に設定します。
エラーがない場合はdescription、エラーがある場合はerror messageのIDが設定されます。

### react-hook-formなしでも使える

`FormField`は純粋なプレゼンテーションコンポーネントです。
`error`プロップに文字列を渡すだけでエラー表示が可能です。

```tsx
// react-hook-form不要のシンプルなパターン
<FormField error={validationError}>
  <FormLabel>Email</FormLabel>
  <FormControl>
    <Input value={email} onChange={(e) => setEmail(e.target.value)} />
  </FormControl>
  <FormMessage />
</FormField>
```
