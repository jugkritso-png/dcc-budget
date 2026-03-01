<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DCC Budget Manager

ระบบจัดการงบประมาณสำหรับองค์กร พัฒนาด้วย React, TypeScript, Express และ Prisma

## Prerequisites

- Node.js (v18 หรือสูงกว่า)
- Supabase Account (สำหรับฐานข้อมูล PostgreSQL)

## การติดตั้ง

1. Clone repository และติดตั้ง dependencies:
   ```bash
   npm install
   ```

2. ตั้งค่า Supabase Database:
   - สร้างโปรเจกต์ใหม่ใน [Supabase](https://supabase.com)
   - ไปที่ Project Settings > Database
   - คัดลอก Connection String (URI)

3. สร้างไฟล์ `.env` และตั้งค่า:
   ```bash
   cp .env.example .env
   ```
   
   แก้ไขไฟล์ `.env` โดยใส่ข้อมูล Supabase ของคุณ:
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```

4. รัน Prisma migrations เพื่อสร้างตารางในฐานข้อมูล:
   ```bash
   npx prisma migrate deploy
   # หรือ
   npx prisma db push
   ```

5. สร้างข้อมูลเริ่มต้น (optional):
   ```bash
   npx tsx scripts/init_profile.ts
   ```

6. รันแอปพลิเคชัน:
   ```bash
   npm run dev
   ```

## รีเซ็ตรหัสผ่าน Admin

หากลืมรหัสผ่าน สามารถรีเซ็ตได้ด้วยคำสั่ง:
```bash
npx tsx scripts/reset_admin_password.ts
```

รหัสผ่านจะถูกรีเซ็ตเป็น: `password123`

## Deploy to Vercel

### ขั้นตอนการ Deploy

1. **ติดตั้ง Vercel CLI** (ถ้ายังไม่มี):
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

### ตั้งค่า Environment Variables บน Vercel

ไปที่ Vercel Dashboard > Project Settings > Environment Variables และเพิ่ม:

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
JWT_SECRET=[YOUR-SECRET-KEY]
NODE_ENV=production
```

### Deploy ผ่าน GitHub (แนะนำ)

1. Push โค้ดขึ้น GitHub
2. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
3. คลิก "Import Project"
4. เลือก GitHub repository
5. ตั้งค่า Environment Variables ตามด้านบน
6. คลิก "Deploy"

Vercel จะ auto-deploy ทุกครั้งที่คุณ push โค้ดใหม่!

### หมายเหตุสำคัญ

- Vercel จะรัน `vercel-build` script อัตโนมัติ
- Database schema จะถูก push ไปยัง Supabase ในขั้นตอน build
- Admin user จะถูกสร้างอัตโนมัติถ้ายังไม่มีในฐานข้อมูล
- ใช้ Supabase (PostgreSQL) เท่านั้น ไม่รองรับ SQLite บน Vercel
