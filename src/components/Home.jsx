import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import JobList from "./JobList.jsx";
import Headers from "./Headers.jsx";
import SearchBar from "./SearchBar.jsx";
import "../styles/Home.css";

export default function Home({ jobs, loadingJobs, errorJobs }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState("");
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [employmentType, setEmploymentType] = useState("");

  function handleSelect(job) {
    navigate(`/jobs/${job.id}`);
  }

  const filteredJobs = useMemo(() => {
    if (!jobs || !Array.isArray(jobs)) return [];
    
    return jobs.filter((job) => {
      const matchTitle = (job.title || "")
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const matchLocation = ((job.city || "") + " " + (job.state || ""))
        .toLowerCase()
        .includes(location.toLowerCase());

      const matchRemote = onlyRemote ? job.work_mode === "remote" : true;

      const matchType = employmentType
        ? job.employment_type === employmentType
        : true;

      return matchTitle && matchLocation && matchRemote && matchType;
    });
  }, [jobs, searchText, location, onlyRemote, employmentType]);

  if (errorJobs) {
    return (
      <div className="home-page page-wrapper">
        <Headers />
        <div className="container">
          <div className="error-container" style={{ textAlign: "center", padding: "40px" }}>
            <h2>⚠️ Erro ao carregar vagas</h2>
            <p>{errorJobs}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{ padding: "10px 20px", marginTop: "20px", cursor: "pointer" }}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page page-wrapper">
      <Headers />

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
              selectedJobId={id}
              onSelect={handleSelect}
            />
          </aside>
        </main>
      </div>
    </div>
  );
}