import { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View, ViewToken } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/providers';
import { Button } from '@/components/ui';
import { STORAGE_KEYS } from '@/constants';
import { cache } from '@/utils/storage';
import { radius, spacing } from '@/theme';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    key: '1',
    icon: 'sparkles' as const,
    title: 'AI that studies with you',
    description:
      'Chat with an assistant that understands your notes, textbooks, and goals.',
  },
  {
    key: '2',
    icon: 'document-text' as const,
    title: 'Turn PDFs into mastery',
    description:
      'Upload documents and get summaries, quizzes, and flashcards in seconds.',
  },
  {
    key: '3',
    icon: 'calendar' as const,
    title: 'Plan smarter sessions',
    description:
      'Build a study plan that adapts to your progress and keeps you consistent.',
  },
];

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
    router.replace('/(auth)/login');
  };

  const next = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
      return;
    }
    finish();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.topBar}>
        <Text style={[styles.brand, { color: theme.colors.primary }]}>StudyAI</Text>
        <Button title="Skip" variant="ghost" size="sm" onPress={finish} />
      </View>

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
              style={[styles.iconWrap, { backgroundColor: `${theme.colors.primary}18` }]}
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
        <Button
          title={index === SLIDES.length - 1 ? 'Get started' : 'Continue'}
          onPress={next}
          fullWidth
          size="lg"
        />
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
});
