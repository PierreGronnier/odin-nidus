import useAuthStore from "../../store/authStore";

export default function SidebarProfile() {
  const { user } = useAuthStore();

  return (
    <div className="sidebar-profile">
      <div className="sidebar-avatar">
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.username} />
        ) : (
          <span>{user?.username?.[0]?.toUpperCase() || "?"}</span>
        )}
      </div>
      <div className="sidebar-profile-info">
        <p className="sidebar-profile-name">{user?.username || "User"}</p>
        <p className="sidebar-profile-status">Online</p>
      </div>
    </div>
  );
}
