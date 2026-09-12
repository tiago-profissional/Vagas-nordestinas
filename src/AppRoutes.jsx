import { Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import DashboardJobs from "./components/dashboard";
import CreateJob from "./components/CreateJob";
import EditJob from "./components/EditJob";
import NotFound from "./components/NotFound";
import MyTickets from "./components/MyTickets.jsx";

function AppRoutes({ jobs, loadingJobs, errorJobs }) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            jobs={jobs}
            loadingJobs={loadingJobs}
            errorJobs={errorJobs}
          />
        }
      />

      <Route
        path="/jobs/:id"
        element={
          <Home
            jobs={jobs}
            loadingJobs={loadingJobs}
            errorJobs={errorJobs}
          />
        }
      />

      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<DashboardJobs />} />
      <Route path="/create-job" element={<CreateJob />} />
      <Route path="/edit-job/:id" element={<EditJob />} />

      <Route path="/MyTickets" element={<MyTickets />} /> 

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;