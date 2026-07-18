import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  Card,
  Badge,
  ProgressBar,
  Avatar,
  SkeletonCard,
  Chip,
} from '@/components/ui';
import { useTheme } from '@/providers';
import { useAuthStore } from '@/store';
import { createShadow, radius, spacing } from '@/theme';

const QUICK_ACTIONS = [
  { label: 'Upload PDF', icon: 'cloud-upload-outline' as const, href: '/upload' },
  { label: 'AI Chat', icon: 'sparkles-outline' as const, href: '/(tabs)/chat' },
  { label: 'Quiz', icon: 'help-circle-outline' as const, href: '/quiz' },
  { label: 'Flashcards', icon: 'albums-outline' as const, href: '/flashcards' },
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('Today');

  const onRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 900);
  };

  return (
    <Screen
      title={`Hey, ${user?.displayName?.split(' ')[0] ?? 'Learner'}`}
      subtitle="Ready for a focused study session?"
      headerRight={<Avatar name={user?.displayName} size="md" />}
      refreshing={loading}
      onRefresh={onRefresh}
    >
      {loading ? (
        <SkeletonCard />
      ) : (
        <>
          <Card elevated style={styles.streakCard}>
            <View style={styles.streakHeader}>
              <View>
                <Text style={[styles.streakLabel, { color: theme.colors.textSecondary }]}>
                  Study streak
                </Text>
                <Text style={[styles.streakValue, { color: theme.colors.text }]}>
                  7 days
                </Text>
              </View>
              <Badge label="Pro ready" variant="secondary" />
            </View>
            <ProgressBar progress={0.65} />
            <Text style={[styles.streakHint, { color: theme.colors.textMuted }]}>
              65% of your weekly goal completed
            </Text>
          </Card>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick actions
          </Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <Pressable
                key={action.label}
                onPress={() => router.push(action.href as never)}
                style={[
                  styles.actionTile,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                  },
                  createShadow('sm', theme.colors.shadow),
                ]}
              >
                <View
                  style={[
                    styles.actionIcon,
                    { backgroundColor: `${theme.colors.primary}18` },
                  ]}
                >
                  <Ionicons name={action.icon} size={22} color={theme.colors.primary} />
                </View>
                <Text style={[styles.actionLabel, { color: theme.colors.text }]}>
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.chipRow}>
            {['Today', 'This week', 'All'].map((item) => (
              <Chip
                key={item}
                label={item}
                selected={filter === item}
                onPress={() => setFilter(item)}
              />
            ))}
          </View>

          <Card
            elevated
            onPress={() => router.push('/summary')}
            style={styles.activityCard}
          >
            <Badge label="Summary" variant="primary" />
            <Text style={[styles.activityTitle, { color: theme.colors.text }]}>
              Intro to Machine Learning
            </Text>
            <Text style={[styles.activityBody, { color: theme.colors.textSecondary }]}>
              Placeholder activity card — connect document summaries here.
            </Text>
          </Card>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  streakCard: { gap: spacing.md, marginBottom: spacing.lg },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  streakLabel: { fontSize: 14, fontWeight: '500' },
  streakValue: { fontSize: 28, fontWeight: '800', marginTop: 4 },
  streakHint: { fontSize: 13 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  actionTile: {
    width: '48%',
    borderRadius: radius['2xl'],
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.md,
    gap: spacing.sm,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { fontSize: 14, fontWeight: '600' },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  activityCard: { gap: spacing.sm },
  activityTitle: { fontSize: 18, fontWeight: '700' },
  activityBody: { fontSize: 14, lineHeight: 20 },
});
