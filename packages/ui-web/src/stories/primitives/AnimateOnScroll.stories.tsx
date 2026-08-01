import type { Meta, StoryObj } from '@storybook/react';
import { AnimateOnScroll } from '../../components/primitives/animate-on-scroll';

const meta: Meta<typeof AnimateOnScroll> = {
  title: 'Primitives/AnimateOnScroll',
  component: AnimateOnScroll,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof AnimateOnScroll>;

export const AllAnimations: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <div className="mx-auto max-w-3xl space-y-8 p-8">
        <p className="text-sm text-neutral-500">
          {isJa
            ? '↓ 下にスクロールして各アニメーションを確認してください'
            : '↓ Scroll down to see each animation trigger'}
        </p>
        <div className="h-[60vh]" />

        {(['fade-up', 'fade-in', 'fade-down', 'scale', 'blur-in'] as const).map((animation) => (
          <AnimateOnScroll key={animation} animation={animation}>
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
              <h3 className="text-lg font-bold">{animation}</h3>
              <p className="mt-2 text-sm text-neutral-500">
                {isJa
                  ? `「${animation}」アニメーションで表示されます`
                  : `Appears with "${animation}" animation`}
              </p>
            </div>
          </AnimateOnScroll>
        ))}

        <div className="h-[20vh]" />
      </div>
    );
  },
};

export const StaggerGrid: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <div className="mx-auto max-w-4xl p-8">
        <p className="mb-4 text-sm text-neutral-500">
          {isJa
            ? '↓ スクロールするとカードが順番に出現します（stagger delay）'
            : '↓ Scroll to see cards appear sequentially (stagger delay)'}
        </p>
        <div className="h-[80vh]" />

        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <AnimateOnScroll key={i} animation="fade-up" staggerIndex={i}>
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-500 dark:bg-primary-950">
                  {i + 1}
                </div>
                <h3 className="font-bold">
                  {isJa ? `機能 ${i + 1}` : `Feature ${i + 1}`}
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  {isJa
                    ? `${i * 100}ms の遅延で出現`
                    : `Appears with ${i * 100}ms delay`}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <div className="h-[20vh]" />
      </div>
    );
  },
};
