import { create } from "zustand";
import api from "../services/axios";

const useFriendStore = create((set, get) => ({
  friends: [],
  isLoading: false,
  error: null,

  fetchFriends: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/friendships");
      const friendList = response.data.map((friendship) =>
        friendship.requesterId === userId
          ? { ...friendship.receiver, friendshipId: friendship.id }
          : { ...friendship.requester, friendshipId: friendship.id },
      );
      set({ friends: friendList, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Could not fetch friends.",
        isLoading: false,
      });
    }
  },

  removeFriend: async (friendshipId) => {
    try {
      await api.delete(`/friendships/${friendshipId}`);
      set((state) => ({
        friends: state.friends.filter((f) => f.friendshipId !== friendshipId),
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Could not remove friend." });
      throw err;
    }
  },

  addFriend: (friend) => {
    set((state) => {
      const alreadyExists = state.friends.some((f) => f.id === friend.id);
      if (alreadyExists) return state;
      return { friends: [...state.friends, friend] };
    });
  },

  clearError: () => set({ error: null }),
}));

export default useFriendStore;
