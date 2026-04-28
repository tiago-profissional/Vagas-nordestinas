import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "./Headers";
import { getJobsByUser, deleteJob } from "../services/jobsApi";
import "../styles/dashboardJobs.css";

function DashboardJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user) {
      toast.error("Faça login para acessar o dashboard");
      navigate("/signup");
      return;
    }

    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await getJobsByUser(user.id);

      if (data.ok) {
        setJobs(data.data || []);
        toast.success(`${data.data?.length || 0} vagas carregadas`);
      } else {
        toast.error(data.error || "Failed to load jobs.");
        setError(data.error || "Failed to load jobs.");
      }
    } catch (err) {
      toast.error("Server error.");
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this job?");
    if (!confirmDelete) return;

    const loadingToast = toast.loading("Deletando vaga...");

    try {
      const data = await deleteJob(id);

      if (data.success || data.ok) {
        setJobs((prev) => prev.filter((job) => job.id !== id));
        toast.dismiss(loadingToast);
        toast.success("Vaga deletada com sucesso!");
      } else {
        toast.dismiss(loadingToast);
        toast.error(data.message || data.error || "Failed to delete job.");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Server error while deleting job.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logout realizado com sucesso!");
    navigate("/signup");
  };

  const stats = useMemo(
    () => ({
      total: jobs.length,
      active: jobs.filter((j) => j.status === "Ativa").length,
      published: jobs.filter((j) => j.status === "Publicada").length,
      draft: jobs.filter((j) => j.status === "Rascunho").length,
    }),
    [jobs]
  );

  return (
    <>
      <Header />

      <div className="vn-dashboard-jobs">
        <div className="vn-dashboard-jobs__layout">
          <aside className="vn-dashboard-jobs__sidebar">
            <h2 className="vn-dashboard-jobs__sidebar-title">Dashboard</h2>

            <div className="vn-dashboard-jobs__sidebar-menu">
              <button className="vn-dashboard-jobs__sidebar-item active">
                Minhas Vagas
              </button>

              <Link
                to="/create-job"
                className="vn-dashboard-jobs__sidebar-item"
              >
                Criar Vaga
              </Link>

              <button
                className="vn-dashboard-jobs__sidebar-item"
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          </aside>

          <main className="vn-dashboard-jobs__content">
            <div className="vn-dashboard-jobs__content-header">
              <div className="vn-dashboard-jobs__content-text">
                <h1>Minhas Vagas</h1>
                <p>Gerencie suas vagas</p>
              </div>

              <Link
                to="/create-job"
                className="vn-dashboard-jobs__btn-primary"
              >
                + Criar Nova Vaga
              </Link>
            </div>

            <section className="vn-dashboard-jobs__stats">
              <div className="vn-dashboard-jobs__stat-card">
                <span className="vn-dashboard-jobs__stat-label">
                  Total de Vagas
                </span>
                <h3 className="vn-dashboard-jobs__stat-number">
                  {stats.total}
                </h3>
              </div>

              <div className="vn-dashboard-jobs__stat-card">
                <span className="vn-dashboard-jobs__stat-label">Ativas</span>
                <h3 className="vn-dashboard-jobs__stat-number text-blue">
                  {stats.active}
                </h3>
              </div>

              <div className="vn-dashboard-jobs__stat-card">
                <span className="vn-dashboard-jobs__stat-label">Publicadas</span>
                <h3 className="vn-dashboard-jobs__stat-number text-blue">
                  {stats.published}
                </h3>
              </div>

              <div className="vn-dashboard-jobs__stat-card">
                <span className="vn-dashboard-jobs__stat-label">Rascunhos</span>
                <h3 className="vn-dashboard-jobs__stat-number text-purple">
                  {stats.draft}
                </h3>
              </div>
            </section>

            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="vn-dashboard-jobs__error">{error}</p>
            ) : (
              <section className="vn-dashboard-jobs__table-wrap">
                <div className="vn-dashboard-jobs__table">
                  <table>
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Cidade</th>
                        <th>Modalidade</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>

                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job.id}>
                          <td>{job.title}</td>

                          <td>
                            {job.city}
                            {job.state ? `, ${job.state}` : ""}
                          </td>

                          <td>
                            <span
                              className={`badge badge--${(
                                job.work_mode || ""
                              ).toLowerCase()}`}
                            >
                              {job.work_mode || "N/A"}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`badge badge--${(
                                job.status || ""
                              ).toLowerCase()}`}
                            >
                              {job.status || "Sem status"}
                            </span>
                          </td>

                          <td className="vn-dashboard-jobs__actions">
                            <Link to={`/job/${job.id}`} aria-label="View job">
                              👁
                            </Link>

                            <Link
                              to={`/edit-job/${job.id}`}
                              aria-label="Edit job"
                            >
                              ✏️
                            </Link>

                            <button
                              onClick={() => handleDelete(job.id)}
                              aria-label="Delete job"
                            >
                              🗑
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default DashboardJobs;