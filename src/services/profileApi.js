// src/services/profileApi.js

const API_BASE = '/api';

/**
 * Garante que exista um token de autenticação no localStorage para testes
 */
export async function ensureAuthToken() {
  let token = localStorage.getItem('token');
  if (token) return token;

  try {
    // Tenta fazer login ou criar usuário demo
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'tiagoramon@email.com',
        password: 'SenhaSegura123!'
      })
    });

    const loginData = await loginRes.json();
    if (loginRes.ok && loginData.access_token) {
      localStorage.setItem('token', loginData.access_token);
      localStorage.setItem('user', JSON.stringify(loginData.user));
      return loginData.access_token;
    }

    // Se não existia usuário, cadastra
    const regRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Tiago Ramon',
        email: 'tiagoramon@email.com',
        password: 'SenhaSegura123!',
        confirmPassword: 'SenhaSegura123!'
      })
    });

    const regData = await regRes.json();
    if (regRes.ok && regData.access_token) {
      localStorage.setItem('token', regData.access_token);
      localStorage.setItem('user', JSON.stringify(regData.user));
      return regData.access_token;
    }
  } catch (err) {
    console.warn('Não foi possível conectar ao back-end para autenticação automática:', err);
  }

  return null;
}

export async function fetchUserProfile() {
  const token = await ensureAuthToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}/users/profile`, { headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Erro ao carregar perfil.');
  }

  return data.data;
}

export async function updateUserProfile(profileData) {
  const token = await ensureAuthToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}/users/profile`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(profileData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Erro ao salvar alterações.');
  }

  return data.data;
}

export async function uploadUserAvatar(file) {
  const token = await ensureAuthToken();
  const formData = new FormData();
  formData.append('avatar', file);

  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}/users/profile/avatar`, {
    method: 'POST',
    headers,
    body: formData
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Erro ao enviar foto.');
  }

  return data;
}

export async function deleteUserAccount() {
  const token = await ensureAuthToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}/users/account`, {
    method: 'DELETE',
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Erro ao excluir conta.');
  }

  return data;
}

