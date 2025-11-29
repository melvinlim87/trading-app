# Backend Deployment Guide

## Deploy Backend to Vercel

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/new
2. Click "Import Git Repository"
3. Select: `melvinlim87/trading-app`

### Step 2: Configure Backend Project
- **Project Name**: `trading-app-backend`
- **Root Directory**: Click "Edit" → Enter `backend`
- **Framework Preset**: Other
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Add Environment Variables

Go to Settings → Environment Variables and add:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `file:./dev.db` | SQLite for now |
| `JWT_SECRET` | `your-super-secret-jwt-key-12345` | Change this! |
| `NODE_ENV` | `production` | |
| `PORT` | `3001` | |
| `CORS_ORIGIN` | `*` | Allow all origins |
| `REDIS_HOST` | `localhost` | Optional |
| `REDIS_PORT` | `6379` | Optional |
| `OPENAI_API_KEY` | `your-key` | Optional |

### Step 4: Deploy

Click **"Deploy"** and wait for the build to complete.

### Step 5: Get Backend URL

After deployment, copy the URL (e.g., `https://trading-app-backend-xyz.vercel.app`)

### Step 6: Update Frontend Environment Variable

1. Go to your frontend project in Vercel
2. Settings → Environment Variables
3. Update `NEXT_PUBLIC_API_URL` with your backend URL
4. Redeploy frontend

## Alternative: Deploy Backend to Railway

Railway is better for backends with databases:

### Step 1: Go to Railway
Visit: https://railway.app

### Step 2: New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `melvinlim87/trading-app`

### Step 3: Configure
- **Root Directory**: `backend`
- Add environment variables (same as above)

### Step 4: Add PostgreSQL
1. Click "New" → "Database" → "PostgreSQL"
2. Railway will auto-generate `DATABASE_URL`
3. Update `prisma/schema.prisma` to use PostgreSQL

### Step 5: Deploy
Railway will automatically deploy and give you a URL.

## Production Database Setup

For production, switch from SQLite to PostgreSQL:

### Option 1: Supabase (Recommended)
1. Go to https://supabase.com
2. Create new project
3. Copy connection string
4. Update `DATABASE_URL` in Vercel/Railway

### Option 2: Neon
1. Go to https://neon.tech
2. Create project
3. Copy connection string
4. Update `DATABASE_URL`

### Update Schema for PostgreSQL
In `backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then run migrations:
```bash
npx prisma migrate deploy
```

## Testing Backend

After deployment, test these endpoints:

- Health check: `https://your-backend-url.vercel.app/`
- API docs: `https://your-backend-url.vercel.app/api/docs`
- Auth: `https://your-backend-url.vercel.app/auth/register`

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Test build locally: `npm run build`

### Database Connection Error
- For production, use PostgreSQL instead of SQLite
- Verify `DATABASE_URL` is set correctly
- Run migrations: `npx prisma migrate deploy`

### CORS Errors
- Set `CORS_ORIGIN` to your frontend URL
- Or use `*` for development

## Next Steps

1. ✅ Deploy backend
2. ✅ Set up production database
3. ✅ Update frontend API URL
4. ✅ Test all endpoints
5. ✅ Monitor logs
