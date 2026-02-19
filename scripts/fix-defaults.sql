-- Run this SQL in Supabase Dashboard > SQL Editor
-- This adds defaults so the Supabase SDK can insert without providing id/timestamps

-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Category
ALTER TABLE "Category" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
ALTER TABLE "Category" ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "Category" ALTER COLUMN "updatedAt" SET DEFAULT now();

-- Expense
ALTER TABLE "Expense" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
ALTER TABLE "Expense" ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "Expense" ALTER COLUMN "updatedAt" SET DEFAULT now();

-- SubActivity
ALTER TABLE "SubActivity" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
ALTER TABLE "SubActivity" ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "SubActivity" ALTER COLUMN "updatedAt" SET DEFAULT now();

-- BudgetPlan
ALTER TABLE "BudgetPlan" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
ALTER TABLE "BudgetPlan" ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "BudgetPlan" ALTER COLUMN "updatedAt" SET DEFAULT now();

-- Department
ALTER TABLE "Department" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
ALTER TABLE "Department" ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "Department" ALTER COLUMN "updatedAt" SET DEFAULT now();

-- BudgetRequest
ALTER TABLE "BudgetRequest" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
ALTER TABLE "BudgetRequest" ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "BudgetRequest" ALTER COLUMN "updatedAt" SET DEFAULT now();

-- BudgetRequestItem
ALTER TABLE "BudgetRequestItem" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
ALTER TABLE "BudgetRequestItem" ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "BudgetRequestItem" ALTER COLUMN "updatedAt" SET DEFAULT now();

-- User
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DEFAULT now();

-- BudgetLog
ALTER TABLE "BudgetLog" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
ALTER TABLE "BudgetLog" ALTER COLUMN "createdAt" SET DEFAULT now();

-- ActivityLog
ALTER TABLE "ActivityLog" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
ALTER TABLE "ActivityLog" ALTER COLUMN "createdAt" SET DEFAULT now();

-- SystemSetting (key is PK, no uuid needed)
-- No changes needed for SystemSetting
