import type { NextFunction, Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { database } from "../config/database.js";

export async function listJobs(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [jobs] = await database.query<RowDataPacket[]>(
      "SELECT * FROM jobs ORDER BY id DESC"
    );
    res.json(jobs);
  } catch (error) {
    next(error);
  }
}

export async function getJobById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    if (typeof id !== "string" || !/^\d+$/.test(id)) {
      res.status(404).json({ error: "Vaga não encontrada." });
      return;
    }

    const [jobs] = await database.execute<RowDataPacket[]>(
      "SELECT * FROM jobs WHERE id = ? LIMIT 1",
      [id]
    );
    const job = jobs[0];
    if (!job) {
      res.status(404).json({ error: "Vaga não encontrada." });
      return;
    }

    res.json(job);
  } catch (error) {
    next(error);
  }
}

function idDoUsuario(res: Response): string {
  const userId = res.locals.userId;
  if (!userId) {
    throw new Error("Usuário não autenticado.");
  }
  return String(userId);
}

export async function applyToJob(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = idDoUsuario(res);
    const jobId = req.params.id;

    if (!jobId) {
      res.status(400).json({ message: "ID da vaga não informado." });
      return;
    }

    const [existentes] = await database.execute<RowDataPacket[]>(
      "SELECT id FROM candidaturas WHERE user_id = ? AND job_id = ?",
      [userId, jobId]
    );

    if (existentes.length > 0) {
      res.status(409).json({ message: "Você já se candidatou a esta vaga." });
      return;
    }

    await database.execute<ResultSetHeader>(
      "INSERT INTO candidaturas (user_id, job_id, status) VALUES (?, ?, 'Em análise')",
      [userId, jobId]
    );

    res.status(201).json({ message: "Candidatura enviada com sucesso!" });
  } catch (error) {
    next(error);
  }
}

export async function getMyApplications(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = idDoUsuario(res);

    const [applications] = await database.execute<RowDataPacket[]>(
      `SELECT c.id AS candidatura_id, c.status, c.created_at AS data_candidatura,
              j.id AS job_id, j.title, j.company, j.city, j.state, j.work_mode
       FROM candidaturas c
       JOIN jobs j ON c.job_id = j.id
       WHERE c.user_id = ?
       ORDER BY c.created_at DESC`,
      [userId]
    );

    res.json({ data: applications });
  } catch (error) {
    next(error);
  }
}