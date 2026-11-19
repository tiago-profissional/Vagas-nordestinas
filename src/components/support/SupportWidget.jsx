import { useNavigate } from "react-router-dom";

import { useCurrentUser } from "../../hooks/useCurrentUser.js";
import "../../styles/support/SupportWidget.css";

export default function SupportWidget() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const isAdmin = user?.role === "admin";

  function openSupport() {
    navigate(isAdmin ? "/tickets" : "/relatar-problema");
  }

  return (
    <div className="support-widget-container">
      <button
        type="button"
        className="support-launcher-btn"
        onClick={openSupport}
        aria-label={isAdmin ? "Abrir suporte administrativo" : "Relatar problema"}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
        </svg>
      </button>
    </div>
  );
}
