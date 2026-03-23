import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getJobsByUser, deleteJob } from "../services/jobsApi";
import "../styles/DashboardJobs.css";

function DashboardJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
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
      } else {
        setError(data.error || "Failed to load jobs.");
      }
    } catch (err) {
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this job?");
    if (!confirmDelete) return;

    try {
      const data = await deleteJob(id);

      if (data.success || data.ok) {
        setJobs((prev) => prev.filter((job) => job.id !== id));
      } else {
        alert(data.message || data.error || "Failed to delete job.");
      }
    } catch (err) {
      alert("Server error while deleting job.");
    }
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
    <div className="dashboard">
      <header className="topbar">
        <div className="logo">Vagas Nordestinas</div>

        <nav className="nav">
          <a href="#">Vagas</a>
          <a href="#">Avaliações</a>
          <a href="#">Salários</a>
        </nav>

        <div className="user">Olá, {user?.name}</div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <h2>Dashboard</h2>

          <button className="sidebar__item active">Minhas Vagas</button>
          <Link to="/create-job" className="sidebar__item">
            Criar Vaga
          </Link>

          <button
            className="sidebar__item"
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/signup");
            }}
          >
            Sair
          </button>
        </aside>

        <main className="content">
          <div className="content__header">
            <div>
              <h1>Minhas Vagas</h1>
              <p>Gerencie suas vagas</p>
            </div>

            <Link to="/create-job" className="btn-primary">
              + Criar Nova Vaga
            </Link>
          </div>

          <div className="stats">
            <div className="card">
              <span>Total</span>
              <h3>{stats.total}</h3>
            </div>

            <div className="card">
              <span>Ativas</span>
              <h3 className="text-green">{stats.active}</h3>
            </div>

            <div className="card">
              <span>Publicadas</span>
              <h3 className="text-blue">{stats.published}</h3>
            </div>

            <div className="card">
              <span>Rascunhos</span>
              <h3 className="text-gold">{stats.draft}</h3>
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div className="table">
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

                      <td className="actions">
                        <Link to={`/job/${job.id}`}>👁</Link>
                        <Link to={`/edit-job/${job.id}`}>✏️</Link>
                        <button onClick={() => handleDelete(job.id)}>🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default DashboardJobs;