import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private readonly connectedUsers = new Map<string, string>();

  handleConnection(client: Socket) {
    try {
      const token = this.extractToken(client);

      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET || 'change_me',
      ) as {
        sub?: string;
        userId?: string;
        email?: string;
        roles?: string[];
      };

      const userId = payload.sub || payload.userId || payload.email;

      if (!userId) {
        throw new UnauthorizedException('Invalid token payload');
      }

      client.data.user = payload;
      client.data.userId = userId;

      this.connectedUsers.set(userId, client.id);
      client.join(`user:${userId}`);

      this.logger.log(`WebSocket connected: user=${userId}`);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : String(error);

        this.logger.warn(`WebSocket connection rejected: ${message}`);
        client.disconnect();
        }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;

    if (userId) {
      this.connectedUsers.delete(userId);
      this.logger.log(`WebSocket disconnected: user=${userId}`);
    }
  }

  emitNewNotification(userId: string, notification: unknown) {
    this.server.to(`user:${userId}`).emit('notification:new', notification);
  }

  emitUnreadCount(userId: string, count: number) {
    this.server.to(`user:${userId}`).emit('notification:unread-count', {
      userId,
      count,
    });
  }

  @SubscribeMessage('notification:read')
  handleNotificationRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { notificationId: string },
  ) {
    this.logger.log(
      `notification:read received user=${client.data.userId} notification=${data.notificationId}`,
    );

    return {
      event: 'notification:read',
      notificationId: data.notificationId,
      status: 'received',
    };
  }

  getConnectedClientsCount(): number {
    return this.connectedUsers.size;
  }

  private extractToken(client: Socket): string {
    const authToken = client.handshake.auth?.token;
    const header = client.handshake.headers.authorization;

    if (authToken) {
      return authToken;
    }

    if (header && header.startsWith('Bearer ')) {
      return header.replace('Bearer ', '');
    }

    throw new UnauthorizedException('Missing WebSocket token');
  }
}