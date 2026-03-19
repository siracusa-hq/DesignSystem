// Utilities
export { cn } from './lib/cn';
export { createContext } from './lib/create-context';

// Hooks
export { useBreakpoint, BREAKPOINTS, type Breakpoint } from './hooks';
export { useDisplayMode, type DisplayMode } from './hooks';
export { useOnlineStatus } from './hooks';
export { useViewportHeight } from './hooks';
export { useInstallPrompt } from './hooks';
export { useTheme, type UseThemeOptions, type UseThemeReturn } from './hooks/use-theme';

// Theme
export {
  ThemeProvider,
  useTheme as useThemeContext,
  type ThemeProviderProps,
  type Theme,
  type ResolvedTheme,
} from './components/theme-provider';

// Components
export { Button, buttonVariants, type ButtonProps } from './components/button';
export { Badge, badgeVariants, type BadgeProps } from './components/badge';
export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarStatus,
  avatarVariants,
  type AvatarProps,
  type AvatarImageProps,
  type AvatarFallbackProps,
  type AvatarStatusProps,
  type AvatarStatusType,
} from './components/avatar';
export { AvatarGroup, type AvatarGroupProps } from './components/avatar-group';
export { Separator, type SeparatorProps } from './components/separator';
export { Skeleton, type SkeletonProps } from './components/skeleton';
export { Spinner, spinnerVariants, type SpinnerProps } from './components/spinner';
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './components/card';
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from './components/tooltip';
export {
  Toast,
  ToastAction,
  ToastClose,
  ToastTitle,
  ToastDescription,
  ToastProvider,
  ToastViewport,
  toastVariants,
  type ToastProps,
  type ToastActionElement,
} from './components/toast';
export { useToast, toast } from './components/toast';
export { Toaster } from './components/toast';

// Form Atoms
export { Label, type LabelProps } from './components/label';
export { Input, inputVariants, type InputProps } from './components/input';
export {
  Textarea,
  textareaVariants,
  type TextareaProps,
} from './components/textarea';
export { Checkbox, type CheckboxProps } from './components/checkbox';
export {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupProps,
  type RadioGroupItemProps,
} from './components/radio-group';
export { Switch, switchVariants, type SwitchProps } from './components/switch';

// Form Composites
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
} from './components/select';
export { NumberInput, type NumberInputProps } from './components/number-input';
export { DatePicker, type DatePickerProps } from './components/date-picker';
export {
  Combobox,
  type ComboboxProps,
  type ComboboxOption,
} from './components/combobox';

// Form Patterns
export {
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
  type FormFieldProps,
  type FormLabelProps,
  type FormControlProps,
  type FormDescriptionProps,
  type FormMessageProps,
} from './components/form-field';
export {
  DynamicFormField,
  getFieldComponent,
  type DynamicFormFieldProps,
  type FieldType,
  type FieldOption,
} from './components/dynamic-form-field';
export {
  FormLayout,
  formLayoutVariants,
  FormSection,
  FormActions,
  type FormLayoutProps,
  type FormSectionProps,
  type FormActionsProps,
} from './components/form-layout';

// Data Display
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  type TabsListProps,
} from './components/tabs';
export {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
  type EmptyStateProps,
} from './components/empty-state';
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './components/table';
export {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableToolbar,
  type DataTableProps,
} from './components/data-table';
export {
  FilterBar,
  FilterBarGroup,
  FilterChip,
  ActiveFilters,
  FilterBarActions,
  type FilterChipProps,
  type ActiveFiltersProps,
} from './components/filter-bar';

// Navigation + Layout
export {
  Popover,
  PopoverTrigger,
  PopoverAnchor,
  PopoverContent,
} from './components/popover';
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  type DropdownMenuItemProps,
} from './components/dropdown-menu';
export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './components/dialog';
export {
  CommandPalette,
  CommandPaletteGroup,
  CommandPaletteItem,
  CommandPaletteSeparator,
  CommandPaletteEmpty,
  CommandPaletteShortcut,
  type CommandPaletteProps,
  type CommandPaletteGroupProps,
  type CommandPaletteItemProps,
} from './components/command-palette';
export {
  DrawerProvider,
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  type DrawerProps,
  type DrawerContentProps,
} from './components/drawer';
export {
  AppShell,
  AppShellSidebar,
  AppShellHeader,
  AppShellContent,
  AppShellFooter,
  useAppShell,
  type AppShellProps,
} from './components/app-shell';

// PWA Components
export {
  BottomNavigation,
  BottomNavigationItem,
  type BottomNavigationProps,
  type BottomNavigationItemProps,
} from './components/bottom-navigation';
export {
  OfflineIndicator,
  type OfflineIndicatorProps,
} from './components/offline-indicator';
export {
  InstallPrompt,
  type InstallPromptProps,
} from './components/install-prompt';
export {
  PullToRefresh,
  type PullToRefreshProps,
} from './components/pull-to-refresh';

// Print / 帳票
export {
  PrintDocument,
  printDocumentVariants,
  PrintHeader,
  PrintFooter,
  PrintTable,
  PrintTableHeader,
  PrintTableBody,
  PrintTableFooter,
  PrintTableRow,
  PrintTableHead,
  PrintTableCell,
  PrintField,
  PrintFieldGroup,
  printFieldGroupVariants,
  PrintDivider,
  type PrintDocumentProps,
  type PrintHeaderProps,
  type PrintFooterProps,
  type PrintTableProps,
  type PrintTableHeaderProps,
  type PrintTableBodyProps,
  type PrintTableFooterProps,
  type PrintTableRowProps,
  type PrintTableHeadProps,
  type PrintTableCellProps,
  type PrintFieldProps,
  type PrintFieldGroupProps,
  type PrintDividerProps,
} from './components/print';

// Chart / Dashboard
export { StatCard, type StatCardProps } from './components/stat-card';
export { ChartContainer, type ChartContainerProps } from './components/chart-container';
export {
  chartColors,
  type ChartCategoricalColors,
  type ChartSemanticColors,
} from './tokens/chart-theme';
export {
  getChartColors,
  getChartSubtleColors,
  getChartTheme,
  ChartTooltip,
  ChartLegend,
  type ChartTooltipProps,
  type ChartLegendProps,
} from './components/chart';
