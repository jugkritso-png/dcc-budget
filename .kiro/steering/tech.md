# Technology Stack

## Architecture
Full-stack TypeScript application with client-server architecture:
- **Frontend**: React SPA built with Vite
- **Backend**: Express.js REST API
- **Database**: PostgreSQL (production) via Prisma ORM
- **Deployment**: Vercel (frontend + serverless functions)

## Frontend Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 (utility-first)
- **UI Components**: Custom components + Lucide React icons
- **State Management**: React Context API (`BudgetContext`)
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts
- **Forms**: React Hook Form (implied from patterns)
- **Notifications**: React Hot Toast, SweetAlert2
- **PDF Generation**: jsPDF with jspdf-autotable

## Backend Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **ORM**: Prisma 6
- **Authentication**: JWT (jsonwebtoken) + bcryptjs for password hashing
- **Validation**: Zod schemas
- **Error Handling**: express-async-errors
- **CORS**: Enabled for cross-origin requests
- **Google OAuth**: @react-oauth/google + google-auth-library

## Database
- **Production**: PostgreSQL (via Supabase)
- **ORM**: Prisma with migrations
- **Schema**: See `prisma/schema.prisma`

## Development Tools
- **TypeScript**: 5.8
- **Package Manager**: npm
- **Containerization**: Docker + Docker Compose
- **Scripts**: tsx for running TypeScript scripts

## Common Commands

### Development
```bash
npm run dev              # Start Vite dev server (port 3000)
npm run server           # Start Express server (port 3002)
```

### Database
```bash
npx prisma db push       # Push schema changes to database
npx prisma migrate deploy # Run migrations in production
npx prisma studio        # Open Prisma Studio GUI
npx prisma generate      # Generate Prisma Client
```

### Build & Deploy
```bash
npm run build            # Build frontend (includes prisma generate)
npm start                # Start production server
npm run vercel-build     # Vercel build script (generates Prisma, pushes schema, builds)
```

### Utility Scripts
```bash
npx tsx scripts/init_profile.ts          # Seed initial data
npx tsx scripts/reset_admin_password.ts  # Reset admin password to 'password123'
npx tsx scripts/verify_budget.ts         # Verify budget calculations
```

## Environment Variables
Required in `.env`:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT signing
- `SUPABASE_URL`: Supabase project URL (optional)
- `SUPABASE_ANON_KEY`: Supabase anonymous key (optional)
- `GEMINI_API_KEY`: Google Gemini API key (optional)
- `NODE_ENV`: 'development' or 'production'

## API Proxy
Vite dev server proxies `/api/*` requests to `http://localhost:3002` (Express server).

## Path Aliases
- `@/*` maps to `src/*` (configured in tsconfig.json and vite.config.ts)

## Code Style
- TypeScript strict mode disabled (no strict checks)
- ESM modules (`"type": "module"` in package.json)
- Experimental decorators enabled
- React JSX transform (no need to import React)
