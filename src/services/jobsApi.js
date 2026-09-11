// src/services/jobsApi.js
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "/api/index.php";

async function api(route, options = {}) {
  const url = `${API_BASE}?route=${encodeURIComponent(route)}`;

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `HTTP ${response.status}`);
  }

  return data;
}

export async function fetchJobs() {
  const data = await api("/jobs");
  return Array.isArray(data) ? data : [];
}

export async function getJobById(id) {
  const job = await api(`/jobs/${id}`);
  if (!job || job.error) throw new Error("Vaga nao encontrada");
  return job;
}

export async function createJobApi(jobData) {
  const result = await api("/jobs", {
    method: "POST",
    body: JSON.stringify(jobData),
  });

  return { id: result.id, ...jobData };
}

export async function updateJobApi(id, jobData) {
  return api(`/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(jobData),
  });
}

export async function deleteJobApi(id) {
  return api(`/jobs/${id}`, {
    method: "DELETE",
  });
}

export async function getJobs() {
  return fetchJobs();
}

export async function deleteJob(id) {
  return deleteJobApi(id);
}

export async function getJobsByUser() {
  const jobs = await fetchJobs();
  return { ok: true, data: jobs };
}