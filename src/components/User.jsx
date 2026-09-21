import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/User.css";

const initialProfile = {
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

function User() {
	const [profile, setProfile] = useState(initialProfile);
	const [activeTab, setActiveTab] = useState("Perfil");
	const [publicProfile, setPublicProfile] = useState(true);
	const [jobRecommendations, setJobRecommendations] = useState(true);

	function updateField(event) {
		const { name, value } = event.target;
		setProfile((current) => ({ ...current, [name]: value }));
	}

	function saveProfile(event) {
		event.preventDefault();
		localStorage.setItem("profile", JSON.stringify(profile));
		toast.success("Alterações salvas!");
	}

	function cancelChanges() {
		setProfile(initialProfile);
		toast("Alterações canceladas", { icon: "↩" });
	}

	const fields = [
		["name", "Nome completo", "text"],
		["email", "E-mail", "email"],
		["phone", "Telefone", "text"],
		["city", "Cidade", "text"],
		["state", "Estado", "select", ["Ceará", "Pernambuco", "Bahia", "Paraíba"]],
		["birthDate", "Data de nascimento", "text"],
	];

	return (
		<div className="user-page">
			<header className="user-header">
				<Link className="user-brand" to="/">Vagas Nordestinas</Link>
				<nav className="user-nav" aria-label="Navegação principal">
					<Link to="/">Vagas</Link><Link to="/dashboard">Dashboard</Link>
					<Link className="active" to="/user">Meu currículo</Link><Link to="/Tickets">Meus chamados</Link>
				</nav>
				<div className="user-header-actions">
					<Link className="user-avatar-small" to="/user" aria-label="Perfil de Tiago Ramon"><span className="avatar-head" /><span className="avatar-body" /></Link>
					<span className="user-chevron" aria-hidden="true">⌄</span>
					<Link className="report-button" to="/Tickets">Relatar problema</Link>
				</div>
			</header>

			<main className="user-content">
				<div className="user-heading"><h1>Informações do usuário</h1><p>Gerencie seus dados pessoais e preferências da conta.</p></div>
				<div className="user-tabs" role="tablist" aria-label="Seções do perfil">
					{["Perfil", "Segurança", "Privacidade", "Notificações"].map((tab) => (
						<button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)} type="button" role="tab" aria-selected={activeTab === tab}>{tab}</button>
					))}
				</div>

				{activeTab === "Perfil" ? (
					<form className="user-layout" onSubmit={saveProfile}>
						<aside className="profile-card">
							<div className="profile-avatar">TR</div><h2>{profile.name}</h2><p>Desenvolvedor Web Júnior</p><span className="profile-location">⌖ Aracati, Ceará</span>
							<button className="change-photo" type="button">▣ &nbsp; Alterar foto</button>
							<div className="profile-completion"><strong>Perfil 80% completo</strong><div className="completion-track"><span /></div></div>
							<div className="profile-tip"><b>♧</b><span><strong>Dica:</strong> complete seu perfil para aumentar suas chances de ser encontrado pelas empresas.</span></div>
						</aside>

						<div className="user-form-area">
							<section className="user-section"><h2>Dados pessoais</h2><div className="fields-grid">
								{fields.map(([name, label, type, options]) => <label key={name}>{label}{type === "select" ? <select name={name} value={profile[name]} onChange={updateField}>{options.map((option) => <option key={option}>{option}</option>)}</select> : <input name={name} type={type} value={profile[name]} onChange={updateField} />}</label>)}
							</div></section>

							<section className="user-section"><h2>Preferências profissionais</h2><div className="fields-grid">
								<label>Cargo desejado<input name="desiredRole" value={profile.desiredRole} onChange={updateField} /></label>
								<label>Modelo de trabalho<select name="workModel" value={profile.workModel} onChange={updateField}><option>Remoto</option><option>Híbrido</option><option>Presencial</option></select></label>
								<label>Tipo de contratação<select name="contract" value={profile.contract} onChange={updateField}><option>CLT ou PJ</option><option>CLT</option><option>PJ</option></select></label>
								<label>Disponibilidade<select name="availability" value={profile.availability} onChange={updateField}><option>Imediata</option><option>Em 15 dias</option><option>Em 30 dias</option></select></label>
							</div><div className="skills-line"><span>Habilidades (opcional)</span><div className="skill-pills"><b>React ×</b><b>TypeScript ×</b><b>Node.js ×</b><b>PHP ×</b><button type="button">＋ Adicionar habilidade</button></div></div></section>

							<section className="user-section privacy-section"><h2>Privacidade da conta</h2>
								<label className="switch-row"><input type="checkbox" checked={publicProfile} onChange={(event) => setPublicProfile(event.target.checked)} /><span className="switch" /><span>Permitir que recrutadores encontrem meu perfil<small>Seu perfil poderá ser exibido para empresas parceiras.</small></span></label>
								<label className="switch-row"><input type="checkbox" checked={jobRecommendations} onChange={(event) => setJobRecommendations(event.target.checked)} /><span className="switch" /><span>Receber recomendações de vagas por e-mail<small>Enviaremos vagas que combinam com o seu perfil.</small></span></label>
								<div className="form-actions"><button className="save-button" type="submit">Salvar alterações</button><button className="cancel-button" type="button" onClick={cancelChanges}>Cancelar</button><button className="delete-button" type="button" onClick={() => toast.error("Esta ação requer confirmação")}>♙ &nbsp; Excluir minha conta</button></div>
							</section>
						</div>
					</form>
				) : <div className="empty-tab"><h2>{activeTab}</h2><p>As configurações de {activeTab.toLowerCase()} estarão disponíveis em breve.</p></div>}
			</main>
		</div>
	);
}

export default User;
