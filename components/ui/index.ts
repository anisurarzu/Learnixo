/**
 * StudyAI Design System — public API
 */

// Actions
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';
export { IconButton } from './IconButton';
export type { IconButtonProps, IconButtonVariant, IconButtonSize } from './IconButton';
export { FloatingButton, FloatingActionButton } from './FloatingButton';
export type {
  FloatingButtonProps,
  FloatingButtonSize,
  FloatingActionButtonProps,
} from './FloatingButton';

// Inputs
export { Input, PasswordInput } from './Input';
export type { InputProps, InputSize } from './Input';
export { SearchInput, SearchBar } from './SearchInput';
export type { SearchInputProps, SearchBarProps } from './SearchInput';
export { OTPInput } from './OTPInput';
export type { OTPInputProps } from './OTPInput';

// Surfaces
export { Card } from './Card';
export type { CardProps } from './Card';
export { GlassCard } from './GlassCard';
export type { GlassCardProps } from './GlassCard';
export { Screen } from './Screen';
export type { ScreenProps } from './Screen';
export { SectionHeader } from './SectionHeader';
export type { SectionHeaderProps } from './SectionHeader';
export { Divider } from './Divider';
export type { DividerProps } from './Divider';

// Display
export { Avatar, UserAvatar } from './Avatar';
export type { AvatarProps, AvatarSize } from './Avatar';
export { Badge } from './Badge';
export type { BadgeProps, BadgeSize } from './Badge';
export { Chip } from './Chip';
export type { ChipProps } from './Chip';
export { Tag } from './Tag';
export type { TagProps } from './Tag';
export { AppText, Typography } from './Text';
export type { AppTextProps, TextProps } from './Text';

// Progress
export { ProgressBar } from './ProgressBar';
export type { ProgressBarProps } from './ProgressBar';
export { CircularProgress } from './CircularProgress';
export type { CircularProgressProps } from './CircularProgress';

// Overlays
export { Modal } from './Modal';
export type { ModalProps } from './Modal';
export { AppBottomSheet, BottomSheet } from './BottomSheet';
export type { AppBottomSheetProps, BottomSheetProps } from './BottomSheet';
export { Toast, ToastProvider, useToast } from './Toast';
export type { ToastOptions, ToastVariant } from './Toast';
export { Snackbar } from './Snackbar';
export type { SnackbarProps } from './Snackbar';

// Feedback
export { Spinner, Loading } from './Spinner';
export type { SpinnerProps, SpinnerSize, LoadingProps } from './Spinner';
export { Skeleton, SkeletonCard, SkeletonLoader } from './Skeleton';
export type { SkeletonProps } from './Skeleton';
export { EmptyState, ErrorState, SuccessState } from './EmptyState';
export type { EmptyStateProps, ErrorStateProps, SuccessStateProps } from './EmptyState';
