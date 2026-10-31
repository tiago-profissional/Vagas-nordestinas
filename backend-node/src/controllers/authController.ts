import type { NextFunction, Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createHash, randomBytes, randomUUID } from "node:crypto";

import { jwtExpiresIn, jwtSecret } from "../config/auth.js";
import { database } from "../config/database.js";
import { ErroValidacao, normalizarEmail } from "../lib/validacao.js";

interface UsuarioAuthRow extends RowDataPacket {
  id: string;
  name: string;
  email: string;
  password_hash: string;
}

const custoHash = 12;

const mensagemEsqueciSenha = "Se você esqueceu sua senha, um e-mail com instruções para redefini-la será enviado caso o e-mail informado esteja cadastrado.";  


// Usado para gastar o mesmo tempo quando o e-mail não existe,
// assim não dá para descobrir quais e-mails estão cadastrados.
const hashFalso = bcrypt.hashSync("senha-que-nunca-sera-usada", custoHash);

function criarToken(userId: string): string {
  return jwt.sign({}, jwtSecret, {
    subject: userId,
    expiresIn: jwtExpiresIn,
    algorithm: "HS256",
  });
}

function lerCorpo(req: Request): Record<string, unknown> {
  const body: unknown = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ErroValidacao("Dados inválidos.");
  }

  return body as Record<string, unknown>;
}

function responderErro(error: unknown, res: Response, next: NextFunction) {
  if (error instanceof ErroValidacao) {
    res.status(400).json({ message: error.message });
    return;
  }

  next(error);
}

// POST /api/auth/register
export async function register(req: Request, res: Response, next: NextFunction) {
  res.set("Cache-Control", "no-store");

  try {
    const body = lerCorpo(req);

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = normalizarEmail(body.email);
    const password = typeof body.password === "string" ? body.password : "";

    if (name.length < 2 || name.length > 120) {
      throw new ErroValidacao("O nome deve ter entre 2 e 120 caracteres.");
    }

    if (password.length < 8 || Buffer.byteLength(password) > 72) {
      throw new ErroValidacao("A senha deve ter pelo menos 8 caracteres.");
    }

    if (
      body.confirmPassword !== undefined &&
      body.confirmPassword !== password
    ) {
      throw new ErroValidacao("As senhas não conferem.");
    }

    const [existentes] = await database.execute<RowDataPacket[]>(
      "SELECT id FROM usuarios WHERE email = ?",
      [email],
    );

    if (existentes.length > 0) {
      res.status(409).json({ message: "Este e-mail já está cadastrado." });
      return;
    }

    const id = randomUUID();
    const passwordHash = await bcrypt.hash(password, custoHash);

    try {
      await database.execute<ResultSetHeader>(
        `INSERT INTO usuarios (id, name, email, password_hash)
         VALUES (?, ?, ?, ?)`,
        [id, name, email, passwordHash],
      );
    } catch (error) {
      if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
        res.status(409).json({ message: "Este e-mail já está cadastrado." });
        return;
      }
      throw error;
    }

    res.status(201).json({
      access_token: criarToken(id),
      user: { id, name, email, role: "candidate" },
    });
  } catch (error) {
    responderErro(error, res, next);
  }
}

// POST /api/auth/login
export async function login(req: Request, res: Response, next: NextFunction) {
  res.set("Cache-Control", "no-store");

  try {
    const body = lerCorpo(req);

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      throw new ErroValidacao("Informe e-mail e senha.");
    }

    const [rows] = await database.execute<UsuarioAuthRow[]>(
      `SELECT id, name, email, password_hash
       FROM usuarios
       WHERE email = ? AND active = 1`,
      [email],
    );

    const usuario = rows[0];
    const senhaConfere = await bcrypt.compare(
      password,
      usuario?.password_hash ?? hashFalso,
    );

    if (!usuario || !senhaConfere) {
      res.status(401).json({ message: "E-mail ou senha incorretos." });
      return;
    }

    res.json({
      access_token: criarToken(usuario.id),
      user: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        role: "candidate",
      },
    });
  } catch (error) {
    responderErro(error, res, next);
  }
}




export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  res.set("Cache-Control", "no-store");

  try {
    const body = lerCorpo(req);
    const email = normalizarEmail(body.email);

    // (rodada 2 entra aqui, usando email) 

    res.json({ message: mensagemEsqueciSenha });
  } catch (error) {
    responderErro(error, res, next);
  }

}


