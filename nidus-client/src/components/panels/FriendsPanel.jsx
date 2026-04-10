import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore.js";
import useFriendStore from "../../store/friendStore.js";
import { MessageCircle, UserMinus } from "lucide-react";
import ConfirmModal from "../modals/ConfirmModal.jsx";
import useToastStore from "../../store/toastStore";
import "../../styles/FriendsPanel.css";

export default function FriendsPanel({ onStartConversation }) {
  const { user } = useAuthStore();
  const { friends, fetchFriends, removeFriend } = useFriendStore();
  const [friendToRemove, setFriendToRemove] = useState(null);
  const { addToast } = useToastStore();

  useEffect(() => {
    if (!user) return;
    // On fetch à l'ouverture du panel pour être à jour
    fetchFriends(user.id);
  }, [user]);

  const handleRemoveFriend = async () => {
    try {
      await removeFriend(friendToRemove.friendshipId);
      setFriendToRemove(null);
      addToast("Friend removed");
    } catch {
      addToast("Something went wrong", "error");
      // l'erreur est déjà dans le store
    }
  };

  return (
    <div className="friends-panel">
      <div className="friends-panel-header">
        <h1 className="friends-panel-title">Friends</h1>
        <span className="friends-panel-count">{friends.length}</span>
      </div>

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
