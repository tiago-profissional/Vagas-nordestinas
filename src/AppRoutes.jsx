import { Routes, Route, useNavigate } from "react-router-dom";
import App from "./App.jsx";
import CreateJob from "./components/CreateJob.jsx";

const API_URL = "http://localhost:8000/Vagas_Nordestinas/backend/api";

export default function AppRoutes() {
  const navigate = useNavigate();

  async function createJob(payload) {
    const res = await fetch(`${API_URL}/jobs.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (json?.errors) {
        const msg = Object.values(json.errors).join("\n");
        throw new Error(msg);
      }
      throw new Error(json?.error || "Erro ao criar vaga");
    }

    // depois de criar, volta pra home
    navigate("/");
    return json;
  }

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/jobs/:id" element={<App />} />

      <Route
        path="/create-job"
        element={
          <CreateJob
            onCreate={createJob}
            onCancel={() => navigate("/")}
          />
        }
      />

      <Route
        path="*"
        element={<div style={{ padding: 24 }}>404 - Página não encontrada</div>}
      />
    </Routes>
  );
}