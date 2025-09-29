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
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeUsers = 0;

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket) {
    this.activeUsers++;
    console.log(`Клиент подключен: ${client.id}. Активных: ${this.activeUsers}`);

    this.server.emit('userCount', { count: this.activeUsers });
  }

  handleDisconnect(client: Socket) {
    this.activeUsers--;
    console.log(`Клиент отключен: ${client.id}. Активных: ${this.activeUsers}`);

    this.server.emit('userCount', { count: this.activeUsers });
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(@MessageBody() data: { text: string; author: string }, @ConnectedSocket() client: Socket) {
    console.log(`📨 Получено сообщение от ${client.id}:`, data);

    const message = this.messagesService.create(data.text, data.author);

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
