import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import App from "./App.jsx";
import CreateJob from "./components/CreateJob.jsx";
import EditJob from "./components/EditJob.jsx";
import NotFound from "./components/NotFound.jsx";
import About from "./components/About.jsx";
import Signup from "./components/Signup.jsx";
import DashboardJobs from "./components/dashboard.jsx";
import JobDetail from "./components/JobDetail.jsx";

import { fetchJobs, createJobApi, getJobById } from "./services/jobsApi.js";

export default function AppRoutes() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [errorJobs, setErrorJobs] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoadingJobs(true);
    setErrorJobs("");
    
    const loadingToast = toast.loading("Carregando vagas...");

    try {
      const data = await fetchJobs();
      setJobs(data);
      toast.dismiss(loadingToast);
      toast.success(`${data.length} vagas carregadas com sucesso!`);
    } catch (err) {
      console.log("ERROR GET /jobs:", err);
      toast.dismiss(loadingToast);
      toast.error(err.message || "Erro ao carregar vagas.");
      setErrorJobs(err.message || "Erro ao carregar vagas.");
    } finally {
      setLoadingJobs(false);
    }
  }

  async function handleCreateJob(payload) {
    const loadingToast = toast.loading("Criando nova vaga...");

    try {
      const created = await createJobApi(payload);
      setJobs((prev) => [created, ...prev]);
      toast.dismiss(loadingToast);
      toast.success(`Vaga "${created.title}" criada com sucesso!`);
      navigate(`/jobs/${created.id}`);
      return created;
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message || "Erro ao criar vaga");
      throw err;
    }
  }

  // Componente wrapper para JobDetail
  function JobDetailWrapper() {
    const { id } = useParams(); // AGORA useParams está definido!
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      async function loadJob() {
        try {
          setLoading(true);
          const data = await getJobById(id);
          setJob(data);
          setError(null);
        } catch (err) {
          console.error("Erro ao carregar vaga:", err);
          setError(err.message);
          setJob(null);
        } finally {
          setLoading(false);
        }
      }
      
      if (id) {
        loadJob();
      }
    }, [id]);

    if (loading) return <div className="container">Carregando vaga...</div>;
    if (error) return <div className="container">Erro: {error}</div>;
    if (!job) return <div className="container">Vaga não encontrada</div>;

    return <JobDetail job={job} loading={loading} error={error} notFound={!job} />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <App jobs={jobs} loadingJobs={loadingJobs} errorJobs={errorJobs} />
        }
      />

      <Route path="/jobs/:id" element={<JobDetailWrapper />} />

      <Route
        path="/create-job"
        element={
          <CreateJob
            onCreate={handleCreateJob}
            onCancel={() => navigate("/")}
          />
        }
      />

      <Route path="/edit-job/:id" element={<EditJob />} />

      <Route path="/signup" element={<Signup />} />

      <Route path="/about" element={<About />} />

      <Route path="/dashboard" element={<DashboardJobs />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}