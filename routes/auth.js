import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { validateUser, validateLogin } from '../middlewares/validation.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post('/register', validateUser, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/profile', verifyToken, getProfile);

export default router;
