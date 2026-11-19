import { apiRequest } from "./apiClient.js";

function getToken() {
  return localStorage.getItem('token');
}

export async function ensureAuthToken() {
  return getToken();
}

async function request(path, options = {}) {
  if (!getToken()) {
    throw new Error('Você precisa estar logado para acessar o perfil.');
  }

  try {
    return await apiRequest(path, options);
  } catch (error) {
    if (error.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Sessão expirada. Faça login novamente.');
    }
    throw error;
  }
}

export async function fetchUserProfile() {
  const data = await request('/users/profile');
  return data.data;
}

export async function updateUserProfile(profileData) {
  const data = await request('/users/profile', {
    method: 'PUT',
    body: profileData,
  });
  return data.data;
}

export async function uploadUserAvatar(file) {
  const formData = new FormData();
  formData.append('avatar', file);

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

export async function fetchAllUsersForAdmin() {
  const response = await request('/users/admin/all');
  return response.data;
}

export async function changeUserRoleByAdmin(userId, newRole) {
  const response = await request(`/users/admin/role/${userId}`, {
    method: 'PATCH',
    body: { role: newRole },
  });
  return response;
}