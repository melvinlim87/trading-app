# 🚀 Deploy Your Trading App NOW!

## ⚡ Super Quick Deploy (3 Commands)

Open PowerShell and run:

```powershell
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy!
cd C:\Users\melvi\Downloads\TradingApp
.\deploy.ps1
```

Choose option **3** (Deploy Both)

**That's it!** Your app will be live in ~5 minutes! 🎉

---

## 📋 What You'll Need

Before deploying, have ready:
- ✅ Email for Vercel account (free)
- ✅ Strong JWT secret (any random string)
- ✅ (Optional) OpenAI API key for AI features

---

## 🎯 Step-by-Step Manual Deploy

### 1️⃣ Install Vercel
```powershell
npm install -g vercel
```

### 2️⃣ Login
```powershell
vercel login
```
Follow the email verification link.

### 3️⃣ Deploy Backend
```powershell
cd backend
vercel --prod
```

**Copy the URL** (e.g., `https://trading-app-backend-xyz.vercel.app`)

### 4️⃣ Set Backend Environment Variables

In Vercel Dashboard (https://vercel.com):
1. Go to your backend project
2. Settings → Environment Variables
3. Add these:

| Variable | Value | Environment |
|----------|-------|-------------|
| `JWT_SECRET` | `your-secret-key-here` | Production |
| `DATABASE_URL` | `file:./dev.db` | Production |
| `NODE_ENV` | `production` | Production |
| `CORS_ORIGIN` | `*` | Production |

### 5️⃣ Deploy Frontend
```powershell
cd ..\frontend
vercel --prod
```

### 6️⃣ Set Frontend Environment Variables

In Vercel Dashboard:
1. Go to your frontend project
2. Settings → Environment Variables
3. Add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend-url.vercel.app` | Production |

### 7️⃣ Redeploy Frontend
```powershell
vercel --prod
```

---

## ✅ Your App is Live!

Visit your frontend URL and:
1. **Register** a new account
2. **Create** a paper trading account
3. **Start** trading with $100K virtual funds!

---

## 🔧 Production Upgrade (Optional)

For a production-ready deployment with real database:

### Add PostgreSQL Database

**Option A: Supabase (Recommended)**
```
1. Go to https://supabase.com
2. Create new project (free)
3. Copy connection string
4. Update DATABASE_URL in Vercel
```

**Option B: Neon**
```
1. Go to https://neon.tech
2. Create project (free)
3. Copy connection string
4. Update DATABASE_URL in Vercel
```

### Update Prisma Schema
In `backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Change from sqlite
  url      = env("DATABASE_URL")
}
```

### Run Migrations
```powershell
cd backend
npx prisma migrate deploy
```

---

## 📊 Monitor Your Deployment

- **Logs**: Vercel Dashboard → Deployments → Logs
- **Analytics**: Vercel Dashboard → Analytics
- **Errors**: Vercel Dashboard → Errors

---

## 🆘 Troubleshooting

### "Command not found: vercel"
```powershell
npm install -g vercel
```

### Build fails
```powershell
# Test locally first
cd frontend
npm run build
```

### API not connecting
- Check `NEXT_PUBLIC_API_URL` is set correctly
- Verify backend is deployed and running
- Check browser console for errors

### Database errors
- For production, use PostgreSQL instead of SQLite
- Update `DATABASE_URL` environment variable
- Run migrations: `npx prisma migrate deploy`

---

## 🎉 Success Checklist

- [ ] Vercel CLI installed
- [ ] Logged into Vercel
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Environment variables set
- [ ] App is accessible
- [ ] Can register/login
- [ ] Can create paper account
- [ ] Can place trades

---

## 📚 More Options

- **Detailed Guide**: See `DEPLOYMENT_GUIDE.md`
- **Quick Reference**: See `QUICK_DEPLOY.md`
- **PowerShell Script**: Run `.\deploy.ps1`

---

## 🚀 Ready to Deploy?

Run this now:
```powershell
cd C:\Users\melvi\Downloads\TradingApp
.\deploy.ps1
```

**Your trading app will be live in minutes!** 🎊
