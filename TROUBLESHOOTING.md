# Troubleshooting Guide

## Current Issue: Prisma Database Connection

We're experiencing a Prisma authentication issue with PostgreSQL. Here are the solutions:

### Solution 1: Use Docker Desktop PostgreSQL GUI

1. Open Docker Desktop
2. Go to Containers
3. Click on `trading-app-postgres`
4. Click "Exec" tab
5. Run: `psql -U postgres trading_app`
6. Paste the SQL schema (will provide separately)

### Solution 2: Alternative Database Setup

Use a cloud PostgreSQL instance:
- **Supabase** (free tier): https://supabase.com
- **Neon** (free tier): https://neon.tech
- **ElephantSQL** (free tier): https://elephantsql.com

Then update `.env` with the connection string.

### Solution 3: Skip Database for Now

You can explore the frontend and code structure without the backend running:

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

The frontend will run at http://localhost:3000 (though API calls will fail without backend).

### Solution 4: Manual SQL Execution

If you have `psql` installed locally or can access the Docker container, run the migration SQL directly.

## Next Steps

Once we resolve the database connection:
1. Run `npx prisma db push` in backend folder
2. Start backend: `npm run start:dev`
3. Start frontend: `npm run dev`
4. Visit http://localhost:3000

## Alternative: Use SQLite (Quick Demo)

I can modify the backend to use SQLite instead of PostgreSQL for a quick demo. This requires no external database.

Let me know which solution you'd like to try!
