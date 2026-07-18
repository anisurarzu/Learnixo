import { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View, ViewToken } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/providers';
import { Button, ProgressBar } from '@/components/ui';
import { STORAGE_KEYS } from '@/constants';
import { ROUTES } from '@/constants/routes';
import { replace } from '@/navigation';
import { cache } from '@/utils/storage';
import { radius, spacing } from '@/theme';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    key: '1',
    icon: 'sparkles' as const,
    title: 'Study smarter with AI',
    description:
      'Ask questions, get explanations, and learn faster with an assistant built for students.',
  },
  {
    key: '2',
    icon: 'document-text' as const,
    title: 'Upload PDFs and generate summaries',
    description:
      'Turn dense textbooks into clear summaries, key points, and actionable study notes.',
  },
  {
    key: '3',
    icon: 'albums' as const,
    title: 'Create quizzes and flashcards instantly',
    description:
      'Practice with AI-generated quizzes and flashcards tailored to your materials.',
  },
];

/**
 * Premium 3-step onboarding with skip / next / back + progress.
 */
export default function OnboardingScreen() {
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index != null) {
        setIndex(viewableItems[0].index);
      }
    },
  ).current;

  const finish = () => {
    cache.setJSON(STORAGE_KEYS.onboardingComplete, true);
    replace(ROUTES.auth.login);
  };

  const next = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
      return;
    }
    finish();
  };

  const back = () => {
    if (index > 0) {
      listRef.current?.scrollToIndex({ index: index - 1, animated: true });
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.topBar}>
        <Text style={[styles.brand, { color: theme.colors.primary }]}>Learnixo</Text>
        <Button title="Skip" variant="ghost" size="sm" onPress={finish} />
      </View>

      <Animated.View entering={FadeInUp.duration(300)} style={styles.progressWrap}>
        <ProgressBar progress={(index + 1) / SLIDES.length} />
        <Text style={[styles.progressLabel, { color: theme.colors.textMuted }]}>
          Step {index + 1} of {SLIDES.length}
        </Text>
      </Animated.View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 60 }}
        renderItem={({ item }) => (
          <Animated.View
            entering={FadeInRight.duration(350)}
            style={[styles.slide, { width }]}
          >
            <View
              style={[styles.iconWrap, { backgroundColor: theme.colors.primaryMuted }]}
            >
              <Ionicons name={item.icon} size={44} color={theme.colors.primary} />
            </View>
            <Text style={[styles.title, { color: theme.colors.text }]}>{item.title}</Text>
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
              {item.description}
            </Text>
          </Animated.View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((slide, i) => (
            <View
              key={slide.key}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === index ? theme.colors.primary : theme.colors.border,
                  width: i === index ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.actions}>
          <Button
            title="Back"
            variant="outline"
            onPress={back}
            disabled={index === 0}
            style={styles.actionBtn}
          />
          <Button
            title={index === SLIDES.length - 1 ? 'Get started' : 'Next'}
            onPress={next}
            style={styles.actionBtn}
            size="lg"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  brand: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  progressWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.xs,
  },
  progressLabel: { fontSize: 12, fontWeight: '600' },
  slide: {
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 110,
    height: 110,
    borderRadius: radius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 320,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm },
  dot: { height: 8, borderRadius: 4 },
  actions: { flexDirection: 'row', gap: spacing.sm },
  actionBtn: { flex: 1 },
});
