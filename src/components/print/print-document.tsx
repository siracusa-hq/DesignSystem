import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

/* ----------------------------------------------------------------
   PrintDocument — A4/Letter page wrapper for PDF reports

   mm 単位で正確な用紙サイズを指定。
   box-sizing: border-box で padding を含む。
   pdfg に送る際は margin: 0 でパディングを CSS 側で管理。
   ---------------------------------------------------------------- */

const printDocumentVariants = cva(
  [
    'bg-white text-neutral-900',
    'flex flex-col',
    // Screen preview: paper-on-desk effect
    'screen:shadow-lg screen:border screen:border-neutral-200',
  ].join(' '),
  {
    variants: {
      size: {
        A4: 'w-[210mm] min-h-[297mm]',
        Letter: 'w-[8.5in] min-h-[11in]',
      },
      orientation: {
        portrait: '',
        landscape: '',
      },
    },
    compoundVariants: [
      { size: 'A4', orientation: 'landscape', className: 'w-[297mm] min-h-[210mm]' },
      { size: 'Letter', orientation: 'landscape', className: 'w-[11in] min-h-[8.5in]' },
    ],
    defaultVariants: {
      size: 'A4',
      orientation: 'portrait',
    },
  },
);

export interface PrintDocumentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof printDocumentVariants> {
  /** Padding inside the document. Default: "20mm" */
  padding?: string;
}

const PrintDocument = React.forwardRef<HTMLDivElement, PrintDocumentProps>(
  ({ className, size, orientation, padding = '20mm', style, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(printDocumentVariants({ size, orientation }), className)}
      style={{
        padding,
        boxSizing: 'border-box',
        fontFamily: 'Inter, "Noto Sans JP", sans-serif',
        fontSize: '10pt',
        lineHeight: '1.6',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  ),
);
PrintDocument.displayName = 'PrintDocument';

/* ----------------------------------------------------------------
   PrintHeader — Report header with logo, title, and meta info
   ---------------------------------------------------------------- */

export interface PrintHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Logo element (img or SVG) */
  logo?: React.ReactNode;
  /** Main title (e.g., "請求書") */
  title?: string;
  /** Subtitle (e.g., "Invoice") */
  subtitle?: string;
  /** Right-aligned meta info (e.g., invoice number, date) */
  meta?: React.ReactNode;
}

const PrintHeader = React.forwardRef<HTMLDivElement, PrintHeaderProps>(
  ({ className, logo, title, subtitle, meta, children, ...props }, ref) => (
    <div ref={ref} className={cn('mb-6', className)} {...props}>
      {/* Brand accent bar */}
      <div className="h-1 bg-primary-500 rounded-full mb-5" />
      <div className="flex items-start justify-between pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          {logo && <div className="shrink-0">{logo}</div>}
          <div>
            {title && <h1 className="text-xl font-bold text-neutral-900 leading-tight">{title}</h1>}
            {subtitle && (
              <p className="text-[8pt] font-medium tracking-widest uppercase text-neutral-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {meta && <div className="text-right text-[9pt] text-neutral-600 leading-relaxed">{meta}</div>}
        {children}
      </div>
    </div>
  ),
);
PrintHeader.displayName = 'PrintHeader';

/* ----------------------------------------------------------------
   PrintFooter — Report footer with notes and company info
   ---------------------------------------------------------------- */

export interface PrintFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const PrintFooter = React.forwardRef<HTMLDivElement, PrintFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-auto pt-4 border-t border-neutral-200 text-[8pt] text-neutral-400 text-center leading-relaxed', className)}
      {...props}
    >
      {children}
    </div>
  ),
);
PrintFooter.displayName = 'PrintFooter';

export { PrintDocument, printDocumentVariants, PrintHeader, PrintFooter };
