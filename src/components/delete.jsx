import "../styles/delete.css";

export default function DeleteModal({ show, onCancel, onConfirm }) {

  if (!show) return null;

  return (
    <div className="delete-overlay">

      <div className="delete-modal">

        <button className="delete-close" onClick={onCancel}>
          ✕
        </button>

        <p className="delete-message">
          Are you sure you want to delete this job?
        </p>

        <div className="delete-actions">

          <button
            className="delete-cancel"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            className="delete-confirm"
            onClick={onConfirm}
          >
            Deletar
          </button>

        </div>

      </div>

    </div>
  );
}