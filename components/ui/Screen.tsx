import React, { memo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/providers';
import { spacing } from '@/theme';
import { Spinner } from './Spinner';

export interface ScreenProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  scroll?: boolean;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  padded?: boolean;
}

export const Screen = memo(function Screen({
  children,
  title,
  subtitle,
  headerRight,
  scroll = true,
  loading = false,
  refreshing = false,
  onRefresh,
  style,
  contentStyle,
  padded = true,
}: ScreenProps) {
  const { theme } = useTheme();

  if (loading) {
    return <Spinner fullScreen message="Loading…" />;
  }

  const header =
    title || headerRight ? (
      <Animated.View entering={FadeInDown.duration(300)} style={styles.header}>
        <View style={styles.headerText}>
          {title ? (
            <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
          ) : null}
          {subtitle ? (
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {headerRight}
      </Animated.View>
    ) : null;

  const body = (
    <>
      {header}
      {children}
    </>
  );

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safe, { backgroundColor: theme.colors.background }, style]}
    >
      {scroll ? (
        <ScrollView
          contentContainerStyle={[
            padded && styles.padded,
            styles.scrollContent,
            contentStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.colors.primary}
              />
            ) : undefined
          }
        >
          {body}
        </ScrollView>
      ) : (
        <View style={[padded && styles.padded, styles.fill, contentStyle]}>{body}</View>
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safe: { flex: 1 },
  fill: { flex: 1 },
  padded: { paddingHorizontal: spacing.lg, paddingBottom: spacing['3xl'] },
  scrollContent: { flexGrow: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  headerText: { flex: 1, gap: spacing.xs },
  title: { fontSize: 30, fontWeight: '700', letterSpacing: -0.4 },
  subtitle: { fontSize: 15, lineHeight: 22 },
});
