import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import JobList from "./JobList.jsx";
import Headers from "./Headers.jsx";
import SearchBar from "./SearchBar.jsx";
import JobDetail from "./JobDetail.jsx";
import Footer from "./Footer";
import TermsConsentModal from "./TermsConsentModal";
import { getJobById } from "../services/jobsApi.js";

import "../styles/Home.css";

export default function Home({ jobs, loadingJobs, errorJobs }) {
  const { id } = useParams();
  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState("");
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [employmentType, setEmploymentType] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [jobDetail, setJobDetail] = useState({
    id: null,
    job: null,
    loading: false,
    error: null,
    notFound: false,
  });

  function closeDetail() {
    setDetailOpen(false);
  }

  useEffect(() => {
    if (!detailOpen) return undefined;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") setDetailOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [detailOpen]);

  useEffect(() => {
    if (!id) {
      setJobDetail({
        id: null,
        job: null,
        loading: false,
        error: null,
        notFound: false,
      });
      return undefined;
    }

    const controller = new AbortController();
    setJobDetail({ id, job: null, loading: true, error: null, notFound: false });

    getJobById(id, { signal: controller.signal })
      .then((job) => {
        setJobDetail({ id, job, loading: false, error: null, notFound: false });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        const notFound = error?.status === 404;
        setJobDetail({
          id,
          job: null,
          loading: false,
          error: notFound ? null : error.message,
          notFound,
        });
      });

    return () => controller.abort();
  }, [id]);

  const jobsArray = Array.isArray(jobs) ? jobs : [];

  function handleSelect(job) {
    if (!job?.id) return;
    setDetailOpen(true);
  }

  function normalizeText(value) {
    return String(value || "").trim().toLowerCase();
  }

  function normalizeWorkMode(value) {
    const mode = normalizeText(value);
    if (mode === "remote" || mode === "remoto") return "remote";
    if (["hybrid", "híbrido", "hibrido"].includes(mode)) return "hybrid";
    if (["onsite", "on-site", "presencial"].includes(mode)) return "onsite";
    return mode;
  }

  function normalizeEmploymentType(value) {
    const type = normalizeText(value);
    if (["full-time", "full_time", "tempo integral"].includes(type)) return "full_time";
    if (["part-time", "part_time", "meio período", "meio periodo"].includes(type)) return "part_time";
    if (["internship", "estágio", "estagio"].includes(type)) return "internship";
    return type === "pj" ? "pj" : type;
  }

  const hasSearchFilters =
    searchText.trim() !== "" || location.trim() !== "" || onlyRemote || employmentType !== "";

  const filteredJobs = useMemo(() => {
    return jobsArray.filter((job) => {
      const title = normalizeText(job.title);
      const company = normalizeText(job.company);
      const city = normalizeText(job.city);
      const state = normalizeText(job.state);
      const search = normalizeText(searchText);
      const searchLocation = normalizeText(location);
      const workMode = normalizeWorkMode(job.work_mode || job.work_model || job.modality);
      const jobType = normalizeEmploymentType(job.employment_type || job.contractType || job.type);
      const matchSearch = !search || title.includes(search) || company.includes(search);
      const matchLocation =
        !searchLocation ||
        city.includes(searchLocation) ||
        state.includes(searchLocation) ||
        `${city} ${state}`.includes(searchLocation);
      const matchRemote = !onlyRemote || workMode === "remote";
      const matchType = !employmentType || jobType === normalizeEmploymentType(employmentType);
      return matchSearch && matchLocation && matchRemote && matchType;
    });
  }, [jobsArray, searchText, location, onlyRemote, employmentType]);

  const noSearchResults = hasSearchFilters && filteredJobs.length === 0;
  const loadingJobDetail = Boolean(id) && (jobDetail.id !== id || jobDetail.loading);
  const selectedJob = useMemo(() => {
    if (noSearchResults || !id) return null;
    return jobDetail.id === id ? jobDetail.job : null;
  }, [id, noSearchResults, jobDetail]);
  const selectedJobNotFound =
    Boolean(id) && jobDetail.id === id && jobDetail.notFound;

  if (errorJobs || loadingJobs) {
    return (
      <>
        <TermsConsentModal />
        <div className="home-page page-wrapper">
          <Headers />
          <div className="container">
            {errorJobs ? (
              <div className="error-container" role="alert">
                <h2>Erro ao carregar vagas</h2>
                <p>{errorJobs}</p>
                <button type="button" onClick={() => window.location.reload()}>
                  Tentar novamente
                </button>
              </div>
            ) : (
              <p className="home-loading" role="status">Carregando vagas...</p>
            )}
          </div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <TermsConsentModal />
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
                selectedJobId={selectedJob?.id}
                onSelect={handleSelect}
                noSearchResults={noSearchResults}
              />
            </aside>
            <section
              className={`job-detail-panel ${detailOpen ? "is-open" : ""}`}
              onClick={(event) => {
                if (event.target === event.currentTarget) closeDetail();
              }}
            >
              <div className="job-detail-sheet" role="dialog" aria-modal="true" aria-label="Detalhes da vaga">
                <button
                  type="button"
                  className="job-detail-close"
                  onClick={closeDetail}
                  aria-label="Fechar detalhes da vaga"
                >
                  ✕
                </button>
                <JobDetail
                  job={selectedJob}
                  loading={loadingJobDetail}
                  error={jobDetail.id === id ? jobDetail.error : null}
                  notFound={selectedJobNotFound}
                  noSearchResults={noSearchResults}
                />
              </div>
            </section>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}
