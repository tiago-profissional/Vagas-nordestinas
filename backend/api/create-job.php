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

    const payload = {
      ...form,
      salary_min: normalizeSalary(form.salary_min),
      salary_max: normalizeSalary(form.salary_max),
    };

    await onCreate(payload); // sem optional chaining pra falhar “alto” se não tiver onCreate
  }

  return (
    <div className="cj-page">
      <div className="cj-card">
        <h2 className="cj-title">Cadastrar Vaga</h2>

        <form className="cj-form" onSubmit={handleSubmit}>
          {/* ... seus campos iguais ... */}

          <div className="cj-actions">
            <button type="button" className="cj-btn cj-btn-ghost" onClick={onCancel}>
              Cancelar
            </button>

            <button type="submit" className="cj-btn cj-btn-primary">
              Publicar Vaga
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}