import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { loginSchema, registerSchema } from '../validators/authValidators.js';

// tworzymy nowy router, który będzie obsługiwał żądania związane z uwierzytelnianiem użytkowników.
const router = express.Router();

// definiujemy trasę POST dla rejestracji użytkownika oraz sprawdzamy poprawność danych wejściowych itp...
router.post("/register", validateRequest(registerSchema), register);

// to samo tylko dla logowania.
router.post("/login", validateRequest(loginSchema), login);

router.post("/logout", logout);

export default router;