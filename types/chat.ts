export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  isStreaming?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  documentId?: string;
  lastMessagePreview?: string;
  messageCount: number;
  updatedAt: string;
  createdAt: string;
}
