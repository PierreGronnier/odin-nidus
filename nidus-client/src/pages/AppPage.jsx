import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import ProfilePanel from "../components/panels/ProfilePanel";
import "../styles/AppPage.css";

export default function AppPage() {
  const [activeTab, setActiveTab] = useState("messages");
  const [selectedFriend, setSelectedFriend] = useState(null);

  return (
    <div className="app-layout">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSelectFriend={setSelectedFriend}
        selectedFriendId={selectedFriend?.id}
      />
      <main className="app-main">
        {activeTab === "profile" && <ProfilePanel />}
      </main>
    </div>
  );
}
