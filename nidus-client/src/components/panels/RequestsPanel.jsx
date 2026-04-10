import { useState, useEffect } from "react";
import useRequestStore from "../../store/requestStore.js";
import useToastStore from "../../store/toastStore";
import "../../styles/RequestsPanel.css";
import ConfirmModal from "../modals/ConfirmModal.jsx";

export default function RequestsPanel() {
  const {
    receivedRequests,
    sentRequests,
    fetchAll,
    sendFriendRequest,
    acceptRequest,
    declineRequest,
    cancelRequest,
  } = useRequestStore();

  const { addToast } = useToastStore();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSearch = async () => {
    setSearchError("");
    setHasSearched(true);

    try {
      const { default: api } = await import("../../services/axios.js");
      const response = await api.get(`/users/search?username=${query}`);
      setResults(response.data);
    } catch (err) {
      const message =
        err.response?.data?.message || "Can't find with this name";

      setSearchError(message);
      addToast(message, "error");
    }
  };

  const handleAddFriend = async (receiverId) => {
    try {
      await sendFriendRequest(receiverId);
      addToast("Friend request sent", "success");
    } catch (err) {
      const status = err.response?.status;

      let message;
      if (status === 400) {
        message = "You can't add yourself as a friend";
      } else if (status === 409) {
        message =
          "A friend request is already pending or you are already friends";
      } else {
        message = err.response?.data?.message || "Something went wrong.";
      }

      addToast(message, "error");
    }
  };

  const handleAcceptRequest = async (friendshipId) => {
    try {
      await acceptRequest(friendshipId);
      addToast("Friend request accepted", "success");
    } catch (err) {
      const status = err.response?.status;

      let message;
      if (status === 404) {
        message = "This friend request no longer exists.";
      } else if (status === 400) {
        message = "This request has already been processed.";
      } else if (status === 403) {
        message = "You are not authorized to accept this request.";
      } else {
        message = err.response?.data?.message || "Failed to accept request.";
      }

      addToast(message, "error");
    }
  };

  const handleDeclineRequest = async (friendshipId) => {
    try {
      await declineRequest(friendshipId);
      addToast("Request declined", "success");
    } catch (err) {
      const status = err.response?.status;

      let message;
      if (status === 404) {
        message = "This friend request no longer exists.";
      } else if (status === 400) {
        message = "This request has already been processed.";
      } else if (status === 403) {
        message = "You are not authorized to decline this request.";
      } else {
        message = err.response?.data?.message || "Failed to decline request.";
      }

      addToast(message, "error");
    }
  };

  const handleCancelRequest = async (friendshipId) => {
    try {
      await cancelRequest(friendshipId);
      addToast("Request cancelled", "success");
      setConfirmCancel(null);
    } catch (err) {
      const status = err.response?.status;

      let message;
      if (status === 404) {
        message = "This friend request no longer exists.";
      } else if (status === 400) {
        message = "Cannot cancel this request.";
      } else if (status === 403) {
        message = "You can only cancel your own requests.";
      } else {
        message = err.response?.data?.message || "Failed to cancel request.";
      }

      addToast(message, "error");
    }
  };

  return (
    <div className="requests-panel">
      <div>
        <h2 className="requests-section-title">Find friends</h2>

        {searchError && <p className="requests-error">{searchError}</p>}

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
          {hasSearched && results.length === 0 && !searchError && (
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
