import express from 'express';
import validate from '../middleware/validateResource.js';
import { createDepartmentSchema } from '../schemas/masterDataSchema.js';
import { requirePermission } from '../middleware/authMiddleware.js';
import * as settingController from '../controllers/settingController.js';

const router = express.Router();

// --- System Settings ---
router.get('/settings', settingController.getSettings);
router.put('/settings', requirePermission('manage_settings'), settingController.updateSettings);

// --- Departments ---
router.get('/departments', settingController.getDepartments);
router.post('/departments', validate(createDepartmentSchema), requirePermission('manage_departments'), settingController.createDepartment);
router.put('/departments/:id', validate(createDepartmentSchema), requirePermission('manage_departments'), settingController.updateDepartment);
router.delete('/departments/:id', requirePermission('manage_departments'), settingController.deleteDepartment);

export default router;
