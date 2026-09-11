import "../styles/SearchBar.css";

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
  function handleRemoteOnly() {
    setOnlyRemote(true);
  }

  function handleAllWorkModes() {
    setOnlyRemote(false);
  }

  function handleClearFilters() {
    setOnlyRemote(false);
    setEmploymentType("");
  }

  return (
    <section className="jobs-searchbar">
      <div className="jobs-searchbar__title-col">
        <p className="jobs-searchbar__title">Vagas encontradas para sua busca</p>
      </div>

      <div className="jobs-searchbar__center-col">
        <div className="jobs-searchbar__inputs">
          <div className="jobs-searchbar__input-icon">
            <span className="jobs-searchbar__icon">🔍</span>

            <input
              type="text"
              placeholder="Encontre sua vaga"
              value={searchText ?? ""}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="jobs-searchbar__input-icon">
            <span className="jobs-searchbar__icon">📍</span>

            <input
              type="text"
              placeholder="Digite sua cidade ou estado"
              value={location ?? ""}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="jobs-searchbar__chips-row">
          <button
            type="button"
            className={`jobs-searchbar__chip ${onlyRemote ? "active" : ""}`}
            onClick={handleRemoteOnly}
          >
            Apenas remoto
          </button>

          <button
            type="button"
            className={`jobs-searchbar__chip ${!onlyRemote ? "active" : ""}`}
            onClick={handleAllWorkModes}
          >
            Remoto e presencial
          </button>

          <button
            type="button"
            className={`jobs-searchbar__chip ${
              !onlyRemote && !employmentType ? "active" : ""
            }`}
            onClick={handleClearFilters}
          >
            Limpar tipo de vaga
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
    </section>
  );
}

export default SearchBar;