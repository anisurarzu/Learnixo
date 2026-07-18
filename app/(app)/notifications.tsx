import { StyleSheet, Text, View } from 'react-native';
import { goBack } from '@/navigation';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Button, EmptyState, Badge } from '@/components/ui';
import { useTheme } from '@/providers';
import { spacing } from '@/theme';

const SAMPLE = [
  {
    id: '1',
    title: 'Quiz ready',
    body: 'Your Machine Learning quiz is ready to take.',
    time: '2h ago',
  },
  {
    id: '2',
    title: 'Study reminder',
    body: 'You have a 30-minute session planned for tonight.',
    time: 'Yesterday',
  },
];

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const hasNotifications = SAMPLE.length > 0;

  return (
    <Screen
      title="Notifications"
      subtitle="Stay on top of study updates."
      headerRight={<Button title="Close" variant="ghost" size="sm" onPress={goBack} />}
    >
      {hasNotifications ? (
        SAMPLE.map((item) => (
          <Card key={item.id} elevated style={styles.card}>
            <View style={styles.row}>
              <View
                style={[styles.icon, { backgroundColor: `${theme.colors.primary}18` }]}
              >
                <Ionicons
                  name="notifications-outline"
                  size={18}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.content}>
                <View style={styles.header}>
                  <Text style={[styles.title, { color: theme.colors.text }]}>
                    {item.title}
                  </Text>
                  <Badge label={item.time} variant="neutral" />
                </View>
                <Text style={{ color: theme.colors.textSecondary, lineHeight: 20 }}>
                  {item.body}
                </Text>
              </View>
            </View>
          </Card>
        ))
      ) : (
        <EmptyState
          icon="notifications-off-outline"
          title="You're all caught up"
          description="Study reminders and AI updates will show up here."
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, gap: 4 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: { fontSize: 16, fontWeight: '700', flex: 1 },
});
