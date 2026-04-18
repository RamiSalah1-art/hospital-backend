import { Router } from 'express';
import { login, getProfile, register } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { loginSchema } from '../schemas/validation.schemas';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/register', register);
router.get('/profile', authenticate, getProfile);

export default router;
