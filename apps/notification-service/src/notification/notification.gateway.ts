import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { NotificationService } from './notification.service';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { LibrariesService } from 'shared/libraries';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway()
export class NotificationGateway {
  private readonly logger = new Logger(NotificationGateway.name);

  @WebSocketServer() io: Server;

  constructor(
    private readonly notificationService: NotificationService,
    private libraryService: LibrariesService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  afterInit() {
    this.logger.log('Notification Gateway initialized');
  }

  handleConnection(client: Socket) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);

    const authHeader = client.handshake.headers.authorization;
    const token = this.libraryService.extractToken(authHeader);
    if (!token) {
      this.logger.error(`Token ${token} must be Bearer token and not empty`);
      client.disconnect();
      return;
    }
    try {
      const { sub: userId } = this.jwtService.verify<{
        sub: string;
      }>(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      void client.join(userId);
    } catch {
      this.logger.error(`Token ${token} not verified`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client id:${client.id} disconnected`);
  }

  sendNotification(userId: string) {
    this.io.to(userId).emit('notification', { data: 'hello' });
  }
}
