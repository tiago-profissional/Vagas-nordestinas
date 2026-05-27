import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getJobById,
  getJobs,
  updateJobApi,
  deleteJobApi,
} from "../services/jobsApi";
import Headers from "./Headers.jsx";
import "../styles/EditJob.css";
import JobSidebar from "./JobSidebar.jsx";
import JobSidebarSearch from "./JobSidebarSearch.jsx";
import DeleteModal from "./delete.jsx";

export default function EditJob() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    city: "",
    state: "",
    work_mode: "",
    employment_type: "",
    salary_min: "",
    salary_max: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadJob() {
      try {
        setLoading(true);
        setError("");

        const job = await getJobById(id);
        const jobsList = await getJobs();

        setFormData({
          title: job?.title || "",
          company: job?.company || "",
          city: job?.city || "",
          state: job?.state || "",
          work_mode: job?.work_mode || "",
          employment_type: job?.employment_type || "",
          salary_min: job?.salary_min || "",
          salary_max: job?.salary_max || "",
          description: job?.description || "",
        });

        setJobs(Array.isArray(jobsList) ? jobsList : []);
      } catch (error) {
        console.error("Error loading job:", error);
        toast.error(error.message || "Erro ao carregar vaga.");
        setError(error.message || "Erro ao carregar vaga.");
      } finally {
        setLoading(false);
      }
    }

    if (!id) {
      toast.error("ID da vaga não encontrado.");
      setError("ID da vaga não encontrado.");
      setLoading(false);
      return;
    }

    loadJob();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.title || !formData.company || !formData.city || !formData.state) {
      toast.error("Preencha os campos obrigatórios.");
      setError("Preencha os campos obrigatórios.");
      return;
    }

    const loadingToast = toast.loading("Salvando alterações...");

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateJobApi(id, formData);

      toast.dismiss(loadingToast);
      toast.success("Vaga atualizada com sucesso!");
      setSuccess("Vaga atualizada com sucesso!");

      setTimeout(() => {
        navigate(`/jobs/${id}`);
      }, 1200);
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error updating job:", error);
      toast.error("Erro ao atualizar vaga.");
      setError("Erro ao atualizar vaga.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const loadingToast = toast.loading("Deletando vaga...");

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      await deleteJobApi(id);

      toast.dismiss(loadingToast);
      toast.success("Vaga deletada com sucesso!");
      setShowDeleteModal(false);
      navigate("/");
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error deleting job:", error);
      toast.error("Erro ao deletar vaga.");
      setError("Erro ao deletar vaga.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <>
        <Headers />
        <div className="editjob-page">
          <div className="editjob-page__inner">
            <h1 className="editjob-page__title">Editar Vaga</h1>
            <p className="editjob-page__loading">Carregando vaga...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Headers />

      <div className="editjob-page">
        <div className="editjob-page__inner">
          <h1 className="editjob-page__title">Editar Vaga</h1>

          <div className="editjob-layout">
            <aside className="editjob-layout__sidebar">
              <div className="editjob-layout__search">
                <JobSidebarSearch
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              </div>

              <div className="editjob-layout__list">
                <JobSidebar
                  jobs={jobs}
                  currentJobId={id}
                  searchTerm={searchTerm}
                />
              </div>
            </aside>

            <section className="editjob-layout__main">
              <div className="editjob-form-card">
                <h2 className="editjob-form-card__title">Edit Job</h2>

                <form onSubmit={handleSubmit} className="editjob-form-grid">
                  <div className="editjob-field">
                    <label>Job title*</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="editjob-field">
                    <label>Empresa*</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="editjob-field">
                    <label>Cidade*</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="editjob-field">
                    <label>Estado*</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="editjob-field">
                    <label>Work Mode</label>
                    <select
                      name="work_mode"
                      value={formData.work_mode}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="onsite">On-site</option>
                    </select>
                  </div>

                  <div className="editjob-field">
                    <label>Employment Type</label>
                    <select
                      name="employment_type"
                      value={formData.employment_type}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="full_time">Full-time</option>
                      <option value="part_time">Part-time</option>
                      <option value="pj">PJ</option>
                    </select>
                  </div>

                  <div className="editjob-field">
                    <label>Salary Min</label>
                    <input
                      type="number"
                      name="salary_min"
                      value={formData.salary_min}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="editjob-field">
                    <label>Salary Max</label>
                    <input
                      type="number"
                      name="salary_max"
                      value={formData.salary_max}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="editjob-field editjob-field--full">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="editjob-actions">
                    <button
                      type="button"
                      className="editjob-btn editjob-btn--cancel"
                      onClick={() => navigate(-1)}
                      disabled={saving || deleting}
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      className="editjob-btn editjob-btn--delete"
                      onClick={() => setShowDeleteModal(true)}
                      disabled={saving || deleting}
                    >
                      Delete
                    </button>

                    <button
                      type="submit"
                      className="editjob-btn editjob-btn--save"
                      disabled={saving || deleting}
                    >
                      {saving ? "Salvando..." : "Salvar Alterações"}
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>

      <DeleteModal
        show={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}