import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { WsJwtAuthGuard } from '../../common/guards/ws-jwt-auth.guard';
import type { AuthUser } from '../auth/interfaces/auth-user.interface';

interface SocketWithAuth extends Socket {
  data: {
    user?: AuthUser;
  };
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessagesGateway.name);
  private activeUsers = 0;

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket) {
    this.activeUsers++;
    this.logger.log(`Клиент подключен: ${client.id}. Активных: ${this.activeUsers}`);

    this.server.emit('userCount', { count: this.activeUsers });
  }

  handleDisconnect(client: Socket) {
    this.activeUsers--;
    this.logger.log(`Клиент отключен: ${client.id}. Активных: ${this.activeUsers}`);

    this.server.emit('userCount', { count: this.activeUsers });
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() data: { text: string }, @ConnectedSocket() client: SocketWithAuth) {
    const user = client.data.user as AuthUser;
    this.logger.log(`📨 Получено сообщение от пользователя ${user.name} (${user.userId}): ${data.text}`);

    const message = await this.messagesService.create(data.text, user.userId);

    this.server.emit('newMessage', message);

    return { success: true, message };
  }

  @SubscribeMessage('requestMessages')
  async handleRequestMessages(@ConnectedSocket() client: Socket) {
    const messages = await this.messagesService.findAll();
    client.emit('allMessages', messages);
    return { success: true };
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('typing')
  handleTyping(@MessageBody() data: { isTyping: boolean }, @ConnectedSocket() client: SocketWithAuth) {
    const user = client.data.user as AuthUser;
    client.broadcast.emit('userTyping', { userName: user.name, isTyping: data.isTyping });
  }
}
