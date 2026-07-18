import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

/**
 * Shared screen transition presets for Expo Router stacks.
 */
export const transitions = {
  fade: {
    animation: 'fade',
  } satisfies Partial<NativeStackNavigationOptions>,

  slideFromRight: {
    animation: 'slide_from_right',
  } satisfies Partial<NativeStackNavigationOptions>,

  slideFromBottom: {
    animation: 'slide_from_bottom',
  } satisfies Partial<NativeStackNavigationOptions>,

  scaleModal: {
    presentation: 'modal',
    animation: 'fade_from_bottom',
  } satisfies Partial<NativeStackNavigationOptions>,

  formSheet: {
    presentation: 'formSheet',
    animation: 'slide_from_bottom',
  } satisfies Partial<NativeStackNavigationOptions>,

  transparentModal: {
    presentation: 'transparentModal',
    animation: 'fade',
  } satisfies Partial<NativeStackNavigationOptions>,
} as const;

export const defaultStackOptions: Partial<NativeStackNavigationOptions> = {
  headerShown: false,
  animation: 'fade_from_bottom',
  gestureEnabled: true,
  fullScreenGestureEnabled: true,
};
