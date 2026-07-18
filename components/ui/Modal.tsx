import React, { memo } from 'react';
import {
  Modal as RNModal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useTheme } from '@/providers';
import { radius, spacing } from '@/theme';
import { Button } from './Button';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  primaryAction?: { label: string; onPress: () => void; loading?: boolean };
  secondaryAction?: { label: string; onPress: () => void };
  style?: ViewStyle;
}

export const Modal = memo(function Modal({
  visible,
  onClose,
  title,
  children,
  primaryAction,
  secondaryAction,
  style,
}: ModalProps) {
  const { theme } = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(150)}
        style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close modal"
        />
        <Animated.View
          entering={ZoomIn.springify().damping(16)}
          exiting={ZoomOut.duration(150)}
          accessibilityViewIsModal
          style={[styles.sheet, { backgroundColor: theme.colors.surfaceElevated }, style]}
        >
          {title ? (
            <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
          ) : null}
          <View style={styles.body}>{children}</View>
          {(primaryAction || secondaryAction) && (
            <View style={styles.actions}>
              {secondaryAction ? (
                <Button
                  title={secondaryAction.label}
                  variant="ghost"
                  onPress={secondaryAction.onPress}
                  style={styles.actionBtn}
                />
              ) : null}
              {primaryAction ? (
                <Button
                  title={primaryAction.label}
                  onPress={primaryAction.onPress}
                  loading={primaryAction.loading}
                  style={styles.actionBtn}
                />
              ) : null}
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </RNModal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  sheet: {
    borderRadius: radius['2xl'],
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: { fontSize: 20, fontWeight: '700' },
  body: { gap: spacing.sm },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm },
  actionBtn: { flex: 1 },
});
