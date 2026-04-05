import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Upload, ImageIcon } from 'lucide-react';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
} from '../components/file-upload';

const meta: Meta<typeof FileUpload> = {
  title: 'Components/FileUpload',
  component: FileUpload,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [(Story) => <div className="w-full max-w-md"><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  render: () => {
    const [files, setFiles] = React.useState<File[]>([]);
    return (
      <FileUpload value={files} onValueChange={setFiles} multiple>
        <FileUploadDropzone />
        <FileUploadList />
      </FileUpload>
    );
  },
};

export const ImagesOnly: Story = {
  render: () => {
    const [files, setFiles] = React.useState<File[]>([]);
    return (
      <FileUpload
        value={files}
        onValueChange={setFiles}
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] }}
        maxSize={10 * 1024 * 1024}
        multiple
      >
        <FileUploadDropzone>
          <ImageIcon className="mb-3 size-8 text-[var(--color-on-surface-muted)]" />
          <p className="text-sm font-medium text-[var(--color-on-surface)]">
            Drop images here or click to browse
          </p>
          <p className="mt-1 text-xs text-[var(--color-on-surface-muted)]">
            PNG, JPG, GIF, WebP up to 10MB
          </p>
        </FileUploadDropzone>
        <FileUploadList />
      </FileUpload>
    );
  },
};

export const SingleFile: Story = {
  render: () => {
    const [files, setFiles] = React.useState<File[]>([]);
    return (
      <FileUpload
        value={files}
        onValueChange={setFiles}
        multiple={false}
        maxFiles={1}
      >
        <FileUploadDropzone>
          <Upload className="mb-3 size-8 text-[var(--color-on-surface-muted)]" />
          <p className="text-sm font-medium text-[var(--color-on-surface)]">
            Upload a single file
          </p>
        </FileUploadDropzone>
        <FileUploadList />
      </FileUpload>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <FileUpload value={[]} onValueChange={() => {}} disabled>
      <FileUploadDropzone />
      <FileUploadList />
    </FileUpload>
  ),
};
