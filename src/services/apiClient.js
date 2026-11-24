const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api/index.php";

const SESSION_COOKIE = "vn_token";
const PORTAL_DOMAIN = "vagasnordestinas.com";

export function syncSharedSessionCookie(token = localStorage.getItem("token")) {
  if (typeof document === "undefined" || !token) return;

  const hostname = window.location.hostname.toLowerCase();
  const isPortalDomain =
    hostname === PORTAL_DOMAIN || hostname.endsWith(`.${PORTAL_DOMAIN}`);
  const attributes = [`${SESSION_COOKIE}=${encodeURIComponent(token)}`, "Path=/", "SameSite=Lax"];

  if (isPortalDomain) {
    attributes.push(`Domain=.${PORTAL_DOMAIN}`);
    if (window.location.protocol === "https:") attributes.push("Secure");
  }

  document.cookie = attributes.join("; ");
}

export function clearSharedSessionCookie() {
  if (typeof document === "undefined") return;

  const hostname = window.location.hostname.toLowerCase();
  const isPortalDomain =
    hostname === PORTAL_DOMAIN || hostname.endsWith(`.${PORTAL_DOMAIN}`);
  const attributes = [`${SESSION_COOKIE}=`, "Path=/", "Max-Age=0", "SameSite=Lax"];

  document.cookie = attributes.join("; ");
  if (isPortalDomain) {
    attributes.push(`Domain=.${PORTAL_DOMAIN}`);
    if (window.location.protocol === "https:") attributes.push("Secure");
    document.cookie = attributes.join("; ");
  }
}

export async function apiRequest(route, options = {}) {
  const { headers = {}, body, ...requestOptions } = options;
  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };
  const requestBody =
    body && typeof FormData !== "undefined" && body instanceof FormData
      ? body
      : body !== undefined && typeof body !== "string"
        ? JSON.stringify(body)
        : body;

  if (requestBody !== undefined && !(requestBody instanceof FormData)) {
    requestHeaders["Content-Type"] =
      requestHeaders["Content-Type"] || "application/json";
  }

  const token = localStorage.getItem("token");
  if (token) {
    syncSharedSessionCookie(token);
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}?route=${encodeURIComponent(route)}`,
    {
      ...requestOptions,
      headers: requestHeaders,
      body: requestBody,
    }
  );
  const responseText = await response.text();
  let data = {};

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      if (response.ok) {
        throw new Error("A API PHP retornou uma resposta inválida.");
      }
    }
  }

  if (!response.ok) {
    const error = new Error(
      data.message || data.error || `Erro ${response.status} ao acessar a API.`
    );
    error.status = response.status;
    throw error;
  }

  return data;
}
