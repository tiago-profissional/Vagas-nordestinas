import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import JobDetail from "./components/JobDetail.jsx";
import JobList from "./components/JobList.jsx";
import Navbar from "./components/Navbar.jsx";
import SearchBar from "./components/SearchBar.jsx";



const API_URL = "http://localhost:8000/Vagas_Nordestinas/api";

function formatJob(job) {
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
 

export default function App() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // ✅ estados UX
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [errorJobs, setErrorJobs] = useState("");
  const [notFound, setNotFound] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState("");
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [employmentType, setEmploymentType] = useState("");

  // ✅ Fetch
  useEffect(() => {
    setLoadingJobs(true);
    setErrorJobs("");

    fetch(`${API_URL}/jobs.php`)
      .then((res) => res.json())
      .then((json) => {
        const list = json.data ?? [];
        setJobs(list.map(formatJob));
      })
      .catch((err) => {
        console.log("ERROR GET /jobs:", err);
        setErrorJobs("Erro ao carregar vagas.");
      })
      .finally(() => setLoadingJobs(false));
  }, []);

  // ✅ rota -> seleciona job (MELHORIA 1 e 2)
  useEffect(() => {
    if (loadingJobs) return;
    if (errorJobs) return;

    // ✅ MELHORIA 2: home "/" não seleciona nada
    if (!id) {
      setSelectedJob(null);
      setNotFound(false);
      return;
    }

    const found = jobs.find((j) => String(j.id) === String(id));

    if (found) {
      setSelectedJob(found);
      setNotFound(false);
    } else {
      // ✅ MELHORIA 1: NÃO navega pra rota fake (sem /jobs/999)
      setSelectedJob(null);
      setNotFound(true);
    }
  }, [id, jobs, loadingJobs, errorJobs]);

  function handleSelect(job) {
    setSelectedJob(job);
    setNotFound(false);
    navigate(`/jobs/${job.id}`);
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchTitle = (job.title || "")
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const matchLocation = (job.location || "")
        .toLowerCase()
        .includes(location.toLowerCase());

      const matchRemote = onlyRemote ? job.work_mode === "remote" : true;

      const matchType = employmentType
        ? job.employment_type === employmentType
        : true;

      return matchTitle && matchLocation && matchRemote && matchType;
    });
  }, [jobs, searchText, location, onlyRemote, employmentType]);

  // ✅ NOVA MELHORIA:
  // Se o filtro zerar a lista e você estiver em /jobs/:id -> volta pra "/" e limpa detalhe
  useEffect(() => {
    if (filteredJobs.length === 0 && id) {
      setSelectedJob(null);
      setNotFound(false);
      navigate("/");
    }
  }, [filteredJobs, id, navigate]);

  // ✅ MELHORIA EXTRA (a que você pediu):
  // Se o filtro mudar e a vaga selecionada sair do filteredJobs -> limpa o detalhe e volta pra "/"
  useEffect(() => {
    if (!selectedJob) return;

    const stillVisible = filteredJobs.some(
      (j) => String(j.id) === String(selectedJob.id)
    );

    if (!stillVisible) {
      setSelectedJob(null);
      setNotFound(false);
      navigate("/");
    }
  }, [filteredJobs, selectedJob, navigate]);

  return (
    <div className="page-wrapper">
      <header>
        <Navbar />
      </header>

      <div className="container">
        <section className="search-area">
          <SearchBar
            searchText={searchText}
            setSearchText={setSearchText}
            location={location}
            setLocation={setLocation}
            onlyRemote={onlyRemote}
            setOnlyRemote={setOnlyRemote}
            employmentType={employmentType}
            setEmploymentType={setEmploymentType}
          />
        </section>

        <main className="layout">
          <aside className="job-list">
            <JobList
              jobs={filteredJobs}
              selectedJob={selectedJob}
              onSelect={handleSelect}
            />
          </aside>

          <section className="job-detail-area">
            <JobDetail
              job={selectedJob}
              loading={loadingJobs}
              error={errorJobs}
              notFound={notFound}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
