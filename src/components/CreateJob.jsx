import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Headers from "./Headers.jsx";

import "../styles/createjob.css";

/*
  API PHP do Vagas Nordestinas.

  O index.php recebe a rota através de:
  ?route=/jobs
*/
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/index.php";
const API_URL = `${API_BASE_URL}?route=/jobs`;

export default function CreateJob({ onCancel }) {
  const navigate = useNavigate();

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
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function normalizeSalary(value) {
    if (value === "") {
      return null;
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : null;
  }

  async function createJob(payload) {
    console.log("📤 Enviando vaga:", payload);
    console.log("🌐 Endpoint:", API_URL);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("📥 Status da resposta:", response.status);

    /*
      Lemos a resposta como texto primeiro.

      Assim conseguimos enxergar erros PHP,
      JSON inválido, warnings, etc.
    */
    const responseText = await response.text();

    console.log("📥 Resposta bruta do backend:", responseText);

    let data = null;

    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        console.error(
          "⚠️ O backend não retornou JSON válido:",
          responseText
        );
      }
    }

    if (!response.ok) {
      const message =
        data?.message ||
        data?.error ||
        `Erro ${response.status}: não foi possível cadastrar a vaga.`;

      throw new Error(message);
    }

    return data || { ...payload };
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (submitting) {
      return;
    }

    if (
      !form.title.trim() ||
      !form.company.trim() ||
      !form.city.trim() ||
      !form.state.trim()
    ) {
      toast.error("Preencha todos os campos obrigatórios (*)");
      return;
    }

    const salaryMin = normalizeSalary(form.salary_min);
    const salaryMax = normalizeSalary(form.salary_max);

    if (form.salary_min !== "" && salaryMin === null) {
      toast.error("O salário mínimo precisa ser um número.");
      return;
    }

    if (form.salary_max !== "" && salaryMax === null) {
      toast.error("O salário máximo precisa ser um número.");
      return;
    }

    if (
      salaryMin !== null &&
      salaryMax !== null &&
      salaryMin > salaryMax
    ) {
      toast.error(
        "O salário mínimo não pode ser maior que o salário máximo."
      );
      return;
    }

    const payload = {
      title: form.title.trim(),
      company: form.company.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      work_mode: form.work_mode,
      employment_type: form.employment_type,
      salary_min: salaryMin,
      salary_max: salaryMax,
      description: form.description.trim(),
    };

    const loadingToast = toast.loading("Publicando vaga...");

    try {
      setSubmitting(true);

      const createdJob = await createJob(payload);

      console.log("✅ Vaga criada:", createdJob);

      toast.dismiss(loadingToast);

      toast.success(
        `Vaga "${createdJob?.title || form.title}" publicada com sucesso!`
      );

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

      setTimeout(() => {
        if (typeof onCancel === "function") {
          onCancel();
        } else {
          navigate("/");
        }
      }, 700);
    } catch (error) {
      toast.dismiss(loadingToast);

      console.error("❌ ERRO ao criar vaga:", error);

      if (
        error instanceof TypeError &&
        error.message === "Failed to fetch"
      ) {
        toast.error(
          "Não foi possível acessar a API PHP. Verifique Apache, a URL do backend e o CORS."
        );
        return;
      }

      toast.error(error?.message || "Erro ao criar vaga");
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    if (typeof onCancel === "function") {
      onCancel();
      return;
    }

    navigate("/");
  }

  return (
    <>
      <Headers />

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
                  onChange={(e) =>
                    setField("title", e.target.value)
                  }
                  placeholder="Ex: Frontend React"
                  required
                />
              </div>

              <div className="cj-field">
                <label className="cj-label">Empresa*</label>

                <input
                  className="cj-input"
                  value={form.company}
                  onChange={(e) =>
                    setField("company", e.target.value)
                  }
                  placeholder="Ex: Minha empresa"
                  required
                />
              </div>

              <div className="cj-field">
                <label className="cj-label">Cidade*</label>

                <input
                  className="cj-input"
                  value={form.city}
                  onChange={(e) =>
                    setField("city", e.target.value)
                  }
                  placeholder="Ex: Recife"
                  required
                />
              </div>

              <div className="cj-field">
                <label className="cj-label">Estado*</label>

                <input
                  className="cj-input"
                  value={form.state}
                  onChange={(e) =>
                    setField("state", e.target.value)
                  }
                  placeholder="Ex: CE"
                  required
                />
              </div>

              <div className="cj-field">
                <label className="cj-label">Modalidade*</label>

                <select
                  className="cj-input"
                  value={form.work_mode}
                  onChange={(e) =>
                    setField("work_mode", e.target.value)
                  }
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
                  onChange={(e) =>
                    setField("employment_type", e.target.value)
                  }
                >
                  <option value="full_time">Full-time</option>
                  <option value="part_time">Part-time</option>
                  <option value="pj">PJ</option>
                  <option value="internship">Estágio</option>
                </select>
              </div>

              <div className="cj-field">
                <label className="cj-label">Salário mín. (R$)</label>

                <input
                  className="cj-input"
                  type="number"
                  min="0"
                  value={form.salary_min}
                  onChange={(e) =>
                    setField("salary_min", e.target.value)
                  }
                  placeholder="5000"
                />
              </div>

              <div className="cj-field">
                <label className="cj-label">Salário máx. (R$)</label>

                <input
                  className="cj-input"
                  type="number"
                  min="0"
                  value={form.salary_max}
                  onChange={(e) =>
                    setField("salary_max", e.target.value)
                  }
                  placeholder="7000"
                />
              </div>

              <div className="cj-field cj-field-full">
                <label className="cj-label">Descrição</label>

                <textarea
                  className="cj-textarea"
                  value={form.description}
                  onChange={(e) =>
                    setField("description", e.target.value)
                  }
                  placeholder="Detalhes da vaga..."
                  rows={5}
                />
              </div>
            </div>

            <div className="cj-actions">
              <button
                type="button"
                className="cj-btn cj-btn-ghost"
                onClick={handleCancel}
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
    </>
  );
}