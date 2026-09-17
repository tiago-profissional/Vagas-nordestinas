import { useEffect, useState } from "react";
import "../styles/SearchBar.css";

function FilterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="4" y1="6" x2="14" y2="6" />
      <circle cx="17" cy="6" r="2" />

      <line x1="10" y1="12" x2="20" y2="12" />
      <circle cx="7" cy="12" r="2" />

      <line x1="4" y1="18" x2="14" y2="18" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

function SearchBar({
  searchText,
  setSearchText,
  location,
  setLocation,
  onlyRemote,
  setOnlyRemote,
  employmentType,
  setEmploymentType,
}) {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  function handleRemoteOnly() {
    setOnlyRemote(true);
  }

  function handleAllWorkModes() {
    setOnlyRemote(false);
  }

  function handleClearFilters() {
    setSearchText("");
    setLocation("");
    setOnlyRemote(null);
    setEmploymentType("");
  }

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsSearchModalOpen(false);
        setIsFilterModalOpen(false);
      }
    }

    const modalIsOpen = isSearchModalOpen || isFilterModalOpen;

    if (modalIsOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isSearchModalOpen, isFilterModalOpen]);

  return (
    <section className="jobs-searchbar">
      <div className="jobs-searchbar__title-col">
        <h2 className="jobs-searchbar__title">
          Vagas encontradas para sua busca
        </h2>
      </div>

      <div className="jobs-searchbar__center-col">
        {/* Barra de pesquisa para mais de 380px */}
        <div className="jobs-searchbar__inputs">
          <div className="jobs-searchbar__input-icon">
            <span className="jobs-searchbar__icon">⌕</span>

            <input
              type="text"
              placeholder="Encontre sua vaga"
              value={searchText ?? ""}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>

          <div className="jobs-searchbar__input-icon">
            <span className="jobs-searchbar__icon">📍</span>

            <input
              type="text"
              placeholder="Digite sua cidade ou estado"
              value={location ?? ""}
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>

          {/* Aparece dentro da barra em 600px ou menos */}
          <button
            type="button"
            className="jobs-searchbar__inline-filter"
            aria-label="Abrir filtros"
            title="Filtrar vagas"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <FilterIcon />
          </button>
        </div>

        {/* Barra compacta para 380px ou menos */}
        <div className="jobs-searchbar__mobile-control">
          <button
            type="button"
            className="jobs-searchbar__mobile-search"
            onClick={() => setIsSearchModalOpen(true)}
          >
            <span className="jobs-searchbar__mobile-search-icon">
              🔍
            </span>

            <span className="jobs-searchbar__mobile-search-text">
              {searchText || location || "Encontre sua vaga"}
            </span>
          </button>

          <button
            type="button"
            className="jobs-searchbar__mobile-filter"
            aria-label="Abrir filtros"
            title="Filtrar vagas"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <FilterIcon />
          </button>
        </div>

        <div className="jobs-searchbar__chips-row">
          <button
            type="button"
            className={`jobs-searchbar__chip ${
              onlyRemote === true ? "active" : ""
            }`}
            onClick={handleRemoteOnly}
          >
            Apenas remoto
          </button>

          <button
            type="button"
            className={`jobs-searchbar__chip ${
              onlyRemote === false ? "active" : ""
            }`}
            onClick={handleAllWorkModes}
          >
            Remoto e presencial
          </button>

          <button
            type="button"
            className="jobs-searchbar__chip"
            onClick={handleClearFilters}
          >
            Limpar filtros
          </button>
        </div>
      </div>

      <div className="jobs-searchbar__right-col">
        <p className="jobs-searchbar__right-title">
          Selecione o tipo de contratação
        </p>

        <div className="jobs-searchbar__radios">
          <label className="jobs-searchbar__radio-option">
            <input
              type="radio"
              name="type"
              checked={employmentType === "part_time"}
              onChange={() => setEmploymentType("part_time")}
            />

            <span>Meio período</span>
          </label>

          <label className="jobs-searchbar__radio-option">
            <input
              type="radio"
              name="type"
              checked={employmentType === "full_time"}
              onChange={() => setEmploymentType("full_time")}
            />

            <span>Tempo integral</span>
          </label>
        </div>
      </div>

      {/* Popup da busca em 380px ou menos */}
      {isSearchModalOpen && (
        <div
          className="jobs-search-modal"
          onClick={() => setIsSearchModalOpen(false)}
        >
          <div
            className="jobs-search-modal__content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-search-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="jobs-modal__header">
              <h2 id="mobile-search-title">Buscar vagas</h2>

              <button
                type="button"
                className="jobs-modal__close"
                aria-label="Fechar busca"
                onClick={() => setIsSearchModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="jobs-search-modal__body">
              <label className="jobs-search-modal__field">
                <span aria-hidden="true">🔍</span>

                <input
                  type="text"
                  placeholder="Encontre a vaga dos seus sonhos"
                  value={searchText ?? ""}
                  onChange={(event) =>
                    setSearchText(event.target.value)
                  }
                  autoFocus
                />
              </label>

              <label className="jobs-search-modal__field">
                <span aria-hidden="true">📍</span>

                <input
                  type="text"
                  placeholder="Cidade, estado ou remoto"
                  value={location ?? ""}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                />
              </label>

              <button
                type="button"
                className="jobs-modal__apply"
                onClick={() => setIsSearchModalOpen(false)}
              >
                Buscar vagas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup dos filtros em 600px ou menos */}
      {isFilterModalOpen && (
        <div
          className="jobs-filter-modal"
          onClick={() => setIsFilterModalOpen(false)}
        >
          <div
            className="jobs-filter-modal__content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="jobs-modal__header">
              <h2 id="filter-modal-title">Filtrar vagas</h2>

              <button
                type="button"
                className="jobs-modal__close"
                aria-label="Fechar filtros"
                onClick={() => setIsFilterModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="jobs-filter-modal__body">
              <div className="jobs-filter-modal__section">
                <h3>Modelo de trabalho</h3>

                <label className="jobs-filter-modal__option">
                  <input
                    type="radio"
                    name="modal-work-mode"
                    checked={onlyRemote === true}
                    onChange={handleRemoteOnly}
                  />

                  <span>Apenas remoto</span>
                </label>

                <label className="jobs-filter-modal__option">
                  <input
                    type="radio"
                    name="modal-work-mode"
                    checked={onlyRemote === false}
                    onChange={handleAllWorkModes}
                  />

                  <span>Remoto e presencial</span>
                </label>
              </div>

              <div className="jobs-filter-modal__section">
                <h3>Tipo de contratação</h3>

                <label className="jobs-filter-modal__option">
                  <input
                    type="radio"
                    name="modal-employment-type"
                    checked={employmentType === "part_time"}
                    onChange={() => setEmploymentType("part_time")}
                  />

                  <span>Meio período</span>
                </label>

                <label className="jobs-filter-modal__option">
                  <input
                    type="radio"
                    name="modal-employment-type"
                    checked={employmentType === "full_time"}
                    onChange={() => setEmploymentType("full_time")}
                  />

                  <span>Tempo integral</span>
                </label>
              </div>
            </div>

            <div className="jobs-filter-modal__footer">
              <button
                type="button"
                className="jobs-filter-modal__clear"
                onClick={handleClearFilters}
              >
                Limpar
              </button>

              <button
                type="button"
                className="jobs-modal__apply"
                onClick={() => setIsFilterModalOpen(false)}
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default SearchBar;