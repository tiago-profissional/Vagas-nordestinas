import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatJob, getJobById } from "../services/jobsApi";
import Headers from "../components/Headers.jsx";
import "../styles/EditJob.css";

export default function EditJob() {
  const { id } = useParams();

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

  useEffect(() => {
    async function loadJob() {
      try {
        const job = await getJobById(id);

        setFormData({
          title: job.title || "",
          company: job.company || "",
          city: job.city || "",
          state: job.state || "",
          work_mode: job.work_mode || "",
          employment_type: job.employment_type || "",
          salary_min: job.salary_min || "",
          salary_max: job.salary_max || "",
          description: job.description || "",
        });

      } catch (error) {
        console.error("Error loading job:", error);
      }
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

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Updated job data:", formData);
  }

  return (
    <>
    <Headers />
      <div className="edit-job-wrapper">
        <h1 className="edit-job-heading">Editar Vaga</h1>

        <div className="edit-job-content">
          <aside className="edit-job-sidebar">
            Sidebar
          </aside>

          <section className="edit-job-card">
            <h2>Editar Vaga</h2>

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
                <button type="button" className="cancel-btn">Cancelar</button>
                <button type="submit" className="save-btn">Salvar Alterações</button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}