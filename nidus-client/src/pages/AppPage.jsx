import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import ProfilePanel from "../components/panels/ProfilePanel";
import RequestsPanel from "../components/panels/RequestsPanel";
import FriendsPanel from "../components/panels/FriendsPanel";
import ChatPanel from "../components/panels/ChatPanel";
import GroupsPanel from "../components/panels/GroupsPanel";
import ToastContainer from "../components/ui/ToastContainer";
import MessageWelcome from "../components/panels/MessageWelcome.jsx";
import "../styles/AppPage.css";

export default function AppPage() {
  const [activeTab, setActiveTab] = useState("messages");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

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

  return (
    <div className="app-layout">
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
      />
      <main className="app-main">
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
      <ToastContainer />
    </div>
  );
}
