import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Button, Card } from '@/components/ui';
import { useTheme } from '@/providers';
import { goBack } from '@/navigation';
import { spacing, type IconName } from '@/theme';

export interface PlaceholderScreenProps {
  title: string;
  subtitle?: string;
  icon?: IconName;
  showBack?: boolean;
}

/**
 * Premium placeholder for navigation shells — no business logic.
 */
export const PlaceholderScreen = memo(function PlaceholderScreen({
  title,
  subtitle = 'Navigation shell ready. Business logic will connect here.',
  icon = 'construct-outline',
  showBack = true,
}: PlaceholderScreenProps) {
  const { theme } = useTheme();

  return (
    <Screen
      title={title}
      subtitle={subtitle}
      headerRight={
        showBack ? (
          <Button title="Back" variant="ghost" size="sm" onPress={goBack} />
        ) : undefined
      }
    >
      <Card elevated style={styles.card}>
        <View style={[styles.iconWrap, { backgroundColor: theme.colors.primaryMuted }]}>
          <Ionicons name={icon} size={36} color={theme.colors.primary} />
        </View>
        <Text style={[styles.heading, { color: theme.colors.text }]}>{title}</Text>
        <Text
          style={{
            color: theme.colors.textSecondary,
            textAlign: 'center',
            lineHeight: 22,
          }}
        >
          {subtitle}
        </Text>
      </Card>
    </Screen>
  );
});

const styles = StyleSheet.create({
  card: { alignItems: 'center', gap: spacing.md },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: { fontSize: 20, fontWeight: '700' },
});
