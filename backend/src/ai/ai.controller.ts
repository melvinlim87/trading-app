import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('ai')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('analyze/:symbol')
  @ApiOperation({ summary: 'Get AI analysis for a ticker' })
  analyzeTicker(
    @Param('symbol') symbol: string,
    @Query('timeframe') timeframe?: string,
  ) {
    return this.aiService.analyzeTicker(symbol, timeframe);
  }

  @Post('options-strategy')
  @ApiOperation({ summary: 'Get AI-suggested options strategy' })
  suggestOptionsStrategy(
    @Body()
    params: {
      outlook: 'bullish' | 'bearish' | 'neutral';
      riskTolerance: 'low' | 'medium' | 'high';
      symbol: string;
    },
  ) {
    return this.aiService.suggestOptionsStrategy(params);
  }

  @Post('portfolio-insights')
  @ApiOperation({ summary: 'Get AI insights for portfolio' })
  analyzePortfolio(@Body() body: { positions: any[] }) {
    return this.aiService.analyzePortfolio(body.positions);
  }
}
