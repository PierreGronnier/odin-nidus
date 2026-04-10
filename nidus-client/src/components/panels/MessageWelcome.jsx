import {
  MessageCircle,
  Users,
  UserPlus,
  User,
  ContactRound,
  Info,
  Send,
  Sparkles,
  Pencil,
} from "lucide-react";
import "../../styles/MessageWelcome.css";
import useAuthStore from "../../store/authStore.js";

export default function MessagesWelcome() {
  const { user } = useAuthStore();

  return (
    <div className="messages-welcome">
      <div className="welcome-header">
        <div className="welcome-icon">
          <MessageCircle size={56} strokeWidth={1.5} />
        </div>
        <h1>Welcome to your messages</h1>
        <p>Select a conversation from the sidebar to start chatting.</p>
      </div>

      <div className="welcome-grid">
        <div className="welcome-card">
          <div className="card-icon">
            <Users size={28} />
          </div>
          <h3>Friends</h3>
          <p>
            See all your friends here. Click the message icon <Send size={14} />{" "}
            next to any friend to start a conversation.
          </p>
        </div>

        <div className="welcome-card">
          <div className="card-icon">
            <UserPlus size={28} />
          </div>
          <h3>Requests</h3>
          <p>
            <strong>Add new friends</strong> by searching for users and sending
            requests. Once accepted, they will appear in your Friends list and
            you can chat with them.
          </p>
        </div>

        <div className="welcome-card">
          <div className="card-icon">
            <ContactRound size={28} />
          </div>
          <h3>Groups</h3>
          <p>
            Create and edit your own group. Click on any group in the sidebar to
            open the conversation and chat with multiple people at once.
          </p>
        </div>

        <div className="welcome-card">
          <div className="card-icon">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={`${user.username}'s avatar`}
                className="welcome-avatar"
              />
            ) : (
              <span className="welcome-initial">
                {user?.username?.[0]?.toUpperCase() || "?"}
              </span>
            )}
          </div>
          <h3>Profile</h3>
          <p>Edit your avatar, bio, and manage your personal information.</p>
        </div>
      </div>

      <div className="welcome-tip">
        <Sparkles size={20} />
        <div className="tip-text">
          <strong>Pro tip:</strong> Add friends via <strong>Requests</strong>,
          then invite them to your groups.
          <br />
          Click the{" "}
          <strong>
            <Pencil size={16} />
          </strong>{" "}
          icon in a group conversation to add members.
        </div>
        <Info size={20} />
      </div>
    </div>
  );
}
