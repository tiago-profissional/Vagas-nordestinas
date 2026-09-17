import type { Request, Response } from "express";

import { database } from "../config/database.js";

export async function listTickets(
  _request: Request,
  response: Response,
) {
  try {
    const [tickets] = await database.query(`
      SELECT
        id,
        ticket_number,
        user_id,
        title,
        description,
        category,
        status,
        priority,
        created_at,
        updated_at
      FROM tickets
      ORDER BY updated_at DESC
    `);

    return response.json(tickets);
  } catch (error) {
    console.error("Erro ao listar chamados:", error);

    return response.status(500).json({
      message: "Erro ao listar chamados.",
    });
  }
}