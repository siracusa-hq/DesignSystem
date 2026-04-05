import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { axe } from 'vitest-axe';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
} from './file-upload';

beforeAll(() => {
  if (typeof URL.createObjectURL === 'undefined') {
    URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    URL.revokeObjectURL = vi.fn();
  }
});

function createFile(name: string, size: number, type: string): File {
  const buffer = new ArrayBuffer(size);
  return new File([buffer], name, { type });
}

function createDtWithFiles(files: File[]) {
  return {
    dataTransfer: {
      files,
      items: files.map((file) => ({
        kind: 'file' as const,
        type: file.type,
        getAsFile: () => file,
      })),
      types: ['Files'],
    },
  };
}

function renderFileUpload(props?: Partial<React.ComponentProps<typeof FileUpload>>) {
  const defaultProps = {
    value: [] as File[],
    onValueChange: vi.fn(),
    multiple: true,
    ...props,
  };
  return {
    ...render(
      <FileUpload {...defaultProps}>
        <FileUploadDropzone />
        <FileUploadList />
      </FileUpload>,
    ),
    onValueChange: defaultProps.onValueChange,
  };
}

describe('FileUpload', () => {
  it('renders the dropzone', () => {
    renderFileUpload();
    expect(screen.getByText(/Drag & drop or click to browse/)).toBeInTheDocument();
  });

  it('renders as a presentation role with aria-label', () => {
    renderFileUpload();
    const zone = screen.getByLabelText('File upload drop zone');
    expect(zone).toBeInTheDocument();
    expect(zone).toHaveAttribute('role', 'presentation');
  });

  it('handles file drop on dropzone', async () => {
    const onValueChange = vi.fn();
    render(
      <FileUpload value={[]} onValueChange={onValueChange} multiple>
        <FileUploadDropzone />
        <FileUploadList />
      </FileUpload>,
    );

    const file = createFile('test.png', 1024, 'image/png');
    const dropzone = screen.getByLabelText('File upload drop zone');

    fireEvent.dragEnter(dropzone, createDtWithFiles([file]));
    fireEvent.drop(dropzone, createDtWithFiles([file]));

    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith([file]);
    });
  });

  it('displays file list when files are present', () => {
    const files = [
      createFile('photo.jpg', 2048, 'image/jpeg'),
      createFile('doc.pdf', 4096, 'application/pdf'),
    ];
    renderFileUpload({ value: files });

    expect(screen.getByText('photo.jpg')).toBeInTheDocument();
    expect(screen.getByText('doc.pdf')).toBeInTheDocument();
    expect(screen.getByText('2 KB')).toBeInTheDocument();
    expect(screen.getByText('4 KB')).toBeInTheDocument();
  });

  it('removes file on X button click', async () => {
    const user = userEvent.setup();
    const files = [createFile('test.png', 1024, 'image/png')];
    const { onValueChange } = renderFileUpload({ value: files });

    await user.click(screen.getByLabelText('Remove test.png'));
    expect(onValueChange).toHaveBeenCalledWith([]);
  });

  it('does not render file list when empty', () => {
    renderFileUpload({ value: [] });
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('applies disabled state to dropzone', () => {
    renderFileUpload({ disabled: true });
    const zone = screen.getByLabelText('File upload drop zone');
    expect(zone.className).toContain('opacity-50');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderFileUpload();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with files', async () => {
    const files = [createFile('test.png', 1024, 'image/png')];
    const { container } = renderFileUpload({ value: files });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
