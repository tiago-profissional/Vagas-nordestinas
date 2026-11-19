import { Router } from "express";

import { forgotPassword, login, register } from "../controllers/authController.js";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/forgot-password", forgotPassword);

export default authRoutes;