import { create } from "zustand";
import api from "../services/axios";

const useMessageStore = create((set, get) => ({
  messages: {},
  isLoading: false,
  error: null,

  fetchMessages: async (conversationId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(
        `/conversations/${conversationId}/messages`,
      );
      set((state) => ({
        messages: { ...state.messages, [conversationId]: response.data },
        isLoading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || "Could not fetch messages.",
        isLoading: false,
      });
    }
  },

  addMessage: (conversationId, message) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), message],
      },
    }));
  },

  clearMessages: (conversationId) => {
    set((state) => ({
      messages: { ...state.messages, [conversationId]: [] },
    }));
  },

  clearError: () => set({ error: null }),
}));

export default useMessageStore;
