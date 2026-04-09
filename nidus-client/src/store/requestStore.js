import { create } from "zustand";
import api from "../services/axios";

const useRequestStore = create((set, get) => ({
  receivedRequests: [],
  sentRequests: [],
  isLoading: false,
  error: null,

  fetchReceivedRequests: async () => {
    try {
      const response = await api.get("/friendships/pending");
      set({ receivedRequests: response.data });
    } catch (err) {
      console.error("Error fetching received requests:", err);
    }
  },

  fetchSentRequests: async () => {
    try {
      const response = await api.get("/friendships/sent");
      set({ sentRequests: response.data });
    } catch (err) {
      console.error("Error fetching sent requests:", err);
    }
  },

  fetchAll: async () => {
    const { fetchReceivedRequests, fetchSentRequests } = get();
    await Promise.all([fetchReceivedRequests(), fetchSentRequests()]);
  },

  sendFriendRequest: async (receiverId) => {
    await api.post("/friendships", { receiverId });
    await get().fetchSentRequests();
  },

  acceptRequest: async (friendshipId) => {
    await api.put(`/friendships/${friendshipId}/accept`);
    await get().fetchAll();
  },

  declineRequest: async (friendshipId) => {
    await api.put(`/friendships/${friendshipId}/decline`);
    await get().fetchAll();
  },

  cancelRequest: async (friendshipId) => {
    await api.delete(`/friendships/${friendshipId}/cancel`);
    set((state) => ({
      sentRequests: state.sentRequests.filter((r) => r.id !== friendshipId),
    }));
  },

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export default useRequestStore;
