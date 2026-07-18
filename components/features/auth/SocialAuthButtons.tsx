import React, { memo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Divider } from '@/components/ui';
import { useTheme } from '@/providers';
import { spacing } from '@/theme';

interface SocialAuthButtonsProps {
  onGoogle: () => void;
  onApple: () => void;
  onGuest?: () => void;
  loadingProvider?: 'google' | 'apple' | 'guest' | null;
  disabled?: boolean;
  showGuest?: boolean;
}

export const SocialAuthButtons = memo(function SocialAuthButtons({
  onGoogle,
  onApple,
  onGuest,
  loadingProvider = null,
  disabled = false,
  showGuest = true,
}: SocialAuthButtonsProps) {
  const { theme } = useTheme();
  const busy = disabled || loadingProvider != null;

  return (
    <View style={styles.wrap}>
      <Divider label="or continue with" />
      <View style={styles.row}>
        <Button
          title="Google"
          variant="outline"
          loading={loadingProvider === 'google'}
          disabled={busy && loadingProvider !== 'google'}
          onPress={onGoogle}
          style={styles.btn}
          leftIcon={<Ionicons name="logo-google" size={18} color={theme.colors.text} />}
        />
        {Platform.OS === 'ios' ? (
          <Button
            title="Apple"
            variant="outline"
            loading={loadingProvider === 'apple'}
            disabled={busy && loadingProvider !== 'apple'}
            onPress={onApple}
            style={styles.btn}
            leftIcon={<Ionicons name="logo-apple" size={18} color={theme.colors.text} />}
          />
        ) : null}
      </View>
      {showGuest && onGuest ? (
        <Button
          title="Continue as guest"
          variant="ghost"
          loading={loadingProvider === 'guest'}
          disabled={busy && loadingProvider !== 'guest'}
          onPress={onGuest}
          fullWidth
        />
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.sm },
  btn: { flex: 1 },
});
