import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { avatarUpload } from '../middlewares/uploadMiddleware.js';
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAccount
} from '../controllers/userController.js';

const router = express.Router();

// Rotas de perfil protegidas por autenticação JWT
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.patch('/profile', authenticateToken, updateProfile);
router.post('/profile/avatar', authenticateToken, avatarUpload.single('avatar'), uploadAvatar);
router.delete('/account', authenticateToken, deleteAccount);

export default router;

