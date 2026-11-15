import type { NextFunction, Request, Response } from "express";
import { database } from "../config/database.js";

export function requireRole(...rolesPermitidas: string[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = res.locals.userId;

      if (!userId) {
        res.status(401).json({ message: "Usuário não autenticado." });
        return;
      }

      const [rows] = await database.execute<Array<{ role: string }>>(
        "SELECT role FROM usuarios WHERE id = ? AND active = 1",
        [userId]
      );

      const usuario = rows[0];

      if (!usuario || !rolesPermitidas.includes(usuario.role)) {
        res.status(403).json({ message: "Acesso negado. Permissão insuficiente." });
        return;
      }

      res.locals.userRole = usuario.role;
      next();
    } catch (error) {
      next(error);
    }
  };
}