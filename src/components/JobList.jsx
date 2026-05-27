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
            <button 
              className="job-save" 
              type="button" 
              aria-label="Salvar" 
              onClick={(e) => {
                e.stopPropagation();
                console.log("Salvar vaga:", job.id);
              }}
            >
              ⭐
            </button>
          </div>

          <h3 className="job-title">{job.title}</h3>
          
          {/* Localização: cidade + estado */}
          <p className="job-location">
            {job.city}{job.state ? `, ${job.state}` : ''}
          </p>
          
          {/* Salário */}
          <p className="job-salary">
            {job.salary_min && job.salary_max 
              ? `R$ ${job.salary_min} - R$ ${job.salary_max}`
              : job.salary_min 
                ? `A partir de R$ ${job.salary_min}`
                : 'Salário a combinar'}
          </p>

          <div className="job-tags">
            <span className={`tag ${job.work_mode === "remote" ? "remote" : "onsite"}`}>
              {job.work_mode === "remote" ? "Remoto" : 
               job.work_mode === "hybrid" ? "Híbrido" : "Presencial"}
            </span>
            <span className="tag fulltime">
              {job.employment_type === "full_time" ? "Tempo Integral" :
               job.employment_type === "part_time" ? "Meio Período" : "PJ"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobList;