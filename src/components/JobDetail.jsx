function JobDetail({ job }) {
  if (!job) {
    return <p className="empty-detail">Selecione uma vaga</p>;
  }

  return (
    <section className="job-detail fade-in">
      <div className="detail-header">
        <h2 className="detail-title">{job.title}</h2>
        <p className="detail-company">{job.company}</p>
      </div>

      <div className="detail-info">
        <p>
          <strong>Local:</strong> {job.location}
        </p>
        <p>
          <strong>Salário:</strong> {job.salary}
        </p>
        <p>
          <strong>Tipo:</strong> {job.type}
        </p>
      </div>

      <p className="detail-description">{job.description}</p>

      <button type="button" className="apply-btn">
        ⚡ Se candidate
      </button>
    </section>
  );
}

export default JobDetail;
