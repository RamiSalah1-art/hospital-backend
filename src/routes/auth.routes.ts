import { Router } from 'express';
import { login, getProfile, register, deleteUser } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.delete('/users/:username', deleteUser);
router.get('/profile', authenticate, getProfile);

export default router;
