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

export default function Home({
  jobs,
  loadingJobs,
  errorJobs,
}) {
  const { id } = useParams();

  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState("");
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [employmentType, setEmploymentType] = useState("");

  // Controla o pop-up de detalhes da vaga (só tem efeito no mobile)
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

  // No mobile: trava a rolagem da página e fecha com a tecla Esc
  useEffect(() => {
    if (!detailOpen) return;

    const isMobile = window.matchMedia(
      "(max-width: 768px)"
    ).matches;

    if (!isMobile) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setDetailOpen(false);
      }
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
      return;
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

  const localJobsArray = Array.isArray(jobs)
    ? jobs
    : [];

  const jobsArray = localJobsArray;

  function handleSelect(job) {
    if (!job?.id) return;

    setDetailOpen(true);
  }

  function normalizeText(value) {
    return String(value || "")
      .trim()
      .toLowerCase();
  }

  function normalizeWorkMode(value) {
    const mode = normalizeText(value);

    if (
      mode === "remote" ||
      mode === "remoto"
    ) {
      return "remote";
    }

    if (
      mode === "hybrid" ||
      mode === "híbrido" ||
      mode === "hibrido"
    ) {
      return "hybrid";
    }

    if (
      mode === "onsite" ||
      mode === "on-site" ||
      mode === "presencial"
    ) {
      return "onsite";
    }

    return mode;
  }

  function normalizeEmploymentType(value) {
    const type = normalizeText(value);

    if (
      type === "full-time" ||
      type === "full_time" ||
      type === "tempo integral"
    ) {
      return "full_time";
    }

    if (
      type === "part-time" ||
      type === "part_time" ||
      type === "meio período" ||
      type === "meio periodo"
    ) {
      return "part_time";
    }

    if (
      type === "internship" ||
      type === "estágio" ||
      type === "estagio"
    ) {
      return "internship";
    }

    if (type === "pj") {
      return "pj";
    }

    return type;
  }

  const hasSearchFilters =
    searchText.trim() !== "" ||
    location.trim() !== "" ||
    onlyRemote ||
    employmentType !== "";

  const filteredJobs = useMemo(() => {
    return jobsArray.filter((job) => {
      const title = normalizeText(
        job.title
      );

      const company = normalizeText(
        job.company
      );

      const city = normalizeText(
        job.city
      );

      const state = normalizeText(
        job.state
      );

      const search = normalizeText(
        searchText
      );

      const searchLocation =
        normalizeText(location);

      const workMode =
        normalizeWorkMode(
          job.work_mode ||
            job.work_model ||
            job.modality
        );

      const jobType =
        normalizeEmploymentType(
          job.employment_type ||
            job.contractType ||
            job.type
        );

      const matchSearch =
        !search ||
        title.includes(search) ||
        company.includes(search);

      const matchLocation =
        !searchLocation ||
        city.includes(searchLocation) ||
        state.includes(searchLocation) ||
        `${city} ${state}`.includes(
          searchLocation
        );

      const matchRemote = onlyRemote
        ? workMode === "remote"
        : true;

      const matchType = employmentType
        ? jobType ===
          normalizeEmploymentType(
            employmentType
          )
        : true;

      return (
        matchSearch &&
        matchLocation &&
        matchRemote &&
        matchType
      );
    });
  }, [
    jobsArray,
    searchText,
    location,
    onlyRemote,
    employmentType,
  ]);

  const noSearchResults =
    hasSearchFilters &&
    filteredJobs.length === 0;

  const loadingJobDetail = Boolean(id) &&
    (jobDetail.id !== id || jobDetail.loading);
  const selectedJob = useMemo(() => {
    if (noSearchResults) {
      return null;
    }

    if (!id) {
      return null;
    }

    return jobDetail.id === id ? jobDetail.job : null;
  }, [
    id,
    noSearchResults,
    jobDetail,
  ]);

  const selectedJobNotFound = Boolean(id) &&
    jobDetail.id === id &&
    jobDetail.notFound;

  if (errorJobs) {
    return (
      <>
        <TermsConsentModal />

        <div className="home-page page-wrapper">
          <Headers />

          <div className="container">
            <div
              className="error-container"
              style={{
                textAlign: "center",
                padding: "40px",
              }}
            >
              <h2>
                ⚠️ Erro ao carregar vagas
              </h2>

              <p>{errorJobs}</p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                style={{
                  padding: "10px 20px",
                  marginTop: "20px",
                  cursor: "pointer",
                }}
              >
                Tentar novamente
              </button>
            </div>
          </div>

          <Footer />
        </div>
      </>
    );
  }

  if (loadingJobs) {
    return (
      <>
        <TermsConsentModal />

        <div className="home-page page-wrapper">
          <Headers />

          <div className="container">
            <p
              style={{
                padding: "40px 0",
              }}
            >
              Carregando vagas...
            </p>
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
              className={`job-detail-panel ${
                detailOpen ? "is-open" : ""
              }`}
              onClick={(event) => {
                // Clique no fundo escuro fecha o pop-up
                if (event.target === event.currentTarget) {
                  closeDetail();
                }
              }}
            >
              <div
                className="job-detail-sheet"
                role="dialog"
                aria-modal="true"
                aria-label="Detalhes da vaga"
              >
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