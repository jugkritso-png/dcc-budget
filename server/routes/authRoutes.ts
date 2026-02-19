import express from 'express';
import validate from '../middleware/validateResource';
import { loginSchema } from '../schemas/authSchema';
import * as authController from '../controllers/authController';

const router = express.Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/google', authController.googleLogin);

export default router;
