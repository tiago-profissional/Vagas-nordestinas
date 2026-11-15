const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/index.php";
const NODE_API_BASE = import.meta.env.VITE_NODE_API_BASE_URL || "/api";
const JOBS_API_BASE = `${NODE_API_BASE.replace(/\/$/, "")}/jobs`;

function getToken() {
  return localStorage.getItem("token");
}

async function jobsApi(path, options = {}) {
  const response = await fetch(`${JOBS_API_BASE}${path}`, {
    headers: { Accept: "application/json" },
    ...options,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    if (response.ok) {
      throw new Error("A API de vagas retornou uma resposta inválida.");
    }
  }

  if (!response.ok) {
    const error = new Error(data?.error || data?.message || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return data;
}

async function api(route, options = {}) {
  const url = `${API_BASE}?route=${encodeURIComponent(route)}`;
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let data = null;
  try { data = await response.json(); } catch { data = null; }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `HTTP ${response.status}`);
  }

  return data;
}

export async function fetchJobs(options = {}) {
  const data = await jobsApi("", options);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.jobs)) return data.jobs;
  throw new Error("A API retornou uma lista de vagas inválida.");
}

export async function getJobById(id, options = {}) {
  const data = await jobsApi(`/${encodeURIComponent(id)}`, options);
  const job = data?.job || data;
  if (!job || typeof job !== "object" || job.error) {
    throw new Error("Vaga não encontrada.");
  }
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
  return api(`/jobs/${id}`, { method: "PUT", body: JSON.stringify(jobData) });
}

export async function deleteJobApi(id) {
  return api(`/jobs/${id}`, { method: "DELETE" });
}

export async function getJobs() { return fetchJobs(); }
export async function deleteJob(id) { return deleteJobApi(id); }
export async function getJobsByUser() {
  const jobs = await fetchJobs();
  return { ok: true, data: jobs };
}

export async function applyToJobApi(jobId) {
  const token = getToken();
  if (!token) throw new Error("Você precisa estar logado para se candidatar.");

  const response = await fetch(`/api/jobs/${jobId}/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao enviar candidatura.");

  return data;
}

export async function fetchMyApplicationsApi() {
  const token = getToken();
  if (!token) throw new Error("Você precisa estar logado para ver suas candidaturas.");

  const response = await fetch("/api/jobs/my-applications", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao buscar candidaturas.");

  return data.data;
}