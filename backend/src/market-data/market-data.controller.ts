import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MarketDataService } from './market-data.service';

@ApiTags('market-data')
@Controller('market-data')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @Get('quote/:symbol')
  @ApiOperation({ summary: 'Get real-time quote for a symbol' })
  getQuote(@Param('symbol') symbol: string) {
    return this.marketDataService.getQuote(symbol);
  }

  @Get('historical/:symbol')
  @ApiOperation({ summary: 'Get historical data for charting' })
  @ApiQuery({ name: 'interval', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  getHistoricalData(
    @Param('symbol') symbol: string,
    @Query('interval') interval?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.marketDataService.getHistoricalData(symbol, interval, from, to);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search for instruments' })
  @ApiQuery({ name: 'q', required: true })
  @ApiQuery({ name: 'type', required: false, enum: ['STOCK', 'OPTION', 'INDEX'] })
  searchInstruments(
    @Query('q') query: string,
    @Query('type') type?: string,
  ) {
    return this.marketDataService.searchInstruments(query, type);
  }

  @Get('options-chain/:symbol')
  @ApiOperation({ summary: 'Get options chain for a symbol' })
  @ApiQuery({ name: 'expiry', required: false })
  getOptionsChain(
    @Param('symbol') symbol: string,
    @Query('expiry') expiryDate?: string,
  ) {
    return this.marketDataService.getOptionsChain(symbol, expiryDate);
  }

  @Get('movers/:type')
  @ApiOperation({ summary: 'Get market movers (gainers/losers)' })
  @ApiQuery({ name: 'limit', required: false })
  getMarketMovers(
    @Param('type') type: 'gainers' | 'losers',
    @Query('limit') limit?: string,
  ) {
    return this.marketDataService.getMarketMovers(
      type,
      limit ? parseInt(limit) : 10,
    );
  }
}
