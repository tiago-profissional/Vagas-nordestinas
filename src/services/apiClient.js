const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api/index.php";

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
