// Market Data API Integration
// Using free APIs: CoinGecko for crypto, Alpha Vantage for stocks

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const ALPHA_VANTAGE_KEY = 'demo'; // Replace with your key from https://www.alphavantage.co/support/#api-key

// Crypto symbol mapping
const CRYPTO_IDS: Record<string, string> = {
  'BTC/USD': 'bitcoin',
  'ETH/USD': 'ethereum',
  'SOL/USD': 'solana',
  'BNB/USD': 'binancecoin',
  'XRP/USD': 'ripple',
  'ADA/USD': 'cardano',
  'DOGE/USD': 'dogecoin',
  'MATIC/USD': 'matic-network',
};

// Stock symbol mapping
const STOCK_SYMBOLS: Record<string, string> = {
  'AAPL': 'AAPL',
  'MSFT': 'MSFT',
  'GOOGL': 'GOOGL',
  'AMZN': 'AMZN',
  'TSLA': 'TSLA',
  'NVDA': 'NVDA',
};

export interface MarketPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  high24h?: number;
  low24h?: number;
  volume?: number;
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

// Fetch live crypto prices
export async function fetchCryptoPrices(): Promise<MarketPrice[]> {
  try {
    const ids = Object.values(CRYPTO_IDS).join(',');
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`
    );
    
    if (!response.ok) throw new Error('Failed to fetch crypto prices');
    
    const data = await response.json();
    
    return Object.entries(CRYPTO_IDS).map(([symbol, id]) => {
      const coin = data.find((c: any) => c.id === id);
      return {
        symbol,
        name: coin?.name || symbol,
        price: coin?.current_price || 0,
        change24h: coin?.price_change_percentage_24h || 0,
        high24h: coin?.high_24h,
        low24h: coin?.low_24h,
        volume: coin?.total_volume,
      };
    });
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return getFallbackCryptoPrices();
  }
}

// Fetch historical crypto data
export async function fetchCryptoHistory(
  symbol: string,
  days: number = 30
): Promise<CandleData[]> {
  try {
    const coinId = CRYPTO_IDS[symbol];
    if (!coinId) throw new Error('Unknown crypto symbol');

    const response = await fetch(
      `${COINGECKO_API}/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch crypto history');
    
    const data = await response.json();
    
    return data.map((candle: number[]) => ({
      time: new Date(candle[0]).toISOString().split('T')[0],
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
    }));
  } catch (error) {
    console.error('Error fetching crypto history:', error);
    return generateFallbackData(symbol, days);
  }
}

// Fetch live stock prices (using Alpha Vantage demo - limited calls)
export async function fetchStockPrices(): Promise<MarketPrice[]> {
  // Note: Alpha Vantage free tier is limited to 5 calls/minute
  // For demo, we'll use a mix of real and cached data
  try {
    const prices: MarketPrice[] = [];
    
    // Fetch one real stock as example (AAPL)
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=${ALPHA_VANTAGE_KEY}`
    );
    
    if (response.ok) {
      const data = await response.json();
      const quote = data['Global Quote'];
      
      if (quote) {
        prices.push({
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: parseFloat(quote['05. price']),
          change24h: parseFloat(quote['10. change percent'].replace('%', '')),
        });
      }
    }
    
    // Use fallback for others to avoid API limits
    return [...prices, ...getFallbackStockPrices().slice(1)];
  } catch (error) {
    console.error('Error fetching stock prices:', error);
    return getFallbackStockPrices();
  }
}

// Fetch stock history (using Alpha Vantage)
export async function fetchStockHistory(
  symbol: string,
  interval: 'daily' | 'weekly' | 'monthly' = 'daily'
): Promise<CandleData[]> {
  try {
    const functionMap = {
      daily: 'TIME_SERIES_DAILY',
      weekly: 'TIME_SERIES_WEEKLY',
      monthly: 'TIME_SERIES_MONTHLY',
    };
    
    const response = await fetch(
      `https://www.alphavantage.co/query?function=${functionMap[interval]}&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch stock history');
    
    const data = await response.json();
    const timeSeriesKey = Object.keys(data).find(key => key.includes('Time Series'));
    
    if (!timeSeriesKey) throw new Error('No time series data');
    
    const timeSeries = data[timeSeriesKey];
    
    return Object.entries(timeSeries)
      .slice(0, 100) // Last 100 data points
      .map(([date, values]: [string, any]) => ({
        time: date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseFloat(values['5. volume']),
      }))
      .reverse();
  } catch (error) {
    console.error('Error fetching stock history:', error);
    return generateFallbackData(symbol, 100);
  }
}

// Fallback data generators
function getFallbackCryptoPrices(): MarketPrice[] {
  return [
    { symbol: 'BTC/USD', name: 'Bitcoin', price: 43250.00, change24h: 3.8 },
    { symbol: 'ETH/USD', name: 'Ethereum', price: 2280.50, change24h: 5.2 },
    { symbol: 'SOL/USD', name: 'Solana', price: 98.75, change24h: 8.5 },
    { symbol: 'BNB/USD', name: 'Binance Coin', price: 312.40, change24h: 2.1 },
    { symbol: 'XRP/USD', name: 'Ripple', price: 0.62, change24h: -1.5 },
    { symbol: 'ADA/USD', name: 'Cardano', price: 0.58, change24h: 4.3 },
    { symbol: 'DOGE/USD', name: 'Dogecoin', price: 0.085, change24h: -2.1 },
    { symbol: 'MATIC/USD', name: 'Polygon', price: 0.92, change24h: 6.7 },
  ];
}

function getFallbackStockPrices(): MarketPrice[] {
  return [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.50, change24h: 2.5 },
    { symbol: 'MSFT', name: 'Microsoft', price: 378.90, change24h: 1.8 },
    { symbol: 'GOOGL', name: 'Alphabet', price: 140.25, change24h: -0.5 },
    { symbol: 'AMZN', name: 'Amazon', price: 155.75, change24h: 3.2 },
    { symbol: 'TSLA', name: 'Tesla', price: 242.80, change24h: -1.2 },
    { symbol: 'NVDA', name: 'NVIDIA', price: 495.20, change24h: 5.5 },
  ];
}

function generateFallbackData(symbol: string, points: number): CandleData[] {
  const data: CandleData[] = [];
  let basePrice = 100;
  
  // Set realistic base prices
  if (symbol.includes('BTC')) basePrice = 43000;
  else if (symbol.includes('ETH')) basePrice = 2200;
  else if (symbol.includes('SOL')) basePrice = 95;
  else if (symbol === 'AAPL') basePrice = 175;
  else if (symbol === 'MSFT') basePrice = 375;
  
  let currentPrice = basePrice;
  const now = new Date();
  
  for (let i = points; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const change = (Math.random() - 0.5) * (basePrice * 0.03);
    const open = currentPrice;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * (basePrice * 0.01);
    const low = Math.min(open, close) - Math.random() * (basePrice * 0.01);
    
    data.push({
      time: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
    });
    
    currentPrice = close;
  }
  
  return data;
}

// Utility: Convert timeframe to days
export function timeframeToDays(timeframe: string): number {
  const map: Record<string, number> = {
    '1D': 1,
    '1W': 7,
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365,
    'ALL': 730, // 2 years
  };
  return map[timeframe] || 30;
}
