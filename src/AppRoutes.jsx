import { useEffect, useState } from "react";
import { Navigate, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import About from "./components/About.jsx";
import AiResume from "./components/AiResume.jsx";
import Signup from "./components/Signup";
import Login from "./components/Login";
import DashboardJobs from "./components/dashboard";
import CreateJob from "./components/CreateJob";
import EditJob from "./components/EditJob";
import AdminUsers from "./components/AdminUsers.jsx";
import NotFound from "./components/NotFound";
import Tickets from "./components/support/TicketsPage.tsx";
import RelatarProblema from "./components/support/relatar-problema/page.tsx";
import TermsUseScreen from "./components/TermsUseScreen";
import PrivacyPolicyScreen from "./components/PrivacyPolicyScreen";
import User from "./components/User.jsx";
import RequireRole from "./components/RequireRole.jsx";

import MinhasCandidaturas from "./components/minhas-candidaturas/minhas-candidaturas.jsx";
import { fetchJobs } from "./services/jobsApi.js";

export default function AppRoutes() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [errorJobs, setErrorJobs] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadJobs() {
      try {
        setLoadingJobs(true);
        setErrorJobs(null);

        setJobs(await fetchJobs({ signal: controller.signal }));
      } catch (error) {
        if (controller.signal.aborted) return;
        setErrorJobs(error instanceof Error ? error.message : "Erro ao carregar vagas");
        setJobs([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoadingJobs(false);
        }
      }
    }

    void loadJobs();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    function syncUser() {
      try {
        setUser(JSON.parse(localStorage.getItem("user") || "null"));
      } catch {
        setUser(null);
      }
    }

    window.addEventListener("auth:changed", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("auth:changed", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const home = <Home jobs={jobs} loadingJobs={loadingJobs} errorJobs={errorJobs} />;

  return (
    <Routes>
      <Route path="/" element={home} />
      <Route path="/jobs" element={home} />
      <Route path="/jobs/:id" element={home} />

      <Route path="/signup" element={<Signup onSignup={setUser} />} />
      <Route path="/login" element={<Login onLogin={setUser} />} />

      <Route path="/profile" element={user ? <User /> : <Navigate to="/login" replace />} />
      <Route path="/user" element={<Navigate to="/profile" replace />} />
      <Route path="/curriculo" element={<Navigate to="/profile" replace />} />
      <Route path="/ai-resume" element={<AiResume />} />
      <Route path="/about" element={<About />} />
      <Route
        path="/minhas-candidaturas"
        element={user ? <MinhasCandidaturas /> : <Navigate to="/login" replace />}
      />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/relatar-problema" element={<RelatarProblema />} />
      <Route path="/support" element={<Navigate to="/tickets" replace />} />
      <Route path="/termos-de-uso" element={<TermsUseScreen />} />
      <Route path="/politica-de-privacidade" element={<PrivacyPolicyScreen />} />

      <Route element={<RequireRole user={user} roles={["recruiter", "admin"]} />}>
        <Route path="/dashboard" element={<DashboardJobs />} />
        <Route path="/create-job" element={<CreateJob />} />
        <Route path="/edit-job/:id" element={<EditJob />} />
      </Route>

      <Route element={<RequireRole user={user} roles={["admin"]} />}>
        <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}