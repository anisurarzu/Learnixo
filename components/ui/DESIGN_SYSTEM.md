# StudyAI Design System

Reusable UI foundation inspired by Notion, Linear, Duolingo, and ChatGPT Mobile.

## Tokens

Centralized in `theme/`:

| File            | Purpose                                                |
| --------------- | ------------------------------------------------------ |
| `tokens.ts`     | Master scales (space, radius, sizes, springs, z-index) |
| `colors.ts`     | Light / dark semantic palettes                         |
| `typography.ts` | Type hierarchy                                         |
| `spacing.ts`    | 8px spacing + radius aliases                           |
| `shadows.ts`    | Soft elevation levels                                  |
| `icons.ts`      | Ionicons registry                                      |
| `animations.ts` | Motion presets                                         |

```ts
import { useTheme } from '@/providers';
import { spacing, radius, typography } from '@/theme';

const { theme } = useTheme();
theme.colors.primary;
theme.isDark;
```

## Components

Import from `@/components/ui`:

### Actions

`Button` · `IconButton` · `FloatingButton`

### Inputs

`Input` · `PasswordInput` · `SearchInput` · `OTPInput`

### Surfaces

`Card` · `GlassCard` · `Screen` · `SectionHeader` · `Divider`

### Display

`Avatar` / `UserAvatar` · `Badge` · `Chip` · `Tag` · `AppText`

### Progress

`ProgressBar` · `CircularProgress`

### Overlays

`Modal` · `BottomSheet` · `Toast` / `useToast` · `Snackbar`

### Feedback

`Spinner` · `Skeleton` · `EmptyState` · `ErrorState` · `SuccessState`

## Toast usage

```ts
import { useToast } from '@/components/ui';

const toast = useToast();
toast.success('Saved', 'Your notes are up to date.');
```

## Conventions

- Variants + sizes on interactive components
- Loading / disabled / error states where relevant
- Press-scale Reanimated feedback
- Accessibility roles & labels
- Dark mode via `ThemeProvider` (light / dark / system)
