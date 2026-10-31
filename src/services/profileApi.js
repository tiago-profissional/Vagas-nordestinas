// src/services/profileApi.js

const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

// Mantido só por compatibilidade: agora apenas devolve o token do usuário logado.
export async function ensureAuthToken() {
  return getToken();
}

// Lê o corpo da resposta sem quebrar quando vier vazio (ex.: erro 500 sem JSON).
async function parseJson(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

async function request(path, options = {}) {
  const token = getToken();
  if (!token) {
    throw new Error('Você precisa estar logado para acessar o perfil.');
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await parseJson(response);

  if (response.status === 401) {
    // Token inválido ou expirado: limpa para forçar novo login.
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (!response.ok) {
    throw new Error(
      data.message || data.error || `Erro ${response.status} ao acessar o servidor.`
    );
  }

  return data;
}

export async function fetchUserProfile() {
  const data = await request('/users/profile');
  return data.data;
}

export async function updateUserProfile(profileData) {
  const data = await request('/users/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
  });
  return data.data;
}

export async function uploadUserAvatar(file) {
  const formData = new FormData();
  formData.append('avatar', file);

  // Sem Content-Type: o navegador define sozinho para FormData.
  return request('/users/profile/avatar', {
    method: 'POST',
    body: formData,
  });
}

export async function deleteUserAccount() {
  const data = await request('/users/account', { method: 'DELETE' });
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return data;
}