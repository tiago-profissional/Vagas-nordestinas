import "../styles/JobSidebarSearch.css";

export default function JobSidebarSearch({ searchTerm, setSearchTerm }) {
  return (
    <div className="ejob-edit-sidebar-search">
      <h2 className="ejob-edit-sidebar-search__title">Vagas para sua busca</h2>

      <div className="ejob-edit-sidebar-search__bar">
        <span className="ejob-edit-sidebar-search__icon">⌕</span>

        <input
          type="text"
          placeholder="Encontre a sua vaga"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ejob-edit-sidebar-search__input"
        />

        <span className="ejob-edit-sidebar-search__divider"></span>
        <span className="ejob-edit-sidebar-search__arrow">▼</span>
      </div>

      <div className="ejob-edit-sidebar-search__tags">
        <button type="button" className="ejob-edit-sidebar-search__tag">
          Apenas remotas
        </button>

        <button
          type="button"
          className="ejob-edit-sidebar-search__tag ejob-edit-sidebar-search__tag--wide"
        >
          Remotas e presencial
        </button>
      </div>
    </div>
  );
}