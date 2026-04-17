import { useState } from "react";
import "../styles/createjob.css";

export default function CreateJob({ onCancel, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    company: "",
    city: "",
    state: "",
    work_mode: "remote",
    employment_type: "full_time",
    salary_min: "",
    salary_max: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function normalizeSalary(v) {
    if (v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (submitting) return;

    const payload = {
      ...form,
      salary_min: normalizeSalary(form.salary_min),
      salary_max: normalizeSalary(form.salary_max),
    };

    try {
      setSubmitting(true);

      const createdJob = await onCreate(payload);

      console.log("✅ retorno do onCreate:", createdJob);
      alert("Vaga publicada com sucesso!");

      // limpa
      setForm({
        title: "",
        company: "",
        city: "",
        state: "",
        work_mode: "remote",
        employment_type: "full_time",
        salary_min: "",
        salary_max: "",
        description: "",
      });

      // fecha
      onCancel?.();

      return createdJob;
    } catch (err) {
      console.error("❌ ERRO no submit:", err);
      alert(err?.message || "Erro ao criar vaga");
    } finally {
      setSubmitting(false);
    }
  }


  return (
    <div className="cj-page">
      <div className="cj-card">
        <h2 className="cj-title">Cadastrar Vaga</h2>

        <form className="cj-form" onSubmit={handleSubmit}>
          <div className="cj-grid">
            <div className="cj-field">
              <label className="cj-label">Título*</label>
              <input
                className="cj-input"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="Ex: Frontend React"
              />
            </div>

            <div className="cj-field">
              <label className="cj-label">Empresa*</label>
              <input
                className="cj-input"
                value={form.company}
                onChange={(e) => setField("company", e.target.value)}
                placeholder="Ex: Minha empresa"
              />
            </div>

            <div className="cj-field">
              <label className="cj-label">Cidade*</label>
              <input
                className="cj-input"
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                placeholder="Ex: Recife"
              />
            </div>

            <div className="cj-field">
              <label className="cj-label">Estado*</label>
              <input
                className="cj-input"
                value={form.state}
                onChange={(e) => setField("state", e.target.value)}
                placeholder="Ex: CE"
              />
            </div>

            <div className="cj-field">
              <label className="cj-label">Modalidade*</label>
              <select
                className="cj-input"
                value={form.work_mode}
                onChange={(e) => setField("work_mode", e.target.value)}
              >
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div className="cj-field">
              <label className="cj-label">Tipo de contrato*</label>
              <select
                className="cj-input"
                value={form.employment_type}
                onChange={(e) => setField("employment_type", e.target.value)}
              >
                <option value="full_time">Full-time</option>
                <option value="part_time">Part-time</option>
                <option value="pj">PJ</option>
              </select>
            </div>

            <div className="cj-field">
              <label className="cj-label">Salário mín. (R$)</label>
              <input
                className="cj-input"
                value={form.salary_min}
                onChange={(e) => setField("salary_min", e.target.value)}
                placeholder="5000"
                inputMode="numeric"
              />
            </div>

            <div className="cj-field">
              <label className="cj-label">Salário máx. (R$)</label>
              <input
                className="cj-input"
                value={form.salary_max}
                onChange={(e) => setField("salary_max", e.target.value)}
                placeholder="7000"
                inputMode="numeric"
              />
            </div>

            <div className="cj-field cj-field-full">
              <label className="cj-label">Descrição</label>
              <textarea
                className="cj-textarea"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Detalhes da vaga..."
                rows={5}
              />
            </div>
          </div>

          <div className="cj-actions">
            <button
              type="button"
              className="cj-btn cj-btn-ghost"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="cj-btn cj-btn-primary"
              disabled={submitting}
            >
              {submitting ? "Publicando..." : "Publicar Vaga"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}