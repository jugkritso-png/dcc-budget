import express from 'express';
import validate from '../middleware/validateResource.js';
import { createUserSchema, updateUserSchema, changePasswordSchema } from '../schemas/userSchema.js';
import { requirePermission } from '../middleware/authMiddleware.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// List all users
router.get('/', userController.listUsers);

// Create new user
router.post('/', validate(createUserSchema), requirePermission('manage_users'), userController.createUser);

// Update user
router.put('/:id', validate(updateUserSchema), userController.updateUser);

// Change Password
router.post('/change-password', validate(changePasswordSchema), userController.changePassword);

// Delete user
router.delete('/:id', requirePermission('manage_users'), userController.deleteUser);

export default router;
