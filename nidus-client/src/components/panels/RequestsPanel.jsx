import { useState } from "react";
import api from "../../services/axios.js";
import "../../styles/RequestsPanel.css";

export default function RequestsPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setHasSearched(true);
    try {
      const response = await api.get(`/users/search?username=${query}`);
      setResults(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Cant find with this name");
    }
  };

  const handleAddFriend = async (receiverId) => {
    try {
      await api.post("/friendships", { receiverId });
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="requests-panel">
      <div>
        <h2 className="requests-section-title">Find friends</h2>
        {error && <p className="requests-error">{error}</p>}
        <div className="requests-search">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by username..."
          />
          <button className="requests-search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="requests-results">
          {hasSearched && results.length === 0 && (
            <p className="requests-empty">No users found</p>
          )}
          {results.map((user) => (
            <div key={user.id} className="requests-user-card">
              <div className="requests-user-avatar">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} />
                ) : (
                  <span>{user.username?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <span className="requests-user-name">{user.username}</span>
              <button
                className="requests-add-btn"
                onClick={() => handleAddFriend(user.id)}
              >
                Add friend
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="requests-divider" />

      <div>
        <h2 className="requests-section-title">Pending requests</h2>
        <p className="requests-empty">No pending requests</p>
      </div>
    </div>
  );
}
