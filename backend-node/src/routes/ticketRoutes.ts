import { Router } from "express";

import {
  createTicket,
  listTickets,
} from "../controllers/ticketController.js";

const ticketRoutes = Router();

ticketRoutes.get("/", listTickets);
ticketRoutes.post("/", createTicket);

export default ticketRoutes;