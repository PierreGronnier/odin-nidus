import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore.js";
import api from "../../services/axios.js";

export default function SidebarFriends({ onSelectFriend, selectedFriendId }) {
  const [error, setError] = useState("");
  const { user } = useAuthStore();
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await api.get(`/friendships`);
        const friendList = response.data.map((friendship) =>
          friendship.requesterId === user.id
            ? friendship.receiver
            : friendship.requester,
        );
        setFriends(friendList);
      } catch (error) {
        setError(error.response?.data?.message);
      }
    };
    getFriends();
  }, []);

  if (friends.length === 0) {
    return (
      <div className="sidebar-empty">
        <p>No friends yet</p>
      </div>
    );
  }

  return (
    <div className="sidebar-friends">
      {error && <p className="requests-error">{error}</p>}
      {friends.map((friend) => (
        <button
          key={friend.id}
          className={`sidebar-friend-item ${selectedFriendId === friend.id ? "active" : ""}`}
          onClick={() => onSelectFriend(friend)}
        >
          <div className="sidebar-friend-avatar">
            {friend.avatarUrl ? (
              <img src={friend.avatarUrl} alt={friend.username} />
            ) : (
              <span>{friend.username[0].toUpperCase()}</span>
            )}
          </div>
          <span className="sidebar-friend-name">{friend.username}</span>
        </button>
      ))}
    </div>
  );
}
