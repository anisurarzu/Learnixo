import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Button } from '@/components/ui';
import { useTheme } from '@/providers';
import { useThemeStore } from '@/store';
import type { ThemeMode } from '@/theme';
import { spacing } from '@/theme';

const THEME_OPTIONS: {
  label: string;
  value: ThemeMode;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { label: 'System', value: 'system', icon: 'phone-portrait-outline' },
  { label: 'Light', value: 'light', icon: 'sunny-outline' },
  { label: 'Dark', value: 'dark', icon: 'moon-outline' },
];

export default function SettingsScreen() {
  const { theme, mode } = useTheme();
  const setMode = useThemeStore((s) => s.setMode);

  return (
    <Screen
      title="Settings"
      subtitle="Appearance and app preferences."
      headerRight={
        <Button title="Done" variant="ghost" size="sm" onPress={() => router.back()} />
      }
    >
      <Text style={[styles.section, { color: theme.colors.text }]}>Appearance</Text>
      <Card elevated padded={false}>
        {THEME_OPTIONS.map((option, index) => {
          const selected = mode === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => setMode(option.value)}
              style={[
                styles.row,
                index < THEME_OPTIONS.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: theme.colors.border,
                },
              ]}
            >
              <View style={styles.rowLeft}>
                <Ionicons name={option.icon} size={20} color={theme.colors.primary} />
                <Text style={[styles.rowLabel, { color: theme.colors.text }]}>
                  {option.label}
                </Text>
              </View>
              {selected ? (
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={theme.colors.primary}
                />
              ) : (
                <View style={[styles.radio, { borderColor: theme.colors.border }]} />
              )}
            </Pressable>
          );
        })}
      </Card>

      <Text style={[styles.section, { color: theme.colors.text, marginTop: spacing.xl }]}>
        About
      </Text>
      <Card elevated>
        <Text style={{ color: theme.colors.textSecondary, lineHeight: 22 }}>
          StudyAI foundation build. Business logic, AI pipelines, and billing are
          intentionally stubbed for this scaffold.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { fontSize: 16, fontWeight: '700', marginBottom: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rowLabel: { fontSize: 16, fontWeight: '600' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
});
