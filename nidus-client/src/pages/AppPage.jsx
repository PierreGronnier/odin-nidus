import { useState, useEffect } from "react";
import {
  MessageCircle,
  UsersRound,
  UserPlus,
  ContactRound,
  Menu,
  X,
  User,
} from "lucide-react";
import Sidebar from "../components/sidebar/Sidebar";
import ProfilePanel from "../components/panels/ProfilePanel";
import RequestsPanel from "../components/panels/RequestsPanel";
import FriendsPanel from "../components/panels/FriendsPanel";
import ChatPanel from "../components/panels/ChatPanel";
import GroupsPanel from "../components/panels/GroupsPanel";
import ToastContainer from "../components/ui/ToastContainer";
import MessageWelcome from "../components/panels/MessageWelcome.jsx";
import useAuthStore from "../store/authStore";
import "../styles/AppPage.css";

const navItems = [
  { icon: MessageCircle, label: "Messages", id: "messages" },
  { icon: UsersRound, label: "Friends", id: "friends" },
  { icon: UserPlus, label: "Requests", id: "requests" },
  { icon: ContactRound, label: "Groups", id: "groups" },
];

const tabLabels = {
  messages: "Messages",
  friends: "Friends",
  requests: "Requests",
  groups: "Groups",
  profile: "Profile",
};

export default function AppPage() {
  const [activeTab, setActiveTab] = useState("messages");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "groups") setSelectedGroup(null);
    if (tab !== "messages") setSelectedFriend(null);
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setSelectedFriend(null);
    setActiveTab("messages");
  };

  const currentLabel = selectedFriend
    ? selectedFriend.username
    : selectedGroup
      ? selectedGroup.name
      : tabLabels[activeTab] || "Nidus";

  return (
    <div className="app-layout">
      <div
        className={`sidebar-overlay${sidebarOpen ? " visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onSelectFriend={(friend) => {
          setSelectedFriend(friend);
          setSelectedGroup(null);
        }}
        selectedFriendId={selectedFriend?.id}
        selectedGroup={selectedGroup}
        onSelectGroup={handleSelectGroup}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <main className="app-main">
        <div className="mobile-top-bar">
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span className="mobile-top-bar-title">{currentLabel}</span>
          <div
            className="mobile-top-bar-avatar"
            onClick={() => handleTabChange("profile")}
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.username} />
            ) : (
              <span>{user?.username?.[0]?.toUpperCase() || "?"}</span>
            )}
          </div>
        </div>

        {activeTab === "messages" && !selectedFriend && !selectedGroup && (
          <MessageWelcome />
        )}
        {activeTab === "messages" && selectedFriend && (
          <ChatPanel friend={selectedFriend} />
        )}
        {activeTab === "messages" && selectedGroup && !selectedFriend && (
          <ChatPanel
            group={selectedGroup}
            onLeaveGroup={() => {
              setSelectedGroup(null);
            }}
          />
        )}
        {activeTab === "profile" && <ProfilePanel />}
        {activeTab === "requests" && <RequestsPanel />}
        {activeTab === "friends" && (
          <FriendsPanel
            onStartConversation={(friend) => {
              setSelectedFriend(friend);
              setSelectedGroup(null);
              setActiveTab("messages");
            }}
          />
        )}
        {activeTab === "groups" && (
          <GroupsPanel onSelectGroup={handleSelectGroup} />
        )}
      </main>

      <nav className="mobile-bottom-nav">
        {navItems.map(({ icon: Icon, label, id }) => (
          <button
            key={id}
            className={`mobile-bottom-nav-item${activeTab === id ? " active" : ""}`}
            onClick={() => handleTabChange(id)}
          >
            <Icon size={22} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <ToastContainer />
    </div>
  );
}
