import "dotenv/config";

import cors from "cors";
import express from "express";
import type { ErrorRequestHandler } from "express";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { uploadsDir } from "./middleware/uploadAvatar.js";

const app = express();
const port = Number(process.env.PORT || 3001);
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.disable("x-powered-by");
app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  }),
);
app.use(express.json({ limit: "32kb" }));
app.use(
  "/uploads",
  express.static(uploadsDir, {
    index: false,
    dotfiles: "deny",
    setHeaders: (res) => res.setHeader("X-Content-Type-Options", "nosniff"),
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/tickets", ticketRoutes);

const tratarErros: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error?.type === "entity.parse.failed") {
    res.status(400).json({ message: "JSON inválido." });
    return;
  }
  if (error?.type === "entity.too.large") {
    res.status(413).json({ message: "Os dados enviados são muito grandes." });
    return;
  }
  console.error("Erro na API:", error);
  res.status(500).json({
    message: "Não foi possível concluir a solicitação. Tente novamente.",
  });
};

app.use(tratarErros);

const server = app.listen(port, () => {
  console.log(`API disponível em http://localhost:${port}`);
});

server.on("error", (error) => {
  console.error("Erro ao iniciar o servidor HTTP:", error);
  process.exit(1);
});
