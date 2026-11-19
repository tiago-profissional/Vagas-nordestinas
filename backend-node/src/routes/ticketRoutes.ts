import { Router } from "express";

import {
  createTicket,
  listTickets,
} from "../controllers/ticketController.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireRole } from "../middleware/requireRole.js";

const ticketRoutes = Router();

ticketRoutes.get("/", authenticate, requireRole("admin"), listTickets);
ticketRoutes.post("/", createTicket);

export default ticketRoutes;