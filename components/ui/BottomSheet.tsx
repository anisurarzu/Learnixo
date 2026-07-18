import React, { forwardRef, memo, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useTheme } from '@/providers';
import { radius, spacing } from '@/theme';

export interface AppBottomSheetProps {
  title?: string;
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  onDismiss?: () => void;
}

export const AppBottomSheet = memo(
  forwardRef<BottomSheetModal, AppBottomSheetProps>(function AppBottomSheet(
    { title, children, snapPoints = ['40%', '70%'], onDismiss },
    ref,
  ) {
    const { theme } = useTheme();
    const points = useMemo(() => snapPoints, [snapPoints]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={points}
        onDismiss={onDismiss}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: theme.colors.surfaceElevated,
          borderTopLeftRadius: radius['2xl'],
          borderTopRightRadius: radius['2xl'],
        }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.border, width: 42 }}
      >
        <BottomSheetView style={styles.content}>
          {title ? (
            <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
          ) : null}
          <View style={styles.body}>{children}</View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }),
);

/** Design-system alias */
export const BottomSheet = AppBottomSheet;
export type BottomSheetProps = AppBottomSheetProps;

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing['2xl'] },
  title: { fontSize: 20, fontWeight: '700', marginBottom: spacing.md },
  body: { gap: spacing.md },
});
