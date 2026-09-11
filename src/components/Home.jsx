import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import JobList from "./JobList.jsx";
import Headers from "./Headers.jsx";
import SearchBar from "./SearchBar.jsx";
import JobDetail from "./JobDetail.jsx";

import {
  fetchGithubJobs,
  fetchGithubJobById,
} from "../services/githubJobsApi.js";

import "../styles/Home.css";

export default function Home({
  jobs,
  loadingJobs,
  errorJobs,
}) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState("");
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [employmentType, setEmploymentType] = useState("");

  const [githubJobs, setGithubJobs] = useState([]);
  const [loadingGithubJobs, setLoadingGithubJobs] =
    useState(false);
  const [errorGithubJobs, setErrorGithubJobs] =
    useState(null);

  const [githubJobDetail, setGithubJobDetail] =
    useState(null);
  const [
    loadingGithubJobDetail,
    setLoadingGithubJobDetail,
  ] = useState(false);
  const [
    errorGithubJobDetail,
    setErrorGithubJobDetail,
  ] = useState(null);

  function parseSkills(skills) {
    if (Array.isArray(skills)) {
      return skills;
    }

    try {
      return skills ? JSON.parse(skills) : [];
    } catch {
      return [];
    }
  }

  function normalizeGithubJob(job) {
    return {
      ...job,
      id: `github-${job.id}`,
      original_id: job.id,
      company: job.posted_by || "GitHub",
      city: "",
      state: "",
      work_mode: job.work_model,
      employment_type: "",
      type: "",
      source: "GitHub",
      skills: parseSkills(job.skills),
    };
  }

  useEffect(() => {
    async function loadGithubJobs() {
      try {
        setLoadingGithubJobs(true);
        setErrorGithubJobs(null);

        const jobsData = await fetchGithubJobs({
          page: 1,
          limit: 100,
        });

        const normalizedGithubJobs = jobsData.map(
          normalizeGithubJob
        );

        setGithubJobs(normalizedGithubJobs);
      } catch (error) {
        console.error(
          "Erro ao carregar vagas do GitHub:",
          error
        );

        setErrorGithubJobs(
          error instanceof Error
            ? error.message
            : "Erro ao carregar vagas do GitHub"
        );

        setGithubJobs([]);
      } finally {
        setLoadingGithubJobs(false);
      }
    }

    loadGithubJobs();
  }, []);

  useEffect(() => {
    async function loadGithubJobDetail() {
      if (!id || !String(id).startsWith("github-")) {
        setGithubJobDetail(null);
        setErrorGithubJobDetail(null);
        return;
      }

      const githubId = String(id).replace("github-", "");

      try {
        setLoadingGithubJobDetail(true);
        setErrorGithubJobDetail(null);

        const job = await fetchGithubJobById(githubId);

        setGithubJobDetail(normalizeGithubJob(job));
      } catch (error) {
        console.error(
          "Erro ao carregar detalhes do GitHub:",
          error
        );

        setErrorGithubJobDetail(
          error instanceof Error
            ? error.message
            : "Erro ao carregar detalhes da vaga"
        );

        setGithubJobDetail(null);
      } finally {
        setLoadingGithubJobDetail(false);
      }
    }

    loadGithubJobDetail();
  }, [id]);

  const localJobsArray = Array.isArray(jobs) ? jobs : [];

  const jobsArray = useMemo(() => {
    return [...localJobsArray, ...githubJobs];
  }, [localJobsArray, githubJobs]);

  function handleSelect(job) {
    if (!job?.id) return;

    navigate(`/jobs/${job.id}`);
  }

  function normalizeText(value) {
    return String(value || "").trim().toLowerCase();
  }

  function normalizeWorkMode(value) {
    const mode = normalizeText(value);

    if (mode === "remote" || mode === "remoto") {
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
      const title = normalizeText(job.title);
      const company = normalizeText(job.company);
      const city = normalizeText(job.city);
      const state = normalizeText(job.state);

      const search = normalizeText(searchText);
      const searchLocation = normalizeText(location);

      const workMode = normalizeWorkMode(
        job.work_mode || job.work_model || job.modality
      );

      const jobType = normalizeEmploymentType(
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
        `${city} ${state}`.includes(searchLocation);

      const matchRemote = onlyRemote
        ? workMode === "remote"
        : true;

      const matchType = employmentType
        ? jobType ===
          normalizeEmploymentType(employmentType)
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
    hasSearchFilters && filteredJobs.length === 0;

  const isGithubRoute =
    Boolean(id) && String(id).startsWith("github-");

  const idDoesNotExist =
    Boolean(id) &&
    !isGithubRoute &&
    jobsArray.length > 0 &&
    !jobsArray.some(
      (job) => String(job.id) === String(id)
    );

  const selectedJob = useMemo(() => {
    if (noSearchResults) {
      return null;
    }

    if (!id) {
      return null;
    }

    if (isGithubRoute) {
      return githubJobDetail;
    }

    if (idDoesNotExist) {
      return null;
    }

    return (
      jobsArray.find(
        (job) => String(job.id) === String(id)
      ) || null
    );
  }, [
    jobsArray,
    id,
    noSearchResults,
    isGithubRoute,
    idDoesNotExist,
    githubJobDetail,
  ]);

  const selectedJobNotFound = isGithubRoute
    ? Boolean(errorGithubJobDetail) &&
      !loadingGithubJobDetail &&
      !githubJobDetail
    : idDoesNotExist;

  if (errorJobs) {
    return (
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
            <h2>⚠️ Erro ao carregar vagas</h2>

            <p>{errorJobs}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
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
      </div>
    );
  }

  if (loadingJobs) {
    return (
      <div className="home-page page-wrapper">
        <Headers />

        <div className="container">
          <p style={{ padding: "40px 0" }}>
            Car Carregando vagas...
          </p>
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

        {loadingGithubJobs && (
          <p style={{ padding: "10px 0" }}>
            Carregando vagas do GitHub...
          </p>
        )}

        {errorGithubJobs && (
          <p
            style={{
              padding: "10px 0",
              color: "red",
            }}
          >
            Erro nas vagas do GitHub:{" "}
            {errorGithubJobs}
          </p>
        )}

        <main className="layout">
          <aside className="job-list">
            <JobList
              jobs={filteredJobs}
              selectedJobId={selectedJob?.id}
              onSelect={handleSelect}
              noSearchResults={noSearchResults}
            />
          </aside>

          <section className="job-detail-panel">
            <JobDetail
              job={selectedJob}
              loading={
                isGithubRoute
                  ? loadingGithubJobDetail
                  : false
              }
              error={
                isGithubRoute
                  ? errorGithubJobDetail
                  : null
              }
              notFound={selectedJobNotFound}
              noSearchResults={noSearchResults}
            />
          </section>
        </main>
      </div>
    </div>
  );
}