import { Link } from "react-router-dom";
import "../styles/sidebar.css";

export default function JobSidebar({ jobs, currentJobId, searchTerm }) {
  const normalizedSearch = searchTerm?.toLowerCase() || "";

  const filteredJobs = (jobs || []).filter((job) => {
    const title = job.title?.toLowerCase() || "";
    return title.includes(normalizedSearch);
  });

  return (
    <aside className="edit-job-sidebar">
      <div className="sidebar-jobs-wrapper">
        <h3 className="sidebar-title">Positions</h3>

        <div className="sidebar-jobs">
          {filteredJobs.map((job) => (
            <Link
              key={job.id}
              to={`/edit-job/${job.id}`}
              className={`sidebar-job ${
                String(job.id) === String(currentJobId) ? "active" : ""
              }`}
            >
              <div className="sidebar-job-title">{job.title}</div>
              <div className="sidebar-job-company">{job.company}</div>
              <div className="sidebar-job-location">
                {job.city}, {job.state}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}