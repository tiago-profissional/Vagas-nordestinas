/* global process */
<<<<<<< HEAD
import pool from "../config/database.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { validateProfileInput } from "../validators/profileValidator.js";
import { sendPasswordResetEmail } from "../services/emailService.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "vagas-nordestinas-chave-secreta-ultra-segura-2026";
const JWT_EXPIRES = "1h";
=======
import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateProfileInput } from '../validators/profileValidator.js';

const JWT_SECRET = process.env.JWT_SECRET || 'vagas-nordestinas-chave-secreta-ultra-segura-2026';
const JWT_EXPIRES = '1h';
>>>>>>> tiago/tickets-node

export async function login(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
<<<<<<< HEAD
        error: "E-mail e senha são obrigatórios.",
=======
        error: 'E-mail e senha são obrigatórios.'
>>>>>>> tiago/tickets-node
      });
    }

    const [rows] = await pool.query(
<<<<<<< HEAD
      "SELECT * FROM users WHERE email = ? AND deleted_at IS NULL LIMIT 1",
      [String(email).trim()],
=======
      'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL LIMIT 1',
      [String(email).trim()]
>>>>>>> tiago/tickets-node
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
<<<<<<< HEAD
        error: "Credenciais inválidas. Usuário não encontrado.",
=======
        error: 'Credenciais inválidas. Usuário não encontrado.'
>>>>>>> tiago/tickets-node
      });
    }

    const user = rows[0];
<<<<<<< HEAD
    const isPasswordValid = await bcrypt.compare(
      String(password),
      user.password,
    );
=======
    const isPasswordValid = await bcrypt.compare(String(password), user.password);
>>>>>>> tiago/tickets-node

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
<<<<<<< HEAD
        error: "Credenciais inválidas. Senha incorreta.",
=======
        error: 'Credenciais inválidas. Senha incorreta.'
>>>>>>> tiago/tickets-node
      });
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, name: user.name },
      JWT_SECRET,
<<<<<<< HEAD
      { expiresIn: JWT_EXPIRES },
=======
      { expiresIn: JWT_EXPIRES }
>>>>>>> tiago/tickets-node
    );

    delete user.password;

    return res.status(200).json({
      success: true,
<<<<<<< HEAD
      message: "Login realizado com sucesso!",
=======
      message: 'Login realizado com sucesso!',
>>>>>>> tiago/tickets-node
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
<<<<<<< HEAD
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erro em login:", error);
    return res.status(500).json({
      success: false,
      error: "Erro interno ao realizar login.",
      details: error.message,
=======
        email: user.email
      }
    });

  } catch (error) {
    console.error('Erro em login:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao realizar login.',
      details: error.message
>>>>>>> tiago/tickets-node
    });
  }
}

export async function register(req, res) {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      phone,
      city,
      state,
      birth_date: birthDate,
      desired_role: desiredRole,
      work_model: workModel,
      contract_type: contractType,
      availability,
<<<<<<< HEAD
      skills,
=======
      skills
>>>>>>> tiago/tickets-node
    } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
<<<<<<< HEAD
        error: "Nome, e-mail e senha são obrigatórios.",
=======
        error: 'Nome, e-mail e senha são obrigatórios.'
>>>>>>> tiago/tickets-node
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
<<<<<<< HEAD
        error: "As senhas informadas não coincidem.",
=======
        error: 'As senhas informadas não coincidem.'
>>>>>>> tiago/tickets-node
      });
    }

    const profileValidation = validateProfileInput({
      email,
      birth_date: birthDate,
      work_model: workModel,
      contract_type: contractType,
      availability,
<<<<<<< HEAD
      skills,
=======
      skills
>>>>>>> tiago/tickets-node
    });
    if (!profileValidation.isValid) {
      return res.status(400).json({
        success: false,
<<<<<<< HEAD
        error: "Algumas informações adicionais são inválidas.",
        errors: profileValidation.errors,
=======
        error: 'Algumas informações adicionais são inválidas.',
        errors: profileValidation.errors
>>>>>>> tiago/tickets-node
      });
    }

    const trimmedEmail = String(email).trim().toLowerCase();

    // Check existing email
    const [existing] = await pool.query(
<<<<<<< HEAD
      "SELECT id FROM users WHERE email = ? AND deleted_at IS NULL LIMIT 1",
      [trimmedEmail],
=======
      'SELECT id FROM users WHERE email = ? AND deleted_at IS NULL LIMIT 1',
      [trimmedEmail]
>>>>>>> tiago/tickets-node
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
<<<<<<< HEAD
        error: "Este e-mail já está cadastrado no sistema.",
=======
        error: 'Este e-mail já está cadastrado no sistema.'
>>>>>>> tiago/tickets-node
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
<<<<<<< HEAD
    const skillsJson =
      Array.isArray(skills) && skills.length > 0
        ? JSON.stringify(skills)
        : null;
=======
    const skillsJson = Array.isArray(skills) && skills.length > 0
      ? JSON.stringify(skills)
      : null;
>>>>>>> tiago/tickets-node

    const [result] = await pool.query(
      `INSERT INTO users (
        name, email, password, phone, city, state, birth_date, desired_role,
        work_model, contract_type, availability, skills
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        String(name).trim(),
        trimmedEmail,
        hashedPassword,
        phone || null,
        city || null,
        state || null,
        birthDate || null,
        desiredRole || null,
        workModel || null,
        contractType || null,
        availability || null,
<<<<<<< HEAD
        skillsJson,
      ],
=======
        skillsJson
      ]
>>>>>>> tiago/tickets-node
    );

    const userId = result.insertId;

    const token = jwt.sign(
      { sub: userId, email: trimmedEmail, name: String(name).trim() },
      JWT_SECRET,
<<<<<<< HEAD
      { expiresIn: JWT_EXPIRES },
=======
      { expiresIn: JWT_EXPIRES }
>>>>>>> tiago/tickets-node
    );

    return res.status(201).json({
      success: true,
<<<<<<< HEAD
      message: "Usuário cadastrado com sucesso!",
=======
      message: 'Usuário cadastrado com sucesso!',
>>>>>>> tiago/tickets-node
      access_token: token,
      user: {
        id: userId,
        name: String(name).trim(),
<<<<<<< HEAD
        email: trimmedEmail,
      },
    });
  } catch (error) {
    console.error("Erro em register:", error);
    return res.status(500).json({
      success: false,
      error: "Erro interno ao registrar usuário.",
      details: error.message,
    });
  }
}

function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "E-mail é obrigatório.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const [rows] = await pool.query(
      `SELECT id, email FROM users
       WHERE email = ? AND deleted_at IS NULL
       LIMIT 1`,
      [normalizedEmail],
    );

    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        message:
          "Se o e-mail estiver cadastrado, você receberá as instruções de recuperação.",
      });
    }

    const user = rows[0];

    const resetToken = generateResetToken();

    const tokenHash = hashResetToken(resetToken);

    // Define a validade do token: 30 minutos.
    const minutos = 30;
    const expiresAt = new Date(Date.now() + minutos * 60 * 1000);

    // Armazena somente a hash no banco.
    await pool.query(
      `INSERT INTO password_resets
       (user_id, token_hash, expires_at)
       VALUES (?, ?, ?)`,
      [user.id, tokenHash, expiresAt],
    );

    await sendPasswordResetEmail(user.email, resetToken);

    return res.status(200).json({
      success: true,
      message:
        "Se o e-mail estiver cadastrado, você receberá as instruções de recuperação.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Erro interno ao solicitar redefinição de senha.",
      details: error.message,
    });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, password, passwordConfirm } = req.body;
    
    if (password != passwordConfirm) {
      return res.status(400).json({
        success: false,
        error: "As senhas informadas não coincidem.",
      });
    }

    const [rows] = await pool.query(
      `SELECT user_id
      FROM password_resets
      WHERE token_hash = ?
      AND expires_at > NOW()
      AND used_at IS NULL
      LIMIT 1`,
      [hashResetToken(token)],
    );

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Token inválido ou expirado.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [
      passwordHash,
      rows[0].user_id,
    ]);
    await pool.query(
        'UPDATE password_resets SET used_at = NOW() WHERE token_hash = ?',
        [hashResetToken(token)]
    );

    return res.status(200).json({
      success: true,
      message: "Senha redefinida com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Erro interno ao redefinir senha.",
      details: error.message,
=======
        email: trimmedEmail
      }
    });

  } catch (error) {
    console.error('Erro em register:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao registrar usuário.',
      details: error.message
>>>>>>> tiago/tickets-node
    });
  }
}
