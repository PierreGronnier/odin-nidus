import { useState, useEffect, useCallback, useRef } from "react";
import api from "../../services/axios.js";
import useAuthStore from "../../store/authStore.js";
import { Send, Info, Crown, DoorOpen } from "lucide-react";
import ConfirmModal from "../modals/ConfirmModal.jsx";
import "../../styles/ChatPanel.css";

export default function ChatPanel({ friend, group, onLeaveGroup }) {
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [input, setInput] = useState("");
  const [members, setMembers] = useState(null);
  const { user } = useAuthStore();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const bottomRef = useRef(null);

  const isGroup = !!group;

  const name = isGroup ? group.name : friend?.username;
  const avatar = isGroup ? group.avatarUrl : friend?.avatarUrl;

  const createConversation = async () => {
    try {
      const response = await api.post("/conversations", {
        isGroup: false,
        participantIds: [user.id, friend.id],
      });
      return response.data;
    } catch (error) {
      setError(
        error.response?.data?.message || "Could not create conversation.",
      );
    }
  };

  const fetchMessages = useCallback(async (convId) => {
    try {
      const response = await api.get(`/conversations/${convId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !conversationId) return;
    try {
      await api.post(`/conversations/${conversationId}/messages`, {
        content: input.trim(),
      });
      setInput("");
      await fetchMessages(conversationId);
    } catch (error) {
      setError(error.response?.data?.message || "Could not send message.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMembers = useCallback(async (convId) => {
    try {
      const response = await api.get(`/conversations/${convId}`);
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  }, []);

  useEffect(() => {
    setMessages([]);
    setConversationId(null);

    let interval;
    let cancelled = false;

    const init = async () => {
      let convId;

      if (isGroup) {
        convId = group.id;
      } else if (friend) {
        const conversation = await createConversation();
        if (!conversation) return;
        convId = conversation.id;
      }

      if (!convId || cancelled) return;

      setConversationId(convId);
      await fetchMessages(convId);
      if (isGroup) await getMembers(convId);

      interval = setInterval(() => {
        if (!cancelled) fetchMessages(convId);
      }, 3000);
    };

    init();

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [friend?.id, group?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleLeaveGroup = async () => {
    try {
      await api.delete(`/conversations/${conversationId}/participants`, {
        data: { participantIds: [user.id] },
      });
      setShowLeaveModal(false);
      onLeaveGroup();
    } catch (error) {
      setError(error.response?.data?.message || "Could not leave group.");
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div className="chat-header-avatar">
          {avatar ? (
            <img src={avatar} alt={name} />
          ) : (
            <span>{name?.[0]?.toUpperCase()}</span>
          )}
        </div>

        <div className="chat-header-info">
          <span className="chat-header-name">{name}</span>
        </div>

        {isGroup && (
          <>
            <div className="group-info-icon-wrapper">
              <Info size={20} />
              <div className="group-members-tooltip">
                <span className="tooltip-title">Members</span>
                {members?.participants?.map((p) => {
                  const isOwner = members.owner?.id === p.user.id;
                  return (
                    <div
                      key={p.user.id}
                      className={`member-item ${isOwner ? "member-item--owner" : ""}`}
                    >
                      <div className="member-avatar">
                        {p.user.avatarUrl ? (
                          <img src={p.user.avatarUrl} alt={p.user.username} />
                        ) : (
                          <span>{p.user.username[0]?.toUpperCase()}</span>
                        )}
                      </div>
                      <span className="member-name">{p.user.username}</span>
                      {isOwner && <Crown size={12} className="owner-crown" />}
                    </div>
                  );
                })}
              </div>
            </div>
            <div
              className="group-action-icon"
              onClick={() => setShowLeaveModal(true)}
            >
              <DoorOpen size={20} />
              {showLeaveModal && (
                <ConfirmModal
                  title="Leave group"
                  message={`Are you sure you want to leave ${name}?`}
                  danger
                  onConfirm={handleLeaveGroup}
                  onCancel={() => setShowLeaveModal(false)}
                />
              )}
            </div>
          </>
        )}
      </div>

      {error && <p className="chat-error">{error}</p>}

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p>No messages yet</p>
            <span>Say hello to {name}</span>
          </div>
        )}

        {messages.map((message) => {
          const isMe = message.senderId === user.id;
          const senderName = message.sender?.username;
          const senderAvatar = isMe
            ? user.avatarUrl
            : message.sender?.avatarUrl;

          return (
            <div
              key={message.id}
              className={`chat-message-row ${isMe ? "me" : "them"}`}
            >
              {!isMe && (
                <div className="chat-bubble-avatar">
                  {senderAvatar ? (
                    <img src={senderAvatar} alt={senderName} />
                  ) : (
                    <span>{senderName?.[0]?.toUpperCase()}</span>
                  )}
                </div>
              )}
              <div className="chat-bubble-wrapper">
                {isGroup && !isMe && (
                  <span className="chat-sender-name">{senderName}</span>
                )}
                <div
                  className={`chat-bubble ${isMe ? "bubble-me" : "bubble-them"}`}
                >
                  {message.content}
                </div>
                <span className="chat-time">
                  {formatTime(message.createdAt)}
                </span>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <div className="chat-input-area">
        <input
          className="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${name}...`}
        />
        <button
          className="chat-send-btn"
          onClick={sendMessage}
          disabled={!input.trim()}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
