# Health Booster Supplement — Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL database

## Setup Steps

### 1. Configure Environment
Edit `.env` with your database credentials:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
ADMIN_EMAIL="admin@healthbooster.com"
ADMIN_PASSWORD="Admin@12345"
AUTH_SECRET="your-super-secret-key-minimum-32-chars"
```

### 2. Create Database & Run Migrations
```bash
npx prisma migrate dev --name init
```

### 3. Seed Data
```bash
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

## Admin Panel
- URL: http://localhost:3000/admin/login
- Default Email: admin@healthbooster.com
- Default Password: Admin@12345

**Change these credentials in `.env` before going to production!**

## Project Structure
```
app/
  page.tsx              → Landing page
  admin/
    login/page.tsx      → Admin login
    dashboard/page.tsx  → Dashboard with stats
    orders/page.tsx     → Order management
    orders/[id]/page.tsx→ Order detail & status update
    products/page.tsx   → Product info
    packages/page.tsx   → Package price management
    settings/page.tsx   → Site & payment settings
  api/
    orders/route.ts     → Public order submission
    settings/route.ts   → Public settings fetch
    admin/...           → Protected admin APIs

components/
  landing/              → All landing page sections
  admin/                → Admin sidebar & shared components
  ui/                   → Shared UI components

lib/
  prisma.ts             → Database client (Prisma v7 + pg adapter)
  auth.ts               → JWT authentication
  utils.ts              → Shared utilities (client-safe)
  server-utils.ts       → Server-only utilities
  validations.ts        → Zod schemas

prisma/
  schema.prisma         → Database schema
  seed.ts               → Seed data
```
