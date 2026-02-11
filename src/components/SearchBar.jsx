

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
  return (
    <section className="searchbar">
      <div className="searchbar-left">
        <p className="searchbar-title">Vagas para sua busca</p>
      </div>

      <div className="searchbar-center">
        <div className="searchbar-inputs">
          <div className="input-icon">
            <span className="icon">🔍</span>
            <input
              type="text"
              placeholder="Encontre a sua vaga"
              value={searchText ?? ""}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="input-icon">
            <span className="icon">📍</span>
            <input
              type="text"
              placeholder="Digite sua Cidade ou estado"
              value={location ?? ""}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="searchbar-chips">
          <button
            type="button"
            className={onlyRemote ? "chip active" : "chip"}
            onClick={() => setOnlyRemote(true)}
          >
            Apenas remotas
          </button>

          <button
            type="button"
            className={!onlyRemote ? "chip active" : "chip"}
            onClick={() => setOnlyRemote(false)}
          >
            Vagas remotas e presenciais
          </button>

          <button
            type="button"
            className={employmentType ? "chip active" : "chip"}
            onClick={() => setEmploymentType("")}
            title="Limpar tipo de contrato"
          >
            Limpar tipo
          </button>
        </div>
      </div>

      <div className="searchbar-right">
        <p className="searchbar-right-title">
          Selecione a sua modalidade de trabalho
        </p>

        <div className="searchbar-radios">
          <label>
            <input
              type="radio"
              name="type"
              checked={employmentType === "part_time"}
              onChange={() => setEmploymentType("part_time")}
            />
            Part-time
          </label>

          <label>
            <input
              type="radio"
              name="type"
              checked={employmentType === "full_time"}
              onChange={() => setEmploymentType("full_time")}
            />
            Full-time
          </label>

          <label>
            <input
              type="radio"
              name="type"
              checked={employmentType === ""}
              onChange={() => setEmploymentType("")}
            />
            Todos
          </label>
        </div>
      </div>
    </section>
  );
}

export default SearchBar;
