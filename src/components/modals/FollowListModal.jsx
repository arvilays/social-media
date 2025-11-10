import "../../styles/modal.css";

export const FollowListModal = ({
  type,
  isOpen,
  onClose,
  users,
  isLoading,
  onUserClick,
  loaderRef,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            {type === "followers" ? "Followers" : "Following"}
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {users.length === 0 && isLoading && (
            <div className="modal-loading">Loading...</div>
          )}
          {users.length === 0 && !isLoading && (
            <div className="modal-empty">No {type} found.</div>
          )}

          <ul className="modal-user-list">
            {users.map((u) => (
              <li
                key={u.id}
                className="modal-user-item"
                onClick={() => onUserClick?.(u.username)}
              >
                <div className="modal-user-avatar">{u.emoji}</div>
                <div className="modal-user-info">
                  <div className="modal-user-display-name">{u.display_name}</div>
                  <div className="modal-user-username">@{u.username}</div>
                </div>
              </li>
            ))}
          </ul>

          <div ref={loaderRef} style={{ height: "1px" }} />
          {isLoading && users.length > 0 && (
            <div className="modal-loading">Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
};
