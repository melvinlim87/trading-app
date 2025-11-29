# 🏠 Run Trading App Locally

## 🚀 Quick Start (One Command!)

Open PowerShell in the project folder and run:

```powershell
.\start-local.ps1
```

This will:
1. ✅ Start the backend server
2. ✅ Start the frontend server
3. ✅ Open your browser automatically

**That's it!** Your app will be running at http://localhost:3000

---

## 📋 Manual Start (If Script Doesn't Work)

### Terminal 1: Backend
```powershell
cd C:\Users\melvi\Downloads\TradingApp\backend
npm run start:dev
```

Wait until you see:
```
✅ Database connected
✅ Redis connected
🚀 Application is running on: http://localhost:3001/api/docs
```

### Terminal 2: Frontend
```powershell
cd C:\Users\melvi\Downloads\TradingApp\frontend
npm run dev
```

Wait until you see:
```
✓ Ready in 3.2s
○ Local: http://localhost:3000
```

### Open Browser
Go to: **http://localhost:3000**

---

## 🎯 What Works Locally

Everything works perfectly on local:

✅ **Full Authentication**
- Register new accounts
- Login/Logout
- JWT tokens

✅ **TradingView Charts**
- Real-time candlestick charts
- Multiple timeframes
- Interactive zoom/pan

✅ **Trading Engine**
- Place market orders
- Place limit orders
- Buy/Sell stocks
- Real order processing

✅ **Database**
- SQLite (file-based)
- All data stored locally
- No internet required

✅ **Portfolio**
- Track positions
- View P&L
- Account summary

✅ **Paper Trading**
- $100,000 virtual funds
- Risk-free trading
- Real market simulation

---

## 🔧 Troubleshooting

### Port Already in Use

If you get "Port 3000 is already in use":

**Option 1: Kill the process**
```powershell
# Find process on port 3000
netstat -ano | findstr :3000

# Kill it (replace PID with the number you found)
taskkill /PID <PID> /F
```

**Option 2: Use different port**
```powershell
# Frontend on port 3002
cd frontend
$env:PORT=3002; npm run dev
```

### Backend Won't Start

1. **Check if Redis is needed**:
   - Comment out Redis in backend if not using it
   - Or start Redis: `docker-compose up redis`

2. **Database issues**:
   ```powershell
   cd backend
   npx prisma generate
   npx prisma db push
   ```

3. **Missing dependencies**:
   ```powershell
   npm install
   ```

### Frontend Won't Connect to Backend

1. Check backend is running on port 3001
2. Check `frontend/.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

---

## 🎨 Development Features

### Hot Reload
Both frontend and backend support hot reload:
- Edit code → Save → Changes appear automatically
- No need to restart servers

### API Documentation
Visit: http://localhost:3001/api/docs
- Interactive API testing
- All endpoints documented
- Try API calls directly

### Database Browser
View your SQLite database:
```powershell
cd backend
npx prisma studio
```
Opens at: http://localhost:5555

---

## 📊 Local vs Online

| Feature | Local | Online (Vercel) |
|---------|-------|-----------------|
| Speed | ⚡ Instant | 🌐 Network delay |
| Database | 💾 SQLite | ☁️ PostgreSQL |
| Development | ✅ Hot reload | ❌ Must redeploy |
| Testing | ✅ Easy | ⏳ Slower |
| Sharing | ❌ Local only | ✅ Public URL |
| Cost | ✅ Free | ✅ Free (with limits) |

**Recommendation**: Develop locally, deploy online when ready!

---

## 🛑 Stop Servers

### Option 1: Close Terminal Windows
Just close the PowerShell windows

### Option 2: Ctrl+C
Press `Ctrl+C` in each terminal window

### Option 3: Kill All Node Processes
```powershell
taskkill /F /IM node.exe
```
⚠️ This kills ALL Node.js processes!

---

## 🎯 Quick Commands

### Start Everything
```powershell
.\start-local.ps1
```

### Start Backend Only
```powershell
cd backend
npm run start:dev
```

### Start Frontend Only
```powershell
cd frontend
npm run dev
```

### Build for Production
```powershell
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm start
```

### Reset Database
```powershell
cd backend
Remove-Item prisma\dev.db
npx prisma db push
```

---

## 🚀 First Time Setup

If this is your first time running locally:

```powershell
# Install all dependencies
cd C:\Users\melvi\Downloads\TradingApp

# Backend
cd backend
npm install
npx prisma generate
npx prisma db push

# Frontend
cd ../frontend
npm install

# Start!
cd ..
.\start-local.ps1
```

---

## 📱 Access Points

After starting:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **Database Studio**: http://localhost:5555 (run `npx prisma studio`)

---

## 🎉 Benefits of Local Development

1. **Instant Feedback** - See changes immediately
2. **No Deploy Wait** - No waiting for Vercel
3. **Full Control** - Debug everything
4. **Offline Work** - No internet needed
5. **Free Database** - SQLite included
6. **Easy Testing** - Test features quickly

---

**Ready to start?** Run `.\start-local.ps1` now! 🚀
