import express from 'express';
import { requirePermission } from '../middleware/authMiddleware';
import * as activityLogController from '../controllers/activityLogController';

const router = express.Router();

router.get('/', requirePermission('view_activity_logs'), activityLogController.getActivityLogs);

export default router;
