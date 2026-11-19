import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const phpBackendPath = "/vagas_nordestinas/Vagas-nordestinas_velha/backend";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, phpBackendPath),
      },
      "/uploads": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/uploads/, `${phpBackendPath}/uploads`),
      },
    },
  },
});