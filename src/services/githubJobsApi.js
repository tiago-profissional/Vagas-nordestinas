const RAW_GITHUB_API_URL =
  import.meta.env.VITE_GITHUB_API_URL || "/api/index.php";

const GITHUB_API_URL = RAW_GITHUB_API_URL.endsWith(".php")
  ? RAW_GITHUB_API_URL
  : `${RAW_GITHUB_API_URL.replace(/\/$/, "")}/index.php`;

async function githubApi(route, query = {}) {
  const params = new URLSearchParams({ route });

  Object.entries(query).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params.append(key, String(value));
    }
  });

  const response = await fetch(
    `${GITHUB_API_URL}?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const responseText = await response.text();
  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(
        "A API de vagas do GitHub não retornou JSON válido."
      );
    }
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

  if (Array.isArray(data?.jobs)) {
    return data.jobs;
  }

  if (Array.isArray(data)) {
    return data;
  }

  return [];
}

export async function fetchGithubJobById(id) {
  if (!id) {
    throw new Error("ID da vaga do GitHub não informado.");
  }

  const data = await githubApi(
    `/github-jobs/${encodeURIComponent(id)}`
  );

  const job = data?.job || (data?.id ? data : null);

  if (!job) {
    throw new Error("Vaga do GitHub não encontrada");
  }

  return job;
}