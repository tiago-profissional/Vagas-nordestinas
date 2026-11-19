export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: "dashboard.view",

  // Perfil do usuário
  PROFILE_VIEW: "profile.view",

  // Vagas
  JOBS_VIEW: "jobs.view",
  JOBS_CREATE: "jobs.create",
  JOBS_EDIT: "jobs.edit",
  JOBS_DELETE: "jobs.delete",

  // Candidatos
  CANDIDATES_VIEW: "candidates.view",
  CANDIDATES_MANAGE: "candidates.manage",

  // Usuários
  USERS_MANAGE: "users.manage",

  // Suporte
  TICKETS_VIEW: "tickets.view",
  TICKETS_MANAGE: "tickets.manage",

  // Configurações
  SETTINGS_MANAGE: "settings.manage",
} as const;

// Tipo de todas as permissões disponíveis
export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];