# Deployment Guide - DCC Budget Manager

This guide explains how to deploy the **DCC Budget Manager** application. The project consists of a React frontend (Vite) and a Node.js/Express backend using Prisma and PostgreSQL (Supabase).

## Prerequisites
- **Node.js**: v18 or higher
- **Supabase Account**: For PostgreSQL database
- **Vercel Account**: For deployment (recommended)

---

## Option 1: Deploy to Vercel (Recommended)

Vercel รองรับทั้ง frontend และ backend (Serverless Functions) ในโปรเจกต์เดียว

### วิธีที่ 1: Deploy ผ่าน Vercel CLI

1. **ติดตั้ง Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login เข้า Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy โปรเจกต์**:
   ```bash
   vercel
   ```
   
   ตอบคำถามตามนี้:
   - Set up and deploy? `Y`
   - Which scope? เลือก account ของคุณ
   - Link to existing project? `N`
   - Project name? กด Enter (ใช้ชื่อเดิม)
   - In which directory is your code located? `./`

4. **ตั้งค่า Environment Variables**:
   ```bash
   vercel env add DATABASE_URL
   vercel env add JWT_SECRET
   vercel env add SUPABASE_URL
   vercel env add SUPABASE_ANON_KEY
   ```
   
   ใส่ค่าตามที่มีในไฟล์ `.env` ของคุณ

5. **Deploy Production**:
   ```bash
   vercel --prod
   ```

### วิธีที่ 2: Deploy ผ่าน GitHub (แนะนำ)

1. **Push โค้ดขึ้น GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Import Project ใน Vercel**:
   - ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
   - คลิก "Add New" > "Project"
   - เลือก GitHub repository ของคุณ
   - คลิก "Import"

3. **ตั้งค่า Environment Variables**:
   ใน Vercel Dashboard > Project Settings > Environment Variables เพิ่ม:
   
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   SUPABASE_URL=https://[PROJECT-REF].supabase.co
   SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
   JWT_SECRET=[RANDOM-SECRET-KEY]
   NODE_ENV=production
   SEED_ADMIN=true
   ```

4. **Deploy**:
   - คลิก "Deploy"
   - รอให้ build เสร็จ (ประมาณ 2-3 นาที)
   - เข้าใช้งานได้ที่ URL ที่ Vercel สร้างให้

### Auto-Deploy

หลังจาก setup แล้ว ทุกครั้งที่คุณ push โค้ดใหม่ขึ้น GitHub:
- Vercel จะ auto-deploy ให้อัตโนมัติ
- Preview deployment สำหรับ Pull Requests
- Production deployment สำหรับ main branch

---

## Option 2: Docker Deployment

### 1. Build and Run
```bash
docker-compose up -d --build
```

### 2. Access the Application
**http://localhost:3002**

### 3. Stop the Application
```bash
docker-compose down
```

---

## Option 3: Manual Deployment (VPS/Server)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
# แก้ไขไฟล์ .env ให้ถูกต้อง
```

### 3. Generate Prisma Client & Push Schema
```bash
npx prisma generate
npx prisma db push
```

### 4. Build Frontend
```bash
npm run build
```

### 5. Start Server
```bash
npm run start
```

### 6. Use PM2 for Production
```bash
npm install -g pm2
pm2 start "npm run start" --name dcc-budget-manager
pm2 save
pm2 startup
```

---

## Database Management

### Backup (Supabase)
Supabase มี automatic backups แต่คุณสามารถ export ข้อมูลได้:
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Reset Database
```bash
npx prisma db push --force-reset
npx tsx scripts/init_profile.ts
```

---

## Troubleshooting

### Vercel Deployment Issues

1. **Build Failed**: ตรวจสอบ Environment Variables ว่าครบถ้วน
2. **Database Connection Error**: ตรวจสอบ DATABASE_URL ว่าถูกต้อง
3. **API Routes Not Working**: ตรวจสอบว่า `vercel.json` มีการ config routes ถูกต้อง

### Local Development Issues

1. **Port Already in Use**: เปลี่ยน port ใน `server/index.ts` และ `vite.config.ts`
2. **Database Connection Failed**: ตรวจสอบ DATABASE_URL ในไฟล์ `.env`
3. **Prisma Client Error**: รัน `npx prisma generate` ใหม่

---

## Performance Tips

1. **Enable Supabase Connection Pooling**: ใช้ pooler URL สำหรับ serverless
2. **Add Database Indexes**: เพิ่ม indexes สำหรับ queries ที่ใช้บ่อย
3. **Enable Vercel Edge Caching**: ตั้งค่า cache headers สำหรับ static assets
4. **Monitor Performance**: ใช้ Vercel Analytics และ Supabase Dashboard

---

## Security Checklist

- ✅ ใช้ strong JWT_SECRET
- ✅ Enable HTTPS (Vercel ทำให้อัตโนมัติ)
- ✅ ตั้งค่า CORS อย่างถูกต้อง
- ✅ ไม่ commit ไฟล์ `.env` ขึ้น Git
- ✅ ใช้ Environment Variables สำหรับ secrets
- ✅ Enable Supabase Row Level Security (RLS) ถ้าต้องการ
