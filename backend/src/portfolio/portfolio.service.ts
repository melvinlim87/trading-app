import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async getPortfolio(accountId: string) {
    const positions = await this.prisma.position.findMany({
      where: { accountId },
      include: {
        instrument: true,
      },
    });

    return positions;
  }

  async getPerformance(accountId: string, days = 30) {
    const snapshots = await this.prisma.pnlSnapshot.findMany({
      where: {
        accountId,
        date: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return snapshots;
  }
}
