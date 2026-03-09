const API_URL = "http://localhost:8000/Vagas_Nordestinas/backend/api";

export function formatJob(job) {
  let location;

  if (job.work_mode === "remote") location = "Remote";
  else location = job.state ? job.city + ", " + job.state : job.city;

  let type;
  if (job.employment_type === "full_time") type = "Full-time";
  else if (job.employment_type === "part_time") type = "Part-time";
  else if (job.employment_type === "pj") type = "PJ";
  else type = job.employment_type || "-";

  let salary;
  if (job.salary_min && job.salary_max) {
    salary =
      "R$ " +
      Number(job.salary_min).toLocaleString("pt-BR") +
      " - R$ " +
      Number(job.salary_max).toLocaleString("pt-BR");
  } else {
    salary = "A combinar";
  }

  return {
    id: job.id,
    title: job.title,
    company: job.company,
    city: job.city,
    state: job.state,
    work_mode: job.work_mode,
    employment_type: job.employment_type,
    salary_min: job.salary_min,
    salary_max: job.salary_max,
    description: job.description,
    location,
    type,
    salary,
  };
}

export async function getJobById(id) {
  const res = await fetch(`${API_URL}/jobs.php?id=${id}`);
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json?.error || "Erro ao carregar vaga");
  }

  return formatJob(json.data);
}

export async function fetchJobs() { 
  const res = await fetch(`${API_URL}/jobs.php`);
  const json = await res.json().catch(() => ({}));

  if(!res.ok){
    throw new Error(json?.error || "Error loading jobs");
  }

  // think: is json.data already an array?
  // if yes, format each job

  return Array.isArray(json.data) ? json.data.map(formatJob) : [];
}


export async function createJobApi(payload) {
  const res = await fetch(`${API_URL}/jobs.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {

    throw new Error(json?.error || "Erro ao criar vaga");
  }

  return formatJob(json.data);
}