import { Module } from '@nestjs/common';
import { MarketDataService } from './market-data.service';
import { MarketDataController } from './market-data.controller';
import { MarketDataGateway } from './market-data.gateway';

@Module({
  controllers: [MarketDataController],
  providers: [MarketDataService, MarketDataGateway],
  exports: [MarketDataService],
})
export class MarketDataModule {}
