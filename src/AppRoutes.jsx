import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import DashboardJobs from "./components/dashboard";
import CreateJob from "./components/CreateJob";
import EditJob from "./components/EditJob";
import AdminUsers from "./components/AdminUsers.jsx";
import NotFound from "./components/NotFound";

import Tickets from "./components/support/TicketsPage.tsx";
import RelatarProblema from "./components/support/relatar-problema/page.tsx";

import Footer from "./components/Footer";
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

  const home = <Home jobs={jobs} loadingJobs={loadingJobs} errorJobs={errorJobs} />;

  return (
    <Routes>
      <Route path="/" element={home} />
      <Route path="/jobs/:id" element={home} />

      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login onLogin={setUser} />} />

      <Route path="/user" element={<User />} />
      <Route path="/minhas-candidaturas" element={<MinhasCandidaturas />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/relatar-problema" element={<RelatarProblema />} />
      <Route path="/footer" element={<Footer />} />
      <Route path="/termos-de-uso" element={<TermsUseScreen />} />
      <Route path="/politica-de-privacidade" element={<PrivacyPolicyScreen />} />

      <Route element={<RequireRole user={user} roles={["recruiter", "admin"]} />}>
        <Route path="/dashboard" element={<DashboardJobs />} />
        <Route path="/create-job" element={<CreateJob />} />
        <Route path="/edit-job/:id" element={<EditJob />} />
      </Route>

      <Route element={<RequireRole user={user} roles={["admin"]} />}>
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}