import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import DashboardJobs from "./components/dashboard";
import CreateJob from "./components/CreateJob";
import EditJob from "./components/EditJob";
import NotFound from "./components/NotFound";
import Tickets from "./components/support/TicketsPage.jsx";
import Footer from "./components/Footer";
import TermsUseScreen from "./components/TermsUseScreen";
import PrivacyPolicyScreen from "./components/PrivacyPolicyScreen";
import { fetchJobs } from "./services/jobsApi.js";

function AppRoutes() {
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
        if (error.name === "AbortError") return;

        console.error("Erro ao buscar vagas:", error);
        setErrorJobs(
          error instanceof Error ? error.message : "Erro ao carregar vagas"
        );
        setJobs([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoadingJobs(false);
        }
      }
    }

    loadJobs();

    return () => controller.abort();
  }, []);

  const home = (
    <Home
      jobs={jobs}
      loadingJobs={loadingJobs}
      errorJobs={errorJobs}
    />
  );

  return (
    <Routes>
      <Route path="/" element={home} />
      <Route path="/jobs/:id" element={home} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<DashboardJobs />} />
      <Route path="/create-job" element={<CreateJob />} />
      <Route path="/edit-job/:id" element={<EditJob />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/footer" element={<Footer />} />
      <Route path="/termos-de-uso" element={<TermsUseScreen />} />
      <Route
        path="/politica-de-privacidade"
        element={<PrivacyPolicyScreen />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;