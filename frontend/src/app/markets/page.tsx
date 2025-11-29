'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TradingChart from '@/components/TradingChart';
import { useAuthStore } from '@/store/auth-store';

export default function MarketsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [assetType, setAssetType] = useState<'stocks' | 'crypto'>('crypto');
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USD');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('1');
  const [limitPrice, setLimitPrice] = useState('');

  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.50, change: 2.5 },
    { symbol: 'MSFT', name: 'Microsoft', price: 378.90, change: 1.8 },
    { symbol: 'GOOGL', name: 'Alphabet', price: 140.25, change: -0.5 },
    { symbol: 'AMZN', name: 'Amazon', price: 155.75, change: 3.2 },
    { symbol: 'TSLA', name: 'Tesla', price: 242.80, change: -1.2 },
    { symbol: 'NVDA', name: 'NVIDIA', price: 495.20, change: 5.5 },
  ];

  const cryptoPairs = [
    { symbol: 'BTC/USD', name: 'Bitcoin', price: 43250.00, change: 3.8 },
    { symbol: 'ETH/USD', name: 'Ethereum', price: 2280.50, change: 5.2 },
    { symbol: 'SOL/USD', name: 'Solana', price: 98.75, change: 8.5 },
    { symbol: 'BNB/USD', name: 'Binance Coin', price: 312.40, change: 2.1 },
    { symbol: 'XRP/USD', name: 'Ripple', price: 0.62, change: -1.5 },
    { symbol: 'ADA/USD', name: 'Cardano', price: 0.58, change: 4.3 },
    { symbol: 'DOGE/USD', name: 'Dogecoin', price: 0.085, change: -2.1 },
    { symbol: 'MATIC/USD', name: 'Polygon', price: 0.92, change: 6.7 },
  ];

  const assets = assetType === 'crypto' ? cryptoPairs : popularStocks;

  const selectedAsset = assets.find(a => a.symbol === selectedSymbol);
  const currentPrice = selectedAsset?.price || 0;

  const handlePlaceOrder = () => {
    const unit = assetType === 'crypto' ? 'units' : 'shares';
    alert(`Order placed: ${side.toUpperCase()} ${quantity} ${unit} of ${selectedSymbol} at ${orderType === 'market' ? 'market price' : `$${limitPrice}`}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => router.push('/dashboard')} className="text-primary hover:underline">
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold">Markets</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Asset List */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Markets</h2>
              </div>
              
              {/* Asset Type Toggle */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => {
                    setAssetType('crypto');
                    setSelectedSymbol('BTC/USD');
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    assetType === 'crypto'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  🪙 Crypto
                </button>
                <button
                  onClick={() => {
                    setAssetType('stocks');
                    setSelectedSymbol('AAPL');
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    assetType === 'stocks'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  📈 Stocks
                </button>
              </div>

              <div className="space-y-2">
                {assets.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => setSelectedSymbol(stock.symbol)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedSymbol === stock.symbol
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{stock.symbol}</div>
                        <div className="text-sm opacity-80">{stock.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${stock.price}</div>
                        <div className={`text-sm ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change}%
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Middle: Chart */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg p-6 border border-border">
              <TradingChart symbol={selectedSymbol} />
            </div>

            {/* Trading Panel */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-lg font-semibold mb-4">Place Order</h2>
              
              {/* Buy/Sell Toggle */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setSide('buy')}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    side === 'buy'
                      ? 'bg-green-500 text-white'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setSide('sell')}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    side === 'sell'
                      ? 'bg-red-500 text-white'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  Sell
                </button>
              </div>

              {/* Order Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Order Type</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setOrderType('market')}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      orderType === 'market'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    Market
                  </button>
                  <button
                    onClick={() => setOrderType('limit')}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      orderType === 'limit'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    Limit
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter quantity"
                />
              </div>

              {/* Limit Price (if limit order) */}
              {orderType === 'limit' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Limit Price</label>
                  <input
                    type="number"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter limit price"
                    step="0.01"
                  />
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Symbol</span>
                  <span className="font-semibold">{selectedSymbol}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Quantity</span>
                  <span className="font-semibold">{quantity}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Order Type</span>
                  <span className="font-semibold capitalize">{orderType}</span>
                </div>
                {orderType === 'limit' && (
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Limit Price</span>
                    <span className="font-semibold">${limitPrice || '0.00'}</span>
                  </div>
                )}
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Current Price</span>
                  <span className="font-semibold">${currentPrice.toLocaleString()}</span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Est. Total</span>
                    <span className="font-bold text-lg">
                      ${orderType === 'market' 
                        ? (parseFloat(quantity || '0') * currentPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : (parseFloat(quantity || '0') * parseFloat(limitPrice || '0')).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  side === 'buy'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {side === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
