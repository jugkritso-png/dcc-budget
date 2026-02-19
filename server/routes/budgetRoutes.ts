import express from 'express';
import validate from '../middleware/validateResource.js';
import { createRequestSchema, updateRequestStatusSchema } from '../schemas/budgetRequestSchema.js';
import { createSubActivitySchema, updateSubActivitySchema } from '../schemas/masterDataSchema.js';
import { authenticateToken, requirePermission } from '../middleware/authMiddleware.js';
import * as budgetController from '../controllers/budgetController.js';

const router = express.Router();

// --- SubActivities ---
router.get('/sub-activities', budgetController.getSubActivities);
router.post('/sub-activities', validate(createSubActivitySchema), budgetController.createSubActivity);
router.put('/sub-activities/:id', validate(updateSubActivitySchema), budgetController.updateSubActivity);
router.delete('/sub-activities/:id', budgetController.deleteSubActivity);

// --- Budget Requests ---
router.get('/requests', budgetController.getRequests);
router.post('/requests', validate(createRequestSchema), budgetController.createRequest);
router.put('/requests/:id/status', validate(updateRequestStatusSchema), budgetController.updateRequestStatus);
router.delete('/requests/:id', budgetController.deleteRequest);

// --- Budget Requests (Actions) ---
// Approve Request
router.put('/requests/:id/approve', requirePermission('approve_budget'), budgetController.approveRequest);

// Reject Request
router.put('/requests/:id/reject', requirePermission('approve_budget'), budgetController.rejectRequest);

// Submit Expense Report (User Action)
router.put('/requests/:id/submit-expense', budgetController.submitExpense);

// Send Back for Revision (Manager Action)
router.put('/requests/:id/reject-expense', budgetController.rejectExpense);

// Complete/Verify Request (Manager Action)
router.put('/requests/:id/complete', budgetController.completeRequest);

// Revert Complete (Manager Action)
router.put('/requests/:id/revert-complete', budgetController.revertCompleteRequest);


// --- Budget Plans ---
router.get('/budget-plans', budgetController.getBudgetPlans);
router.post('/budget-plans', budgetController.updateBudgetPlan);

export default router;
