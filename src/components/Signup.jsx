import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/Signup.css";

const initialAdditionalInfo = {
  phone: "",
  city: "",
  state: "",
  birthDate: "",
  desiredRole: "",
  workModel: "",
  contractType: "",
  availability: "",
  skills: "",
};

function formatPhone(value) {
  const digits = String(value).replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState(initialAdditionalInfo);
  const [loading, setLoading] = useState(false);

  const updateAdditionalInfo = (event) => {
    const { name: field, value } = event.target;
    const formattedValue = field === "phone" ? formatPhone(value) : value;
    setAdditionalInfo((current) => ({ ...current, [field]: formattedValue }));
  };

  const continueToAdditionalInfo = (event) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas informadas não coincidem.");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setStep(2);
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setLoading(true);

    const skills = additionalInfo.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          confirmPassword,
          phone: additionalInfo.phone.trim() || null,
          city: additionalInfo.city.trim() || null,
          state: additionalInfo.state.trim() || null,
          birth_date: additionalInfo.birthDate || null,
          desired_role: additionalInfo.desiredRole.trim() || null,
          work_model: additionalInfo.workModel || null,
          contract_type: additionalInfo.contractType || null,
          availability: additionalInfo.availability || null,
          skills,
        }),
      });
      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        if (response.status === 504 || response.status === 502 || response.status === 500) {
          throw new Error(data.error || "O servidor backend (porta 3000) está desligado. Execute 'npm run api' no terminal.");
        }
        throw new Error(data.error || data.message || "Não foi possível criar sua conta.");
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Conta criada com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form
        className={`auth-form-card${step === 2 ? " auth-form-card--additional" : ""}`}
        onSubmit={step === 1 ? continueToAdditionalInfo : handleSignup}
      >
        <div className="auth-header">
          <h2 className="auth-title">Criar Conta</h2>
          <p className="auth-subtitle">
            {step === 1 ? "Preencha seus dados de acesso" : "Informações adicionais (opcional)"}
          </p>
          <div className="auth-underline"></div>
          <p className="auth-step-label">Etapa {step} de 2</p>
        </div>

        {step === 1 ? (
          <div className="auth-inputs">
            <div className="auth-input-wrapper">
              <input
                className="auth-input"
                type="text"
                placeholder="Nome completo"
                aria-label="Nome completo"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="auth-input-wrapper">
              <input
                className="auth-input"
                type="email"
                placeholder="E-mail"
                aria-label="E-mail"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="auth-input-wrapper">
              <input
                className="auth-input"
                type="password"
                placeholder="Senha (mínimo 6 caracteres)"
                aria-label="Senha"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <div className="auth-input-wrapper">
              <input
                className="auth-input"
                type="password"
                placeholder="Confirmar Senha"
                aria-label="Confirmar Senha"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </div>
          </div>
        ) : (
          <>
            <p className="auth-optional-hint">
              Você pode preencher estas informações agora ou deixar em branco e adicionar depois no seu perfil.
            </p>
            <div className="auth-additional-grid">
              <label>
                Telefone
                <input
                  className="auth-input"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  maxLength={15}
                  placeholder="(99) 99999-9999"
                  value={additionalInfo.phone}
                  onChange={updateAdditionalInfo}
                />
              </label>
              <label>
                Cidade
                <input
                  className="auth-input"
                  type="text"
                  name="city"
                  autoComplete="address-level2"
                  maxLength={100}
                  placeholder="Sua cidade"
                  value={additionalInfo.city}
                  onChange={updateAdditionalInfo}
                />
              </label>
              <label>
                Estado
                <input
                  className="auth-input"
                  type="text"
                  name="state"
                  autoComplete="address-level1"
                  maxLength={100}
                  placeholder="Seu estado (ex: PE, CE, BA)"
                  value={additionalInfo.state}
                  onChange={updateAdditionalInfo}
                />
              </label>
              <label>
                Data de nascimento
                <input
                  className="auth-input"
                  type="date"
                  name="birthDate"
                  autoComplete="bday"
                  value={additionalInfo.birthDate}
                  onChange={updateAdditionalInfo}
                />
              </label>
              <label>
                Cargo desejado
                <input
                  className="auth-input"
                  type="text"
                  name="desiredRole"
                  maxLength={255}
                  placeholder="Ex: Desenvolvedor Front-end"
                  value={additionalInfo.desiredRole}
                  onChange={updateAdditionalInfo}
                />
              </label>
              <label>
                Modelo de trabalho
                <select
                  className="auth-input"
                  name="workModel"
                  value={additionalInfo.workModel}
                  onChange={updateAdditionalInfo}
                >
                  <option value="">Selecione uma opção</option>
                  <option value="Remoto">Remoto</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Presencial">Presencial</option>
                </select>
              </label>
              <label>
                Tipo de contrato
                <select
                  className="auth-input"
                  name="contractType"
                  value={additionalInfo.contractType}
                  onChange={updateAdditionalInfo}
                >
                  <option value="">Selecione uma opção</option>
                  <option value="CLT">CLT</option>
                  <option value="PJ">PJ</option>
                  <option value="CLT ou PJ">CLT ou PJ</option>
                </select>
              </label>
              <label>
                Disponibilidade
                <select
                  className="auth-input"
                  name="availability"
                  value={additionalInfo.availability}
                  onChange={updateAdditionalInfo}
                >
                  <option value="">Selecione uma opção</option>
                  <option value="Imediata">Imediata</option>
                  <option value="15 dias">Em 15 dias</option>
                  <option value="30 dias">Em 30 dias</option>
                  <option value="A combinar">A combinar</option>
                </select>
              </label>
              <label className="auth-additional-grid__wide">
                Habilidades
                <input
                  className="auth-input"
                  type="text"
                  name="skills"
                  placeholder="Separe as habilidades por vírgula (ex: React, Node.js, SQL)"
                  value={additionalInfo.skills}
                  onChange={updateAdditionalInfo}
                />
              </label>
            </div>
          </>
        )}

        <div className={step === 2 ? "auth-step-actions" : undefined}>
          {step === 2 && (
            <button
              type="button"
              className="auth-back-button"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Voltar
            </button>
          )}
          <button type="submit" className="auth-main-submit" disabled={loading}>
            {loading ? "Aguarde..." : step === 1 ? "Continuar" : "Cadastrar"}
          </button>
        </div>

        <p className="auth-bottom-text">
          Já tem uma conta?{" "}
          <Link to="/login" className="auth-bottom-link">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
