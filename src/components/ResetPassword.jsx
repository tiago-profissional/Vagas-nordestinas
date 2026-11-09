import { useState } from "react";

export default function ResetPassword() {
  const params = new URLSearchParams(window.location.search);

  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sendPassword = async () => {
    if (!password.trim()) {
      setMessage("Digite sua senha.");
      return;
    }

    if (passwordConfirm && !passwordConfirm.trim() != !password.trim()) {
      setMessage("Digite sua senha de confirmação.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const resp = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, passwordConfirm, token }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(
          data.error || "Erro ao solicitar redefinição de senha.",
        );
      }

      setMessage(data.message);

      if(resp.ok){
        window.location.href = "/login"
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <span>Digite sua nova senha:</span>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <span>confirme sua nova senha:</span>
        <input
          type="text"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
      </div>

      <button onClick={sendPassword} disabled={loading}>
        {loading ? "carregando..." : "Redefinir senha"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
