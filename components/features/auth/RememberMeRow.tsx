import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/providers';
import { spacing } from '@/theme';

export const RememberMeRow = memo(function RememberMeRow({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={() => onChange(!value)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      style={styles.row}
    >
      <View
        style={[
          styles.box,
          {
            borderColor: value ? theme.colors.primary : theme.colors.border,
            backgroundColor: value ? theme.colors.primary : theme.colors.transparent,
          },
        ]}
      >
        {value ? <Ionicons name="checkmark" size={14} color="#FFF" /> : null}
      </View>
      <Text style={{ color: theme.colors.textSecondary, fontWeight: '500' }}>
        Remember me
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
