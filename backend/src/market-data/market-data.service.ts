import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { RedisService } from '../common/redis/redis.service';

@Injectable()
export class MarketDataService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private config: ConfigService,
  ) {}

  /**
   * Get real-time quote for a symbol
   * In production, this would call a market data provider API
   */
  async getQuote(symbol: string) {
    // Check cache first
    const cached = await this.redis.get(`quote:${symbol}`);
    if (cached) {
      return JSON.parse(cached);
    }

    // Simulate quote data (replace with real API call)
    const quote = {
      symbol,
      price: Math.random() * 1000 + 100,
      bid: 0,
      ask: 0,
      volume: Math.floor(Math.random() * 1000000),
      change: Math.random() * 10 - 5,
      changePercent: Math.random() * 5 - 2.5,
      timestamp: new Date().toISOString(),
    };

    quote.bid = quote.price - 0.01;
    quote.ask = quote.price + 0.01;

    // Cache for 1 second
    await this.redis.set(`quote:${symbol}`, JSON.stringify(quote), 1);

    return quote;
  }

  /**
   * Get historical data for charting
   */
  async getHistoricalData(
    symbol: string,
    interval: string = '1D',
    from?: string,
    to?: string,
  ) {
    // Simulate historical data (replace with real API call)
    const bars = [];
    const now = new Date();
    const days = 30;

    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const open = Math.random() * 1000 + 100;
      const close = open + (Math.random() - 0.5) * 20;
      const high = Math.max(open, close) + Math.random() * 10;
      const low = Math.min(open, close) - Math.random() * 10;

      bars.push({
        time: date.toISOString().split('T')[0],
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 1000000),
      });
    }

    return bars;
  }

  /**
   * Search for instruments
   */
  async searchInstruments(query: string, type?: string) {
    const where: any = {
      OR: [
        { symbol: { contains: query, mode: 'insensitive' } },
        { name: { contains: query, mode: 'insensitive' } },
      ],
    };

    if (type) {
      where.type = type;
    }

    return this.prisma.instrument.findMany({
      where,
      take: 20,
    });
  }

  /**
   * Get options chain for a symbol
   */
  async getOptionsChain(symbol: string, expiryDate?: string) {
    const where: any = {
      underlyingSymbol: symbol,
      type: 'OPTION',
    };

    if (expiryDate) {
      where.expiryDate = new Date(expiryDate);
    }

    const options = await this.prisma.instrument.findMany({
      where,
      orderBy: [{ expiryDate: 'asc' }, { strikePrice: 'asc' }],
    });

    // Group by expiry date
    const grouped = options.reduce((acc, option) => {
      const expiry = option.expiryDate.toISOString().split('T')[0];
      if (!acc[expiry]) {
        acc[expiry] = { calls: [], puts: [] };
      }

      if (option.optionType === 'CALL') {
        acc[expiry].calls.push(option);
      } else {
        acc[expiry].puts.push(option);
      }

      return acc;
    }, {});

    return grouped;
  }

  /**
   * Get market movers (top gainers/losers)
   */
  async getMarketMovers(type: 'gainers' | 'losers' = 'gainers', limit = 10) {
    // Simulate market movers (replace with real data)
    const movers = [];
    for (let i = 0; i < limit; i++) {
      const changePercent =
        type === 'gainers'
          ? Math.random() * 10 + 5
          : -(Math.random() * 10 + 5);

      movers.push({
        symbol: `STOCK${i}`,
        name: `Company ${i}`,
        price: Math.random() * 1000 + 100,
        change: changePercent * 0.5,
        changePercent,
        volume: Math.floor(Math.random() * 10000000),
      });
    }

    return movers;
  }

  /**
   * Create or update instrument
   */
  async upsertInstrument(data: any) {
    return this.prisma.instrument.upsert({
      where: {
        symbol_type_strikePrice_expiryDate_optionType: {
          symbol: data.symbol,
          type: data.type,
          strikePrice: data.strikePrice || null,
          expiryDate: data.expiryDate || null,
          optionType: data.optionType || null,
        },
      },
      create: data,
      update: data,
    });
  }
}
