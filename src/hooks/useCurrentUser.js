import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { fetchUserProfile } from "../services/profileApi.js";

// Evento disparado pela página de perfil quando os dados ou a foto mudam.
export const PROFILE_UPDATED_EVENT = "profile:updated";

function readStoredUser() {
  try {
    if (!localStorage.getItem("token")) return null;

    const raw = localStorage.getItem("user");
    const stored = raw ? JSON.parse(raw) : {};

    return stored && typeof stored === "object" ? stored : {};
  } catch {
    return null;
  }
}

/**
 * Devolve o usuário logado (ou null) com nome, e-mail e foto vindos do perfil
 * salvo no banco. Atualiza sozinho quando:
 *  - o usuário entra ou sai (o token muda e a rota muda);
 *  - o perfil é salvo ou a foto é trocada (evento "profile:updated");
 *  - outra aba entra ou sai da conta.
 */
export function useCurrentUser() {
  const location = useLocation();
  const [user, setUser] = useState(readStoredUser);
  const lastToken = useRef(undefined);

  const refresh = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setUser(null);
      return;
    }

    try {
      const profile = await fetchUserProfile();
      const personal = profile?.personal_data || {};

      setUser((current) => {
        const merged = {
          ...(current || {}),
          name: personal.name || current?.name || "",
          email: personal.email || current?.email || "",
          avatar_url: personal.avatar_url || null,
        };

        try {
          localStorage.setItem("user", JSON.stringify(merged));
        } catch {
          // sem localStorage: segue só com o estado em memória
        }

        return merged;
      });
    } catch {
      // Se a sessão expirou, o profileApi já apagou o token.
      if (!localStorage.getItem("token")) setUser(null);
    }
  }, []);

  // Quando a rota muda, confere se o token mudou (login, cadastro ou saída).
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token !== lastToken.current) {
      lastToken.current = token;
      refresh();
    }
  }, [location.pathname, refresh]);

  useEffect(() => {
    function handleStorage(event) {
      if (event.key === "token" || event.key === "user" || event.key === null) {
        lastToken.current = localStorage.getItem("token");
        refresh();
      }
    }

    window.addEventListener(PROFILE_UPDATED_EVENT, refresh);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", handleStorage);
    };
  }, [refresh]);

  return user;
}