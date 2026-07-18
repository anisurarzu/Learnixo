import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp, Layout } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/providers';
import { createShadow, radius, spacing, type IconName } from '@/theme';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  title: string;
  message?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  show: (options: ToastOptions) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  hide: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastVariant, IconName> = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  warning: 'warning',
  info: 'information-circle',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const hide = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (options: ToastOptions) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const item: ToastItem = {
        id,
        variant: 'info',
        duration: 3200,
        ...options,
      };
      setToasts((prev) => [...prev.slice(-2), item]);
      setTimeout(() => hide(id), item.duration);
    },
    [hide],
  );

  const api = useMemo<ToastContextValue>(
    () => ({
      show,
      hide,
      success: (title, message) => show({ title, message, variant: 'success' }),
      error: (title, message) => show({ title, message, variant: 'error' }),
      warning: (title, message) => show({ title, message, variant: 'warning' }),
      info: (title, message) => show({ title, message, variant: 'info' }),
    }),
    [hide, show],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <View
        pointerEvents="box-none"
        style={[styles.host, { top: insets.top + spacing.sm }]}
      >
        {toasts.map((toast) => {
          const color =
            toast.variant === 'success'
              ? theme.colors.success
              : toast.variant === 'error'
                ? theme.colors.error
                : toast.variant === 'warning'
                  ? theme.colors.warning
                  : theme.colors.info;

          return (
            <Animated.View
              key={toast.id}
              entering={FadeInUp.springify().damping(16)}
              exiting={FadeOutUp.duration(180)}
              layout={Layout.springify()}
              style={[
                styles.toast,
                {
                  backgroundColor: theme.colors.surfaceElevated,
                  borderColor: theme.colors.border,
                },
                createShadow('lg', theme.colors.shadow),
              ]}
            >
              <Ionicons name={ICONS[toast.variant ?? 'info']} size={22} color={color} />
              <View style={styles.content}>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                  {toast.title}
                </Text>
                {toast.message ? (
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 13 }}>
                    {toast.message}
                  </Text>
                ) : null}
              </View>
              <Pressable
                onPress={() => hide(toast.id)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Dismiss"
              >
                <Ionicons name="close" size={18} color={theme.colors.textMuted} />
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

/** Presentational toast (controlled) */
export const Toast = memo(function Toast({
  title,
  message,
  variant = 'info',
  onDismiss,
}: ToastOptions & { onDismiss?: () => void }) {
  const { theme } = useTheme();
  const color =
    variant === 'success'
      ? theme.colors.success
      : variant === 'error'
        ? theme.colors.error
        : variant === 'warning'
          ? theme.colors.warning
          : theme.colors.info;

  return (
    <View
      style={[
        styles.toast,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.border,
        },
        createShadow('md', theme.colors.shadow),
      ]}
    >
      <Ionicons name={ICONS[variant]} size={22} color={color} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        {message ? (
          <Text style={{ color: theme.colors.textSecondary, fontSize: 13 }}>
            {message}
          </Text>
        ) : null}
      </View>
      {onDismiss ? (
        <Pressable onPress={onDismiss} hitSlop={8}>
          <Ionicons name="close" size={18} color={theme.colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    zIndex: 60,
    gap: spacing.sm,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
  },
  content: { flex: 1, gap: 2 },
  title: { fontSize: 15, fontWeight: '700' },
});
