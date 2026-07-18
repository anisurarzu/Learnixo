import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import {
  Screen,
  EmptyState,
  SearchBar,
  FloatingActionButton,
  SkeletonCard,
} from '@/components/ui';
import { useDocumentsStore } from '@/store';
import { spacing } from '@/theme';

export default function DocumentsScreen() {
  const documents = useDocumentsStore((s) => s.documents);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const onRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <>
      <Screen
        title="Documents"
        subtitle="Upload PDFs to generate summaries, quizzes, and cards."
        refreshing={loading}
        onRefresh={onRefresh}
      >
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search documents…"
          style={styles.search}
        />

        {loading ? (
          <SkeletonCard />
        ) : documents.length === 0 ? (
          <EmptyState
            icon="folder-open-outline"
            title="No documents yet"
            description="Upload a PDF to unlock AI summaries, quizzes, and flashcards."
            actionLabel="Upload PDF"
            onAction={() => router.push('/upload')}
          />
        ) : null}
      </Screen>
      <FloatingActionButton icon="add" onPress={() => router.push('/upload')} />
    </>
  );
}

const styles = StyleSheet.create({
  search: { marginBottom: spacing.md },
});
