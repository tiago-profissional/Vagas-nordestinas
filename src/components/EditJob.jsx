// EditJob.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById, getJobs, updateJobApi, deleteJobApi } from "../services/jobsApi";
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

        console.log("ID recebido:", id);

        const job = await getJobById(id);
        console.log("Job carregado:", job);

        const jobsList = await getJobs();
        console.log("Lista carregada:", jobsList);

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
        setError(error.message || "Erro ao carregar vaga.");
      } finally {
        setLoading(false);
      }
    }

    if (!id) {
      setError("ID da vaga não encontrado.");
      setLoading(false);
      return;
    }

    loadJob();
  }, [id]);


  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.company ||
      !formData.city ||
      !formData.state
    ) {
      setError("Preencha os campos obrigatórios.");
      setSuccess("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateJobApi(id, formData);

      setSuccess("Vaga atualizada com sucesso!");

      setTimeout(() => {
        navigate(`/jobs/${id}`);
      }, 1200);
    } catch (error) {
      console.error("Error updating job:", error);
      setError("Erro ao atualizar vaga.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      await deleteJobApi(id);

      setShowDeleteModal(false);
      navigate("/");
    } catch (error) {
      console.error("Error deleting job:", error);
      setError("Erro ao deletar vaga.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <>
        <Headers />
        <div className="edit-job-wrapper">
          <h1 className="edit-job-heading">Editar Vaga</h1>
          <p style={{ color: "#fff", textAlign: "center" }}>
            Carregando vaga...
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Headers />

      <div className="edit-job-wrapper">
        <h1 className="edit-job-heading">Editar Vaga</h1>

        <div className="edit-job-content">
          <div className="edit-job-left">
            <JobSidebarSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            <JobSidebar
              jobs={jobs}
              currentJobId={id}
              searchTerm={searchTerm}
            />
          </div>

          <div className="edit-job-right">
            {error && (
              <p style={{ color: "#ff6b6b", marginBottom: "16px" }}>
                {error}
              </p>
            )}

            {success && (
              <p style={{ color: "#51cf66", marginBottom: "16px" }}>
                {success}
              </p>
            )}

            <form onSubmit={handleSubmit} className="edit-job-form">
              <div className="form-group">
                <label>Job title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Empresa*</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Cidade*</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Estado*</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
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

              <div className="form-group">
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

              <div className="form-group">
                <label>Salary Min</label>
                <input
                  type="number"
                  name="salary_min"
                  value={formData.salary_min}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Salary Max</label>
                <input
                  type="number"
                  name="salary_max"
                  value={formData.salary_max}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="edit-job-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate(-1)}
                  disabled={saving || deleting}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => setShowDeleteModal(true)}
                  disabled={saving || deleting}
                >
                  Delete
                </button>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={saving || deleting}
                >
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
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