import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import JobDetail from "./JobDetail.jsx";
import JobList from "./JobList.jsx";
import Headers from "./Headers.jsx";
import SearchBar from "./SearchBar.jsx";
import "../styles/Home.css";

export default function Home({ jobs, loadingJobs, errorJobs }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [selectedJob, setSelectedJob] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth <= 375);

  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState("");
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [employmentType, setEmploymentType] = useState("");

  useEffect(() => {
    function handleResize() {
      setIsSmallMobile(window.innerWidth <= 375);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (loadingJobs) return;
    if (errorJobs) return;

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
      setSelectedJob(null);
      setNotFound(true);
    }
  }, [id, jobs, loadingJobs, errorJobs]);

  function handleSelect(job) {
    setSelectedJob(job);
    setNotFound(false);
    navigate(`/jobs/${job.id}`);
  }

  function handleBackToList() {
    setSelectedJob(null);
    setNotFound(false);
    navigate("/");
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
          {isSmallMobile ? (
            selectedJob || notFound ? (
              <section className="job-detail-area mobile-single-column-detail">
                <button
                  type="button"
                  className="mobile-back-btn"
                  onClick={handleBackToList}
                >
                  ← Voltar para vagas
                </button>

                <JobDetail
                  job={selectedJob}
                  loading={loadingJobs}
                  error={errorJobs}
                  notFound={notFound}
                />
              </section>
            ) : (
              <aside className="job-list">
                <JobList
                  jobs={filteredJobs}
                  selectedJob={selectedJob}
                  onSelect={handleSelect}
                />
              </aside>
            )
          ) : (
            <>
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}