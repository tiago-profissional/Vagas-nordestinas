const GITHUB_API_URL =
  import.meta.env.VITE_GITHUB_API_URL || "/api/index.php";

async function githubApi(route, query = {}) {
  const params = new URLSearchParams({
    route,
  });

  Object.entries(query).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params.append(key, String(value));
    }
  });

  const response = await fetch(
    `${GITHUB_API_URL}?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.detail ||
        data?.message ||
        `Erro na API do GitHub: HTTP ${response.status}`
    );
  }

  return data;
}

export async function fetchGithubJobs({
  page = 1,
  limit = 100,
  workModel = "",
  seniority = "",
  skill = "",
  search = "",
} = {}) {
  const data = await githubApi("/github-jobs", {
    page,
    limit,
    work_model: workModel,
    seniority,
    skill,
    search,
  });

  // Aceita tanto { jobs: [...] } quanto [...]
  if (Array.isArray(data?.jobs)) {
    return data.jobs;
  }

  if (Array.isArray(data)) {
    return data;
  }

  return [];
}

export async function fetchGithubJobById(id) {
  const data = await githubApi(
    `/github-jobs/${encodeURIComponent(id)}`
  );

  const job = data?.job || (data?.id ? data : null);

  if (!job) {
    throw new Error("Vaga do GitHub não encontrada");
  }

  return job;
}