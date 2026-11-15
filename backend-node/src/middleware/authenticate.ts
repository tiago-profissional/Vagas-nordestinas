import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { jwtSecret } from "../config/auth.js";

// Lê o token do cabeçalho "Authorization: Bearer ..." e guarda o id do
// usuário em res.locals.userId. É assim que a API sabe de quem é o perfil.
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const [esquema, token] = (req.get("authorization") ?? "").split(" ");

  if (esquema !== "Bearer" || !token) {
    res.status(401).json({ message: "Faça login para continuar." });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret, { algorithms: ["HS256"] });

    // Correção: Agora aceita tanto string quanto número no 'sub'
    if (typeof payload === "string" || !payload.sub) {
      throw new Error("Token sem usuário.");
    }

    // Força a conversão para string para o userController conseguir buscar no banco
    res.locals.userId = String(payload.sub);
    next();
  } catch {
    res.status(401).json({ message: "Sessão expirada. Faça login novamente." });
  }
}