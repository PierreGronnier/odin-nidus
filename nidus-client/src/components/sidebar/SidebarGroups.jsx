import { useEffect, useState } from "react";
import api from "../../services/axios.js";

export default function SidebarGroups({ onSelectGroup, selectedGroupId }) {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/conversations");
        const groupList = response.data
          .filter((p) => p.conversation.isGroup)
          .map((p) => p.conversation);
        setGroups(groupList);
      } catch (err) {
        console.error("Could not fetch groups:", err);
      }
    };
    fetchGroups();
  }, []);

  if (groups.length === 0) return null;

  return (
    <>
      <p className="sidebar-section-label">Groups</p>
      <div className="sidebar-friends">
        {groups.map((group) => (
          <button
            key={group.id}
            className={`sidebar-friend-item ${selectedGroupId === group.id ? "active" : ""}`}
            onClick={() => onSelectGroup(group)}
          >
            <div className="sidebar-friend-avatar">
              {group.avatarUrl ? (
                <img src={group.avatarUrl} alt={group.name} />
              ) : (
                <span>{group.name[0].toUpperCase()}</span>
              )}
            </div>
            <span className="sidebar-friend-name">{group.name}</span>
          </button>
        ))}
      </div>
    </>
  );
}
