// Utilities
export { cn } from './lib/cn';
export { createContext } from './lib/create-context';

// Hooks
export { useBreakpoint, BREAKPOINTS, type Breakpoint } from './hooks';
export { useDisplayMode, type DisplayMode } from './hooks';
export { useOnlineStatus } from './hooks';
export { useViewportHeight } from './hooks';
export { useInstallPrompt } from './hooks';

// Components
export { Button, buttonVariants, type ButtonProps } from './components/button';
export { Badge, badgeVariants, type BadgeProps } from './components/badge';
export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  avatarVariants,
  type AvatarProps,
  type AvatarImageProps,
  type AvatarFallbackProps,
} from './components/avatar';
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
