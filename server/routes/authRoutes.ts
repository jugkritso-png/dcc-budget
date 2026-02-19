import express from 'express';
import validate from '../middleware/validateResource.js';
import { loginSchema } from '../schemas/authSchema.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/google', authController.googleLogin);

export default router;
