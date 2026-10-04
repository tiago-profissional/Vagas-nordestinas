import "dotenv/config";

import express from "express";
import type {
  Request,
  Response,
  ErrorRequestHandler,
} from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2";

import { randomUUID } from "node:crypto";

const app = express();

const port = Number(process.env.PORT || 3001);

const frontendOrigin =
  process.env.FRONTEND_ORIGIN || "http://localhost:5173";

const production = process.env.NODE_ENV === "production";
const cookieSecret = process.env.COOKIE_SECRET;

if (!cookieSecret || cookieSecret.length < 32) {
  throw new Error(
    "Configure COOKIE_SECRET com pelo menos 32 caracteres no backend-node/.env.",
  );
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "vagas_nordestinas",
  waitForConnections: true,
  connectionLimit: 10,
  charset: "utf8mb4",
  timezone: "Z",
});

const categorias = new Set([
  "AI Interview",
  "Currículo",
  "Vagas e candidaturas",
  "Conta e acesso",
  "Outro",
]);

const cookieName = "vn_suporte";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface ChamadoRow extends RowDataPacket {
  id: string;
  titulo: string;
  categoria: string;
  descricao: string;
  status: "aberto" | "em_atendimento" | "resolvido";
  criado_em: Date | string;
}

// CONFIGURAÇÕES

app.disable("x-powered-by");

app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
    methods: ["GET", "POST"],
  }),
);

app.use(express.json({ limit: "32kb" }));
app.use(cookieParser(cookieSecret));

// IDENTIFICAÇÃO POR NAVEGADOR

function obterProprietario(req: Request): string | null {
  const id = req.signedCookies?.[cookieName];

  if (typeof id !== "string" || !uuidPattern.test(id)) {
    return null;
  }

  return id;
}

function criarProprietario(res: Response): string {
  const id = randomUUID();

  res.cookie(cookieName, id, {
    signed: true,
    httpOnly: true,
    secure: production,
    sameSite: "lax",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  return id;
}

function serializarChamado(chamado: ChamadoRow) {
  const data =
    chamado.criado_em instanceof Date
      ? chamado.criado_em
      : new Date(chamado.criado_em);

  return {
    id: chamado.id,
    titulo: chamado.titulo,
    categoria: chamado.categoria,
    descricao: chamado.descricao,
    status: chamado.status,
    criado_em: data.toISOString(),
  };
}

// LISTAR CHAMADOS
// GET http://localhost:3001/api/tickets

app.get("/api/tickets", async (req, res, next) => {
  res.set("Cache-Control", "no-store");

  const proprietarioId = obterProprietario(req);

  if (!proprietarioId) {
    res.json([]);
    return;
  }

  try {
    const [rows] = await pool.execute<ChamadoRow[]>(
      `SELECT
         id,
         titulo,
         categoria,
         descricao,
         status,
         criado_em
       FROM chamados
       WHERE proprietario_id = ?
       ORDER BY criado_em DESC, id DESC
       LIMIT 100`,
      [proprietarioId],
    );

    res.json(rows.map(serializarChamado));
  } catch (error) {
    next(error);
  }
});

// CRIAR CHAMADO
// POST http://localhost:3001/api/tickets

app.post("/api/tickets", async (req, res, next) => {
  res.set("Cache-Control", "no-store");

  const origin = req.get("origin");

  if (origin && origin !== frontendOrigin) {
    res.status(403).json({
      message: "Origem da solicitação não permitida.",
    });
    return;
  }

  if (!req.is("application/json")) {
    res.status(415).json({
      message: "Envie os dados em formato JSON.",
    });
    return;
  }

  const body = req.body;

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    res.status(400).json({
      message: "Dados inválidos.",
    });
    return;
  }

  const titulo =
    typeof body.titulo === "string"
      ? body.titulo.trim()
      : "";

  const categoria =
    typeof body.categoria === "string"
      ? body.categoria.trim()
      : "";

  const descricao =
    typeof body.descricao === "string"
      ? body.descricao.trim()
      : "";

  if (titulo.length < 5 || titulo.length > 160) {
    res.status(400).json({
      message: "O título deve ter entre 5 e 160 caracteres.",
    });
    return;
  }

  if (!categorias.has(categoria)) {
    res.status(400).json({
      message: "Selecione uma categoria válida.",
    });
    return;
  }

  if (descricao.length < 20 || descricao.length > 5000) {
    res.status(400).json({
      message: "A descrição deve ter entre 20 e 5.000 caracteres.",
    });
    return;
  }

  try {
    const proprietarioId =
      obterProprietario(req) || criarProprietario(res);

    const id = randomUUID();

    await pool.execute(
      `INSERT INTO chamados (
         id,
         proprietario_id,
         titulo,
         categoria,
         descricao
       )
       VALUES (?, ?, ?, ?, ?)`,
      [
        id,
        proprietarioId,
        titulo,
        categoria,
        descricao,
      ],
    );

    const [rows] = await pool.execute<ChamadoRow[]>(
      `SELECT
         id,
         titulo,
         categoria,
         descricao,
         status,
         criado_em
       FROM chamados
       WHERE id = ? AND proprietario_id = ?`,
      [id, proprietarioId],
    );

    const chamado = rows[0];

    if (!chamado) {
      throw new Error(
        "O chamado foi salvo, mas não foi possível consultá-lo.",
      );
    }

    res.status(201).json({
      ...serializarChamado(chamado),
      protocolo: `#${id.slice(0, 8).toUpperCase()}`,
    });
  } catch (error) {
    next(error);
  }
});

// TRATAMENTO DE ERROS

const tratarErros: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  if (error?.type === "entity.parse.failed") {
    res.status(400).json({
      message: "JSON inválido.",
    });
    return;
  }

  if (error?.type === "entity.too.large") {
    res.status(413).json({
      message: "Os dados enviados são muito grandes.",
    });
    return;
  }

  console.error("Erro na API de tickets:", error);

  res.status(500).json({
    message:
      "Não foi possível concluir a solicitação. Tente novamente.",
  });
};

app.use(tratarErros);

// INICIAR SERVIDOR

async function iniciar() {
  await pool.query("SELECT 1");

  const server = app.listen(port, () => {
    console.log(`API disponível em http://localhost:${port}`);
    console.log(`Rota de chamados: http://localhost:${port}/api/tickets`);
    console.log(`Frontend permitido: ${frontendOrigin}`);
  });

  server.on("error", (error) => {
    console.error("Erro ao iniciar o servidor HTTP:", error);
    process.exit(1);
  });
}

iniciar().catch((error) => {
  console.error("Não foi possível iniciar o backend:", error);
  process.exit(1);
});