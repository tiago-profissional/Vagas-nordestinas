/**
 * Serviço de Negócio para Perfil de Usuário
 */

export function calculateCompletionPercentage(user = {}) {
  const weights = [
    { field: 'name', weight: 10 },
    { field: 'email', weight: 10 },
    { field: 'phone', weight: 10 },
    { field: 'city', weight: 10 },
    { field: 'state', weight: 10 },
    { field: 'birth_date', weight: 10 },
    { field: 'desired_role', weight: 10 },
    { field: 'avatar_url', weight: 10 },
    { field: 'work_model', weight: 5 },
    { field: 'contract_type', weight: 5 },
    { field: 'availability', weight: 5 },
    { field: 'skills', weight: 5 }
  ];

  let totalScore = 0;

  for (const item of weights) {
    if (item.field === 'skills') {
      let skillsArr = user.skills;
      if (typeof skillsArr === 'string') {
        try {
          skillsArr = JSON.parse(skillsArr);
        } catch {
          skillsArr = [];
        }
      }
      if (Array.isArray(skillsArr) && skillsArr.length > 0) {
        totalScore += item.weight;
      }
    } else {
      const val = user[item.field];
      if (val !== null && val !== undefined && String(val).trim() !== '') {
        totalScore += item.weight;
      }
    }
  }

  return Math.min(100, Math.max(0, totalScore));
}

export function formatProfileResponse(user = {}, req = null) {
  // Parse habilidades
  let skills = user.skills || [];
  if (typeof skills === 'string') {
    try {
      skills = JSON.parse(skills);
    } catch {
      skills = [];
    }
  }

  // Tratar avatar_url completo se for um arquivo salvo localmente
  let avatarUrl = user.avatar_url || null;
  if (avatarUrl && !avatarUrl.startsWith('http')) {
    if (req) {
      const protocol = req.protocol || 'http';
      const host = req.get('host') || 'localhost:3000';
      avatarUrl = `${protocol}://${host}/${avatarUrl.replace(/^\/+/, '')}`;
    }
  }

  // Format birth_date as YYYY-MM-DD
  let birthDate = user.birth_date || null;
  if (birthDate instanceof Date) {
    birthDate = birthDate.toISOString().split('T')[0];
  } else if (typeof birthDate === 'string' && birthDate.includes('T')) {
    birthDate = birthDate.split('T')[0];
  }

  const completionPercentage = calculateCompletionPercentage(user);

  return {
    id: user.id,
    personal_data: {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      city: user.city || '',
      state: user.state || '',
      birth_date: birthDate,
      avatar_url: avatarUrl
    },
    professional_preferences: {
      desired_role: user.desired_role || '',
      work_model: user.work_model || 'Remoto',
      contract_type: user.contract_type || 'CLT ou PJ',
      availability: user.availability || 'Imediata',
      skills: Array.isArray(skills) ? skills : []
    },
    account_privacy: {
      allow_recruiters: Boolean(user.allow_recruiters ?? 1),
      email_recommendations: Boolean(user.email_recommendations ?? 1)
    },
    meta: {
      profile_completion_percentage: completionPercentage,
      created_at: user.created_at || null,
      updated_at: user.updated_at || null
    }
  };
}

