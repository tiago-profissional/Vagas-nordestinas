import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Headers from "../Headers";
import { fetchMyApplicationsApi } from "../../services/jobsApi.js";
import "../../styles/dashboardJobs.css";

export default function MinhasCandidaturas() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      const data = await fetchMyApplicationsApi();
      setApplications(data || []);
    } catch (error) {
      toast.error(error.message || "Erro ao carregar candidaturas.");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR");
  }

  return (
    <>
      <Headers />
      <section className="vn-dashboard-jobs">
        <div className="vn-dashboard-jobs__layout">
          <aside className="vn-dashboard-jobs__sidebar">
            <h2 className="vn-dashboard-jobs__sidebar-title">Meu Perfil</h2>
            <div className="vn-dashboard-jobs__sidebar-menu">
              <Link to="/profile" className="vn-dashboard-jobs__sidebar-item">Informações Pessoais</Link>
              <button className="vn-dashboard-jobs__sidebar-item active">Minhas Candidaturas</button>
            </div>
          </aside>

          <main className="vn-dashboard-jobs__content">
            <div className="vn-dashboard-jobs__content-header">
              <div className="vn-dashboard-jobs__content-text">
                <h1>Minhas Candidaturas</h1>
                <p>Acompanhe o estado dos seus processos seletivos.</p>
              </div>
            </div>

            {loading ? (
              <p>A carregar candidaturas...</p>
            ) : applications.length === 0 ? (
              <div style={{ padding: "40px 0", textAlign: "center" }}>
                <p style={{ marginBottom: "15px", color: "#666" }}>Você ainda não se candidatou a nenhuma vaga.</p>
                <Link to="/" style={{ color: "#ea7805", fontWeight: "bold", textDecoration: "underline" }}>
                  Explorar vagas disponíveis
                </Link>
              </div>
            ) : (
              <section className="vn-dashboard-jobs__table-wrap">
                <div className="vn-dashboard-jobs__table">
                  <table>
                    <thead>
                      <tr>
                        <th>Vaga</th>
                        <th>Empresa</th>
                        <th>Localização</th>
                        <th>Data</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app.candidatura_id}>
                          <td>
                            <strong>{app.title}</strong>
                          </td>
                          <td>{app.company}</td>
                          <td>{app.city ? `${app.city}, ${app.state}` : app.work_mode || "Remoto"}</td>
                          <td>{formatDate(app.data_candidatura)}</td>
                          <td>
                            <span className="badge badge--ativa">
                              {app.status || "Em análise"}
                            </span>
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
      </section>
    </>
  );
}