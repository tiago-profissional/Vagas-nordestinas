import { useEffect } from "react";
import { syncSharedSessionCookie } from "../services/apiClient.js";

const configuredNextAppUrl = import.meta.env.VITE_NEXT_APP_URL?.trim();
const NEXT_APP_URL = (
  configuredNextAppUrl ||
  (import.meta.env.DEV ? "http://localhost:3000" : "")
).replace(/\/+$/, "");

let dashboardUrl = "";
let configurationError = "";

if (!NEXT_APP_URL) {
  configurationError =
    "Configure VITE_NEXT_APP_URL para abrir o Currículo com IA.";
} else {
  try {
    dashboardUrl = new URL(`${NEXT_APP_URL}/dashboard`).toString();
  } catch {
    configurationError = "VITE_NEXT_APP_URL não contém uma URL válida.";
  }
}

export default function AiResume() {
  useEffect(() => {
    if (!dashboardUrl) return;
    syncSharedSessionCookie(localStorage.getItem("token"));
    window.location.replace(dashboardUrl);
  }, []);

  return configurationError ? <p role="alert">{configurationError}</p> : null;
}
