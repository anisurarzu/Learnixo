import React, { memo } from 'react';
import { Pressable, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/providers';
import { radius, spacing } from '@/theme';
import { hitSlop } from './utils';

export interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onSubmit?: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  style?: ViewStyle;
}

export const SearchInput = memo(function SearchInput({
  value,
  onChangeText,
  placeholder = 'Search…',
  onClear,
  onSubmit,
  disabled = false,
  autoFocus = false,
  style,
}: SearchInputProps) {
  const { theme } = useTheme();

  return (
    <View
      accessibilityRole="search"
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.inputBackground,
          borderColor: theme.colors.border,
          opacity: disabled ? theme.opacity.disabled : 1,
        },
        style,
      ]}
    >
      <Ionicons name="search-outline" size={20} color={theme.colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.inputPlaceholder}
        style={[styles.input, { color: theme.colors.text }]}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        editable={!disabled}
        onSubmitEditing={onSubmit}
        accessibilityLabel={placeholder}
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => {
            onChangeText('');
            onClear?.();
          }}
          hitSlop={hitSlop()}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
});

/** @deprecated Prefer SearchInput */
export const SearchBar = SearchInput;
export type SearchBarProps = SearchInputProps;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  input: { flex: 1, fontSize: 16, paddingVertical: spacing.sm },
});
