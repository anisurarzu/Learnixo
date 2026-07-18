import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { EmptyState, Input, Button, Skeleton } from '@/components/ui';
import { useTheme } from '@/providers';
import { useChatStore } from '@/store';
import { radius, spacing } from '@/theme';

export default function ChatScreen() {
  const { theme } = useTheme();
  const messages = useChatStore((s) => s.messages);
  const isTyping = useChatStore((s) => s.isTyping);
  const addMessage = useChatStore((s) => s.addMessage);
  const setTyping = useChatStore((s) => s.setTyping);
  const [draft, setDraft] = useState('');

  const send = () => {
    if (!draft.trim()) return;
    const content = draft.trim();
    setDraft('');
    addMessage({
      id: `u-${Date.now()}`,
      conversationId: 'local',
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    });
    setTyping(true);
    setTimeout(() => {
      addMessage({
        id: `a-${Date.now()}`,
        conversationId: 'local',
        role: 'assistant',
        content: 'This is a placeholder AI reply. Wire the chat API and streaming next.',
        createdAt: new Date().toISOString(),
      });
      setTyping(false);
    }, 900);
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>AI Chat</Text>
        <Text style={{ color: theme.colors.textSecondary }}>
          Ask anything about your studies
        </Text>
      </View>

      {messages.length === 0 ? (
        <EmptyState
          icon="chatbubbles-outline"
          title="Start a conversation"
          description="Ask for explanations, summaries, or exam prep help."
          style={styles.empty}
        />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => {
            const isUser = item.role === 'user';
            return (
              <Animated.View
                entering={FadeInUp.delay(index * 40).springify()}
                style={[
                  styles.bubble,
                  {
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    backgroundColor: isUser ? theme.colors.primary : theme.colors.card,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={{ color: isUser ? '#FFF' : theme.colors.text, lineHeight: 22 }}
                >
                  {item.content}
                </Text>
              </Animated.View>
            );
          }}
          ListFooterComponent={
            isTyping ? (
              <View style={styles.typing}>
                <Skeleton width={120} height={14} />
              </View>
            ) : null
          }
        />
      )}

      <View
        style={[
          styles.composer,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
          },
        ]}
      >
        <Input
          value={draft}
          onChangeText={setDraft}
          placeholder="Message StudyAI…"
          containerStyle={styles.input}
        />
        <Button title="Send" onPress={send} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: 4,
  },
  title: { fontSize: 30, fontWeight: '700', letterSpacing: -0.4 },
  empty: { flex: 1 },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.sm },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
  },
  typing: { paddingVertical: spacing.sm },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: { flex: 1 },
});
