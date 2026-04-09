import { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore.js";
import useFriendStore from "../../store/friendStore.js";
import api from "../../services/axios.js";
import { uploadImage } from "../../services/cloudinary.js";
import { Upload } from "lucide-react";
import "../../styles/CreateGroupModal.css";

export default function CreateGroupModal({ onClose, onGroupCreated }) {
  const { user } = useAuthStore();
  const { friends, fetchFriends } = useFriendStore();
  const [groupName, setGroupName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Si le store a déjà les amis, pas besoin de refetch
    if (friends.length === 0 && user) {
      fetchFriends(user.id);
    }
  }, []);

  const handleToggleFriend = (friendId) => {
    if (selectedIds.includes(friendId)) {
      setSelectedIds(selectedIds.filter((id) => id !== friendId));
    } else {
      setSelectedIds([...selectedIds, friendId]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }

    setIsLoading(true);

    try {
      let avatarUrl = null;
      if (avatarFile) avatarUrl = await uploadImage(avatarFile);

      const response = await api.post("/conversations", {
        isGroup: true,
        name: groupName,
        avatarUrl,
        participantIds: [user.id, ...selectedIds],
      });

      if (onGroupCreated) onGroupCreated(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create a group</h2>
          <p className="modal-subtitle">Add a name and invite your friends</p>
        </div>

        {error && <p className="modal-error">{error}</p>}

        <form onSubmit={handleFormSubmit} className="profile-form">
          <div className="profile-field">
            <label htmlFor="groupName">Group name</label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="My group..."
            />
          </div>

          <div className="profile-field">
            <label>Avatar</label>
            <label className="avatar-upload-btn">
              <Upload size={15} />
              <span>{avatarFile ? avatarFile.name : "Add a photo"}</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => setAvatarFile(e.target.files[0])}
              />
            </label>
          </div>

          <label>Add members</label>
          {friends.length === 0 ? (
            <p className="friends-select-empty">No friends to add</p>
          ) : (
            <div className="friends-select-list">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className={`friend-select-item ${
                    selectedIds.includes(friend.id) ? "selected" : ""
                  }`}
                  onClick={() => handleToggleFriend(friend.id)}
                >
                  <div className="friend-select-avatar">
                    {friend.avatarUrl ? (
                      <img src={friend.avatarUrl} alt={friend.username} />
                    ) : (
                      <span>{friend.username[0].toUpperCase()}</span>
                    )}
                  </div>
                  <span className="friend-select-name">{friend.username}</span>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(friend.id)}
                    onChange={() => handleToggleFriend(friend.id)}
                    style={{ display: "none" }}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-ghost profile-submit"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary profile-submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
