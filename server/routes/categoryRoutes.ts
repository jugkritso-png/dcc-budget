import express from 'express';
import validate from '../middleware/validateResource.js';
import { createCategorySchema, updateCategorySchema, budgetAdjustSchema } from '../schemas/masterDataSchema.js';
import * as categoryController from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', categoryController.listCategories);
router.post('/', validate(createCategorySchema), categoryController.createCategory);
router.put('/:id', validate(updateCategorySchema), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

// Adjust budget
router.post('/:id/adjust', validate(budgetAdjustSchema), categoryController.adjustBudget);

// Get budget logs
router.get('/:id/logs', categoryController.getBudgetLogs);

// Get expenses for category
router.get('/:id/expenses', categoryController.getExpenses);

export default router;
