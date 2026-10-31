import type { NextFunction, Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { unlink } from "node:fs/promises";
import path from "node:path";

import { database } from "../config/database.js";
import {
  ErroValidacao,
  lerBooleano,
  lerOpcao,
  lerTexto,
  normalizarEmail,
  objetoOuVazio,
} from "../lib/validacao.js";
import { avatarDir, avatarUrlPrefix } from "../middleware/uploadAvatar.js";

interface PerfilRow extends RowDataPacket {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  birth_date: string | null;
  avatar_url: string | null;
  desired_role: string | null;
  work_model: string | null;
  contract_type: string | null;
  availability: string | null;
  skills: unknown;
  allow_recruiters: number;
  email_recommendations: number;
}

const modelosTrabalho = ["Remoto", "Híbrido", "Presencial"] as const;
const tiposContratacao = ["CLT ou PJ", "CLT", "PJ"] as const;
const disponibilidades = ["Imediata", "15 dias", "30 dias", "A combinar"] as const;

// DATE_FORMAT evita que o fuso horário mude o dia do nascimento.
const colunasPerfil = `id, name, email, phone, city, state,
  DATE_FORMAT(birth_date, '%Y-%m-%d') AS birth_date,
  avatar_url, desired_role, work_model, contract_type, availability,
  skills, allow_recruiters, email_recommendations`;

async function buscarPerfil(userId: string): Promise<PerfilRow | undefined> {
  const [rows] = await database.execute<PerfilRow[]>(
    `SELECT ${colunasPerfil} FROM usuarios WHERE id = ? AND active = 1`,
    [userId],
  );

  return rows[0];
}

// A coluna é TEXT com JSON dentro (funciona igual no MySQL e no MariaDB do XAMPP).
function lerSkills(valor: unknown): string[] {
  let lista: unknown = valor;

  if (typeof valor === "string") {
    try {
      lista = JSON.parse(valor);
    } catch {
      return [];
    }
  }

  return Array.isArray(lista)
    ? lista.filter((item): item is string => typeof item === "string")
    : [];
}

function validarSkills(valor: unknown, atual: string[]): string[] {
  if (valor === undefined) return atual;

  if (!Array.isArray(valor)) {
    throw new ErroValidacao("Habilidades inválidas.");
  }

  const resultado: string[] = [];

  for (const item of valor) {
    if (typeof item !== "string") {
      throw new ErroValidacao("Habilidades inválidas.");
    }

    const habilidade = item.trim();
    if (!habilidade) continue;

    if (habilidade.length > 40) {
      throw new ErroValidacao("Cada habilidade deve ter no máximo 40 caracteres.");
    }

    if (!resultado.some((s) => s.toLowerCase() === habilidade.toLowerCase())) {
      resultado.push(habilidade);
    }
  }

  if (resultado.length > 30) {
    throw new ErroValidacao("Informe no máximo 30 habilidades.");
  }

  return resultado;
}

function validarTelefone(valor: unknown, atual: string | null): string | null {
  if (valor === undefined) return atual;
  if (valor === null) return null;

  if (typeof valor !== "string") {
    throw new ErroValidacao("Telefone inválido.");
  }

  const digitos = valor.replace(/\D/g, "");

  if (digitos === "") return null;

  if (digitos.length !== 10 && digitos.length !== 11) {
    throw new ErroValidacao("Telefone deve ter DDD e 8 ou 9 dígitos.");
  }

  return digitos;
}

function validarDataNascimento(valor: unknown, atual: string | null): string | null {
  const texto = lerTexto(valor, atual, 10, "Data de nascimento");

  if (texto === null || texto === atual) return texto;

  const data = new Date(`${texto}T00:00:00Z`);
  const valida =
    /^\d{4}-\d{2}-\d{2}$/.test(texto) &&
    !Number.isNaN(data.getTime()) &&
    data.toISOString().slice(0, 10) === texto;

  if (!valida) {
    throw new ErroValidacao("Data de nascimento inválida. Use dd/mm/aaaa.");
  }

  if (texto < "1900-01-01" || texto > new Date().toISOString().slice(0, 10)) {
    throw new ErroValidacao("Data de nascimento fora do intervalo permitido.");
  }

  return texto;
}

// Mesmos pesos usados na tela, para a barra de progresso bater.
function calcularPercentual(perfil: PerfilRow, skills: string[]): number {
  let pontos = 0;

  if (perfil.name?.trim()) pontos += 10;
  if (perfil.email?.trim()) pontos += 10;
  if (perfil.phone?.trim()) pontos += 10;
  if (perfil.city?.trim()) pontos += 10;
  if (perfil.state?.trim()) pontos += 10;
  if (perfil.birth_date?.trim()) pontos += 10;
  if (perfil.desired_role?.trim()) pontos += 10;
  if (perfil.avatar_url) pontos += 10;
  if (perfil.work_model?.trim()) pontos += 5;
  if (perfil.contract_type?.trim()) pontos += 5;
  if (perfil.availability?.trim()) pontos += 5;
  if (skills.length > 0) pontos += 5;

  return Math.min(100, pontos);
}

function serializarPerfil(perfil: PerfilRow) {
  const skills = lerSkills(perfil.skills);

  return {
    personal_data: {
      name: perfil.name,
      email: perfil.email,
      phone: perfil.phone ?? "",
      city: perfil.city ?? "",
      state: perfil.state ?? "",
      birth_date: perfil.birth_date ?? "",
      avatar_url: perfil.avatar_url,
    },
    professional_preferences: {
      desired_role: perfil.desired_role ?? "",
      work_model: perfil.work_model ?? "",
      contract_type: perfil.contract_type ?? "",
      availability: perfil.availability ?? "",
      skills,
    },
    account_privacy: {
      allow_recruiters: Boolean(perfil.allow_recruiters),
      email_recommendations: Boolean(perfil.email_recommendations),
    },
    meta: {
      profile_completion_percentage: calcularPercentual(perfil, skills),
    },
  };
}

async function removerArquivoAvatar(url: string | null) {
  if (!url || !url.startsWith(`${avatarUrlPrefix}/`)) return;

  // basename impede apagar arquivos fora da pasta de avatares.
  const arquivo = path.join(avatarDir, path.basename(url));
  await unlink(arquivo).catch(() => undefined);
}

function idDoUsuario(res: Response): string {
  return String(res.locals.userId);
}

function contaNaoEncontrada(res: Response) {
  res.status(401).json({ message: "Conta não encontrada. Faça login novamente." });
}

// GET /api/users/profile
export async function getProfile(_req: Request, res: Response, next: NextFunction) {
  res.set("Cache-Control", "no-store");

  try {
    const perfil = await buscarPerfil(idDoUsuario(res));

    if (!perfil) {
      contaNaoEncontrada(res);
      return;
    }

    res.json({ data: serializarPerfil(perfil) });
  } catch (error) {
    next(error);
  }
}

// PUT /api/users/profile
export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  res.set("Cache-Control", "no-store");

  const userId = idDoUsuario(res);

  try {
    const atual = await buscarPerfil(userId);

    if (!atual) {
      contaNaoEncontrada(res);
      return;
    }

    const body = objetoOuVazio(req.body, "Dados");
    const pessoais = objetoOuVazio(body.personal_data, "Dados pessoais");
    const profissionais = objetoOuVazio(
      body.professional_preferences,
      "Preferências profissionais",
    );
    const privacidade = objetoOuVazio(body.account_privacy, "Privacidade");

    const name = lerTexto(pessoais.name, atual.name, 120, "Nome");

    if (!name || name.length < 2) {
      throw new ErroValidacao("O nome deve ter pelo menos 2 caracteres.");
    }

    const email =
      pessoais.email === undefined ? atual.email : normalizarEmail(pessoais.email);

    if (email !== atual.email) {
      const [emUso] = await database.execute<RowDataPacket[]>(
        "SELECT id FROM usuarios WHERE email = ? AND id <> ?",
        [email, userId],
      );

      if (emUso.length > 0) {
        res.status(409).json({ message: "Este e-mail já está em uso." });
        return;
      }
    }

    const novo = {
      name,
      email,
      phone: validarTelefone(pessoais.phone, atual.phone),
      city: lerTexto(pessoais.city, atual.city, 120, "Cidade"),
      state: lerTexto(pessoais.state, atual.state, 60, "Estado"),
      birth_date: validarDataNascimento(pessoais.birth_date, atual.birth_date),
      desired_role: lerTexto(
        profissionais.desired_role,
        atual.desired_role,
        160,
        "Cargo desejado",
      ),
      work_model: lerOpcao(
        profissionais.work_model,
        atual.work_model,
        modelosTrabalho,
        "Modelo de trabalho",
      ),
      contract_type: lerOpcao(
        profissionais.contract_type,
        atual.contract_type,
        tiposContratacao,
        "Tipo de contratação",
      ),
      availability: lerOpcao(
        profissionais.availability,
        atual.availability,
        disponibilidades,
        "Disponibilidade",
      ),
      skills: validarSkills(profissionais.skills, lerSkills(atual.skills)),
      allow_recruiters: lerBooleano(
        privacidade.allow_recruiters,
        Boolean(atual.allow_recruiters),
        "Privacidade",
      ),
      email_recommendations: lerBooleano(
        privacidade.email_recommendations,
        Boolean(atual.email_recommendations),
        "Recomendações por e-mail",
      ),
    };

    try {
      await database.execute<ResultSetHeader>(
        `UPDATE usuarios SET
           name = ?, email = ?, phone = ?, city = ?, state = ?,
           birth_date = ?, desired_role = ?, work_model = ?,
           contract_type = ?, availability = ?, skills = ?,
           allow_recruiters = ?, email_recommendations = ?
         WHERE id = ? AND active = 1`,
        [
          novo.name,
          novo.email,
          novo.phone,
          novo.city,
          novo.state,
          novo.birth_date,
          novo.desired_role,
          novo.work_model,
          novo.contract_type,
          novo.availability,
          JSON.stringify(novo.skills),
          novo.allow_recruiters ? 1 : 0,
          novo.email_recommendations ? 1 : 0,
          userId,
        ],
      );
    } catch (error) {
      if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
        res.status(409).json({ message: "Este e-mail já está em uso." });
        return;
      }
      throw error;
    }

    const atualizado = await buscarPerfil(userId);

    if (!atualizado) {
      throw new Error("O perfil foi salvo, mas não foi possível consultá-lo.");
    }

    res.json({ data: serializarPerfil(atualizado) });
  } catch (error) {
    if (error instanceof ErroValidacao) {
      res.status(400).json({ message: error.message });
      return;
    }

    next(error);
  }
}

// POST /api/users/profile/avatar  (campo "avatar" em multipart/form-data)
export async function uploadAvatar(req: Request, res: Response, next: NextFunction) {
  res.set("Cache-Control", "no-store");

  const arquivo = req.file;

  if (!arquivo) {
    res.status(400).json({ message: "Envie uma imagem no campo avatar." });
    return;
  }

  const userId = idDoUsuario(res);

  try {
    const atual = await buscarPerfil(userId);

    if (!atual) {
      await removerArquivoAvatar(`${avatarUrlPrefix}/${arquivo.filename}`);
      contaNaoEncontrada(res);
      return;
    }

    const novaUrl = `${avatarUrlPrefix}/${arquivo.filename}`;

    await database.execute<ResultSetHeader>(
      "UPDATE usuarios SET avatar_url = ? WHERE id = ? AND active = 1",
      [novaUrl, userId],
    );

    await removerArquivoAvatar(atual.avatar_url);

    const atualizado = await buscarPerfil(userId);

    if (!atualizado) {
      throw new Error("A foto foi salva, mas não foi possível consultar o perfil.");
    }

    res.json({ avatar_url: novaUrl, data: serializarPerfil(atualizado) });
  } catch (error) {
    await removerArquivoAvatar(`${avatarUrlPrefix}/${arquivo.filename}`);
    next(error);
  }
}

// DELETE /api/users/account
// Inativa a conta e apaga os dados pessoais; o e-mail fica livre para novo cadastro.
export async function deleteAccount(_req: Request, res: Response, next: NextFunction) {
  res.set("Cache-Control", "no-store");

  const userId = idDoUsuario(res);

  try {
    const atual = await buscarPerfil(userId);

    if (!atual) {
      contaNaoEncontrada(res);
      return;
    }

    await database.execute<ResultSetHeader>(
      `UPDATE usuarios SET
         active = 0,
         name = 'Conta excluída',
         email = CONCAT('excluido-', id, '@removido.invalid'),
         phone = NULL, city = NULL, state = NULL, birth_date = NULL,
         avatar_url = NULL, desired_role = NULL, work_model = NULL,
         contract_type = NULL, availability = NULL, skills = NULL,
         allow_recruiters = 0, email_recommendations = 0
       WHERE id = ? AND active = 1`,
      [userId],
    );

    await removerArquivoAvatar(atual.avatar_url);

    res.json({ message: "Conta excluída com sucesso." });
  } catch (error) {
    next(error);
  }
}