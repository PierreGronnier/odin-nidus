import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Sun, Moon } from "lucide-react";
import useAuthStore from "../../store/authStore";
import api from "../../services/axios";
import SidebarProfile from "./SidebarProfile";
import SidebarNav from "./SidebarNav";
import SidebarFriends from "./SidebarFriends";
import SidebarGroups from "./SidebarGroups";
import logo from "../../assets/nidus-logo.svg";
import "../../styles/Sidebar.css";

export default function Sidebar({
  activeTab,
  onTabChange,
  onSelectFriend,
  selectedFriendId,
  selectedGroup,
  onSelectGroup,
}) {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [isLight, setIsLight] = useState(false);

  const toggleTheme = () => {
    document.body.classList.toggle("light");
    setIsLight(!isLight);
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
    } finally {
      logout();
      navigate("/");
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Nidus" className="sidebar-logo" />
        <span className="sidebar-brand">Nidus</span>
      </div>

      <SidebarProfile onTabChange={onTabChange} />

      <div className="sidebar-divider" />

      <SidebarNav activeTab={activeTab} onTabChange={onTabChange} />

      <div className="sidebar-divider" />

      {activeTab === "messages" && (
        <>
          <SidebarFriends
            onSelectFriend={(friend) => {
              onSelectFriend(friend);
            }}
            selectedFriendId={selectedFriendId}
          />
          <SidebarGroups
            onSelectGroup={onSelectGroup}
            selectedGroupId={selectedGroup?.id}
          />
        </>
      )}

      <div className="sidebar-footer">
        <button className="sidebar-footer-btn" onClick={toggleTheme}>
          {isLight ? <Moon size={16} /> : <Sun size={16} />}
          <span>{isLight ? "Dark mode" : "Light mode"}</span>
        </button>
        <button
          className="sidebar-footer-btn sidebar-logout"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
