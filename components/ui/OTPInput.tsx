import React, { memo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import { useTheme } from '@/providers';
import { radius, spacing } from '@/theme';

export interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (code: string) => void;
  onComplete?: (code: string) => void;
  error?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export const OTPInput = memo(function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  error,
  disabled = false,
  style,
}: OTPInputProps) {
  const { theme } = useTheme();
  const [internal, setInternal] = useState('');
  const code = value ?? internal;
  const inputRef = useRef<TextInput>(null);

  const update = (next: string) => {
    const sanitized = next.replace(/\D/g, '').slice(0, length);
    if (value === undefined) setInternal(sanitized);
    onChange?.(sanitized);
    if (sanitized.length === length) onComplete?.(sanitized);
  };

  return (
    <View style={[styles.wrapper, style]}>
      <Pressable
        disabled={disabled}
        onPress={() => inputRef.current?.focus()}
        accessibilityRole="keyboardkey"
        accessibilityLabel={`Enter ${length}-digit code`}
        style={styles.row}
      >
        {Array.from({ length }).map((_, index) => {
          const char = code[index] ?? '';
          const focused =
            code.length === index || (code.length === length && index === length - 1);
          return (
            <View
              key={index}
              style={[
                styles.cell,
                {
                  backgroundColor: theme.colors.inputBackground,
                  borderColor: error
                    ? theme.colors.error
                    : focused
                      ? theme.colors.inputFocus
                      : theme.colors.inputBorder,
                  opacity: disabled ? theme.opacity.disabled : 1,
                },
              ]}
            >
              <Text style={[styles.digit, { color: theme.colors.text }]}>{char}</Text>
            </View>
          );
        })}
      </Pressable>
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={update}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        editable={!disabled}
        style={styles.hidden}
        caretHidden
      />
      {error ? (
        <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { gap: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm },
  cell: {
    width: 48,
    height: 56,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digit: { fontSize: 22, fontWeight: '700' },
  hidden: {
    position: 'absolute',
    opacity: 0,
    height: 1,
    width: 1,
  },
  error: { textAlign: 'center', fontSize: 12 },
});
