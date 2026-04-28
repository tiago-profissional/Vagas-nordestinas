// src/services/jobsApi.js

// URL base do backend (sem barra no final)
const API_BASE = 'http://localhost:8000/Vagas-nordestinas/backend';

console.log("🌐 API_BASE:", API_BASE);

// Função auxiliar para fazer requisições
async function request(endpoint, options = {}) {
  // Adiciona o parâmetro route para o router PHP
  const url = `${API_BASE}/index.php?route=${endpoint}`;
  console.log(`📡 ${options.method || 'GET'} ${url}`);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  console.log("📡 Response status:", response.status);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

export async function fetchJobs() {
  try {
    const data = await request('/jobs');
    console.log("✅ Vagas recebidas:", data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("❌ Erro em fetchJobs:", error);
    throw new Error(`Falha ao carregar vagas: ${error.message}`);
  }
}

export async function getJobById(id) {
  const data = await request(`/jobs/${id}`);
  return data;
}

export async function createJobApi(jobData) {
  console.log("📝 Criando vaga:", jobData);
  
  const data = await request('/jobs', {
    method: "POST",
    body: JSON.stringify(jobData),
  });
  
  console.log("✅ Vaga criada:", data);
  return data;
}

export async function updateJobApi(id, jobData) {
  console.log("✏️ Atualizando vaga:", id, jobData);
  
  const data = await request(`/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(jobData),
  });
  
  console.log("✅ Vaga atualizada:", data);
  return data;
}

export async function deleteJobApi(id) {
  console.log("🗑️ Deletando vaga:", id);
  
  const data = await request(`/jobs/${id}`, {
    method: "DELETE",
  });
  
  console.log("✅ Vaga deletada:", data);
  return data;
}

// Alias para compatibilidade
export async function getJobs() {
  return fetchJobs();
}

export async function deleteJob(id) {
  return deleteJobApi(id);
}

export async function getJobsByUser(userId) {
  const jobs = await fetchJobs();
  return { ok: true, data: jobs.filter(job => job.user_id == userId) };
}