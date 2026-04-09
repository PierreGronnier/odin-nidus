import { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore.js";
import useFriendStore from "../../store/friendStore.js";
import useConversationStore from "../../store/conversationStore.js";
import api from "../../services/axios.js";
import { uploadImage } from "../../services/cloudinary.js";
import "../../styles/EditGroupModal.css";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export default function EditGroupModal({ group, members, onClose }) {
  const { user } = useAuthStore();
  const { friends, fetchFriends } = useFriendStore();
  const { updateGroup } = useConversationStore();

  const [name, setName] = useState(group.name);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarError, setAvatarError] = useState("");
  const [currentMembers, setCurrentMembers] = useState(
    members?.participants || [],
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const originalIds = members?.participants.map((p) => p.user.id) || [];
  const currentIds = currentMembers.map((p) => p.user.id);
  const friendsNotInGroup = friends.filter((f) => !currentIds.includes(f.id));

  useEffect(() => {
    if (friends.length === 0 && user) {
      fetchFriends(user.id);
    }
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setAvatarError("Please select an image file (PNG, JPG, WebP).");
      setAvatarFile(null);
      e.target.value = "";
      return;
    }

    setAvatarError("");
    setAvatarFile(file);
  };

  const handleRemoveMember = (userId) => {
    setCurrentMembers((prev) => prev.filter((m) => m.user.id !== userId));
  };

  const handleAddFriend = (friend) => {
    setCurrentMembers((prev) => [...prev, { user: friend }]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (avatarError) return;
    setError("");
    setIsLoading(true);

    try {
      let avatarUrl = group.avatarUrl;
      if (avatarFile) {
        avatarUrl = await uploadImage(avatarFile);
      }

      await api.put(`/conversations/${group.id}`, { name, avatarUrl });

      updateGroup(group.id, { name, avatarUrl });

      const toAdd = currentIds.filter((id) => !originalIds.includes(id));
      const toRemove = originalIds.filter((id) => !currentIds.includes(id));

      if (toAdd.length > 0) {
        await api.put(`/conversations/${group.id}/participants`, {
          participantIds: toAdd,
        });
      }

      if (toRemove.length > 0) {
        await api.delete(`/conversations/${group.id}/participants`, {
          data: { participantIds: toRemove },
        });
      }

      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const isOwner = members?.owner?.id === user.id;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit group</h2>
          <p className="modal-subtitle">Update group info and members</p>
        </div>

        {error && <p className="modal-error">{error}</p>}

        <form onSubmit={handleFormSubmit} className="group-form">
          {isOwner && (
            <div className="form-field">
              <label>Group name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          {isOwner && (
            <div className="form-field">
              <label>Avatar</label>
              <div className="avatar-preview">
                {avatarFile ? (
                  <img src={URL.createObjectURL(avatarFile)} alt="preview" />
                ) : group.avatarUrl ? (
                  <img src={group.avatarUrl} alt={group.name} />
                ) : (
                  <span>{group.name?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <label className="avatar-upload-btn">
                Change photo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarChange}
                />
              </label>
              {avatarError && <p className="field-error">{avatarError}</p>}
            </div>
          )}

          <div className="form-field">
            <label>Members</label>
            <div className="members-list">
              {currentMembers.map((m) => {
                const isSelf = m.user.id === user.id;
                const isMemberOwner = members?.owner?.id === m.user.id;
                return (
                  <div key={m.user.id} className="member-item">
                    <div className="member-left">
                      {m.user.avatarUrl ? (
                        <img src={m.user.avatarUrl} alt={m.user.username} />
                      ) : (
                        <span className="member-initial">
                          {m.user.username[0].toUpperCase()}
                        </span>
                      )}
                      <span>{m.user.username}</span>
                      {isMemberOwner && (
                        <span className="owner-badge">Owner</span>
                      )}
                    </div>
                    {isOwner && !isSelf && !isMemberOwner && (
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => handleRemoveMember(m.user.id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {isOwner && friendsNotInGroup.length > 0 && (
            <div className="form-field">
              <label>Add friends</label>
              <div className="members-list">
                {friendsNotInGroup.map((friend) => (
                  <div key={friend.id} className="member-item">
                    <div className="member-left">
                      {friend.avatarUrl ? (
                        <img src={friend.avatarUrl} alt={friend.username} />
                      ) : (
                        <span className="member-initial">
                          {friend.username[0].toUpperCase()}
                        </span>
                      )}
                      <span>{friend.username}</span>
                    </div>
                    <button
                      type="button"
                      className="add-btn"
                      onClick={() => handleAddFriend(friend)}
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost profile-submit"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary profile-submit"
              disabled={isLoading || !!avatarError}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
