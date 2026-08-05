import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
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
