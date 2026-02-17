import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import JobDetail from "./components/JobDetail.jsx";
import JobList from "./components/JobList.jsx";
import Navbar from "./components/Navbar.jsx";
import SearchBar from "./components/SearchBar.jsx";

const API_URL = "http://localhost:8000/Vagas_Nordestinas/api";

function formatJob(job) {
  let location;

  if (job.work_mode === "remote") {
    location = "Remote";
  } else {
    if (job.state) location = job.city + ", " + job.state;
    else location = job.city;
  }

  let type;
  if (job.employment_type === "full_time") type = "Full-time";
  else if (job.employment_type === "part_time") type = "Part-time";
  else if (job.employment_type === "pj") type = "PJ";
  else if (job.employment_type) type = job.employment_type;
  else type = "-";

  let salary;
  if (job.salary_min && job.salary_max) {
    salary =
      "R$ " +
      job.salary_min.toLocaleString("pt-BR") +
      " - R$ " +
      job.salary_max.toLocaleString("pt-BR");
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

  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState("");

  const [onlyRemote, setOnlyRemote] = useState(false);
  const [employmentType, setEmploymentType] = useState("");

  // ✅ Fetch 1x
  useEffect(() => {
    fetch(`${API_URL}/jobs.php`)
      .then((res) => res.json())
      .then((json) => {
        const list = json.data ?? [];
        const formatted = list.map(formatJob);
        setJobs(formatted);
      })
      .catch((err) => console.log("ERROR GET /jobs:", err));
  }, []);

  // ✅ Seleciona a vaga certa pela URL
  useEffect(() => {
    if (!jobs.length) return;

    // se estiver na home "/", escolhe a primeira
    if (!id) {
      setSelectedJob(jobs[0] || null);
      return;
    }

    // se estiver em /jobs/:id, encontra a vaga
    const found = jobs.find((j) => String(j.id) === String(id));
    if (found) {
      setSelectedJob(found);
    } else {
      navigate("/"); // id inválido
    }
  }, [id, jobs, navigate]);

  // ✅ Clique na lista: seleciona + muda URL
  function handleSelect(job) {
    setSelectedJob(job);
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
            <JobDetail job={selectedJob} />
          </section>
        </main>
      </div>
    </div>
  );
}
