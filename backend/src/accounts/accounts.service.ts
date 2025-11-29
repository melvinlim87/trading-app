import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async create(userId: string, createAccountDto: CreateAccountDto) {
    const initialBalance = this.config.get<number>(
      'PAPER_TRADING_INITIAL_BALANCE',
      100000,
    );

    return this.prisma.account.create({
      data: {
        userId,
        type: createAccountDto.type || 'PAPER',
        currency: createAccountDto.currency || 'USD',
        cash: createAccountDto.type === 'PAPER' ? initialBalance : 0,
        equity: createAccountDto.type === 'PAPER' ? initialBalance : 0,
      },
    });
  }

  async findUserAccounts(userId: string) {
    return this.prisma.account.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            orders: true,
            positions: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        positions: {
          include: {
            instrument: true,
          },
        },
        orders: {
          where: {
            status: {
              in: ['PENDING', 'OPEN', 'PARTIALLY_FILLED'],
            },
          },
          include: {
            instrument: true,
          },
        },
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return account;
  }

  async updateEquity(accountId: string, equity: number, marginUsed: number) {
    return this.prisma.account.update({
      where: { id: accountId },
      data: {
        equity,
        marginUsed,
      },
    });
  }

  async updateCash(accountId: string, cashDelta: number) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const newCash = account.cash + cashDelta;
    const newEquity = account.equity + cashDelta;

    return this.prisma.account.update({
      where: { id: accountId },
      data: {
        cash: newCash,
        equity: newEquity,
      },
    });
  }

  async getAccountSummary(accountId: string, userId: string) {
    const account = await this.findOne(accountId, userId);

    const positions = await this.prisma.position.findMany({
      where: { accountId },
      include: {
        instrument: true,
      },
    });

    const totalRealizedPnl = positions.reduce(
      (sum, pos) => sum + pos.realizedPnl,
      0,
    );
    const totalUnrealizedPnl = positions.reduce(
      (sum, pos) => sum + pos.unrealizedPnl,
      0,
    );

    return {
      account: {
        id: account.id,
        type: account.type,
        currency: account.currency,
        equity: account.equity,
        cash: account.cash,
        marginUsed: account.marginUsed,
      },
      summary: {
        totalRealizedPnl,
        totalUnrealizedPnl,
        totalPnl: totalRealizedPnl + totalUnrealizedPnl,
        positionsCount: positions.length,
        openOrdersCount: account.orders.length,
      },
      positions,
      openOrders: account.orders,
    };
  }
}
