import React, { memo } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '@/providers';
import { spacing, type IconName, type SemanticColor } from '@/theme';
import { Button } from './Button';
import { semanticColors } from './utils';

interface StateBaseProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export interface EmptyStateProps extends StateBaseProps {
  icon?: IconName;
}

export interface ErrorStateProps extends StateBaseProps {
  icon?: IconName;
}

export interface SuccessStateProps extends StateBaseProps {
  icon?: IconName;
}

function StatusBlock({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  tone,
  style,
}: StateBaseProps & { icon: IconName; tone: SemanticColor }) {
  const { theme } = useTheme();
  const tint = semanticColors(theme.colors, tone);

  return (
    <Animated.View entering={FadeIn.duration(300)} style={[styles.container, style]}>
      <View style={[styles.iconWrap, { backgroundColor: tint.bg }]}>
        <Ionicons name={icon} size={36} color={tint.fg} />
      </View>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {description ? (
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant={tone === 'error' ? 'danger' : 'primary'}
          style={styles.button}
        />
      ) : null}
    </Animated.View>
  );
}

export const EmptyState = memo(function EmptyState({
  icon = 'file-tray-outline',
  ...props
}: EmptyStateProps) {
  return <StatusBlock icon={icon} tone="primary" {...props} />;
});

export const ErrorState = memo(function ErrorState({
  icon = 'alert-circle-outline',
  title = 'Something went wrong',
  ...props
}: ErrorStateProps) {
  return <StatusBlock icon={icon} tone="error" title={title} {...props} />;
});

export const SuccessState = memo(function SuccessState({
  icon = 'checkmark-circle-outline',
  title = 'Success',
  ...props
}: SuccessStateProps) {
  return <StatusBlock icon={icon} tone="success" title={title} {...props} />;
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['3xl'],
    gap: spacing.sm,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  description: { fontSize: 15, textAlign: 'center', lineHeight: 22, maxWidth: 300 },
  button: { marginTop: spacing.md },
});
