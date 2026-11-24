import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { apiRequest } from "../services/apiClient.js";
import "../styles/Signup.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const sendPassword = async (event) => {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    if (!token) {
      setMessage("O link de redefinição está inválido ou incompleto.");
      setMessageType("error");
      return;
    }

    if (password.length < 8) {
      setMessage("A senha deve ter pelo menos 8 caracteres.");
      setMessageType("error");
      return;
    }

    if (password !== passwordConfirm) {
      setMessage("As senhas informadas não coincidem.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      const data = await apiRequest("/auth/reset-password", {
        method: "POST",
        body: { password, passwordConfirm, token },
      });

      toast.success(data.message || "Senha redefinida com sucesso.");
      navigate("/login", { replace: true });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível redefinir sua senha.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-form-card" onSubmit={sendPassword}>
        <header className="auth-header">
          <h1 className="auth-title">Redefinir senha</h1>
          <p className="auth-subtitle">Escolha uma nova senha para sua conta.</p>
          <div className="auth-underline" />
        </header>

        {!token ? (
          <p className="auth-feedback auth-feedback--error" role="alert">
            O link de redefinição está inválido ou incompleto.
          </p>
        ) : (
          <div className="auth-inputs">
            <label className="auth-input-wrapper" htmlFor="new-password">
              <span className="auth-input-label">Nova senha</span>
              <input
                id="new-password"
                className="auth-input"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <label className="auth-input-wrapper" htmlFor="confirm-password">
              <span className="auth-input-label">Confirme a nova senha</span>
              <input
                id="confirm-password"
                className="auth-input"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
              />
            </label>
          </div>
        )}

        {message && (
          <p
            className={`auth-feedback auth-feedback--${messageType}`}
            role={messageType === "error" ? "alert" : "status"}
            aria-live="polite"
          >
            {message}
          </p>
        )}

        {token && (
          <button className="auth-main-submit" type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Redefinir senha"}
          </button>
        )}

        <p className="auth-bottom-text">
          <Link to="/login" className="auth-bottom-link">
            Voltar ao login
          </Link>
        </p>
      </form>
    </main>
  );
}
