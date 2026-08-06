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
    expect(screen.getByLabelText('Preferred Time')).toBeInTheDocument();
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
