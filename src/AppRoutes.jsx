import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import App from "./App.jsx";
import CreateJob from "./components/CreateJob.jsx";
import { fetchJobs, createJobApi } from "./services/jobsApi.js";
import EditJob from "./components/EditJob.jsx";

export default function AppRoutes() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [errorJobs, setErrorJobs] = useState("");

  useEffect(() => {
    setLoadingJobs(true);
    setErrorJobs("");

    fetchJobs()
      .then(setJobs)
      .catch((err) => {
        console.log("ERROR GET /jobs:", err);
        setErrorJobs(err.message || "Erro ao carregar vagas.");
      })
      .finally(() => setLoadingJobs(false));
  }, []);

  async function handleCreateJob(payload) {
    const created = await createJobApi(payload);

    setJobs((prev) => [created, ...prev]);

    navigate(`/jobs/${created.id}`);

    return created;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<App jobs={jobs} loadingJobs={loadingJobs} errorJobs={errorJobs} />}
      />

      <Route
        path="/jobs/:id"
        element={<App jobs={jobs} loadingJobs={loadingJobs} errorJobs={errorJobs} />}
      />

      <Route
        path="/create-job"
        element={
          <CreateJob
            onCreate={handleCreateJob}
            onCancel={() => navigate("/")}
          />
        }
      />

      <Route
        path="*"
        element={<div style={{ padding: 24 }}>404 - Página não encontrada</div>}
      />

        <Route path="/edit-job/:id" element={<EditJob />} /> 

    </Routes>
  );
}