import { render, screen, waitFor } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ContactForm, ResourceRequestForm, DemoRequestForm } from './form-section';

describe('Netlify Forms 対応（Formspree 廃止・2026-08-04 決定）', () => {
  it('data-netlify / form-name / honeypot が描画される', () => {
    const { container } = render(<ContactForm title="お問い合わせ" ichisanEnabled={false} />);
    const form = container.querySelector('form')!;
    expect(form).toHaveAttribute('data-netlify', 'true');
    expect(form).toHaveAttribute('data-netlify-honeypot', 'bot-field');
    expect(form).toHaveAttribute('method', 'POST');
    expect(form.querySelector('input[name="form-name"]')).toHaveValue('contact');
    expect(form.querySelector('input[name="bot-field"]')).toBeInTheDocument();
  });

  it('formName / action を上書きできる', () => {
    const { container } = render(
      <ContactForm title="x" formName="corp-contact" action="/thanks" ichisanEnabled={false} />,
    );
    const form = container.querySelector('form')!;
    expect(form).toHaveAttribute('name', 'corp-contact');
    expect(form).toHaveAttribute('action', '/thanks');
    expect(form.querySelector('input[name="form-name"]')).toHaveValue('corp-contact');
  });

  it('onSubmit で独自バックエンドへ逃がせる', () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    const { container } = render(
      <ContactForm title="x" onSubmit={onSubmit} ichisanEnabled={false} />,
    );
    container
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('資料請求は resource を hidden で送る', () => {
    const { container } = render(
      <ResourceRequestForm title="x" resourceName="wp-2026" ichisanEnabled={false} />,
    );
    expect(container.querySelector('input[name="resource"]')).toHaveValue('wp-2026');
  });

  it('デモ予約に時間帯セレクトがある', () => {
    // jsdom の documentElement.lang は未設定のため英語ラベルになる
    render(<DemoRequestForm title="デモ" ichisanEnabled={false} />);
    expect(screen.getByLabelText('ご希望の時間帯')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<ContactForm title="お問い合わせ" ichisanEnabled={false} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

/* ============================================================
   計測フック（Stage 4 Slice 0）
   ============================================================ */

afterEach(() => {
  vi.unstubAllGlobals();
});

const submit = (container: HTMLElement) =>
  container
    .querySelector('form')!
    .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

/** fetch をモックし、呼び出し引数（URL / RequestInit）を検査できるようにする */
const stubFetch = (impl: () => Promise<unknown>) => {
  const fetchMock = vi.fn((_url: string, _init: RequestInit) => impl());
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

describe('data-cta（送信ボタン）', () => {
  it.each([
    ['ContactForm', <ContactForm key="c" title="x" ichisanEnabled={false} />],
    ['ResourceRequestForm', <ResourceRequestForm key="r" title="x" ichisanEnabled={false} />],
    ['DemoRequestForm', <DemoRequestForm key="d" title="x" ichisanEnabled={false} />],
  ])('%s の送信ボタンに form-submit が付く', (_name, element) => {
    const { container } = render(element);
    expect(container.querySelector('button[type="submit"]')).toHaveAttribute(
      'data-cta',
      'form-submit',
    );
  });
});

describe('onResult（AJAX 送信）', () => {
  it('成功: preventDefault し、URL エンコードで POST して ok / status を返す', async () => {
    const fetchMock = stubFetch(async () => ({ ok: true, status: 200 }));
    const onResult = vi.fn();
    const { container } = render(
      <ContactForm title="x" onResult={onResult} ichisanEnabled={false} />,
    );

    const notCancelled = submit(container);
    // preventDefault されている = ネイティブ POST（ページ遷移）は起きない
    expect(notCancelled).toBe(false);

    await waitFor(() => expect(onResult).toHaveBeenCalledOnce());
    expect(onResult).toHaveBeenCalledWith({ ok: true, status: 200 });

    const [url, init] = fetchMock.mock.calls[0];
    // action 未指定なので現在のパスへ POST する（Netlify Forms の AJAX 仕様）
    expect(url).toBe(window.location.pathname);
    expect(init.method).toBe('POST');
    expect(init.headers).toEqual({ 'Content-Type': 'application/x-www-form-urlencoded' });
    // Netlify はどのフォームかを form-name で判別する。落とすと受け取れない
    expect(new URLSearchParams(init.body as string).get('form-name')).toBe('contact');
  });

  it('action 指定時はそちらへ POST し、resource 等の hidden も body に載る', async () => {
    const fetchMock = stubFetch(async () => ({ ok: true, status: 200 }));
    const onResult = vi.fn();
    const { container } = render(
      <ResourceRequestForm
        title="x"
        action="/thanks"
        resourceName="wp-2026"
        onResult={onResult}
        ichisanEnabled={false}
      />,
    );
    submit(container);
    await waitFor(() => expect(onResult).toHaveBeenCalledOnce());

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/thanks');
    const body = new URLSearchParams(init.body as string);
    expect(body.get('form-name')).toBe('resource-request');
    expect(body.get('resource')).toBe('wp-2026');
  });

  it('失敗: 2xx 以外は ok=false と status を返す', async () => {
    stubFetch(async () => ({ ok: false, status: 500 }));
    const onResult = vi.fn();
    const { container } = render(
      <DemoRequestForm title="x" onResult={onResult} ichisanEnabled={false} />,
    );
    submit(container);
    await waitFor(() => expect(onResult).toHaveBeenCalledOnce());
    expect(onResult).toHaveBeenCalledWith({ ok: false, status: 500 });
  });

  it('fetch 例外（ネットワーク断）: ok=false と error を返す', async () => {
    const boom = new TypeError('Failed to fetch');
    stubFetch(async () => {
      throw boom;
    });
    const onResult = vi.fn();
    const { container } = render(
      <ContactForm title="x" onResult={onResult} ichisanEnabled={false} />,
    );
    submit(container);
    await waitFor(() => expect(onResult).toHaveBeenCalledOnce());
    expect(onResult).toHaveBeenCalledWith({ ok: false, error: boom });
  });

  it('優先順位: onSubmit が指定されていれば onResult は呼ばれない（送信は呼び出し側の責任）', () => {
    const fetchMock = stubFetch(async () => ({ ok: true, status: 200 }));
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    const onResult = vi.fn();
    const { container } = render(
      <ContactForm title="x" onSubmit={onSubmit} onResult={onResult} ichisanEnabled={false} />,
    );
    submit(container);
    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onResult).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('既存経路は不変: onResult 未指定なら preventDefault も fetch もしない（ネイティブ POST）', () => {
    const fetchMock = stubFetch(async () => ({ ok: true, status: 200 }));
    const { container } = render(<ContactForm title="x" action="/thanks" ichisanEnabled={false} />);
    const form = container.querySelector('form')!;
    // form 要素の属性（ネイティブ POST の経路）はそのまま
    expect(form).toHaveAttribute('method', 'POST');
    expect(form).toHaveAttribute('action', '/thanks');

    const notCancelled = submit(container);
    expect(notCancelled).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('送信ボタンラベルの規範（Stage 4 Slice 2）', () => {
  it('ContactForm の既定ラベルはオファー動詞（汎用の「送信する」を廃止）', () => {
    render(<ContactForm title="お問い合わせ" ichisanEnabled={false} />);
    expect(screen.getByRole('button', { name: '問い合わせる' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '送信する' })).toBeNull();
  });

  it('言語は既定 ja・lang="en" で英語（実行環境に依存しない）', () => {
    const { unmount } = render(<ContactForm title="Contact" ichisanEnabled={false} lang="en" />);
    expect(screen.getByRole('button', { name: 'Contact Us' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
    unmount();
    // 既定（未指定）は document.lang に関係なく日本語
    render(<ContactForm title="お問い合わせ" ichisanEnabled={false} />);
    expect(screen.getByLabelText(/お名前/)).toBeInTheDocument();
  });

  it('submitLabel でオファー名に合わせられる', () => {
    render(
      <ResourceRequestForm
        title="資料請求"
        ichisanEnabled={false}
        submitLabel="ホワイトペーパーを受け取る"
      />,
    );
    expect(screen.getByRole('button', { name: 'ホワイトペーパーを受け取る' })).toBeInTheDocument();
  });

  it('汎用ラベル（送信する 等）を渡すと dev 警告が出る', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<ContactForm title="お問い合わせ" ichisanEnabled={false} submitLabel="送信する" />);
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain('汎用語');
    warn.mockRestore();
  });

  it('既定ラベル（オファー動詞）では警告しない', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<DemoRequestForm title="デモ" ichisanEnabled={false} />);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});

/* ============================================================
   項目の拡張（2026-08-15）
   拡張の口は「項目」にだけ開き、「見た目」には開かない
   ============================================================ */

describe('外部スクリプト（ichisanEnabled）の既定', () => {
  afterEach(() => {
    document.querySelectorAll('script[src*="ichisanForm"]').forEach((el) => el.remove());
    document.querySelectorAll('link[href*="ichisanForm"]').forEach((el) => el.remove());
  });

  it('既定では外部スクリプトを読み込まない（0.12.0 で反転）', () => {
    render(<ContactForm title="お問い合わせ" />);
    expect(document.querySelector('script[src*="ichisanForm"]')).toBeNull();
  });

  it('明示的に有効化したときだけ読み込む', () => {
    render(<ContactForm title="お問い合わせ" ichisanEnabled />);
    expect(document.querySelector('script[src*="ichisanForm"]')).toBeInTheDocument();
  });

  it('資料請求・デモ予約も既定オフ', () => {
    render(<ResourceRequestForm title="資料請求" />);
    render(<DemoRequestForm title="デモ" />);
    expect(document.querySelector('script[src*="ichisanForm"]')).toBeNull();
  });
});

describe('名前付きの3項目（種別 / 電話 / 同意）', () => {
  it('inquiryTypes を渡すと種別セレクトが出る', () => {
    render(<ContactForm title="x" inquiryTypes={['製品について', '取材のご依頼']} />);
    const select = screen.getByLabelText('お問い合わせ種別');
    expect(select).toBeInTheDocument();
    expect(select).toBeRequired();
    expect(screen.getByRole('option', { name: '取材のご依頼' })).toBeInTheDocument();
  });

  it('inquiryTypes を渡さなければ種別セレクトは出ない', () => {
    render(<ContactForm title="x" />);
    expect(screen.queryByLabelText('お問い合わせ種別')).not.toBeInTheDocument();
  });

  it('phone は既定で出ない', () => {
    render(<ContactForm title="x" />);
    expect(screen.queryByLabelText(/電話番号/)).not.toBeInTheDocument();
  });

  it('phone="optional" は任意、"required" は必須で出る', () => {
    const { unmount } = render(<ContactForm title="x" phone="optional" />);
    expect(screen.getByLabelText('電話番号')).not.toBeRequired();
    unmount();

    render(<ContactForm title="x" phone="required" />);
    expect(screen.getByLabelText('電話番号')).toBeRequired();
  });

  it('consent は未チェックで送信できない（同意は任意にできない）', () => {
    render(<ContactForm title="x" consent={{ href: '/privacy' }} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeRequired();
    expect(checkbox).toHaveAttribute('name', 'consent');
  });

  it('consent の既定文はリンクを含む（日本語）', () => {
    render(<ContactForm title="x" consent={{ href: '/privacy' }} />);
    expect(screen.getByRole('link', { name: '個人情報の取り扱い' })).toHaveAttribute(
      'href',
      '/privacy',
    );
  });

  it('consent の文面は差し替えられる', () => {
    render(
      <ContactForm
        title="x"
        lang="en"
        submitLabel="Contact Us"
        consent={{ href: '/privacy', label: <span>Custom consent</span> }}
      />,
    );
    expect(screen.getByText('Custom consent')).toBeInTheDocument();
  });

  it('3フォームすべてで phone と consent が使える', () => {
    render(<ResourceRequestForm title="資料請求" phone="optional" consent={{ href: '/privacy' }} />);
    expect(screen.getByLabelText('電話番号')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeRequired();
  });
});

describe('extraFields（項目だけを足す口）', () => {
  it('種類ごとに DS のフォーム部品で描画する', () => {
    render(
      <ContactForm
        title="x"
        extraFields={[
          { kind: 'text', name: 'department', label: '部署名' },
          { kind: 'select', name: 'budget', label: '予算感', options: ['〜100万', '100万〜'] },
          { kind: 'textarea', name: 'background', label: '背景' },
          { kind: 'checkbox', name: 'newsletter', label: 'メール配信を希望する' },
        ]}
      />,
    );
    expect(screen.getByLabelText('部署名')).toBeInTheDocument();
    expect(screen.getByLabelText('予算感')).toBeInTheDocument();
    expect(screen.getByLabelText('背景')).toBeInTheDocument();
    expect(screen.getByLabelText('メール配信を希望する')).toBeInTheDocument();
  });

  it('required を型どおりに反映する', () => {
    render(
      <ContactForm
        title="x"
        extraFields={[{ kind: 'text', name: 'department', label: '部署名', required: true }]}
      />,
    );
    expect(screen.getByLabelText('部署名')).toBeRequired();
  });

  it('組み込み項目と name が衝突すると dev 警告を出す', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <ContactForm title="x" extraFields={[{ kind: 'text', name: 'email', label: '別メール' }]} />,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain('衝突');
    warn.mockRestore();
  });

  it('衝突しなければ警告しない', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <ContactForm title="x" extraFields={[{ kind: 'text', name: 'department', label: '部署名' }]} />,
    );
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('拡張しても a11y 違反がない', async () => {
    const { container } = render(
      <ContactForm
        title="お問い合わせ"
        inquiryTypes={['製品について']}
        phone="optional"
        consent={{ href: '/privacy' }}
        extraFields={[{ kind: 'text', name: 'department', label: '部署名' }]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
