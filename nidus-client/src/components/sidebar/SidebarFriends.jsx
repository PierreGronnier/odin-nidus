import { useEffect } from "react";
import useAuthStore from "../../store/authStore.js";
import useFriendStore from "../../store/friendStore.js";

export default function SidebarFriends({ onSelectFriend, selectedFriendId }) {
  const { user } = useAuthStore();
  const { friends, fetchFriends, error } = useFriendStore();

  useEffect(() => {
    if (!user) return;
    // Ne fetch que si le store est vide (premier chargement)
    if (friends.length === 0) {
      fetchFriends(user.id);
    }
  }, [user]);

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
