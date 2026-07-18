import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

/**
 * Central icon registry — Ionicons names used across the design system.
 */
export type IconName = ComponentProps<typeof Ionicons>['name'];

export const icons = {
  // Navigation
  home: 'home',
  homeOutline: 'home-outline',
  chat: 'chatbubbles',
  chatOutline: 'chatbubbles-outline',
  folder: 'folder',
  folderOutline: 'folder-outline',
  calendar: 'calendar',
  calendarOutline: 'calendar-outline',
  person: 'person',
  personOutline: 'person-outline',
  settings: 'settings-outline',
  notifications: 'notifications-outline',

  // Actions
  add: 'add',
  close: 'close',
  check: 'checkmark',
  checkCircle: 'checkmark-circle',
  search: 'search-outline',
  send: 'send',
  edit: 'create-outline',
  delete: 'trash-outline',
  share: 'share-outline',
  upload: 'cloud-upload-outline',
  download: 'download-outline',
  filter: 'filter-outline',
  more: 'ellipsis-horizontal',
  back: 'chevron-back',
  forward: 'chevron-forward',
  expand: 'chevron-down',
  collapse: 'chevron-up',

  // Auth / forms
  mail: 'mail-outline',
  lock: 'lock-closed-outline',
  eye: 'eye-outline',
  eyeOff: 'eye-off-outline',
  google: 'logo-google',
  apple: 'logo-apple',

  // Feedback
  sparkles: 'sparkles',
  sparklesOutline: 'sparkles-outline',
  warning: 'warning-outline',
  error: 'alert-circle-outline',
  success: 'checkmark-circle-outline',
  info: 'information-circle-outline',
  empty: 'file-tray-outline',

  // Study
  document: 'document-text-outline',
  quiz: 'help-circle-outline',
  flashcards: 'albums-outline',
  diamond: 'diamond-outline',
} as const satisfies Record<string, IconName>;

export const iconSizes = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  '2xl': 36,
} as const;

export type IconSize = keyof typeof iconSizes;
