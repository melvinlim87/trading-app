import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MarketDataService } from './market-data.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  namespace: 'market-data',
})
export class MarketDataGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private subscriptions: Map<string, Set<string>> = new Map();

  constructor(private marketDataService: MarketDataService) {
    // Simulate real-time price updates every 1 second
    setInterval(() => {
      this.broadcastPriceUpdates();
    }, 1000);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Clean up subscriptions
    this.subscriptions.forEach((clients, symbol) => {
      clients.delete(client.id);
      if (clients.size === 0) {
        this.subscriptions.delete(symbol);
      }
    });
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, payload: { symbols: string[] }) {
    const { symbols } = payload;

    symbols.forEach((symbol) => {
      if (!this.subscriptions.has(symbol)) {
        this.subscriptions.set(symbol, new Set());
      }
      this.subscriptions.get(symbol).add(client.id);
    });

    client.emit('subscribed', { symbols });
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, payload: { symbols: string[] }) {
    const { symbols } = payload;

    symbols.forEach((symbol) => {
      const clients = this.subscriptions.get(symbol);
      if (clients) {
        clients.delete(client.id);
        if (clients.size === 0) {
          this.subscriptions.delete(symbol);
        }
      }
    });

    client.emit('unsubscribed', { symbols });
  }

  private async broadcastPriceUpdates() {
    for (const [symbol, clients] of this.subscriptions.entries()) {
      if (clients.size > 0) {
        const quote = await this.marketDataService.getQuote(symbol);

        clients.forEach((clientId) => {
          this.server.to(clientId).emit('quote', quote);
        });
      }
    }
  }
}
