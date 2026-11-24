import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/apiClient.js";
import "../styles/Signup.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const sendEmail = async (event) => {
        event.preventDefault();
        setMessage("");
        setMessageType("");

        if (!email.trim()) {
            setMessage("Digite seu e-mail.");
            setMessageType("error");
            return;
        }

        try {
            setLoading(true);
            const data = await apiRequest("/auth/forgot-password", {
                method: "POST",
                body: { email: email.trim() },
            });

            setMessage(data.message || "Se o e-mail estiver cadastrado, você receberá as instruções de recuperação.");
            setMessageType("success");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Não foi possível solicitar a recuperação.");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <form className="auth-form-card" onSubmit={sendEmail}>
                <header className="auth-header">
                    <h1 className="auth-title">Esqueci minha senha</h1>
                    <p className="auth-subtitle">
                        Informe seu e-mail e enviaremos um link para redefinir sua senha.
                    </p>
                    <div className="auth-underline" />
                </header>

                <div className="auth-inputs">
                    <label className="auth-input-wrapper" htmlFor="forgot-password-email">
                        <span className="auth-input-label">E-mail</span>
                        <input
                            id="forgot-password-email"
                            className="auth-input"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </label>
                </div>

                {message && (
                    <p
                        className={`auth-feedback auth-feedback--${messageType}`}
                        role={messageType === "error" ? "alert" : "status"}
                        aria-live="polite"
                    >
                        {message}
                    </p>
                )}

                <button className="auth-main-submit" type="submit" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar instruções"}
                </button>

                <p className="auth-bottom-text">
                    Lembrou sua senha?{" "}
                    <Link to="/login" className="auth-bottom-link">
                        Voltar ao login
                    </Link>
                </p>
            </form>
        </main>
    );
}