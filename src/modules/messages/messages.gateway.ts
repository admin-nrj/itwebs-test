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
import { Logger } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

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

  @SubscribeMessage('sendMessage')
  handleSendMessage(@MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client: Socket) {
    this.logger.log(`📨 Получено сообщение от ${client.id}: ${JSON.stringify(createMessageDto)}`);

    const message = this.messagesService.create(createMessageDto);

    this.server.emit('newMessage', message);

    return { success: true, message };
  }

  @SubscribeMessage('requestMessages')
  handleRequestMessages(@ConnectedSocket() client: Socket) {
    const messages = this.messagesService.findAll();
    client.emit('allMessages', messages);
    return { success: true };
  }

  @SubscribeMessage('typing')
  handleTyping(@MessageBody() data: { author: string; isTyping: boolean }, @ConnectedSocket() client: Socket) {
    client.broadcast.emit('userTyping', data);
  }
}
