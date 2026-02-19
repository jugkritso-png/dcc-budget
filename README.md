# DCC Budget Manager

A comprehensive Budget Management System built for managing projects, budget requests, and expenses.

## Project Structure

This project follows a client-server architecture:

-   **Frontend**: React (Vite) in `src/`
-   **Backend**: Node.js (Express) in `server/`
-   **Database**: PostgreSQL (via Supabase) managed by Prisma

## Backend Architecture

The backend has been refactored to follow a Controller-Service-Repository pattern (simplified to Controller-Prisma):

-   **`server/app.ts`**: Entry point, middleware setup.
-   **`server/routes/`**: Defines API endpoints and delegates logic to controllers.
-   **`server/controllers/`**: Contains business logic.
    -   `authController.ts`: Login, Google Auth.
    -   `budgetController.ts`: Budget requests, approvals, calculations.
    -   `userController.ts`: User management.
    -   `categoryController.ts`: Budget categories and adjustments.
    -   `expenseController.ts`: Direct expense management.
    -   `settingController.ts`: System settings.
    -   `activityLogController.ts`: Audit logs.
-   **`server/middleware/`**: Authentication (`authMiddleware.ts`) and Validation (`validateResource.ts`).
-   **`server/lib/prisma.ts`**: Prisma Client instance (Singleton).

## Prerequisites

-   Node.js (v18+)
-   Supabase Project

## Setup & Run

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file based on `.env.example` (if available) or ensure you have:
    -   `DATABASE_URL` / `DIRECT_URL` (Supabase Transaction/Session pool)
    -   `SUPABASE_URL` / `SUPABASE_ANON_KEY`
    -   `JWT_SECRET`
    -   `GOOGLE_CLIENT_ID` (for Google Login)

3.  **Database Migration**
    ```bash
    npx prisma db push
    ```

4.  **Run Development Server**
    You need to run the Backend and Frontend in separate terminals:

    **Terminal 1 (Backend):**
    ```bash
    npm run server
    ```
    (Runs on http://localhost:3002)

    **Terminal 2 (Frontend):**
    ```bash
    npm run dev
    ```
    (Runs on http://localhost:3000 or 3001)

## Deployment

The project is configured for deployment on Vercel.
-   `api/index.ts` and `api/vercel.ts` are entry points for Vercel Serverless Functions.
