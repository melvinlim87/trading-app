'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold">Trading App</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Welcome back,</p>
                <p className="font-semibold">{user?.name}</p>
              </div>
              <button
                onClick={() => {
                  useAuthStore.getState().logout();
                  router.push('/auth/login');
                }}
                className="px-4 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Welcome Card */}
          <div className="col-span-full bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-bold mb-2">Welcome to Your Trading Dashboard! 🚀</h2>
            <p className="text-muted-foreground">
              Get started by creating a paper trading account with $100,000 virtual funds.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-left">
                <div className="font-semibold">Create Paper Account</div>
                <div className="text-sm opacity-90">Start with $100K virtual funds</div>
              </button>
              <button 
                onClick={() => router.push('/markets')}
                className="w-full px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-left">
                <div className="font-semibold">Browse Markets</div>
                <div className="text-sm opacity-90">Explore stocks and options</div>
              </button>
              <button className="w-full px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-left">
                <div className="font-semibold">View Portfolio</div>
                <div className="text-sm opacity-90">Check your positions</div>
              </button>
            </div>
          </div>

          {/* Account Summary */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Equity</p>
                <p className="text-2xl font-bold text-green-500">$0.00</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Cash</p>
                <p className="text-xl font-semibold">$0.00</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total P&L</p>
                <p className="text-xl font-semibold">$0.00</p>
              </div>
            </div>
          </div>

          {/* Market Overview */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">Market Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">S&P 500</span>
                <span className="text-green-500 font-semibold">+0.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">NASDAQ</span>
                <span className="text-green-500 font-semibold">+0.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">DOW</span>
                <span className="text-red-500 font-semibold">-0.2%</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="col-span-full bg-card rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent activity</p>
              <p className="text-sm mt-2">Start trading to see your activity here</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Trading App - Paper Trading Platform</p>
          <p className="mt-1">Built with Next.js, NestJS, and ❤️</p>
        </div>
      </footer>
    </div>
  );
}
