import { useState, useEffect, useRef } from "react";
import api from "../../services/axios.js";
import useAuthStore from "../../store/authStore.js";
import useConversationStore from "../../store/conversationStore.js";
import useMessageStore from "../../store/messageStore.js";
import useToastStore from "../../store/toastStore.js";
import { Send, Info, Crown, DoorOpen, Pencil } from "lucide-react";
import ConfirmModal from "../modals/ConfirmModal.jsx";
import EditGroupModal from "../modals/EditGroupModal.jsx";
import "../../styles/ChatPanel.css";

export default function ChatPanel({ friend, group, onLeaveGroup }) {
  const [input, setInput] = useState("");
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sending, setSending] = useState(false);

  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const {
    removeGroup,
    fetchConversationMembers,
    conversationMembers,
    createConversation,
    currentConversation,
    setCurrentConversation,
    clearCurrentConversation,
  } = useConversationStore();
  const {
    messages,
    fetchMessages,
    addMessage,
    clearMessages,
    error: messageError,
  } = useMessageStore();

  const bottomRef = useRef(null);

  const isGroup = !!group;
  const conversationId = currentConversation?.id;
  const members = conversationMembers[conversationId];
  const isOwner = isGroup && members?.owner?.id === user?.id;

  const currentMessages = messages[conversationId] || [];
  const error = messageError;

  const name = isGroup ? group.name : friend?.username;
  const avatar = isGroup ? group.avatarUrl : friend?.avatarUrl;

  const sendMessage = async () => {
    if (!input.trim() || !conversationId || sending) return;

    setSending(true);

    try {
      const response = await api.post(
        `/conversations/${conversationId}/messages`,
        {
          content: input.trim(),
        },
      );

      addMessage(conversationId, response.data);
      setInput("");
    } catch (error) {
      console.error("Could not send message:", error);
      addToast("Could not send message", "error");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    const initConversation = async () => {
      if (conversationId) {
        clearMessages(conversationId);
      }
      clearCurrentConversation();

      let convId;
      let convData = null;

      if (isGroup) {
        convId = group.id;
        convData = group;
      } else if (friend) {
        const conversation = await createConversation(
          [user.id, friend.id],
          false,
        );
        if (!conversation) return;
        convId = conversation.id;
        convData = conversation;
      }

      if (convId) {
        setCurrentConversation(convId, convData);
        await fetchMessages(convId);
        if (isGroup) {
          await fetchConversationMembers(convId);
        }
      }
    };

    initConversation();

    return () => {
      if (conversationId) {
        clearMessages(conversationId);
      }
      clearCurrentConversation();
    };
  }, [friend?.id, group?.id]);

  useEffect(() => {
    if (!conversationId) return;

    let cancelled = false;
    const interval = setInterval(async () => {
      if (!cancelled) {
        await fetchMessages(conversationId);
      }
    }, 3000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [conversationId, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

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
      removeGroup(conversationId);
      addToast("You left the group", "success");
      setShowLeaveModal(false);
      onLeaveGroup();
    } catch (error) {
      console.error("Could not leave group:", error);
      addToast("Could not leave group", "error");
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
            <div className="group-actions-container">
              {isOwner && (
                <div
                  className="group-action-icon edit"
                  onClick={() => setShowEditModal(true)}
                >
                  <Pencil size={20} />
                </div>
              )}
              <div
                className="group-action-icon leave"
                onClick={() => setShowLeaveModal(true)}
              >
                <DoorOpen size={20} />
              </div>
            </div>
          </>
        )}
      </div>

      {error && <p className="chat-error">{error}</p>}

      <div className="chat-messages">
        {currentMessages.length === 0 && (
          <div className="chat-empty">
            <p>No messages yet</p>
            <span>Say hello to {name}</span>
          </div>
        )}

        {currentMessages.map((message) => {
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
        <div className="input-wrapper">
          <input
            type="text"
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${name}...`}
            disabled={sending}
          />

          <button
            className="chat-send-btn"
            onClick={sendMessage}
            disabled={!input.trim() || sending}
          >
            {sending ? "..." : <Send size={16} />}
          </button>
        </div>
      </div>

      {showLeaveModal && (
        <ConfirmModal
          title="Leave group"
          message={`Are you sure you want to leave ${name}?`}
          danger
          onConfirm={handleLeaveGroup}
          onCancel={() => setShowLeaveModal(false)}
        />
      )}
      {showEditModal && (
        <EditGroupModal
          group={group}
          members={members}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}
