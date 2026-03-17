export default function SidebarFriends({ onSelectFriend, selectedFriendId }) {
  const friends = [];

  if (friends.length === 0) {
    return (
      <div className="sidebar-empty">
        <p>No friends yet</p>
      </div>
    );
  }

  return (
    <div className="sidebar-friends">
      {friends.map((friend) => (
        <button
          key={friend.id}
          className={`sidebar-friend-item ${selectedFriendId === friend.id ? "active" : ""}`}
          onClick={() => onSelectFriend(friend)}
        >
          <div className="sidebar-friend-avatar">
            {friend.avatarUrl ? (
              <img src={friend.avatarUrl} alt={friend.username} />
            ) : (
              <span>{friend.username[0].toUpperCase()}</span>
            )}
          </div>
          <span className="sidebar-friend-name">{friend.username}</span>
        </button>
      ))}
    </div>
  );
}
