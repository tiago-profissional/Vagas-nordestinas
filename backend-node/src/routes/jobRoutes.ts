import { Router } from "express";
import { applyToJob, getJobById, getMyApplications, listJobs } from "../controllers/jobController.js";
import { authenticate } from "../middleware/authenticate.js";

const jobRoutes = Router();

jobRoutes.get("/", listJobs);
jobRoutes.get("/my-applications", authenticate, getMyApplications);
jobRoutes.get("/:id", getJobById);
jobRoutes.post("/:id/apply", authenticate, applyToJob);

export default jobRoutes;