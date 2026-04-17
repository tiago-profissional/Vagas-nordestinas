import { Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";

export default function App({ jobs, loadingJobs, errorJobs }) {
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
    </Routes>
  );
}