# Trading App - Setup Guide

This guide will help you set up and run the multi-asset trading platform on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Redis** 7+ ([Download](https://redis.io/download))
- **npm** or **yarn** package manager

## Project Structure

```
TradingApp/
├── backend/          # NestJS backend API
├── frontend/         # Next.js web application
├── mobile/           # React Native app (future)
└── docs/             # Documentation
```

## Step 1: Database Setup

### PostgreSQL

1. **Install PostgreSQL** if not already installed
2. **Create a new database**:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE trading_app;

# Create user (optional)
CREATE USER trading_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE trading_app TO trading_user;

# Exit
\q
```

### Redis

1. **Install Redis** if not already installed
2. **Start Redis server**:

```bash
# Windows (if installed via installer)
redis-server

# Or use Docker
docker run -d -p 6379:6379 redis:7-alpine
```

## Step 2: Backend Setup

1. **Navigate to backend directory**:

```bash
cd backend
```

2. **Install dependencies**:

```bash
npm install
```

3. **Configure environment variables**:

```bash
# Copy the example env file
copy .env.example .env

# Edit .env file with your settings
```

Update the `.env` file with your configuration:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/trading_app?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=7d

# API Keys (optional for MVP)
MARKET_DATA_API_KEY=your-market-data-api-key
OPENAI_API_KEY=your-openai-api-key

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# Paper Trading
PAPER_TRADING_INITIAL_BALANCE=100000
```

4. **Run database migrations**:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. **Seed database (optional)**:

Create some sample instruments:

```bash
npx prisma studio
```

Then manually add some instruments or create a seed script.

6. **Start the backend server**:

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The backend API should now be running at `http://localhost:3001`

API Documentation is available at `http://localhost:3001/api/docs`

## Step 3: Frontend Setup

1. **Navigate to frontend directory**:

```bash
cd ../frontend
```

2. **Install dependencies**:

```bash
npm install
```

3. **Configure environment variables**:

```bash
# Copy the example env file
copy .env.example .env.local

# Edit .env.local file
```

Update the `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

4. **Start the development server**:

```bash
npm run dev
```

The frontend should now be running at `http://localhost:3000`

## Step 4: Verify Installation

1. **Open your browser** and navigate to `http://localhost:3000`
2. **Register a new account**
3. **Create a paper trading account** (should get $100,000 virtual funds)
4. **Test the features**:
   - View market data
   - Place a paper trade
   - Check your portfolio
   - Explore social feed

## Common Issues & Troubleshooting

### Database Connection Error

**Problem**: Cannot connect to PostgreSQL

**Solution**:
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in `.env` file
- Ensure database exists: `psql -U postgres -l`

### Redis Connection Error

**Problem**: Cannot connect to Redis

**Solution**:
- Verify Redis is running: `redis-cli ping` (should return PONG)
- Check REDIS_HOST and REDIS_PORT in `.env` file
- Try restarting Redis server

### Port Already in Use

**Problem**: Port 3000 or 3001 is already in use

**Solution**:
- Change the port in configuration files
- Or kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :3001
  taskkill /PID <PID> /F
  ```

### Prisma Migration Errors

**Problem**: Prisma migration fails

**Solution**:
- Reset the database: `npx prisma migrate reset`
- Regenerate Prisma client: `npx prisma generate`
- Check database permissions

### Module Not Found Errors

**Problem**: Cannot find module errors

**Solution**:
- Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules
  npm install
  ```
- Clear npm cache: `npm cache clean --force`

## Development Workflow

### Backend Development

```bash
cd backend

# Run in watch mode
npm run start:dev

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format

# View database
npx prisma studio
```

### Frontend Development

```bash
cd frontend

# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# Lint code
npm run lint
```

## Next Steps

### Phase 1 - MVP Features (Current)
- ✅ User authentication
- ✅ Paper trading
- ✅ Market data (simulated)
- ✅ Basic social feed
- ✅ Portfolio tracking

### Phase 2 - Advanced Features (Next)
- [ ] Real market data integration
- [ ] Options chain with Greeks
- [ ] Advanced charting
- [ ] Risk management tools
- [ ] Social rooms and follows

### Phase 3 - AI Integration
- [ ] Ticker analysis
- [ ] Options strategy suggestions
- [ ] Portfolio insights
- [ ] Content moderation

### Phase 4 - Production Ready
- [ ] Real broker integration
- [ ] KYC/AML compliance
- [ ] Mobile app (React Native)
- [ ] Performance optimization
- [ ] Security audit

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Accounts
- `POST /accounts` - Create account
- `GET /accounts` - Get user accounts
- `GET /accounts/:id` - Get account details
- `GET /accounts/:id/summary` - Get account summary

### Market Data
- `GET /market-data/quote/:symbol` - Get quote
- `GET /market-data/historical/:symbol` - Get historical data
- `GET /market-data/search` - Search instruments
- `GET /market-data/options-chain/:symbol` - Get options chain
- `GET /market-data/movers/:type` - Get market movers

### Orders
- `POST /orders` - Place order
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order details
- `DELETE /orders/:id` - Cancel order

### Portfolio
- `GET /portfolio/:accountId` - Get portfolio
- `GET /portfolio/:accountId/performance` - Get performance

### Social
- `POST /social/posts` - Create post
- `GET /social/feed` - Get social feed
- `GET /social/posts/:id` - Get post
- `POST /social/comments` - Create comment
- `POST /social/reactions/:postId/:type` - Toggle reaction
- `POST /social/follow/:userId` - Follow/unfollow user

### AI
- `GET /ai/analyze/:symbol` - Get AI analysis
- `POST /ai/options-strategy` - Get strategy suggestion
- `POST /ai/portfolio-insights` - Get portfolio insights

### Notifications
- `GET /notifications` - Get notifications
- `PATCH /notifications/:id/read` - Mark as read
- `PATCH /notifications/read-all` - Mark all as read

## Support

For issues and questions:
- Check the [documentation](./README.md)
- Review [API docs](http://localhost:3001/api/docs)
- Contact the development team

## License

Proprietary - All rights reserved
