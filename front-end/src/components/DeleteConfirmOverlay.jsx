import "./DeleteConfirmOverlay.css";

export default function DeleteConfirmOverlay({ onClose, onConfirm }) {
  return (
    <div className="delete-overlay">
      <div className="delete-panel">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete your account?</p>

        <div className="delete-buttons">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
