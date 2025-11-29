# Multi-Asset Trading Platform

A modern, AI-powered trading application for stocks and options with real-time trading, paper trading, and social community features.

## 🚀 Product Vision

Build a multi-asset trading app (stocks + stock options) with real-time trading, paper trading, and a social trading community, inspired by Moomoo & Tiger Trade, but tightly integrated with AI tools.

## 🏗️ Architecture

### Frontend
- **Web**: Next.js 14+ with React, TypeScript
- **Mobile**: React Native (iOS + Android)
- **State Management**: Zustand
- **Charts**: TradingView Lightweight Charts
- **UI**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React

### Backend
- **Framework**: NestJS (Node.js + TypeScript)
- **API**: REST + WebSocket
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT + Passport

### Services Architecture
1. **User & Auth Service** - accounts, 2FA, roles, SSO
2. **Market Data Service** - real-time stocks & options data
3. **Order & Execution Service** - order routing and execution
4. **Portfolio & Risk Service** - positions, P&L, Greeks, risk limits
5. **Social Service** - posts, comments, follows, leaderboards
6. **AI Service** - analysis, forecasts, strategy suggestions
7. **Notification Service** - push, email, in-app alerts

## 📦 Project Structure

```
TradingApp/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── market-data/    # Market data service
│   │   ├── orders/         # Order management
│   │   ├── portfolio/      # Portfolio & positions
│   │   ├── social/         # Social features
│   │   ├── ai/             # AI integration
│   │   ├── notifications/  # Notification service
│   │   └── common/         # Shared utilities
│   ├── prisma/             # Database schema
│   └── package.json
├── frontend/               # Next.js web app
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities
│   │   ├── hooks/         # Custom hooks
│   │   ├── store/         # State management
│   │   └── types/         # TypeScript types
│   └── package.json
├── mobile/                # React Native app (future)
└── docs/                  # Documentation
```

## 🎯 Core Features

### Phase 1 - MVP (Paper Trading)
- ✅ User authentication & accounts
- ✅ Market data integration (stocks & options)
- ✅ Paper trading engine ($100K virtual funds)
- ✅ Order management (market, limit, stop orders)
- ✅ Portfolio tracking & P&L
- ✅ Basic social feed

### Phase 2 - Advanced Options
- Options chain with Greeks
- Multi-leg options strategies
- Risk management & alerts
- Advanced portfolio analytics

### Phase 3 - Social & Community
- Trade feed sharing
- User profiles & badges
- Themed rooms
- Follow system & leaderboards

### Phase 4 - AI Integration
- Ticker analysis assistant
- Options strategy helper
- Portfolio insights
- Community content moderation

### Phase 5 - Real Money Trading
- Broker API integration
- KYC/AML compliance
- Deposit/withdrawal flows
- Full audit trails

## 🎨 Design System

### Color Themes
- **Dark Theme** (Primary)
  - Background: Dark navy/charcoal (#0A0E27)
  - Secondary: Lighter panels (#151B3B)
  - Accent Primary: Electric cyan (#00D9FF)
  - Accent Secondary: Magenta (#FF00FF)
  - Positive: Green (#00FF88)
  - Negative: Red (#FF4444)

### UX Principles
- Beginner vs Pro mode toggle
- Contextual tooltips & educational content
- Smooth micro-interactions
- Clear error handling
- Mobile-first responsive design

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your database and Redis URLs
npx prisma migrate dev
npm run start:dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Configure API URL
npm run dev
```

## 📊 Data Models

### Core Entities
- **User**: id, email, name, role, avatar, settings
- **Account**: id, user_id, type (paper/live), equity, cash, margin
- **Instrument**: id, symbol, type (stock/option), exchange, metadata
- **Order**: id, account_id, instrument_id, side, type, qty, price, status
- **Position**: id, account_id, instrument_id, qty, avg_price, pnl
- **Post**: id, user_id, text, symbols, attachments, created_at
- **Comment, Reaction, Follow, Room**: Social graph entities

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on all endpoints
- Input validation & sanitization
- CORS configuration
- SQL injection prevention (Prisma ORM)
- XSS protection

## 📱 API Documentation

API documentation available at `/api/docs` when running the backend server (Swagger UI).

## 🤝 Contributing

This is a proprietary project. For internal development only.

## 📄 License

Proprietary - All rights reserved

## 🆘 Support

For issues and questions, contact the development team.
