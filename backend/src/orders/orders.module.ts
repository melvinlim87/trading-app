import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PaperTradingService } from './paper-trading.service';
import { AccountsModule } from '../accounts/accounts.module';
import { MarketDataModule } from '../market-data/market-data.module';

@Module({
  imports: [AccountsModule, MarketDataModule],
  controllers: [OrdersController],
  providers: [OrdersService, PaperTradingService],
  exports: [OrdersService],
})
export class OrdersModule {}
