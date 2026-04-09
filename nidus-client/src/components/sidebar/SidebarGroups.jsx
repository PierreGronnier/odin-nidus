import { useEffect } from "react";
import useConversationStore from "../../store/conversationStore.js";

export default function SidebarGroups({ onSelectGroup, selectedGroupId }) {
  const { groups, fetchGroups } = useConversationStore();

  useEffect(() => {
    // Ne fetch que si le store est vide (premier chargement)
    if (groups.length === 0) {
      fetchGroups();
    }
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
