// src/services/jobsApi.js
const API_BASE = "https://vagasnordestinasdb.infinityfree.me/api";

export async function fetchJobs() {
  console.log("🔍 Buscando em:", `${API_BASE}/jobs.php`);
  const response = await fetch(`${API_BASE}/jobs.php`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function getJobById(id) {
  const response = await fetch(`${API_BASE}/jobs.php?id=${id}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function createJobApi(jobData) {
  const response = await fetch(`${API_BASE}/create-job.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jobData),
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || "Erro ao criar vaga");
  return data.data || data;
}

export async function updateJobApi(id, jobData) {
  const response = await fetch(`${API_BASE}/jobs.php?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jobData),
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || "Erro ao atualizar");
  return data;
}

export async function deleteJobApi(id) {
  const response = await fetch(`${API_BASE}/delete-job.php?id=${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || "Erro ao deletar");
  return data;
}

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