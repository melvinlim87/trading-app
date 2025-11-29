import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { MarketDataService } from '../market-data/market-data.service';

@Injectable()
export class PaperTradingService {
  constructor(
    private prisma: PrismaService,
    private marketDataService: MarketDataService,
  ) {}

  async executeOrder(order: any) {
    // Get current market price
    const quote = await this.marketDataService.getQuote(order.instrument.symbol);
    let fillPrice = quote.price;

    // Determine fill price based on order type
    if (order.type === 'MARKET') {
      fillPrice = order.side === 'BUY' ? quote.ask : quote.bid;
    } else if (order.type === 'LIMIT') {
      fillPrice = order.price;
      // For simplicity, fill limit orders immediately at limit price
      // In real system, would check if limit price is achievable
    }

    // Calculate cost
    const cost = fillPrice * order.quantity;

    // Update order status
    await this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'FILLED',
        filledQty: order.quantity,
        avgFillPrice: fillPrice,
        filledAt: new Date(),
      },
    });

    // Update or create position
    await this.updatePosition(order, fillPrice);

    // Update account cash
    const cashDelta = order.side === 'BUY' ? -cost : cost;
    await this.updateAccountCash(order.accountId, cashDelta);

    return { success: true, fillPrice, cost };
  }

  private async updatePosition(order: any, fillPrice: number) {
    const existingPosition = await this.prisma.position.findUnique({
      where: {
        accountId_instrumentId: {
          accountId: order.accountId,
          instrumentId: order.instrumentId,
        },
      },
    });

    if (existingPosition) {
      // Update existing position
      const newQty =
        order.side === 'BUY'
          ? existingPosition.quantity + order.quantity
          : existingPosition.quantity - order.quantity;

      if (newQty === 0) {
        // Close position
        await this.prisma.position.delete({
          where: { id: existingPosition.id },
        });
      } else {
        // Update position
        const newAvgPrice =
          order.side === 'BUY'
            ? (existingPosition.avgPrice * existingPosition.quantity +
                fillPrice * order.quantity) /
              newQty
            : existingPosition.avgPrice;

        await this.prisma.position.update({
          where: { id: existingPosition.id },
          data: {
            quantity: newQty,
            avgPrice: newAvgPrice,
          },
        });
      }
    } else {
      // Create new position
      if (order.side === 'BUY') {
        await this.prisma.position.create({
          data: {
            accountId: order.accountId,
            instrumentId: order.instrumentId,
            quantity: order.quantity,
            avgPrice: fillPrice,
          },
        });
      }
    }
  }

  private async updateAccountCash(accountId: string, cashDelta: number) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    await this.prisma.account.update({
      where: { id: accountId },
      data: {
        cash: account.cash + cashDelta,
      },
    });
  }
}
