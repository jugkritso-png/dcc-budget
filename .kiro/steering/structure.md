# Project Structure

## Root Directory Layout
```
/
├── src/                 # Frontend React application
├── server/              # Backend Express API
├── prisma/              # Database schema and migrations
├── scripts/             # Utility scripts (TypeScript)
├── public/              # Static assets
├── docs/                # Documentation
├── .kiro/               # Kiro AI configuration
└── api/                 # Vercel serverless functions
```

## Frontend Structure (`src/`)
```
src/
├── components/          # React components
│   ├── ui/             # Base UI components (Button, Input, Modal, etc.)
│   ├── common/         # Shared components (StatCard, etc.)
│   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   ├── budget/         # Budget-specific components
│   ├── management/     # Category management components
│   └── settings/       # Settings page components
├── pages/              # Route-level page components
│   ├── Dashboard.tsx
│   ├── Budget.tsx
│   ├── CreateRequest.tsx
│   ├── Analytics.tsx
│   ├── Settings.tsx
│   └── Login.tsx
├── context/            # React Context providers
│   └── BudgetContext.tsx
├── services/           # API client and service layer
│   ├── api.ts          # Main API client
│   └── reportService.ts
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── lib/                # Third-party library configurations
└── index.tsx           # Application entry point
```

## Backend Structure (`server/`)
```
server/
├── routes/             # Express route handlers
│   ├── authRoutes.ts
│   ├── userRoutes.ts
│   ├── categoryRoutes.ts
│   ├── expenseRoutes.ts
│   ├── budgetRoutes.ts
│   ├── settingRoutes.ts
│   └── activityLogRoutes.ts
├── middleware/         # Express middleware
│   ├── authMiddleware.ts      # JWT authentication
│   ├── errorHandler.ts        # Global error handling
│   └── validateResource.ts    # Zod validation middleware
├── schemas/            # Zod validation schemas
│   ├── authSchema.ts
│   ├── budgetRequestSchema.ts
│   ├── masterDataSchema.ts
│   └── userSchema.ts
├── lib/                # Shared backend utilities
│   └── prisma.ts       # Prisma client instance
├── utils/              # Backend utilities
│   └── logger.ts
├── index.ts            # Main server entry (development)
└── vercel-app.ts       # Vercel serverless entry
```

## Database (`prisma/`)
```
prisma/
├── schema.prisma       # Prisma schema definition
├── migrations/         # Database migration history
└── dev.db             # SQLite database (development only)
```

## Key Conventions

### Component Organization
- **UI Components** (`src/components/ui/`): Reusable, generic components (Button, Input, Card, Modal, Table, Select, Badge)
- **Feature Components**: Organized by feature domain (budget/, management/, settings/)
- **Page Components** (`src/pages/`): Top-level route components that compose feature components

### API Routes
- All API routes prefixed with `/api`
- Protected routes use `authenticateToken` middleware
- Route structure mirrors resource hierarchy:
  - `/api/auth/*` - Authentication
  - `/api/users/*` - User management
  - `/api/categories/*` - Budget categories
  - `/api/expenses/*` - Expense tracking
  - `/api/budget-requests/*` - Budget request workflow
  - `/api/settings/*` - System settings
  - `/api/activity-logs/*` - Audit logs

### File Naming
- **Components**: PascalCase (e.g., `BudgetPlanning.tsx`, `ApprovalModal.tsx`)
- **Utilities**: camelCase (e.g., `pdfGenerator.ts`, `logger.ts`)
- **Routes**: camelCase with "Routes" suffix (e.g., `authRoutes.ts`)
- **Schemas**: camelCase with "Schema" suffix (e.g., `budgetRequestSchema.ts`)

### Import Patterns
- Use path alias `@/*` for imports from `src/`
- Example: `import { Button } from '@/components/ui/Button'`
- Server imports use relative paths

### State Management
- Global state via React Context (`BudgetContext`)
- Server state via TanStack Query
- Local component state via `useState`

### Authentication Flow
- JWT tokens stored in localStorage
- `authMiddleware.ts` validates tokens on protected routes
- User info attached to `req.user` after authentication

### Error Handling
- Backend: Global error handler middleware catches all errors
- Frontend: Try-catch blocks with toast notifications
- Validation errors: Zod schemas throw descriptive errors

### Database Access
- All database operations through Prisma Client
- Single Prisma instance exported from `server/lib/prisma.ts`
- Use Prisma migrations for schema changes

### Styling Approach
- Tailwind utility classes for styling
- Custom components in `src/components/ui/` provide consistent design system
- Responsive design with Tailwind breakpoints
- Theme support (light/dark) via user preferences
