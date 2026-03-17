import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
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
        <p>Onglet actif : {activeTab}</p>
      </main>
    </div>
  );
}
