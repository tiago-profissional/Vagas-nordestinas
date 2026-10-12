import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchUserProfile,
  updateUserProfile,
  uploadUserAvatar,
  deleteUserAccount
} from "../services/profileApi.js";
import "../styles/User.css";

const defaultProfile = {
  name: "Tiago Ramon",
  email: "tiagoramon@email.com",
  phone: "(88) 99999-9999",
  city: "Aracati",
  state: "Ceará",
  birthDate: "15/04/2004",
  desiredRole: "Desenvolvedor Web Júnior",
  workModel: "Remoto",
  contract: "CLT ou PJ",
  availability: "Imediata",
};

const defaultSkills = ["React", "TypeScript", "Node.js", "PHP"];

/**
 * Formata o número de telefone no padrão (99) 99999-9999 ao digitar
 */
function formatPhone(value) {
  const digits = String(value).replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

function calculateLocalPercentage(p, sk, av) {
  let score = 0;
  if (p.name?.trim()) score += 10;
  if (p.email?.trim()) score += 10;
  if (p.phone?.trim()) score += 10;
  if (p.city?.trim()) score += 10;
  if (p.state?.trim()) score += 10;
  if (p.birthDate?.trim()) score += 10;
  if (p.desiredRole?.trim()) score += 10;
  if (av) score += 10;
  if (p.workModel?.trim()) score += 5;
  if (p.contract?.trim()) score += 5;
  if (p.availability?.trim()) score += 5;
  if (sk && sk.length > 0) score += 5;
  return Math.min(100, Math.max(0, score));
}

function User() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("profile");
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [skills, setSkills] = useState(() => {
    const savedSkills = localStorage.getItem("user_skills");
    return savedSkills ? JSON.parse(savedSkills) : defaultSkills;
  });

  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillText, setNewSkillText] = useState("");

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(80);
  const [activeTab, setActiveTab] = useState("Perfil");
  const [publicProfile, setPublicProfile] = useState(true);
  const [jobRecommendations, setJobRecommendations] = useState(true);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);

  // Carrega os dados do back-end ao abrir a tela (se disponível)
  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchUserProfile();
        if (data) {
          const personal = data.personal_data || {};
          const professional = data.professional_preferences || {};
          const privacy = data.account_privacy || {};

          let bDate = personal.birth_date || "";
          if (bDate.includes("-")) {
            const [y, m, d] = bDate.split("-");
            bDate = `${d}/${m}/${y}`;
          }

          setProfile({
            name: personal.name || defaultProfile.name,
            email: personal.email || defaultProfile.email,
            phone: personal.phone ? formatPhone(personal.phone) : defaultProfile.phone,
            city: personal.city || defaultProfile.city,
            state: personal.state || defaultProfile.state,
            birthDate: bDate || defaultProfile.birthDate,
            desiredRole: professional.desired_role || defaultProfile.desiredRole,
            workModel: professional.work_model || defaultProfile.workModel,
            contract: professional.contract_type || defaultProfile.contract,
            availability: professional.availability || defaultProfile.availability,
          });

          if (professional.skills && Array.isArray(professional.skills)) {
            setSkills(professional.skills);
          }

          if (personal.avatar_url) {
            setAvatarUrl(personal.avatar_url);
          }

          if (data.meta && typeof data.meta.profile_completion_percentage === "number") {
            setCompletionPercentage(data.meta.profile_completion_percentage);
          }

          if (privacy.allow_recruiters !== undefined) {
            setPublicProfile(Boolean(privacy.allow_recruiters));
          }

          if (privacy.email_recommendations !== undefined) {
            setJobRecommendations(Boolean(privacy.email_recommendations));
          }
        }
      } catch (err) {
        // Fallback local caso o back-end não esteja rodando no momento
        const localPerc = calculateLocalPercentage(profile, skills, avatarUrl);
        setCompletionPercentage(localPerc);
      }
    }

    loadProfile();
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    const formattedValue = name === "phone" ? formatPhone(value) : value;

    setProfile((current) => {
      const updated = { ...current, [name]: formattedValue };
      const newPerc = calculateLocalPercentage(updated, skills, avatarUrl);
      setCompletionPercentage(newPerc);
      return updated;
    });
  }

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);

    // Se o usuário digitou uma skill no campo aberto e clicou direto em Salvar, inclui ela também
    let currentSkills = [...skills];
    if (isAddingSkill && newSkillText.trim()) {
      const trimmed = newSkillText.trim();
      if (!currentSkills.includes(trimmed)) {
        currentSkills.push(trimmed);
        setSkills(currentSkills);
      }
      setNewSkillText("");
      setIsAddingSkill(false);
    }

    try {
      const payload = {
        personal_data: {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          city: profile.city,
          state: profile.state,
          birth_date: profile.birthDate,
        },
        professional_preferences: {
          desired_role: profile.desiredRole,
          work_model: profile.workModel,
          contract_type: profile.contract,
          availability: profile.availability,
          skills: currentSkills,
        },
        account_privacy: {
          allow_recruiters: publicProfile,
          email_recommendations: jobRecommendations,
        },
      };

      const updated = await updateUserProfile(payload);
      if (updated && updated.meta) {
        setCompletionPercentage(updated.meta.profile_completion_percentage);
      }

      localStorage.setItem("profile", JSON.stringify(profile));
      localStorage.setItem("user_skills", JSON.stringify(currentSkills));
      toast.success("Alterações salvas no banco de dados!");
    } catch (err) {
      // Salva localmente sem travar a experiência
      localStorage.setItem("profile", JSON.stringify(profile));
      localStorage.setItem("user_skills", JSON.stringify(currentSkills));
      const localPerc = calculateLocalPercentage(profile, currentSkills, avatarUrl);
      setCompletionPercentage(localPerc);
      toast.success("Alterações salvas com sucesso!");
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const localPreviewUrl = URL.createObjectURL(file);
    setAvatarUrl(localPreviewUrl);
    setCompletionPercentage(calculateLocalPercentage(profile, skills, localPreviewUrl));

    const loadingToast = toast.loading("Enviando foto de perfil...");
    try {
      const result = await uploadUserAvatar(file);
      if (result && result.avatar_url) {
        setAvatarUrl(result.avatar_url);
      }
      if (result && result.data && result.data.meta) {
        setCompletionPercentage(result.data.meta.profile_completion_percentage);
      }
      toast.success("Foto de perfil atualizada!", { id: loadingToast });
    } catch (err) {
      toast.success("Foto atualizada!", { id: loadingToast });
    }
  }

  function confirmAddSkill() {
    const trimmed = newSkillText.trim();
    if (!trimmed) {
      setIsAddingSkill(false);
      return;
    }

    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Essa habilidade já foi adicionada!");
      return;
    }

    const updatedSkills = [...skills, trimmed];
    setSkills(updatedSkills);
    localStorage.setItem("user_skills", JSON.stringify(updatedSkills));
    setCompletionPercentage(calculateLocalPercentage(profile, updatedSkills, avatarUrl));
    setNewSkillText("");
    setIsAddingSkill(false);
    toast.success(`Habilidade "${trimmed}" adicionada!`);
  }

  function handleRemoveSkill(skillToRemove) {
    const newSkills = skills.filter((s) => s !== skillToRemove);
    setSkills(newSkills);
    localStorage.setItem("user_skills", JSON.stringify(newSkills));
    setCompletionPercentage(calculateLocalPercentage(profile, newSkills, avatarUrl));
    toast(`Habilidade "${skillToRemove}" removida`, { icon: "🗑️" });
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir sua conta? Esta ação inativará o seu perfil."
    );
    if (!confirmed) return;

    try {
      await deleteUserAccount();
      toast.success("Conta excluída com sucesso.");
    } catch (err) {
      localStorage.removeItem("profile");
      localStorage.removeItem("user_skills");
      setProfile(defaultProfile);
      setSkills(defaultSkills);
      toast.success("Conta redefinida com sucesso.");
    }
  }

  function cancelChanges() {
    setProfile(defaultProfile);
    setSkills(defaultSkills);
    setAvatarUrl(null);
    setIsAddingSkill(false);
    setNewSkillText("");
    setCompletionPercentage(80);
    localStorage.removeItem("profile");
    localStorage.removeItem("user_skills");
    toast("Alterações canceladas", { icon: "↩" });
  }

  const fields = [
    ["name", "Nome completo", "text"],
    ["email", "E-mail", "email"],
    ["phone", "Telefone", "tel"],
    ["city", "Cidade", "text"],
    ["state", "Estado", "select", ["Ceará", "Pernambuco", "Bahia", "Paraíba", "Rio Grande do Norte", "Alagoas", "Sergipe", "Maranhão", "Piauí"]],
    ["birthDate", "Data de nascimento", "text"],
  ];

  return (
    <div className="user-page">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/png,image/jpeg,image/webp"
        onChange={handleAvatarChange}
      />

      <header className="user-header">
        <Link className="user-brand" to="/">Vagas Nordestinas</Link>
        <nav className="user-nav" aria-label="Navegação principal">
          <Link to="/">Vagas</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link className="active" to="/user">Meu currículo</Link>
          <Link to="/Tickets">Meus chamados</Link>
        </nav>
        <div className="user-header-actions">
          <Link className="user-avatar-small" to="/user" aria-label={`Perfil de ${profile.name}`}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <>
                <span className="avatar-head" />
                <span className="avatar-body" />
              </>
            )}
          </Link>
          <span className="user-chevron" aria-hidden="true">⌄</span>
          <Link className="report-button" to="/Tickets">Relatar problema</Link>
        </div>
      </header>

      <main className="user-content">
        <div className="user-heading">
          <h1>Informações do usuário</h1>
          <p>Gerencie seus dados pessoais e preferências da conta.</p>
        </div>

        <div className="user-tabs" role="tablist" aria-label="Seções do perfil">
          {["Perfil", "Segurança", "Privacidade", "Notificações"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Perfil" ? (
          <form className="user-layout" onSubmit={saveProfile}>
            <aside className="profile-card">
              <div className="profile-avatar" style={{ overflow: "hidden" }}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Foto de perfil"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  profile.name
                    ? profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : "TR"
                )}
              </div>
              <h2>{profile.name}</h2>
              <p>{profile.desiredRole}</p>
              <span className="profile-location">
                ⌖ {profile.city ? `${profile.city}, ${profile.state}` : "Aracati, Ceará"}
              </span>

              <button
                className="change-photo"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                ▣ &nbsp; Alterar foto
              </button>

              <div className="profile-completion">
                <strong>Perfil {completionPercentage}% completo</strong>
                <div className="completion-track">
                  <span style={{ width: `${completionPercentage}%`, transition: "width 0.4s ease" }} />
                </div>
              </div>

              <div className="profile-tip">
                <b>♧</b>
                <span>
                  <strong>Dica:</strong> complete seu perfil para aumentar suas chances de ser encontrado pelas empresas.
                </span>
              </div>
            </aside>

            <div className="user-form-area">
              <section className="user-section">
                <h2>Dados pessoais</h2>
                <div className="fields-grid">
                  {fields.map(([name, label, type, options]) => (
                    <label key={name}>
                      {label}
                      {type === "select" ? (
                        <select name={name} value={profile[name]} onChange={updateField}>
                          {options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          name={name}
                          type={type}
                          value={profile[name]}
                          onChange={updateField}
                          placeholder={name === "phone" ? "(99) 99999-9999" : undefined}
                          maxLength={name === "phone" ? 15 : undefined}
                        />
                      )}
                    </label>
                  ))}
                </div>
              </section>

              <section className="user-section">
                <h2>Preferências profissionais</h2>
                <div className="fields-grid">
                  <label>
                    Cargo desejado
                    <input
                      name="desiredRole"
                      value={profile.desiredRole}
                      onChange={updateField}
                    />
                  </label>
                  <label>
                    Modelo de trabalho
                    <select
                      name="workModel"
                      value={profile.workModel}
                      onChange={updateField}
                    >
                      <option value="Remoto">Remoto</option>
                      <option value="Híbrido">Híbrido</option>
                      <option value="Presencial">Presencial</option>
                    </select>
                  </label>
                  <label>
                    Tipo de contratação
                    <select
                      name="contract"
                      value={profile.contract}
                      onChange={updateField}
                    >
                      <option value="CLT ou PJ">CLT ou PJ</option>
                      <option value="CLT">CLT</option>
                      <option value="PJ">PJ</option>
                    </select>
                  </label>
                  <label>
                    Disponibilidade
                    <select
                      name="availability"
                      value={profile.availability}
                      onChange={updateField}
                    >
                      <option value="Imediata">Imediata</option>
                      <option value="15 dias">15 dias</option>
                      <option value="30 dias">30 dias</option>
                      <option value="A combinar">A combinar</option>
                    </select>
                  </label>
                </div>

                <div className="skills-line">
                  <span>Habilidades (opcional)</span>
                  <div className="skill-pills">
                    {skills.map((skill) => (
                      <b
                        key={skill}
                        onClick={() => handleRemoveSkill(skill)}
                        style={{ cursor: "pointer" }}
                        title="Clique para remover"
                      >
                        {skill} &times;
                      </b>
                    ))}

                    {isAddingSkill ? (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Digite a habilidade..."
                          value={newSkillText}
                          onChange={(e) => setNewSkillText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              confirmAddSkill();
                            } else if (e.key === "Escape") {
                              setIsAddingSkill(false);
                              setNewSkillText("");
                            }
                          }}
                          autoFocus
                          style={{
                            height: "24px",
                            padding: "0 10px",
                            borderRadius: "99px",
                            border: "1px solid #d86b09",
                            fontSize: "10px",
                            outline: "none",
                            width: "130px",
                            background: "#fffdfa",
                            color: "#41362c",
                          }}
                        />
                        <button
                          type="button"
                          onClick={confirmAddSkill}
                          style={{
                            background: "#d86b09",
                            color: "#fff",
                            border: "none",
                            padding: "4px 10px",
                            borderRadius: "99px",
                            fontSize: "9px",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                        >
                          Adicionar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingSkill(false);
                            setNewSkillText("");
                          }}
                          style={{
                            border: "1px solid #dfcbb6",
                            padding: "4px 8px",
                            borderRadius: "99px",
                            fontSize: "9px",
                            cursor: "pointer",
                            color: "#756454",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsAddingSkill(true)}
                      >
                        ＋ Adicionar habilidade
                      </button>
                    )}
                  </div>
                </div>
              </section>

              <section className="user-section privacy-section">
                <h2>Privacidade da conta</h2>
                <label className="switch-row">
                  <input
                    type="checkbox"
                    checked={publicProfile}
                    onChange={(event) => setPublicProfile(event.target.checked)}
                  />
                  <span className="switch" />
                  <span>
                    Permitir que recrutadores encontrem meu perfil
                    <small>Seu perfil poderá ser exibido para empresas parceiras.</small>
                  </span>
                </label>

                <label className="switch-row">
                  <input
                    type="checkbox"
                    checked={jobRecommendations}
                    onChange={(event) => setJobRecommendations(event.target.checked)}
                  />
                  <span className="switch" />
                  <span>
                    Receber recomendações de vagas por e-mail
                    <small>Enviaremos vagas que combinam com o seu perfil.</small>
                  </span>
                </label>

                <div className="form-actions">
                  <button className="save-button" type="submit" disabled={saving}>
                    {saving ? "Salvando..." : "Salvar alterações"}
                  </button>
                  <button className="cancel-button" type="button" onClick={cancelChanges}>
                    Cancelar
                  </button>
                  <button
                    className="delete-button"
                    type="button"
                    onClick={handleDeleteAccount}
                  >
                    ♙ &nbsp; Excluir minha conta
                  </button>
                </div>
              </section>
            </div>
          </form>
        ) : (
          <div className="empty-tab">
            <h2>{activeTab}</h2>
            <p>As configurações de {activeTab.toLowerCase()} estarão disponíveis em breve.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default User;
