// src/services/jobsApi.js
const API_BASE = "/api";

// Buscar todas as vagas
export async function fetchJobs() {
  const response = await fetch(`${API_BASE}/jobs.php`);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

// Alias para getJobs (mesma coisa que fetchJobs)
export async function getJobs() {
  return fetchJobs();
}

// Buscar vagas por usuário
export async function getJobsByUser(userId) {
  const jobs = await fetchJobs();
  const userJobs = jobs.filter(job => job.user_id == userId);
  
  return {
    ok: true,
    data: userJobs
  };
}

// Buscar vaga por ID
export async function getJobById(id) {
  const response = await fetch(`${API_BASE}/jobs.php?id=${id}`);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

// Criar nova vaga
export async function createJobApi(jobData) {
  const response = await fetch(`${API_BASE}/create-job.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobData),
  });
  
  const data = await response.json();
  
  if (!response.ok || !data.success) {
    throw new Error(data.message || data.error || "Erro ao criar vaga");
  }
  
  return data.data || data;
}

// Atualizar vaga
export async function updateJobApi(id, jobData) {
  const response = await fetch(`${API_BASE}/jobs.php?id=${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobData),
  });
  
  const data = await response.json();
  
  if (!response.ok || !data.success) {
    throw new Error(data.message || data.error || "Erro ao atualizar vaga");
  }
  
  return data;
}

// Deletar vaga
export async function deleteJobApi(id) {
  const response = await fetch(`${API_BASE}/delete-job.php?id=${id}`, {
    method: "DELETE",
  });
  
  const data = await response.json();
  
  if (!response.ok || !data.success) {
    throw new Error(data.message || data.error || "Erro ao deletar vaga");
  }
  
  return data;
}

// Delete (alias)
export async function deleteJob(id) {
  return deleteJobApi(id);
}