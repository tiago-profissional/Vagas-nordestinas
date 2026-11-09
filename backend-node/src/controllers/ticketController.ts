import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { database } from "../config/database.js";

export async function listTickets(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const [tickets] = await database.query<RowDataPacket[]>(
      `
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
        ORDER BY updated_at DESC, id DESC
      `,
    );

    res.status(200).json(tickets);
  } catch (error) {
    console.error("Erro ao listar chamados:", error);

    res.status(500).json({
      message: "Não foi possível listar os chamados.",
    });
  }
}

export async function createTicket(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { title, description, category } = req.body ?? {};

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof category !== "string" ||
      !title.trim() ||
      !description.trim() ||
      !category.trim()
    ) {
      res.status(400).json({
        message: "Informe título, descrição e categoria.",
      });
      return;
    }

    const ticketNumber =
      `VN-${randomUUID().replaceAll("-", "").slice(0, 16)}`;

    const [result] = await database.execute<ResultSetHeader>(
      `
        INSERT INTO tickets (
          ticket_number,
          user_id,
          title,
          description,
          category
        )
        VALUES (?, NULL, ?, ?, ?)
      `,
      [
        ticketNumber,
        title.trim(),
        description.trim(),
        category.trim(),
      ],
    );

    const [tickets] = await database.execute<RowDataPacket[]>(
      "SELECT * FROM tickets WHERE id = ?",
      [result.insertId],
    );

    if (!tickets[0]) {
      throw new Error("Não foi possível recuperar o chamado criado.");
    }

    res.status(201).json(tickets[0]);
  } catch (error) {
    console.error("Erro ao criar chamado:", error);

    res.status(500).json({
      message: "Não foi possível criar o chamado.",
    });
  }
}