import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { goBack } from '@/navigation';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Screen, Button, EmptyState, Badge } from '@/components/ui';
import { useTheme } from '@/providers';
import { createShadow, radius, spacing } from '@/theme';

export default function FlashcardsScreen() {
  const { theme } = useTheme();
  const [flipped, setFlipped] = useState(false);
  const rotate = useSharedValue(0);

  const flip = () => {
    const next = !flipped;
    setFlipped(next);
    rotate.value = withSpring(next ? 180 : 0, { damping: 16, stiffness: 120 });
  };

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(rotate.value, [0, 180], [0, 180])}deg` },
    ],
    opacity: interpolate(rotate.value, [0, 90, 180], [1, 0, 0]),
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(rotate.value, [0, 180], [180, 360])}deg` },
    ],
    opacity: interpolate(rotate.value, [0, 90, 180], [0, 0, 1]),
  }));

  return (
    <Screen
      title="Flashcards"
      subtitle="Tap the card to flip between question and answer."
      headerRight={<Button title="Close" variant="ghost" size="sm" onPress={goBack} />}
    >
      <View style={styles.meta}>
        <Badge label="1 / 12" variant="secondary" />
      </View>

      <Pressable onPress={flip} style={styles.cardPress}>
        <Animated.View
          style={[
            styles.cardFace,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
            createShadow('lg', theme.colors.shadow),
            frontStyle,
          ]}
        >
          <Text style={[styles.sideLabel, { color: theme.colors.primary }]}>FRONT</Text>
          <Text style={[styles.cardText, { color: theme.colors.text }]}>
            What is gradient descent?
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.cardFace,
            styles.cardBack,
            {
              backgroundColor: theme.colors.primary,
            },
            createShadow('lg', theme.colors.shadow),
            backStyle,
          ]}
        >
          <Text style={[styles.sideLabel, { color: 'rgba(255,255,255,0.8)' }]}>BACK</Text>
          <Text style={[styles.cardText, { color: '#FFFFFF' }]}>
            An optimization algorithm that iteratively updates parameters to minimize
            loss.
          </Text>
        </Animated.View>
      </Pressable>

      <View style={styles.actions}>
        <Button title="Again" variant="outline" style={styles.btn} onPress={flip} />
        <Button title="Got it" style={styles.btn} onPress={flip} />
      </View>

      <EmptyState
        icon="albums-outline"
        title="Deck placeholder"
        description="Spaced repetition and deck management will connect here."
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  meta: { marginBottom: spacing.md },
  cardPress: {
    height: 240,
    marginBottom: spacing.lg,
  },
  cardFace: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: radius['2xl'],
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.xl,
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    borderWidth: 0,
  },
  sideLabel: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardText: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    textAlign: 'center',
  },
  actions: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  btn: { flex: 1 },
});
