import React, { memo } from 'react';
import { Image, ImageStyle, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '@/providers';
import { sizeTokens } from '@/theme';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  uri?: string | null;
  name?: string | null;
  size?: AvatarSize;
  style?: ViewStyle | ImageStyle;
}

export const Avatar = memo(function Avatar({
  uri,
  name,
  size = 'md',
  style,
}: AvatarProps) {
  const { theme } = useTheme();
  const dimension = sizeTokens.avatar[size];
  const initials = getInitials(name);

  if (uri) {
    return (
      <Image
        accessibilityIgnoresInvertColors
        accessibilityLabel={name ?? 'User avatar'}
        source={{ uri }}
        style={[
          styles.image,
          { width: dimension, height: dimension, borderRadius: dimension / 2 },
          style as ImageStyle,
        ]}
      />
    );
  }

  return (
    <View
      accessibilityLabel={name ?? 'User avatar'}
      style={[
        styles.fallback,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: theme.colors.primary,
        },
        style as ViewStyle,
      ]}
    >
      <Text style={[styles.initials, { fontSize: dimension * 0.36 }]}>{initials}</Text>
    </View>
  );
});

/** Alias matching design-system naming */
export const UserAvatar = Avatar;

function getInitials(name?: string | null) {
  if (!name?.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

const styles = StyleSheet.create({
  image: { backgroundColor: '#E2E8F0' },
  fallback: { alignItems: 'center', justifyContent: 'center' },
  initials: { color: '#FFFFFF', fontWeight: '700' },
});
