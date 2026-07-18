import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Button, ProgressBar, EmptyState } from '@/components/ui';
import { useTheme } from '@/providers';
import { radius, spacing } from '@/theme';

export default function UploadScreen() {
  const { theme } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulateUpload = () => {
    setUploading(true);
    setProgress(0);
    let value = 0;
    const timer = setInterval(() => {
      value += 0.12;
      setProgress(Math.min(value, 1));
      if (value >= 1) {
        clearInterval(timer);
        setUploading(false);
        router.replace('/summary');
      }
    }, 200);
  };

  return (
    <Screen title="Upload PDF" subtitle="Drop a document to generate AI study materials.">
      <Card elevated style={styles.dropzone}>
        <View style={[styles.iconWrap, { backgroundColor: `${theme.colors.primary}18` }]}>
          <Ionicons name="cloud-upload-outline" size={40} color={theme.colors.primary} />
        </View>
        <Text style={[styles.title, { color: theme.colors.text }]}>Select a PDF</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
          File picker will be wired next. This screen demonstrates the upload UX shell.
        </Text>
        {uploading ? (
          <View style={styles.progressBlock}>
            <ProgressBar progress={progress} />
            <Text style={{ color: theme.colors.textMuted }}>
              Uploading… {Math.round(progress * 100)}%
            </Text>
          </View>
        ) : (
          <Button title="Choose file" onPress={simulateUpload} fullWidth size="lg" />
        )}
      </Card>

      <EmptyState
        icon="document-text-outline"
        title="Supported formats"
        description="PDF documents up to 50MB. More formats coming soon."
      />

      <Button title="Cancel" variant="ghost" fullWidth onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  dropzone: {
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
    borderStyle: 'dashed',
  },
  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: radius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 20, fontWeight: '700' },
  body: { textAlign: 'center', lineHeight: 22 },
  progressBlock: { width: '100%', gap: spacing.sm },
});
