import { useState, useEffect } from "react";
import api from "../../services/axios.js";
import useAuthStore from "../../store/authStore.js";
import { Mail, Calendar, Clock, Pencil } from "lucide-react";
import "../../styles/ProfilePanel.css";
import useFriendStore from "../../store/friendStore.js";
import useConversationStore from "../../store/conversationStore.js";
import EditProfileModal from "../modals/EditProfileModal.jsx";

export default function ProfilePanel() {
  const { user, setUser } = useAuthStore();
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { friends } = useFriendStore();
  const { groups } = useConversationStore();

  useEffect(() => {
    const getInfo = async () => {
      if (!user) {
        try {
          const response = await api.get("/users/me");
          setUser(response.data);
        } catch {
          setError("Can't get info");
        }
      }
    };
    getInfo();
  }, []);

  if (!user) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="profile-panel">
      <div className="profile-body">
        <div className="profile-top-row">
          <div className="profile-avatar-large">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.username} />
            ) : (
              <span>{user.username?.[0]?.toUpperCase()}</span>
            )}
          </div>
          <div className="profile-header-info">
            <h1 className="profile-username">{user.username}</h1>
            <p className="profile-bio">
              {user.bio || (
                <span className="profile-empty">
                  No bio yet — tell people about yourself
                </span>
              )}
            </p>
          </div>
          <button className="profile-edit-btn" onClick={() => setIsOpen(true)}>
            <Pencil size={14} />
            <span>Edit profile</span>
          </button>
        </div>

        <div className="profile-divider" />

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-value">{friends.length}</span>
            <span className="profile-stat-label">Friends</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-value">{groups.length}</span>
            <span className="profile-stat-label">Groups</span>
          </div>
        </div>

        <div className="profile-divider" />

        <div className="profile-details">
          <h2 className="profile-section-title">About</h2>
          <div className="profile-detail-item">
            <Mail size={15} />
            <span>{user.email}</span>
          </div>
          <div className="profile-detail-item">
            <Calendar size={15} />
            <span>
              Joined{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="profile-detail-item">
            <Clock size={15} />
            <span>
              Last seen{" "}
              {new Date(user.lastSeenAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {error && <p className="profile-error">{error}</p>}
      </div>
      {isOpen && <EditProfileModal onClose={() => setIsOpen(false)} />}
    </div>
  );
}
