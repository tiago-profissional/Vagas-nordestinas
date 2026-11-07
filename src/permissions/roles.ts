import { PERMISSIONS, type Permission } from "./permissions";

// Perfis disponíveis no sistema
export const ROLES = {
  USER: "user",
  ADMIN: "admin",
  RECRUITER: "recruiter",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Permissões de cada perfil
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {

  // USUÁRIO COMUM
  [ROLES.USER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.JOBS_VIEW,
    PERMISSIONS.TICKETS_VIEW,
  ],

  // ADMINISTRADOR
  [ROLES.ADMIN]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.TICKETS_VIEW,
    PERMISSIONS.TICKETS_MANAGE,
    PERMISSIONS.SETTINGS_MANAGE,
  ],

  // RECRUTADOR
  [ROLES.RECRUITER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.JOBS_VIEW,
    PERMISSIONS.JOBS_CREATE,
    PERMISSIONS.JOBS_EDIT,
    PERMISSIONS.CANDIDATES_VIEW,
    PERMISSIONS.CANDIDATES_MANAGE,
    PERMISSIONS.TICKETS_VIEW,
  ],
};

// Identifica o perfil recebido do sistema
export function normalizeRole(value: unknown): Role | null {
  if (typeof value !== "string") {
    return null;
  }

  const role = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  switch (role) {
    case "user":
    case "usuario":
    case "usuario comum":
      return ROLES.USER;

    case "admin":
    case "administrador":
      return ROLES.ADMIN;

    case "recruiter":
    case "recrutador":
      return ROLES.RECRUITER;

    default:
      return null;
  }
}

// Retorna as permissões de determinado perfil
export function getPermissionsForRole(
  role: unknown
): readonly Permission[] {
  const normalizedRole = normalizeRole(role);

  if (!normalizedRole) {
    return [];
  }

  return ROLE_PERMISSIONS[normalizedRole];
}

// Verifica se o perfil possui determinada permissão
export function hasPermission(
  role: unknown,
  permission: Permission
): boolean {
  return getPermissionsForRole(role).includes(permission);
}

// Verifica se possui pelo menos uma das permissões
export function hasAnyPermission(
  role: unknown,
  permissions: readonly Permission[]
): boolean {
  return permissions.some((permission) =>
    hasPermission(role, permission)
  );
}

// Verifica se possui todas as permissões
export function hasAllPermissions(
  role: unknown,
  permissions: readonly Permission[]
): boolean {
  return permissions.every((permission) =>
    hasPermission(role, permission)
  );
}