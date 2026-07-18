import React, { memo } from 'react';
import {
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';
import { useTheme } from '@/providers';
import { typography, type TypographyVariant } from '@/theme';

export interface AppTextProps extends Omit<RNTextProps, 'style'> {
  variant?: TypographyVariant;
  color?: string;
  muted?: boolean;
  align?: TextStyle['textAlign'];
  style?: TextStyle;
}

/**
 * Themed text primitive — use for consistent typography hierarchy.
 */
export const AppText = memo(function AppText({
  variant = 'body',
  color,
  muted = false,
  align,
  style,
  children,
  ...props
}: AppTextProps) {
  const { theme } = useTheme();
  const resolvedColor = color ?? (muted ? theme.colors.textMuted : theme.colors.text);

  return (
    <RNText
      {...props}
      style={[
        typography[variant] as TextStyle,
        { color: resolvedColor, textAlign: align },
        style,
      ]}
    >
      {children}
    </RNText>
  );
});

export { AppText as Typography };
export type { AppTextProps as TextProps };
