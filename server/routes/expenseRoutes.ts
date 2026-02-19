import express from 'express';
import * as expenseController from '../controllers/expenseController';

const router = express.Router();

router.post('/', expenseController.createExpense);
router.delete('/:id', expenseController.deleteExpense);

export default router;
