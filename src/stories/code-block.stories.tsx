import type { Meta, StoryObj } from '@storybook/react';
import { CodeBlock } from '../components/code-block';

const meta: Meta<typeof CodeBlock> = {
  title: 'Components/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof CodeBlock>;

const typescriptCode = `interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

function getUser(id: string): Promise<User> {
  return fetch(\`/api/users/\${id}\`)
    .then(res => res.json());
}`;

export const Default: Story = {
  args: {
    language: 'typescript',
    children: typescriptCode,
  },
};

export const WithLineNumbers: Story = {
  args: {
    language: 'typescript',
    showLineNumbers: true,
    children: typescriptCode,
  },
};

export const WithHighlightedLines: Story = {
  args: {
    language: 'typescript',
    showLineNumbers: true,
    highlightLines: [1, 2, 3, 4, 5, 6],
    children: typescriptCode,
  },
};

export const WithTitle: Story = {
  args: {
    title: 'src/models/user.ts',
    language: 'typescript',
    showLineNumbers: true,
    children: typescriptCode,
  },
};
