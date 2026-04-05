import * as React from 'react';
import { useDropzone, type DropzoneOptions, type FileRejection } from 'react-dropzone';
import { Upload, X, File as FileIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

/* ---------------------------------------------------------------
   Context
   --------------------------------------------------------------- */

interface FileUploadContextValue {
  files: File[];
  removeFile: (index: number) => void;
  getRootProps: ReturnType<typeof useDropzone>['getRootProps'];
  getInputProps: ReturnType<typeof useDropzone>['getInputProps'];
  isDragActive: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
  open: () => void;
  disabled: boolean;
}

const FileUploadContext = React.createContext<FileUploadContextValue | null>(null);

function useFileUploadContext() {
  const ctx = React.useContext(FileUploadContext);
  if (!ctx) throw new Error('FileUpload.* must be used within <FileUpload>');
  return ctx;
}

/* ---------------------------------------------------------------
   FileUpload (Root)
   --------------------------------------------------------------- */

export interface FileUploadProps
  extends Omit<DropzoneOptions, 'onDrop' | 'disabled'> {
  value?: File[];
  onValueChange?: (files: File[]) => void;
  onReject?: (rejections: FileRejection[]) => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      value = [],
      onValueChange,
      onReject,
      disabled = false,
      children,
      className,
      ...dropzoneOptions
    },
    ref,
  ) => {
    const onDrop = React.useCallback(
      (accepted: File[], rejected: FileRejection[]) => {
        if (accepted.length > 0) {
          const next = dropzoneOptions.multiple !== false
            ? [...value, ...accepted]
            : accepted;
          onValueChange?.(next);
        }
        if (rejected.length > 0) {
          onReject?.(rejected);
        }
      },
      [value, onValueChange, onReject, dropzoneOptions.multiple],
    );

    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject,
      open,
    } = useDropzone({
      ...dropzoneOptions,
      disabled,
      onDrop,
      noClick: true,
      noKeyboard: true,
    });

    const removeFile = React.useCallback(
      (index: number) => {
        const next = [...value];
        next.splice(index, 1);
        onValueChange?.(next);
      },
      [value, onValueChange],
    );

    const ctx = React.useMemo<FileUploadContextValue>(
      () => ({
        files: value,
        removeFile,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        open,
        disabled,
      }),
      [value, removeFile, getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, open, disabled],
    );

    return (
      <FileUploadContext.Provider value={ctx}>
        <div ref={ref} className={cn('flex flex-col gap-3', className)}>
          {children}
        </div>
      </FileUploadContext.Provider>
    );
  },
);
FileUpload.displayName = 'FileUpload';

/* ---------------------------------------------------------------
   FileUploadDropzone
   --------------------------------------------------------------- */

export interface FileUploadDropzoneProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const FileUploadDropzone = React.forwardRef<
  HTMLDivElement,
  FileUploadDropzoneProps
>(({ className, children, ...props }, ref) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    open,
    disabled,
  } = useFileUploadContext();

  return (
    <div
      ref={ref}
      {...getRootProps({
        onClick: disabled ? undefined : (e) => { e.stopPropagation(); open(); },
        onKeyDown: (e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            open();
          }
        },
      })}
      role="presentation"
      aria-label="File upload drop zone"
      className={cn(
        'relative flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors',
        'border-[var(--color-border-input)] bg-transparent',
        'hover:border-[var(--color-on-surface-muted)] hover:bg-[var(--color-surface-muted)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        isDragAccept && 'border-primary-500 bg-primary-500/5',
        isDragReject && 'border-error-500 bg-error-500/5',
        isDragActive && !isDragAccept && !isDragReject && 'border-primary-500 bg-primary-500/5',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
      {...props}
    >
      <input {...getInputProps()} aria-label="File upload" />
      {children ?? (
        <>
          <Upload className="mb-3 size-8 text-[var(--color-on-surface-muted)]" />
          <p className="text-sm font-medium text-[var(--color-on-surface)]">
            {isDragActive ? 'Drop files here' : 'Drag & drop or click to browse'}
          </p>
        </>
      )}
    </div>
  );
});
FileUploadDropzone.displayName = 'FileUploadDropzone';

/* ---------------------------------------------------------------
   FileUploadList
   --------------------------------------------------------------- */

export interface FileUploadListProps
  extends React.HTMLAttributes<HTMLUListElement> {}

export const FileUploadList = React.forwardRef<
  HTMLUListElement,
  FileUploadListProps
>(({ className, ...props }, ref) => {
  const { files } = useFileUploadContext();
  if (files.length === 0) return null;

  return (
    <ul
      ref={ref}
      role="list"
      aria-label="Uploaded files"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    >
      {files.map((file, index) => (
        <FileUploadItem key={`${file.name}-${file.lastModified}`} file={file} index={index} />
      ))}
    </ul>
  );
});
FileUploadList.displayName = 'FileUploadList';

/* ---------------------------------------------------------------
   FileUploadItem (internal)
   --------------------------------------------------------------- */

function FileUploadItem({ file, index }: { file: File; index: number }) {
  const { removeFile, disabled } = useFileUploadContext();
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  return (
    <li className="flex items-center gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2">
      {preview ? (
        <img
          src={preview}
          alt={file.name}
          className="size-10 shrink-0 rounded-md object-cover"
        />
      ) : (
        <FileIcon className="size-10 shrink-0 text-[var(--color-on-surface-muted)] p-2" />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--color-on-surface)]">
          {file.name}
        </p>
        <p className="text-xs text-[var(--color-on-surface-muted)]">
          {formatBytes(file.size)}
        </p>
      </div>
      <button
        type="button"
        aria-label={`Remove ${file.name}`}
        disabled={disabled}
        onClick={() => removeFile(index)}
        className="shrink-0 rounded-sm p-1 text-[var(--color-on-surface-muted)] transition-colors hover:text-[var(--color-on-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50"
      >
        <X className="size-4" />
      </button>
    </li>
  );
}

/* ---------------------------------------------------------------
   Utilities
   --------------------------------------------------------------- */

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
