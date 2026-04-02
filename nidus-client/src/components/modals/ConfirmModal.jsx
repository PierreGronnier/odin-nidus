import "../../styles/ConfirmModal.css";

export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  danger = false,
}) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-card confirm-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          {message && <p className="modal-subtitle">{message}</p>}
        </div>
        <div className="modal-actions">
          <button className="btn-ghost profile-submit" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={`profile-submit ${danger ? "btn-danger" : "btn-primary"}`}
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
