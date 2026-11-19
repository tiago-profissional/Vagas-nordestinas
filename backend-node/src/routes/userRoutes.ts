import { Router } from "express";
import {
  deleteAccount,
  getAllUsers,
  getProfile,
  updateProfile,
  updateUserRole,
  uploadAvatar,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireRole } from "../middleware/requireRole.js";
import { receberAvatar } from "../middleware/uploadAvatar.js";

const userRoutes = Router();

userRoutes.use(authenticate);

userRoutes.get("/profile", getProfile);
userRoutes.put("/profile", updateProfile);
userRoutes.post("/profile/avatar", receberAvatar, uploadAvatar);
userRoutes.delete("/account", deleteAccount);

userRoutes.get("/admin/all", requireRole("admin"), getAllUsers);
userRoutes.patch("/admin/role/:id", requireRole("admin"), updateUserRole);

export default userRoutes;