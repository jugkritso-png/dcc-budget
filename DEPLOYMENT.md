# Deployment Guide - DCC Budget Manager

This guide explains how to deploy the **DCC Budget Manager** application. The project consists of a React frontend (Vite) and a Node.js/Express backend using Prisma and SQLite.

## Prerequisites
- **Node.js**: v18 or higher (for manual deployment)
- **Docker & Docker Compose**: (Recommended for containerized deployment)

---

## Option 1: Docker Deployment (Recommended)
This method is the easiest as it bundles everything (Frontend + Backend + Database logic) into a single container.

### 1. Build and Run
Run the following command in the project root:
```bash
docker-compose up -d --build
```

### 2. Access the Application
Once the container is running, the application will be available at:
**http://localhost:3002**

### 3. Stops the Application
To stop the application, run:
```bash
docker-compose down
```

### Data Persistence
The database file (`dev.db`) is located in the `prisma/` folder. The `docker-compose.yml` file maps this folder to the container, so your data **will persist** even if you restart or rebuild the container.

---

## Option 2: Manual Deployment (Linux/VPS/MacOS)
Use this method if you want to run the application directly on a server without Docker.

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Database Client
```bash
npx prisma generate
```

### 3. Build the Frontend
This compiles the React application into static files in the `dist/` folder.
```bash
npm run build
```

### 4. Start the Server
Start the backend server. It is configured to serve the frontend files automatically in production.
```bash
npm run server
```

### 5. Running in Background (Production)
For a real server, use a process manager like **PM2** to keep the app running.

**Install PM2:**
```bash
npm install -g pm2
```

**Start with PM2:**
```bash
pm2 start "npm run server" --name dcc-budget-manager
```

**View Logs:**
```bash
pm2 logs
```

**Save Process List (Restart on Reboot):**
```bash
pm2 save
pm2 startup
```

---

## Database Management

### Backup
Since the database is a simple file (`prisma/dev.db`), you can back it up by simply copying the file:
```bash
cp prisma/dev.db prisma/backup_dev_$(date +%F).db
```

### Reset Database
If you need to wipe the database and start fresh:
```bash
rm prisma/dev.db
npx prisma db push
```

## Troubleshooting
- **Port 3002 Setup**: If port 3002 is busy, change `PORT` in `server/index.ts` and update `docker-compose.yml`/`Dockerfile`.
- **Database Locked**: SQLite can only handle one writer at a time. Ensure you don't have multiple instances of the app connected to the same file.
