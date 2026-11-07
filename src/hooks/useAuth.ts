import { useCallback, useMemo } from "react";

import { useCurrentUser } from "./useCurrentUser.js";

import {
  normalizeRole,
  getPermissionsForRole,
  hasPermission as checkPermission,
} from "../permissions/roles";

import type { Permission } from "../permissions/permissions";

type UserData = Record<string, unknown>;

function getUserRole(user: UserData | null) {
  if (!user) return null;

  const possibleRoles = [
    user.role,
    user.user_role,
    user.user_type,
    user.userType,
    user.tipo,
    user.tipo_usuario,
    user.perfil,
    user.account_type,
    user.type,
  ];

  for (const value of possibleRoles) {
    const role = normalizeRole(value);

    if (role) {
      return role;
    }
  }

  return null;
}

export function useAuth() {
  const currentUser = useCurrentUser();

  const user = currentUser as UserData | null;

  const role = useMemo(
    () => getUserRole(user),
    [user]
  );

  const permissions = useMemo(
    () => getPermissionsForRole(role),
    [role]
  );

  const isAuthenticated =
    typeof window !== "undefined" &&
    Boolean(localStorage.getItem("token"));

  const can = useCallback(
    (permission: Permission) => {
      if (!role) return false;

      return checkPermission(role, permission);
    },
    [role]
  );

  return {
    user,
    role,
    permissions,
    isAuthenticated,
    can,
  };
}

export default useAuth;