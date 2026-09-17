import express from "express";
import cors from "cors";

import { database } from "./config/database.js";
import ticketRoutes from "./routes/ticketRoutes.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/api/tickets", ticketRoutes);

app.get("/", (_request, response) => {
  response.json({
    message: "Backend Node funcionando!",
  });
});

app.get("/database", async (_request, response) => {
  try {
    await database.query("SELECT 1");

    response.json({
      message: "Node conectado ao MySQL!",
    });
  } catch (error) {
    console.error("Erro ao conectar ao MySQL:", error);

    response.status(500).json({
      message: "Erro ao conectar ao MySQL.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});