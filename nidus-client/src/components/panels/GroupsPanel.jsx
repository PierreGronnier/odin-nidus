import { useEffect, useState } from "react";
import useConversationStore from "../../store/conversationStore.js";
import CreateGroupModal from "../modals/CreateGroupModal.jsx";
import { MessageCircle } from "lucide-react";
import "../../styles/GroupsPanel.css";

export default function GroupsPanel({ onSelectGroup }) {
  const { groups, fetchGroups, addGroup, error } = useConversationStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Toujours fetch à l'ouverture du panel pour être à jour
    fetchGroups();
  }, []);

  return (
    <div className="groups-panel">
      <div className="groups-header">
        <h2>My Groups</h2>
        <button className="btn-add-group" onClick={() => setShowModal(true)}>
          Add group
        </button>
      </div>

      {error && <p className="groups-error">{error}</p>}

      {groups.length === 0 ? (
        <p className="groups-empty">No groups yet</p>
      ) : (
        <div className="groups-list">
          {groups.map((group) => (
            <div key={group.id} className="group-item">
              <div className="group-avatar">
                {group.avatarUrl ? (
                  <img src={group.avatarUrl} alt={group.name} />
                ) : (
                  <span>{group.name[0].toUpperCase()}</span>
                )}
              </div>
              <span className="group-name">{group.name}</span>

              <div className="friend-actions">
                <button
                  className="friend-action-btn friend-message-btn"
                  title="Send a message"
                  onClick={() => onSelectGroup(group)}
                >
                  <MessageCircle size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <CreateGroupModal
          onClose={() => setShowModal(false)}
          onGroupCreated={(newGroup) => {
            addGroup(newGroup); // Met à jour le store → SidebarGroups se met à jour aussi
          }}
        />
      )}
    </div>
  );
}
