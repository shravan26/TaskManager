import { Router } from 'express';
import { login, register } from '@src/controllers/user.controller';
export const router = Router();

router.post('/register', register);
router.post('/login', login);
