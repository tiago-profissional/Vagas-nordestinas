import { useState } from "react";

export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const sendEmail = async () => {
        if (!email.trim()) {
            setMessage("Digite seu e-mail.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const resp = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.error || "Erro ao solicitar recuperação.");
            }

            setMessage(data.message);

        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <span>
                Após o envio, aguarde e verifique sua caixa de e-mails.
            </span>

            <input
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={sendEmail} disabled={loading}>
                {loading ? "Enviando..." : "Enviar código"}
            </button>

            {message && <p>{message}</p>}
        </div>
    );
}