# 🚀 Quick Deploy - Trading App

## Fastest Way to Deploy (5 minutes)

### Step 1: Install Vercel CLI
```powershell
npm install -g vercel
```

### Step 2: Deploy Backend
```powershell
cd C:\Users\melvi\Downloads\TradingApp\backend
vercel
```

When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → `trading-app-backend`
- **Directory?** → `./` (press Enter)
- **Override settings?** → No

Copy the deployment URL (e.g., `https://trading-app-backend.vercel.app`)

### Step 3: Deploy Frontend
```powershell
cd C:\Users\melvi\Downloads\TradingApp\frontend
vercel
```

When prompted:
- **Set up and deploy?** → Yes
- **Project name?** → `trading-app-frontend`
- **Directory?** → `./` (press Enter)
- **Override settings?** → No

### Step 4: Configure Environment Variables

#### For Frontend:
```powershell
# Still in frontend directory
vercel env add NEXT_PUBLIC_API_URL
```
Enter the backend URL from Step 2 (e.g., `https://trading-app-backend.vercel.app`)

Select: **Production**

#### For Backend:
```powershell
cd ..\backend
vercel env add DATABASE_URL
```
For now, use SQLite (file-based):
```
file:./dev.db
```
Select: **Production**

```powershell
vercel env add JWT_SECRET
```
Enter a strong secret (e.g., `your-super-secret-jwt-key-12345`)

```powershell
vercel env add REDIS_HOST
```
Enter: `localhost` (or skip Redis for now)

### Step 5: Redeploy with Environment Variables
```powershell
# In backend
vercel --prod

# In frontend
cd ..\frontend
vercel --prod
```

### Step 6: Access Your App! 🎉

Your app is now live at:
- **Frontend**: `https://trading-app-frontend.vercel.app`
- **Backend API**: `https://trading-app-backend.vercel.app`
- **API Docs**: `https://trading-app-backend.vercel.app/api/docs`

## Alternative: Use the PowerShell Script

Simply run:
```powershell
cd C:\Users\melvi\Downloads\TradingApp
.\deploy.ps1
```

Choose option 3 (Both Frontend + Backend)

## Production Database Setup (Optional)

For a production-ready deployment, use a real database:

### Option 1: Supabase (Recommended)
1. Go to https://supabase.com
2. Create new project
3. Copy the connection string
4. Add to Vercel:
   ```powershell
   cd backend
   vercel env add DATABASE_URL
   ```
   Paste the Supabase connection string

### Option 2: Neon
1. Go to https://neon.tech
2. Create new project
3. Copy connection string
4. Add to Vercel environment variables

### Option 3: Railway
1. Go to https://railway.app
2. New Project → PostgreSQL
3. Copy connection string
4. Add to Vercel environment variables

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Test build locally: `npm run build`

### API Not Connecting
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS settings in backend
- Ensure backend is deployed and running

### Database Connection Error
- For production, switch from SQLite to PostgreSQL
- Update `prisma/schema.prisma` datasource to `postgresql`
- Run `npx prisma migrate deploy`

## Custom Domain (Optional)

1. Go to Vercel dashboard
2. Select your project
3. Settings → Domains
4. Add your custom domain
5. Follow DNS configuration instructions

## Monitoring

- **Logs**: Vercel Dashboard → Deployments → View Logs
- **Analytics**: Vercel Dashboard → Analytics
- **Performance**: Vercel Dashboard → Speed Insights

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Set up production database
3. ✅ Configure custom domain
4. ✅ Enable analytics
5. ✅ Set up monitoring

---

**Need help?** Check `DEPLOYMENT_GUIDE.md` for detailed instructions and alternative deployment options.
