import { useState, useEffect, useCallback, useRef } from "react";
import api from "../../services/axios.js";
import useAuthStore from "../../store/authStore.js";
import { Send } from "lucide-react";
import "../../styles/ChatPanel.css";

export default function ChatPanel({ friend }) {
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [input, setInput] = useState("");
  const { user } = useAuthStore();
  const bottomRef = useRef(null);

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

  useEffect(() => {
    let interval;
    const init = async () => {
      const conversation = await createConversation();
      setConversationId(conversation.id);
      await fetchMessages(conversation.id);
      interval = setInterval(() => fetchMessages(conversation.id), 3000);
    };
    init();
    return () => clearInterval(interval);
  }, [friend.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div className="chat-header-avatar">
          {friend.avatarUrl ? (
            <img src={friend.avatarUrl} alt={friend.username} />
          ) : (
            <span>{friend.username[0].toUpperCase()}</span>
          )}
        </div>
        <div className="chat-header-info">
          <span className="chat-header-name">{friend.username}</span>
        </div>
      </div>

      {error && <p className="chat-error">{error}</p>}

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p>No messages yet</p>
            <span>Say hello to {friend.username}</span>
          </div>
        )}
        {messages.map((message) => {
          const isMe = message.senderId === user.id;
          return (
            <div
              key={message.id}
              className={`chat-message-row ${isMe ? "me" : "them"}`}
            >
              {!isMe && (
                <div className="chat-bubble-avatar">
                  {friend.avatarUrl ? (
                    <img src={friend.avatarUrl} alt={friend.username} />
                  ) : (
                    <span>{friend.username[0].toUpperCase()}</span>
                  )}
                </div>
              )}
              <div className="chat-bubble-wrapper">
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
          placeholder={`Message ${friend.username}...`}
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
