import { useState, useEffect, useCallback } from "react";
import api from "../../services/axios.js";
import "../../styles/RequestsPanel.css";
import ConfirmModal from "../modals/ConfirmModal.jsx";

export default function RequestsPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [confirmCancel, setConfirmCancel] = useState(null);

  const fetchReceivedRequests = useCallback(async () => {
    try {
      const response = await api.get("/friendships/pending");
      setReceivedRequests(response.data);
    } catch (error) {
      console.error("Error fetching received requests:", error);
    }
  }, []);

  const fetchSentRequests = useCallback(async () => {
    try {
      const response = await api.get("/friendships/sent");
      setSentRequests(response.data);
    } catch (error) {
      console.error("Error fetching sent requests:", error);
    }
  }, []);

  useEffect(() => {
    fetchReceivedRequests();
    fetchSentRequests();
  }, [fetchReceivedRequests, fetchSentRequests]);

  const handleSearch = async () => {
    setError("");
    setHasSearched(true);
    try {
      const response = await api.get(`/users/search?username=${query}`);
      setResults(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Can't find with this name");
    }
  };

  const handleAddFriend = async (receiverId) => {
    try {
      await api.post("/friendships", { receiverId });
      await fetchSentRequests();
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        setError("You can't add yourself as a friend");
      } else if (status === 409) {
        setError(
          "A friend request is already pending or you are already friends",
        );
      } else {
        setError(error.response?.data?.message || "Something went wrong.");
      }
    }
  };

  const handleAcceptRequest = async (friendshipId) => {
    try {
      await api.put(`/friendships/${friendshipId}/accept`);
      await Promise.all([fetchReceivedRequests(), fetchSentRequests()]);
    } catch (error) {
      const status = error.response?.status;
      if (status === 404) {
        setError("This friend request no longer exists.");
        await Promise.all([fetchReceivedRequests(), fetchSentRequests()]);
      } else if (status === 400) {
        setError("This request has already been processed.");
        await Promise.all([fetchReceivedRequests(), fetchSentRequests()]);
      } else if (status === 403) {
        setError("You are not authorized to accept this request.");
      } else {
        setError(error.response?.data?.message || "Failed to accept request.");
      }
    }
  };

  const handleDeclineRequest = async (friendshipId) => {
    try {
      await api.put(`/friendships/${friendshipId}/decline`);
      await Promise.all([fetchReceivedRequests(), fetchSentRequests()]);
    } catch (error) {
      const status = error.response?.status;
      if (status === 404) {
        setError("This friend request no longer exists.");
        await Promise.all([fetchReceivedRequests(), fetchSentRequests()]);
      } else if (status === 400) {
        setError("This request has already been processed.");
        await Promise.all([fetchReceivedRequests(), fetchSentRequests()]);
      } else if (status === 403) {
        setError("You are not authorized to decline this request.");
      } else {
        setError(error.response?.data?.message || "Failed to decline request.");
      }
    }
  };

  const handleCancelRequest = async (friendshipId) => {
    try {
      await api.delete(`/friendships/${friendshipId}/cancel`);
      setConfirmCancel(null);
      await fetchSentRequests();
    } catch (error) {
      const status = error.response?.status;
      if (status === 404) {
        setError("This friend request no longer exists.");
        await fetchSentRequests();
      } else if (status === 400) {
        setError("Cannot cancel this request.");
        await fetchSentRequests();
      } else if (status === 403) {
        setError("You can only cancel your own requests.");
      } else {
        setError(error.response?.data?.message || "Failed to cancel request.");
      }
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
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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
        <h2 className="requests-section-title">Friend requests received</h2>
        {receivedRequests.length === 0 ? (
          <p className="requests-empty">No pending friend requests</p>
        ) : (
          <div className="requests-pending-list">
            {receivedRequests.map((request) => (
              <div key={request.id} className="requests-user-card">
                <div className="requests-user-avatar">
                  {request.requester.avatarUrl ? (
                    <img
                      src={request.requester.avatarUrl}
                      alt={request.requester.username}
                    />
                  ) : (
                    <span>
                      {request.requester.username?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="requests-user-name">
                  {request.requester.username}
                </span>
                <div className="requests-actions">
                  <button
                    className="requests-accept-btn"
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="requests-decline-btn"
                    onClick={() => handleDeclineRequest(request.id)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="requests-divider" />

      <div>
        <h2 className="requests-section-title">Friend requests sent</h2>
        {sentRequests.length === 0 ? (
          <p className="requests-empty">No sent friend requests</p>
        ) : (
          <div className="requests-pending-list">
            {sentRequests.map((request) => (
              <div key={request.id} className="requests-user-card">
                <div className="requests-user-avatar">
                  {request.receiver.avatarUrl ? (
                    <img
                      src={request.receiver.avatarUrl}
                      alt={request.receiver.username}
                    />
                  ) : (
                    <span>{request.receiver.username?.[0]?.toUpperCase()}</span>
                  )}
                </div>
                <span className="requests-user-name">
                  {request.receiver.username}
                </span>
                <div className="requests-actions">
                  <button
                    className="requests-cancel-btn"
                    onClick={() =>
                      setConfirmCancel({
                        id: request.id,
                        username: request.receiver.username,
                      })
                    }
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmCancel && (
        <ConfirmModal
          title="Cancel request"
          message={`Are you sure you want to cancel your request to ${confirmCancel.username}?`}
          danger
          onConfirm={() => handleCancelRequest(confirmCancel.id)}
          onCancel={() => setConfirmCancel(null)}
        />
      )}
    </div>
  );
}
