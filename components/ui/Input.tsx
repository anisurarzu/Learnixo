import React, { forwardRef, memo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  Pressable,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/providers';
import { radius, sizeTokens, spacing, type IconName } from '@/theme';
import { hitSlop } from './utils';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
  size?: InputSize;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextInputProps['style'];
}

export const Input = memo(
  forwardRef<TextInput, InputProps>(function Input(
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      onRightIconPress,
      size = 'md',
      disabled = false,
      containerStyle,
      inputStyle,
      secureTextEntry,
      editable,
      ...props
    },
    ref,
  ) {
    const { theme } = useTheme();
    const [focused, setFocused] = useState(false);
    const [hidden, setHidden] = useState(!!secureTextEntry);
    const isDisabled = disabled || editable === false;

    const borderColor = error
      ? theme.colors.inputError
      : focused
        ? theme.colors.inputFocus
        : theme.colors.inputBorder;

    return (
      <View style={[styles.container, containerStyle]}>
        {label ? (
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            {label}
          </Text>
        ) : null}
        <View
          style={[
            styles.field,
            sizeStyles[size],
            {
              backgroundColor: theme.colors.inputBackground,
              borderColor,
              opacity: isDisabled ? theme.opacity.disabled : 1,
            },
          ]}
        >
          {leftIcon ? (
            <Ionicons name={leftIcon} size={20} color={theme.colors.textMuted} />
          ) : null}
          <TextInput
            ref={ref}
            editable={!isDisabled}
            placeholderTextColor={theme.colors.inputPlaceholder}
            secureTextEntry={hidden}
            accessibilityState={{ disabled: isDisabled }}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            style={[styles.input, { color: theme.colors.text }, inputStyle]}
            {...props}
          />
          {secureTextEntry ? (
            <Pressable
              onPress={() => setHidden((v) => !v)}
              hitSlop={hitSlop()}
              accessibilityRole="button"
              accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            >
              <Ionicons
                name={hidden ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={theme.colors.textMuted}
              />
            </Pressable>
          ) : rightIcon ? (
            <Pressable
              onPress={onRightIconPress}
              hitSlop={hitSlop()}
              disabled={!onRightIconPress}
              accessibilityRole={onRightIconPress ? 'button' : undefined}
            >
              <Ionicons name={rightIcon} size={20} color={theme.colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
        {error ? (
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.meta, { color: theme.colors.error }]}
          >
            {error}
          </Text>
        ) : hint ? (
          <Text style={[styles.meta, { color: theme.colors.textMuted }]}>{hint}</Text>
        ) : null}
      </View>
    );
  }),
);

/** Password input convenience wrapper */
export const PasswordInput = memo(
  forwardRef<TextInput, Omit<InputProps, 'secureTextEntry'>>(
    function PasswordInput(props, ref) {
      return (
        <Input
          ref={ref}
          secureTextEntry
          leftIcon={props.leftIcon ?? 'lock-closed-outline'}
          {...props}
        />
      );
    },
  ),
);

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  label: { fontSize: 14, fontWeight: '500', marginLeft: spacing.xs },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: spacing.sm,
  },
  meta: { fontSize: 12, marginLeft: spacing.xs },
});

const sizeStyles = StyleSheet.create({
  sm: { minHeight: sizeTokens.input.sm },
  md: { minHeight: sizeTokens.input.md },
  lg: { minHeight: sizeTokens.input.lg },
});
