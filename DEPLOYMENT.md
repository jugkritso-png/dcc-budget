# Deployment Guide - DCC Budget Manager

This guide explains how to deploy the **DCC Budget Manager** application. The project consists of a React frontend (Vite) and a Node.js/Express backend using Prisma and PostgreSQL (Supabase).

## Prerequisites
- **Node.js**: v18 or higher
- **Supabase Project**: A configured Supabase project with PostgreSQL database.
- **Vercel Account**: (Recommended for Hosting)

---

## Environment Variables
Ensure your `.env` file (or deployment environment variables) contains:
- `DATABASE_URL`: Connection string for Prisma (Transaction/Session Pooler)
- `DIRECT_URL`: Direct connection string for migrations (Session/Direct)
- `JWT_SECRET`: Secret key for authentication tokens
- `GOOGLE_CLIENT_ID`: (Optional) For Google Login backend validation
- `VITE_GOOGLE_CLIENT_ID`: (Optional) For Google Login frontend button

---

## Option 1: Vercel Deployment (Recommended)
This project is configured for Vercel, which can host both the Frontend and the Backend API (as Serverless Functions).

### 1. Push to GitHub
Commit your code and push it to a GitHub repository.

### 2. Import Project in Vercel
- Go to Vercel Dashboard -> Add New Project.
- Import your GitHub repository.
- **Framework Preset**: Vercel should detect `Vite` automatically.
- **Root Directory**: `./`

### 3. Configure Build Settings
- **Build Command**: `npm run vercel-build` (or `prisma generate && vite build`)
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Set Environment Variables
Copy all variables from your local `.env` to the Vercel Project Settings.

### 5. Deploy
Click **Deploy**. Vercel will build the frontend and deploy the backend API routes found in `api/`.

---

## Option 2: Render / Railway / VPS (Docker/Node)

### 1. Build
```bash
npm install
npx prisma generate
npm run build
```

### 2. Start
```bash
npm run server
```
This starts the Express server on port 3002 (default). It serves the API at `/api` and the static frontend files from `dist/`.

---

## Database Management

### Migrations
To update the production database schema:
```bash
npx prisma db push
```
Or for safer migrations in production:
```bash
npx prisma migrate deploy
```

### Seeding
If setting up a fresh database, you might need to seed initial data (e.g., admin user):
```bash
npx tsx prisma/seed.ts
``` (If a seed script exists)

---

## Troubleshooting
- **Database Connection**: Ensure your IP is allowed in Supabase settings if running from a local machine or restricted server.
- **Vercel Functions**: The `api` folder contains the entry point for Vercel functions. Ensure `vercel.json` is correctly configured if you have custom routing needs.
