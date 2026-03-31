import { useState, useEffect, useCallback, useRef } from "react";
import api from "../../services/axios.js";
import useAuthStore from "../../store/authStore.js";
import { Send } from "lucide-react";
import "../../styles/ChatPanel.css";

export default function ChatPanel({ friend, group }) {
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [input, setInput] = useState("");
  const { user } = useAuthStore();
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

  useEffect(() => {
    let interval;

    const init = async () => {
      let convId;

      if (isGroup) {
        convId = group.id;
        setConversationId(group.id);
      } else if (friend) {
        const conversation = await createConversation();
        if (!conversation) return;
        convId = conversation.id;
        setConversationId(conversation.id);
      }

      if (convId) {
        await fetchMessages(convId);
        interval = setInterval(() => fetchMessages(convId), 3000);
      }
    };

    init();

    return () => clearInterval(interval);
  }, [friend, group]);

  // auto scroll
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
      {/* HEADER */}
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
      </div>

      {error && <p className="chat-error">{error}</p>}

      {/* MESSAGES */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p>No messages yet</p>
            <span>Say hello to {name}</span>
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
                  {avatar ? (
                    <img src={avatar} alt={name} />
                  ) : (
                    <span>{name?.[0]?.toUpperCase()}</span>
                  )}
                </div>
              )}

              <div className="chat-bubble-wrapper">
                <div
                  className={`chat-bubble ${
                    isMe ? "bubble-me" : "bubble-them"
                  }`}
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
