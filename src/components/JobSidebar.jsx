import { Link } from "react-router-dom";
import "../styles/sidebar.css";

export default function JobSidebar({ jobs, currentJobId, searchTerm }) {
  const normalizedSearch = searchTerm?.toLowerCase() || "";

  const filteredJobs = (jobs || []).filter((job) => {
    const title = job.title?.toLowerCase() || "";
    return title.includes(normalizedSearch);
  });

  return (
    <aside className="vn-editjob-sidebar">
      <div className="vn-editjob-sidebar__wrapper">
        <h3 className="vn-editjob-sidebar__title">Positions</h3>

        <div className="vn-editjob-sidebar__list">
          {filteredJobs.map((job) => (
            <Link
              key={job.id}
              to={`/edit-job/${job.id}`}
              className={`vn-editjob-sidebar__item ${
                String(job.id) === String(currentJobId)
                  ? "vn-editjob-sidebar__item--active"
                  : ""
              }`}
            >
              <div className="vn-editjob-sidebar__item-title">{job.title}</div>
              <div className="vn-editjob-sidebar__item-company">{job.company}</div>
              <div className="vn-editjob-sidebar__item-location">
                {job.city}, {job.state}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}