function JobList({ jobs, selectedJob, onSelect }) {
  if (!jobs || jobs.length === 0) {
    return <p>Nenhuma vaga encontrada.</p>;
  }

  return (
    <div className="job-list-wrapper">
      {jobs.map((job) => (
        <div
          key={job.id}
          className={`job ${selectedJob?.id === job.id ? "selected" : ""}`}
          onClick={() => onSelect(job)}
        >
          <div className="job-top">
            <span className="job-source">{job.company}</span>
            <button className="job-save" type="button" aria-label="Salvar">
              ⭐
            </button>
          </div>

          <h3 className="job-title">{job.title}</h3>
          <p className="job-location">{job.location}</p>
          <p className="job-salary">{job.salary}</p>

          <div className="job-tags">
            <span className="tag remote">{job.work_mode === "remote" ? "Remoto" : "Presencial"}</span>
            <span className="tag fulltime">{job.type}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobList;
