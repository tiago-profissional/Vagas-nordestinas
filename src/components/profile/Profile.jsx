import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import Headers from "../Headers.jsx";
import {
  fetchUserProfile,
  updateUserProfile,
  uploadUserAvatar,
} from "../../services/profileApi.js";
import { resolveAvatarUrl } from "../../services/avatarUrl.js";
import "../../styles/profile/profile.css";

const EMPTY_PROFILE = {
  name: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  bio: "",
  birthDate: "",
  desiredRole: "",
  workModel: "",
  contractType: "",
  availability: "",
  skills: "",
};

function profileToForm(data) {
  const personal = data?.personal_data || {};
  const professional = data?.professional_preferences || {};

  return {
    name: personal.name || "",
    email: personal.email || "",
    phone: personal.phone || "",
    city: personal.city || "",
    state: personal.state || "",
    bio: personal.bio || "",
    birthDate: personal.birth_date ? String(personal.birth_date).slice(0, 10) : "",
    desiredRole: professional.desired_role || "",
    workModel: professional.work_model || "",
    contractType: professional.contract_type || "",
    availability: professional.availability || "",
    skills: Array.isArray(professional.skills) ? professional.skills.join(", ") : "",
  };
}

function profileCompletion(data) {
  const value = data?.profile_completion ?? data?.meta?.profile_completion_percentage;
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
}

function getInitials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function Profile() {
  const avatarInputRef = useRef(null);
  const [form, setForm] = useState(EMPTY_PROFILE);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [completion, setCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);

  async function loadProfile() {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await fetchUserProfile();
      setForm(profileToForm(data));
      setAvatarUrl(resolveAvatarUrl(data?.personal_data?.avatar_url));
      setAvatarFailed(false);
      setCompletion(profileCompletion(data));
    } catch (error) {
      setLoadError(true);
      toast.error(error.message || "Não foi possível carregar seu perfil.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    fetchUserProfile()
      .then((data) => {
        if (!active) return;
        setForm(profileToForm(data));
        setAvatarUrl(resolveAvatarUrl(data?.personal_data?.avatar_url));
        setAvatarFailed(false);
        setCompletion(profileCompletion(data));
      })
      .catch((error) => {
        if (!active) return;
        setLoadError(true);
        toast.error(error.message || "Não foi possível carregar seu perfil.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function changeAvatar(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      toast.error("Selecione uma imagem PNG, JPEG ou WEBP.");
      return;
    }

    setUploadingAvatar(true);
    try {
      const result = await uploadUserAvatar(file);
      const avatarPath =
        result?.avatar_url || result?.data?.personal_data?.avatar_url;
      if (typeof avatarPath !== "string" || !avatarPath) {
        throw new Error("A API não retornou a URL da foto enviada.");
      }

      const updatedAvatarUrl = resolveAvatarUrl(avatarPath, Date.now());
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...storedUser, avatar_url: updatedAvatarUrl };
      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser),
      );
      setAvatarUrl(updatedAvatarUrl);
      setAvatarFailed(false);
      window.dispatchEvent(
        new CustomEvent("auth:changed", { detail: updatedUser }),
      );
      toast.success("Foto de perfil atualizada.");
    } catch (error) {
      toast.error(error.message || "Não foi possível atualizar sua foto.");
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const updated = await updateUserProfile({
        personal_data: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          bio: form.bio.trim(),
          birth_date: form.birthDate || null,
        },
        professional_preferences: {
          desired_role: form.desiredRole.trim(),
          work_model: form.workModel || null,
          contract_type: form.contractType || null,
          availability: form.availability || null,
          skills: form.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
        },
      });
      setForm(profileToForm(updated));
      setCompletion(profileCompletion(updated));
      window.dispatchEvent(new Event("profile:updated"));
      toast.success("Perfil atualizado com sucesso.");
    } catch (error) {
      toast.error(error.message || "Não foi possível salvar seu perfil.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Headers />
      <section className="vn-profile">
        <div className="vn-profile__layout">
          <aside className="vn-profile__sidebar">
            <div className="vn-profile__avatar-card">
              <div className="vn-profile__avatar">
                {avatarUrl && !avatarFailed ? (
                  <img
                    key={avatarUrl}
                    src={avatarUrl}
                    alt={`Foto de perfil de ${form.name || "usuário"}`}
                    onError={() => setAvatarFailed(true)}
                  />
                ) : (
                  <span aria-label="Iniciais do usuário">
                    {getInitials(form.name)}
                  </span>
                )}
              </div>
              <input
                ref={avatarInputRef}
                className="vn-profile__avatar-input"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={changeAvatar}
                aria-label="Selecionar foto de perfil"
              />
              <button
                className="vn-profile__button vn-profile__avatar-button"
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? "Enviando foto..." : "Alterar foto"}
              </button>
            </div>
            <h2 className="vn-profile__sidebar-title">Meu Perfil</h2>
            <nav className="vn-profile__sidebar-menu" aria-label="Seções do perfil">
              <Link to="/profile" className="vn-profile__sidebar-item active">Informações Pessoais</Link>
              <Link to="/minhas-candidaturas" className="vn-profile__sidebar-item">Minhas Candidaturas</Link>
            </nav>
          </aside>

          <main className="vn-profile__content">
            <header className="vn-profile__header">
              <div>
                <h1>Informações pessoais</h1>
                <p>Mantenha seus dados e preferências profissionais atualizados.</p>
                <div className="vn-profile__completion">
                  <span>Perfil preenchido: {completion}%</span>
                  <progress max="100" value={completion} aria-label={`Perfil preenchido: ${completion}%`} />
                </div>
              </div>
            </header>

            {loading ? (
              <p className="vn-profile__message" role="status">A carregar seu perfil...</p>
            ) : loadError ? (
              <div className="vn-profile__message vn-profile__message--error" role="alert">
                <p>Não foi possível carregar seus dados.</p>
                <button className="vn-profile__button vn-profile__button--secondary" type="button" onClick={loadProfile}>
                  Tentar novamente
                </button>
              </div>
            ) : (
              <form className="vn-profile__form" onSubmit={saveProfile}>
                <section className="vn-profile__section" aria-labelledby="vn-profile-personal">
                  <h2 id="vn-profile-personal">Dados pessoais</h2>
                  <div className="vn-profile__grid">
                    <label className="vn-profile__field">
                      <span>Nome completo</span>
                      <input name="name" value={form.name} onChange={updateField} autoComplete="name" required />
                    </label>
                    <label className="vn-profile__field">
                      <span>E-mail</span>
                      <input name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" required />
                    </label>
                    <label className="vn-profile__field">
                      <span>Telefone</span>
                      <input name="phone" type="tel" value={form.phone} onChange={updateField} autoComplete="tel" />
                    </label>
                    <label className="vn-profile__field">
                      <span>Data de nascimento</span>
                      <input name="birthDate" type="date" value={form.birthDate} onChange={updateField} />
                    </label>
                    <label className="vn-profile__field">
                      <span>Cidade</span>
                      <input name="city" value={form.city} onChange={updateField} autoComplete="address-level2" />
                    </label>
                    <label className="vn-profile__field">
                      <span>Estado</span>
                      <input name="state" value={form.state} onChange={updateField} autoComplete="address-level1" />
                    </label>
                    <label className="vn-profile__field vn-profile__field--full">
                      <span>Biografia</span>
                      <textarea
                        name="bio"
                        value={form.bio}
                        onChange={updateField}
                        maxLength={5000}
                        rows={4}
                      />
                    </label>
                  </div>
                </section>

                <section className="vn-profile__section" aria-labelledby="vn-profile-professional">
                  <h2 id="vn-profile-professional">Preferências profissionais</h2>
                  <div className="vn-profile__grid">
                    <label className="vn-profile__field">
                      <span>Cargo desejado</span>
                      <input name="desiredRole" value={form.desiredRole} onChange={updateField} />
                    </label>
                    <label className="vn-profile__field">
                      <span>Modelo de trabalho</span>
                      <select name="workModel" value={form.workModel} onChange={updateField}>
                        <option value="">Selecione</option>
                        <option value="Remoto">Remoto</option>
                        <option value="Híbrido">Híbrido</option>
                        <option value="Presencial">Presencial</option>
                      </select>
                    </label>
                    <label className="vn-profile__field">
                      <span>Tipo de contratação</span>
                      <select name="contractType" value={form.contractType} onChange={updateField}>
                        <option value="">Selecione</option>
                        <option value="CLT">CLT</option>
                        <option value="PJ">PJ</option>
                        <option value="CLT ou PJ">CLT ou PJ</option>
                      </select>
                    </label>
                    <label className="vn-profile__field">
                      <span>Disponibilidade</span>
                      <select name="availability" value={form.availability} onChange={updateField}>
                        <option value="">Selecione</option>
                        <option value="Imediata">Imediata</option>
                        <option value="15 dias">15 dias</option>
                        <option value="30 dias">30 dias</option>
                        <option value="A combinar">A combinar</option>
                      </select>
                    </label>
                    <label className="vn-profile__field vn-profile__field--full">
                      <span>Habilidades <small>(separadas por vírgula)</small></span>
                      <input name="skills" value={form.skills} onChange={updateField} placeholder="Ex.: React, PHP, atendimento" />
                    </label>
                  </div>
                </section>

                <div className="vn-profile__actions">
                  <button className="vn-profile__button" type="submit" disabled={saving}>
                    {saving ? "Salvando..." : "Salvar alterações"}
                  </button>
                </div>
              </form>
            )}
          </main>
        </div>
      </section>
    </>
  );
}