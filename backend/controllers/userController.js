import pool from '../config/database.js';
import { validateProfileInput } from '../validators/profileValidator.js';
import { formatProfileResponse } from '../services/profileService.js';

export async function getProfile(req, res) {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado ou conta inativa.'
      });
    }

    const user = rows[0];
    const data = formatProfileResponse(user, req);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Erro em getProfile:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao buscar perfil do usuário.',
      details: error.message
    });
  }
}

export async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const body = req.body || {};

    // Suporta formato aninhado ou plano
    const personal = body.personal_data || body.personalData || {};
    const professional = body.professional_preferences || body.professionalPreferences || {};
    const privacy = body.account_privacy || body.accountPrivacy || {};

    const name = personal.name !== undefined ? personal.name : body.name;
    const email = personal.email !== undefined ? personal.email : body.email;
    const phone = personal.phone !== undefined ? personal.phone : body.phone;
    const city = personal.city !== undefined ? personal.city : body.city;
    const state = personal.state !== undefined ? personal.state : body.state;
    const birthDateRaw = personal.birth_date || personal.birthDate || body.birth_date || body.birthDate;

    const desiredRole = professional.desired_role || professional.desiredRole || body.desired_role || body.desiredRole;
    const workModel = professional.work_model || professional.workModel || body.work_model || body.workModel;
    const contractType = professional.contract_type || professional.contractType || body.contract_type || body.contractType;
    const availability = professional.availability || body.availability;
    const skills = professional.skills !== undefined ? professional.skills : body.skills;

    const allowRecruiters = privacy.allow_recruiters !== undefined ? privacy.allow_recruiters : body.allow_recruiters;
    const emailRecommendations = privacy.email_recommendations !== undefined ? privacy.email_recommendations : body.email_recommendations;

    // Normalizar data de nascimento (ISO YYYY-MM-DD)
    let birthDate = null;
    if (birthDateRaw) {
      const dateStr = String(birthDateRaw).trim();
      if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      } else {
        birthDate = dateStr;
      }
    }

    const payloadToValidate = {
      email,
      birth_date: birthDate,
      work_model: workModel,
      contract_type: contractType,
      availability,
      skills
    };

    // Validação
    const { isValid, errors } = validateProfileInput(payloadToValidate);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Erros de validação nos campos informados.',
        errors
      });
    }

    // Buscar usuário atual
    const [existingRows] = await pool.query(
      'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1',
      [userId]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado.'
      });
    }

    const currentUser = existingRows[0];

    // Verificar e-mail duplicado
    if (email && email !== currentUser.email) {
      const [emailCheck] = await pool.query(
        'SELECT id FROM users WHERE email = ? AND id != ? AND deleted_at IS NULL LIMIT 1',
        [email, userId]
      );
      if (emailCheck.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'O e-mail fornecido já está em uso por outro usuário.',
          errors: { email: 'E-mail em uso.' }
        });
      }
    }

    // Tratar skills como JSON string para MySQL
    let skillsJson = currentUser.skills;
    if (skills !== undefined) {
      skillsJson = JSON.stringify(Array.isArray(skills) ? skills : []);
    }

    const updatedName = name !== undefined ? String(name).trim() : currentUser.name;
    const updatedEmail = email !== undefined ? String(email).trim() : currentUser.email;
    const updatedPhone = phone !== undefined ? String(phone).trim() : currentUser.phone;
    const updatedCity = city !== undefined ? String(city).trim() : currentUser.city;
    const updatedState = state !== undefined ? String(state).trim() : currentUser.state;
    const updatedBirthDate = birthDate !== null ? birthDate : currentUser.birth_date;
    const updatedDesiredRole = desiredRole !== undefined ? String(desiredRole).trim() : currentUser.desired_role;
    const updatedWorkModel = workModel !== undefined ? workModel : currentUser.work_model;
    const updatedContractType = contractType !== undefined ? contractType : currentUser.contract_type;
    const updatedAvailability = availability !== undefined ? availability : currentUser.availability;
    const updatedAllowRecruiters = allowRecruiters !== undefined ? (allowRecruiters ? 1 : 0) : currentUser.allow_recruiters;
    const updatedEmailRecommendations = emailRecommendations !== undefined ? (emailRecommendations ? 1 : 0) : currentUser.email_recommendations;

    const updateQuery = `
      UPDATE users SET
        name = ?,
        email = ?,
        phone = ?,
        city = ?,
        state = ?,
        birth_date = ?,
        desired_role = ?,
        work_model = ?,
        contract_type = ?,
        availability = ?,
        skills = ?,
        allow_recruiters = ?,
        email_recommendations = ?,
        updated_at = NOW()
      WHERE id = ? AND deleted_at IS NULL
    `;

    await pool.query(updateQuery, [
      updatedName,
      updatedEmail,
      updatedPhone,
      updatedCity,
      updatedState,
      updatedBirthDate,
      updatedDesiredRole,
      updatedWorkModel,
      updatedContractType,
      updatedAvailability,
      skillsJson,
      updatedAllowRecruiters,
      updatedEmailRecommendations,
      userId
    ]);

    // Buscar perfil atualizado
    const [updatedRows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [userId]);
    const updatedData = formatProfileResponse(updatedRows[0], req);

    return res.status(200).json({
      success: true,
      message: 'Perfil do usuário atualizado com sucesso!',
      data: updatedData
    });

  } catch (error) {
    console.error('Erro em updateProfile:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao atualizar perfil.',
      details: error.message
    });
  }
}

export async function uploadAvatar(req, res) {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum arquivo de imagem enviado ou formato inválido.'
      });
    }

    const relativePath = `uploads/avatars/${req.file.filename}`;

    await pool.query(
      'UPDATE users SET avatar_url = ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [relativePath, userId]
    );

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [userId]);
    const formattedData = formatProfileResponse(rows[0], req);

    return res.status(200).json({
      success: true,
      message: 'Foto de perfil atualizada com sucesso!',
      avatar_url: formattedData.personal_data.avatar_url,
      data: formattedData
    });

  } catch (error) {
    console.error('Erro em uploadAvatar:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao fazer upload da foto de perfil.',
      details: error.message
    });
  }
}

export async function deleteAccount(req, res) {
  try {
    const userId = req.user.id;

    await pool.query(
      'UPDATE users SET deleted_at = NOW(), updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: 'Conta de usuário excluída (soft-deleted) com sucesso.'
    });

  } catch (error) {
    console.error('Erro em deleteAccount:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao excluir a conta do usuário.',
      details: error.message
    });
  }
}

