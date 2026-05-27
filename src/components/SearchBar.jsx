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
  return (
    <section className="jobs-searchbar">
      <div className="jobs-searchbar__title-col">
        <p className="jobs-searchbar__title">Jobs matching your search</p>
      </div>

      <div className="jobs-searchbar__center-col">
        <div className="jobs-searchbar__inputs">
          <div className="jobs-searchbar__input-icon">
            <span className="jobs-searchbar__icon">🔍</span>
            <input
              type="text"
              placeholder="Find your job"
              value={searchText ?? ""}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="jobs-searchbar__input-icon">
            <span className="jobs-searchbar__icon">📍</span>
            <input
              type="text"
              placeholder="Enter your city or state"
              value={location ?? ""}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="jobs-searchbar__chips-row">
          <button
            type="button"
            className={onlyRemote ? "jobs-searchbar__chip active" : "jobs-searchbar__chip"}
            onClick={() => setOnlyRemote((v) => !v)}
          >
            Remote only
          </button>

          <button
            type="button"
            className={!onlyRemote ? "jobs-searchbar__chip active" : "jobs-searchbar__chip"}
            onClick={() => setOnlyRemote(false)}
          >
            Remote and on-site jobs
          </button>

          <button
            type="button"
            className={employmentType ? "jobs-searchbar__chip active" : "jobs-searchbar__chip"}
            onClick={() => setEmploymentType("")}
          >
            Clear job type
          </button>
        </div>
      </div>

      <div className="jobs-searchbar__right-col">
        <p className="jobs-searchbar__right-title">Select your employment type</p>

        <div className="jobs-searchbar__radios">
          <label className="jobs-searchbar__radio-option">
            <input
              type="radio"
              name="type"
              checked={employmentType === "part_time"}
              onChange={() => setEmploymentType("part_time")}
            />
            <span>Part-time</span>
          </label>

          <label className="jobs-searchbar__radio-option">
            <input
              type="radio"
              name="type"
              checked={employmentType === "full_time"}
              onChange={() => setEmploymentType("full_time")}
            />
            <span>Full-time</span>
          </label>
        </div>
      </div>
    </section>
  );
}

export default SearchBar;