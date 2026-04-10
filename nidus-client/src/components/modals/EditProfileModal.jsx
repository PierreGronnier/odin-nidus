import { useState } from "react";
import useAuthStore from "../../store/authStore.js";
import useToastStore from "../../store/toastStore";
import api from "../../services/axios.js";
import { uploadImage } from "../../services/cloudinary.js";
import { Upload } from "lucide-react";
import "../../styles/EditProfileModal.css";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export default function EditProfileModal({ onClose }) {
  const { user, setUser } = useAuthStore();
  const { addToast } = useToastStore();

  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarError, setAvatarError] = useState("");

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      const msg = "Please select an image file (PNG, JPG, WebP).";
      setAvatarError(msg);
      addToast(msg, "error");
      setAvatarFile(null);
      e.target.value = "";
      return;
    }

    setAvatarError("");
    setAvatarFile(file);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (avatarError) return;

    try {
      let avatarUrl = user.avatarUrl;

      if (avatarFile) {
        avatarUrl = await uploadImage(avatarFile);
      }

      const response = await api.put("/users/me", {
        username,
        bio,
        avatarUrl,
      });

      setUser(response.data);
      addToast("Profile updated successfully", "success");
      onClose();
    } catch (error) {
      addToast(
        error.response?.data?.message || "Something went wrong.",
        "error",
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit profile</h2>
          <p className="modal-subtitle">Update your personal information</p>
        </div>

        <form onSubmit={handleFormSubmit} className="profile-form">
          <div className="profile-field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="profile-field">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
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
                hidden
                onChange={handleAvatarChange}
              />
            </label>

            {avatarError && <p className="field-error">{avatarError}</p>}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost profile-submit"
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
