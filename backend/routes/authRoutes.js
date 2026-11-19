import express from 'express';
<<<<<<< HEAD
import { login, register, forgotPassword, resetPassword } from '../controllers/authController.js';
=======
import { login, register } from '../controllers/authController.js';
>>>>>>> tiago/tickets-node

const router = express.Router();

router.post('/login', login);
router.post('/register', register);

<<<<<<< HEAD
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


=======
>>>>>>> tiago/tickets-node
export default router;

