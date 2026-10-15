/* global process */
import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateProfileInput } from '../validators/profileValidator.js';

const JWT_SECRET = process.env.JWT_SECRET || 'vagas-nordestinas-chave-secreta-ultra-segura-2026';
const JWT_EXPIRES = '1h';

export async function login(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'E-mail e senha são obrigatórios.'
      });
    }

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL LIMIT 1',
      [String(email).trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas. Usuário não encontrado.'
      });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(String(password), user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas. Senha incorreta.'
      });
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    delete user.password;

    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso!',
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Erro em login:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao realizar login.',
      details: error.message
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
      skills
    } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Nome, e-mail e senha são obrigatórios.'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'As senhas informadas não coincidem.'
      });
    }

    const profileValidation = validateProfileInput({
      email,
      birth_date: birthDate,
      work_model: workModel,
      contract_type: contractType,
      availability,
      skills
    });
    if (!profileValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Algumas informações adicionais são inválidas.',
        errors: profileValidation.errors
      });
    }

    const trimmedEmail = String(email).trim().toLowerCase();

    // Check existing email
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? AND deleted_at IS NULL LIMIT 1',
      [trimmedEmail]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Este e-mail já está cadastrado no sistema.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const skillsJson = Array.isArray(skills) && skills.length > 0
      ? JSON.stringify(skills)
      : null;

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
        skillsJson
      ]
    );

    const userId = result.insertId;

    const token = jwt.sign(
      { sub: userId, email: trimmedEmail, name: String(name).trim() },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso!',
      access_token: token,
      user: {
        id: userId,
        name: String(name).trim(),
        email: trimmedEmail
      }
    });

  } catch (error) {
    console.error('Erro em register:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao registrar usuário.',
      details: error.message
    });
  }
}
