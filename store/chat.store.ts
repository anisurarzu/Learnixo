import { create } from 'zustand';
import type { ChatConversation, ChatMessage } from '@/types';

interface ChatStore {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  messages: ChatMessage[];
  isTyping: boolean;
  setConversations: (conversations: ChatConversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setTyping: (isTyping: boolean) => void;
  reset: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  isTyping: false,
  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (activeConversationId) => set({ activeConversationId }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setTyping: (isTyping) => set({ isTyping }),
  reset: () =>
    set({
      conversations: [],
      activeConversationId: null,
      messages: [],
      isTyping: false,
    }),
}));
