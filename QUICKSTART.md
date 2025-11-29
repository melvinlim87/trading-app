# Quick Start Guide

Get the Trading App running in 5 minutes!

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 7+

## Quick Setup (Windows)

### 1. Start Database Services

**Option A: Using Docker (Recommended)**
```bash
# Navigate to project root
cd C:\Users\melvi\Downloads\TradingApp

# Start PostgreSQL and Redis
docker-compose up -d postgres redis
```

**Option B: Local Installation**
- Start PostgreSQL service
- Start Redis service

### 2. Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Update .env with your database credentials
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trading_app?schema=public"

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev --name init

# Start backend server
npm run start:dev
```

Backend will be running at: http://localhost:3001
API Docs: http://localhost:3001/api/docs

### 3. Setup Frontend

```bash
# Open new terminal
cd C:\Users\melvi\Downloads\TradingApp\frontend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env.local

# Start frontend server
npm run dev
```

Frontend will be running at: http://localhost:3000

## First Steps

1. **Open browser**: Navigate to http://localhost:3000
2. **Register**: Create a new account
3. **Create account**: Set up a paper trading account (gets $100,000 virtual funds)
4. **Start trading**: Explore markets and place your first paper trade!

## Default Test Data

After setup, you can add sample instruments via Prisma Studio:

```bash
cd backend
npx prisma studio
```

Add some sample stocks:
- Symbol: AAPL, Name: Apple Inc., Type: STOCK, Exchange: NASDAQ
- Symbol: GOOGL, Name: Alphabet Inc., Type: STOCK, Exchange: NASDAQ
- Symbol: MSFT, Name: Microsoft Corp., Type: STOCK, Exchange: NASDAQ

## Troubleshooting

### Database Connection Failed
```bash
# Check if PostgreSQL is running
pg_isready

# Or check Docker container
docker ps
```

### Redis Connection Failed
```bash
# Check if Redis is running
redis-cli ping

# Or check Docker container
docker ps
```

### Port Already in Use
```bash
# Find process using port 3001
netstat -ano | findstr :3001

# Kill the process
taskkill /PID <PID> /F
```

## Next Steps

- Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Check [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines

## Features to Try

✅ **Authentication**: Register and login
✅ **Paper Trading**: Place orders with virtual money
✅ **Market Data**: View real-time quotes (simulated)
✅ **Portfolio**: Track your positions and P&L
✅ **Social Feed**: Share trades and interact with community
✅ **AI Analysis**: Get AI-powered insights (requires OpenAI API key)

## Support

For issues:
1. Check the documentation
2. Review API docs at http://localhost:3001/api/docs
3. Check console logs for errors

Happy Trading! 🚀📈
