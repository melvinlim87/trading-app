import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { AccountsService } from '../accounts/accounts.service';
import { PaperTradingService } from './paper-trading.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private accountsService: AccountsService,
    private paperTradingService: PaperTradingService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { accountId, instrumentId, side, type, quantity, price, stopPrice } =
      createOrderDto;

    // Verify account ownership
    const account = await this.accountsService.findOne(accountId, userId);

    // Get instrument
    const instrument = await this.prisma.instrument.findUnique({
      where: { id: instrumentId },
    });

    if (!instrument) {
      throw new NotFoundException('Instrument not found');
    }

    // Create order
    const order = await this.prisma.order.create({
      data: {
        accountId,
        instrumentId,
        side,
        type,
        quantity,
        price,
        stopPrice,
        status: 'PENDING',
      },
      include: {
        instrument: true,
      },
    });

    // Execute order based on account type
    if (account.type === 'PAPER') {
      // Execute paper trade immediately
      await this.paperTradingService.executeOrder(order);
    } else {
      // For live trading, route to broker API (not implemented yet)
      throw new BadRequestException('Live trading not yet implemented');
    }

    return order;
  }

  async findAll(userId: string, accountId?: string, status?: string) {
    const where: any = {
      account: {
        userId,
      },
    };

    if (accountId) {
      where.accountId = accountId;
    }

    if (status) {
      where.status = status;
    }

    return this.prisma.order.findMany({
      where,
      include: {
        instrument: true,
      },
      orderBy: {
        placedAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        instrument: true,
        account: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.account.userId !== userId) {
      throw new BadRequestException('Access denied');
    }

    return order;
  }

  async cancel(id: string, userId: string) {
    const order = await this.findOne(id, userId);

    if (
      order.status !== 'PENDING' &&
      order.status !== 'OPEN'
    ) {
      throw new BadRequestException('Cannot cancel order in current status');
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    });
  }
}
