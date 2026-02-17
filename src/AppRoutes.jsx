import { Routes, Route } from "react-router-dom";
import App from "./App.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/jobs/:id" element={<App />} />
      <Route path="*" element={<div style={{ padding: 24 }}>404 - Página não encontrada</div>} />
    </Routes>
  );
}
