import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Headers from "./Headers";
import { fetchAllUsersForAdmin, changeUserRoleByAdmin } from "../services/profileApi.js";
import "../styles/dashboardJobs.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await fetchAllUsersForAdmin();
      setUsers(data || []);
    } catch (error) {
      toast.error(error.message || "Erro ao carregar utilizadores.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId, newRole) {
    const loadingToast = toast.loading("A atualizar permissão...");
    try {
      await changeUserRoleByAdmin(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success("Permissão atualizada com sucesso!", { id: loadingToast });
    } catch (error) {
      toast.error(error.message || "Falha ao atualizar.", { id: loadingToast });
    }
  }

  return (
    <>
      <Headers />
      <section className="vn-dashboard-jobs">
        <div className="vn-dashboard-jobs__layout">
          <aside className="vn-dashboard-jobs__sidebar">
            <h2 className="vn-dashboard-jobs__sidebar-title">Painel Admin</h2>
            <div className="vn-dashboard-jobs__sidebar-menu">
              <Link to="/dashboard" className="vn-dashboard-jobs__sidebar-item">As minhas vagas</Link>
              <button className="vn-dashboard-jobs__sidebar-item active">Gerir Utilizadores</button>
            </div>
          </aside>

          <main className="vn-dashboard-jobs__content">
            <div className="vn-dashboard-jobs__content-header">
              <div className="vn-dashboard-jobs__content-text">
                <h1>Gerenciamento de Utilizadores</h1>
                <p>Promove utilizadores a recrutadores ou administradores.</p>
              </div>
            </div>

            {loading ? (
              <p>A carregar lista...</p>
            ) : (
              <section className="vn-dashboard-jobs__table-wrap">
                <div className="vn-dashboard-jobs__table">
                  <table>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Papel Atual</th>
                        <th>Ação (Mudar Papel)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`badge ${u.role === 'admin' ? 'badge--ativa' : u.role === 'recruiter' ? 'badge--publicada' : 'badge--rascunho'}`}>
                              {u.role === 'admin' ? 'Admin' : u.role === 'recruiter' ? 'Recrutador' : 'Candidato'}
                            </span>
                          </td>
                          <td>
                            <select 
                              value={u.role} 
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
                            >
                              <option value="user">Candidato</option>
                              <option value="recruiter">Recrutador</option>
                              <option value="admin">Administrador</option>
                            </select>
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