import { Router } from "express";

import { listTickets } from "../controllers/ticketController.js";

const ticketRoutes = Router();

ticketRoutes.get("/", listTickets);

export default ticketRoutes;
