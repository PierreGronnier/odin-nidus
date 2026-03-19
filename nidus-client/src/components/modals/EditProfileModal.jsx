import { useState } from "react";
import useAuthStore from "../../store/authStore.js";
import api from "../../services/axios.js";
import { uploadImage } from "../../services/cloudinary.js";
import { Upload } from "lucide-react";
import "../../styles/EditProfileModal.css";

export default function EditProfileModal({ onClose }) {
  const { user, setUser } = useAuthStore();
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let avatarUrl = user.avatarUrl;

      if (avatarFile) {
        avatarUrl = await uploadImage(avatarFile);
      }

      const response = await api.put("/users/me", { username, bio, avatarUrl });
      setUser(response.data);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit profile</h2>
          <p className="modal-subtitle">Update your personal information</p>
        </div>

        {error && <p className="modal-error">{error}</p>}

        <form onSubmit={handleFormSubmit} className="profile-form">
          <div className="profile-field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={user.username}
            />
          </div>

          <div className="profile-field">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people about yourself..."
              rows={3}
            />
          </div>

          <div className="profile-field">
            <label>Avatar</label>
            <div className="avatar-preview">
              {avatarFile ? (
                <img src={URL.createObjectURL(avatarFile)} alt="preview" />
              ) : user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.username} />
              ) : (
                <span>{user.username?.[0]?.toUpperCase()}</span>
              )}
            </div>
            <label className="avatar-upload-btn">
              <Upload size={15} />
              <span>{avatarFile ? avatarFile.name : "Change photo"}</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => setAvatarFile(e.target.files[0])}
              />
            </label>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-ghost profile-submit"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary profile-submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
