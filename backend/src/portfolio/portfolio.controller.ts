import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('portfolio')
@Controller('portfolio')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get(':accountId')
  @ApiOperation({ summary: 'Get portfolio positions' })
  getPortfolio(@Param('accountId') accountId: string) {
    return this.portfolioService.getPortfolio(accountId);
  }

  @Get(':accountId/performance')
  @ApiOperation({ summary: 'Get portfolio performance history' })
  getPerformance(
    @Param('accountId') accountId: string,
    @Query('days') days?: string,
  ) {
    return this.portfolioService.getPerformance(
      accountId,
      days ? parseInt(days) : 30,
    );
  }
}
