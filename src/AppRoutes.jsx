import { Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import CreateJob from "./components/CreateJob.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/jobs/:id" element={<App />} />
      <Route path="/create-job" element={<CreateJob />} /> 
      <Route path="*" element={<div style={{ padding: 24 }}>404 - Página não encontrada</div>} />
      
    </Routes>
  );
}
