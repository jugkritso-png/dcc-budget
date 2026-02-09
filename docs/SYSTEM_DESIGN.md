# System Design Documentation
**Project:** DCC Budget Manager

## 1. System Overview
The **DCC Budget Manager** is a web-based application designed to manage, track, and analyze organizational budget allocations and expenses. It provides a comprehensive dashboard for real-time insights, a request management workflow for budget approval, and detailed reporting capabilities.

## 2. Architecture
The application follows a standard **Client-Server Architecture**:

- **Frontend (SPA):** Built with React and Vite, serving as the user interface. It communicates with the backend via a RESTful API.
- **Backend (API):** A Node.js/Express server that handles business logic, authentication, and database operations.
- **Database:** Managed via Prisma ORM. Currently configured for **SQLite** (Development), but adaptable for **PostgreSQL** (Production).

```mermaid
graph TD
    Client[React Client (Vite)] -- REST API --> Server[Express Server]
    Server -- Prisma ORM --> DB[(Database)]
    Server -- Auth --> AuthMiddleware
    Server -- Logs --> ActivityLogs
```

## 3. Technology Stack

### Frontend
- **Framework:** React (TypeScript)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (Utility-first CSS framework)
- **UI Components:** Lucide React (Icons), Custom Components (Cards, Buttons, Inputs)
- **Data Visualization:** Recharts
- **State Management:** React Context API (`BudgetContext`)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs
- **Validation:** Zod (inferred from recent schemas)

### Infrastructure
- **Containerization:** Docker & Docker Compose

## 4. Data Model (Database Schema)

### Core Entities

#### User
*Manages system access and roles.*
- `id`: UUID
- `username`, `email`, `password` (hashed)
- `role`: 'admin', 'user', 'approver'
- `department`: Linked department

#### Category
*Main budget buckets (e.g., Operating, Materials).*
- `id`: UUID
- `name`: Category name
- `allocated`: Total budget allocated
- `used`: Amount currently spent
- `subActivities`: Relation to SubActivity

#### BudgetRequest
*The core workflow entity for requesting funds.*
- `id`: UUID
- `project`: Project Name
- `amount`: Requested amount
- `status`: 'pending', 'approved', 'rejected', 'draft'
- `requester`: User who made the request
- `urgency`: 'normal', 'urgent', 'critical'
- `expenseItems`: Detailed line items of the request

#### SubActivity
*Granular breakdown of activities within a category.*
- `id`: UUID
- `categoryId`: FK to Category
- `allocated`: Budget allocated to this specific activity

#### BudgetPlan
*Monthly planning for budget distribution.*
- `subActivityId`: FK to SubActivity
- `year`, `month`: Timeline
- `amount`: Planned amount

#### Expense
*Actual recorded usage of funds.*
- `categoryId`: FK to Category
- `amount`: value
- `payee`: Who was paid
- `date`: Transaction date

## 5. Key Workflows

### 5.1 Budget Request Flow
1. **Creation:** User fills out `CreateRequest` form (Project info, Category, Line items).
2. **Validation:** Frontend validates inputs; Backend validates logic.
3. **Submission:** Request saved with `status: pending`.
4. **Approval:** Admin/Approver reviews request -> Status changes to `approved` or `rejected`.
5. **Deduction:** (On Approval) Amount is deducted from the Category's available budget.

### 5.2 Authentication
- Users log in via `/api/auth/login`.
- Server issues a JWT.
- Client attaches JWT to headers (`Authorization: Bearer <token>`) for protected routes.

## 6. Directory Structure
```
/
├── src/                # Frontend Source
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route pages (Dashboard, Budget, Settings)
│   ├── context/        # React Context (Global State)
│   └── lib/            # Utilities (utils.ts)
├── server/             # Backend Source
│   ├── routes/         # API Route definitions
│   ├── middleware/     # Auth & Error handling
│   └── schemas/        # Zod validation schemas
├── prisma/             # Database Schema & Migrations
└── docs/               # System Documentation
```
