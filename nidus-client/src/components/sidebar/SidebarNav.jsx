import {
  MessageCircle,
  UsersRound,
  UserPlus,
  ContactRound,
} from "lucide-react";

const navItems = [
  { icon: MessageCircle, label: "Messages", id: "messages" },
  { icon: UsersRound, label: "Friends", id: "friends" },
  { icon: UserPlus, label: "Requests", id: "requests" },
  { icon: ContactRound, label: "Groups", id: "groups" },
];

export default function SidebarNav({ activeTab, onTabChange }) {
  return (
    <nav className="sidebar-nav">
      {navItems.map(({ icon: Icon, label, id }) => (
        <button
          key={id}
          className={`sidebar-nav-item ${activeTab === id ? "active" : ""}`}
          onClick={() => onTabChange(id)}
        >
          <Icon size={18} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
