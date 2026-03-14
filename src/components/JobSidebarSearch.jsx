import "../styles/JobSidebarSearch.css";

export default function JobSidebarSearch({ searchTerm, setSearchTerm }) {
  return (
    <div className="sidebar-search-box">
      <h2 className="sidebar-search-title">Vagas para sua busca</h2>

      <div className="sidebar-search-bar">
        <span className="sidebar-search-icon">⌕</span>

        <input
          type="text"
          placeholder="Encontre a sua vaga"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sidebar-search-input"
        />

        <span className="sidebar-search-divider"></span>
        <span className="sidebar-search-arrow">▼</span>
      </div>

      <div className="sidebar-search-tags">
        <button type="button" className="sidebar-tag">
          Apenas remotas
        </button>

        <button type="button" className="sidebar-tag sidebar-tag-wide">
          Remotas e presencial
        </button>
      </div>
    </div>
  );
}