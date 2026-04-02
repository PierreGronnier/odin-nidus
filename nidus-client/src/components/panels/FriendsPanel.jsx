import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore.js";
import api from "../../services/axios.js";
import { MessageCircle, UserMinus } from "lucide-react";
import ConfirmModal from "../modals/ConfirmModal.jsx";
import "../../styles/FriendsPanel.css";

export default function FriendsPanel({ onStartConversation }) {
  const [error, setError] = useState("");
  const { user } = useAuthStore();
  const [friends, setFriends] = useState([]);
  const [friendToRemove, setFriendToRemove] = useState(null);

  const fetchFriends = async () => {
    try {
      const response = await api.get("/friendships");
      const friendList = response.data.map((friendship) =>
        friendship.requesterId === user.id
          ? { ...friendship.receiver, friendshipId: friendship.id }
          : { ...friendship.requester, friendshipId: friendship.id },
      );
      setFriends(friendList);
    } catch (error) {
      setError(error.response?.data?.message || "Could not fetch friends.");
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleRemoveFriend = async () => {
    try {
      await api.delete(`/friendships/${friendToRemove.friendshipId}`);
      setFriendToRemove(null);
      await fetchFriends();
    } catch (error) {
      setError(error.response?.data?.message || "Could not remove friend.");
    }
  };

  return (
    <div className="friends-panel">
      <div className="friends-panel-header">
        <h1 className="friends-panel-title">Friends</h1>
        <span className="friends-panel-count">{friends.length}</span>
      </div>

      {error && <p className="friends-error">{error}</p>}

      {friends.length === 0 ? (
        <div className="friends-empty">
          <p>No friends yet</p>
          <span>Search for users in the Requests tab to add friends.</span>
        </div>
      ) : (
        <div className="friends-list">
          {friends.map((friend) => (
            <div key={friend.id} className="friend-card">
              <div className="friend-avatar">
                {friend.avatarUrl ? (
                  <img src={friend.avatarUrl} alt={friend.username} />
                ) : (
                  <span>{friend.username[0].toUpperCase()}</span>
                )}
              </div>

              <div className="friend-info">
                <span className="friend-name">{friend.username}</span>
                <span className="friend-bio">
                  {friend.bio || <em>No bio yet</em>}
                </span>
              </div>

              <div className="friend-actions">
                <button
                  className="friend-action-btn friend-message-btn"
                  title="Send a message"
                  onClick={() => onStartConversation?.(friend)}
                >
                  <MessageCircle size={15} />
                </button>
                <button
                  className="friend-action-btn friend-remove-btn"
                  title="Remove friend"
                  onClick={() =>
                    setFriendToRemove({
                      friendshipId: friend.friendshipId,
                      username: friend.username,
                    })
                  }
                >
                  <UserMinus size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {friendToRemove && (
        <ConfirmModal
          title="Remove friend"
          message={`Are you sure you want to remove ${friendToRemove.username}?`}
          danger
          onConfirm={handleRemoveFriend}
          onCancel={() => setFriendToRemove(null)}
        />
      )}
    </div>
  );
}
