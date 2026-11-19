import { apiRequest } from "./apiClient.js";

function getToken() {
  return localStorage.getItem("token");
}

async function jobsApi(path, options = {}) {
  return apiRequest(`/jobs${path}`, options);
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
  const result = await apiRequest("/jobs", {
    method: "POST",
    body: jobData,
  });
  return { id: result.id, ...jobData };
}

export async function updateJobApi(id, jobData) {
  return apiRequest(`/jobs/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: jobData,
  });
}

export async function deleteJobApi(id) {
  return apiRequest(`/jobs/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function getJobs() { return fetchJobs(); }
export async function deleteJob(id) { return deleteJobApi(id); }
export async function getJobsByUser() {
  const jobs = await fetchJobs();
  return { ok: true, data: jobs };
}

export async function applyToJobApi(jobId) {
  if (!getToken()) throw new Error("Você precisa estar logado para se candidatar.");
  return apiRequest(`/jobs/${encodeURIComponent(jobId)}/apply`, {
    method: "POST",
  });
}

export async function fetchMyApplicationsApi() {
  if (!getToken()) throw new Error("Você precisa estar logado para ver suas candidaturas.");
  const data = await apiRequest("/jobs/my-applications");
  return data.data;
}