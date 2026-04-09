import { create } from "zustand";
import api from "../services/axios";

const useConversationStore = create((set, get) => ({
  groups: [],
  currentConversation: null,
  conversationMembers: {},
  isLoading: false,
  error: null,

  fetchGroups: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/conversations");
      const groupList = response.data
        .filter((p) => p.conversation.isGroup)
        .map((p) => p.conversation);
      set({ groups: groupList, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Could not fetch groups.",
        isLoading: false,
      });
    }
  },

  fetchConversationMembers: async (conversationId) => {
    try {
      const response = await api.get(`/conversations/${conversationId}`);
      set((state) => ({
        conversationMembers: {
          ...state.conversationMembers,
          [conversationId]: response.data,
        },
      }));
      return response.data;
    } catch (err) {
      console.error("Error fetching members:", err);
      return null;
    }
  },

  createConversation: async (participantIds, isGroup = false) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/conversations", {
        isGroup,
        participantIds,
      });
      set({ isLoading: false });
      return response.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Could not create conversation.",
        isLoading: false,
      });
      return null;
    }
  },

  setCurrentConversation: (conversationId, conversationData = null) => {
    set({ currentConversation: { id: conversationId, ...conversationData } });
  },

  clearCurrentConversation: () => set({ currentConversation: null }),

  addGroup: (group) => {
    set((state) => ({
      groups: [group, ...state.groups],
    }));
  },

  removeGroup: (groupId) => {
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== groupId),
    }));
  },

  updateGroup: (groupId, updates) => {
    set((state) => ({
      groups: state.groups.map((g) =>
        g.id === groupId ? { ...g, ...updates } : g,
      ),
    }));
  },

  clearError: () => set({ error: null }),
}));

export default useConversationStore;
