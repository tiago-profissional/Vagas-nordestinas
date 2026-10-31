import { Router } from "express";

import {
  deleteAccount,
  getProfile,
  updateProfile,
  uploadAvatar,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/authenticate.js";
import { receberAvatar } from "../middleware/uploadAvatar.js";

const userRoutes = Router();

// Tudo aqui exige login: o perfil é sempre do dono do token.
userRoutes.use(authenticate);

userRoutes.get("/profile", getProfile);
userRoutes.put("/profile", updateProfile);
userRoutes.post("/profile/avatar", receberAvatar, uploadAvatar);
userRoutes.delete("/account", deleteAccount);

export default userRoutes;