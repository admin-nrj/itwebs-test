import { Injectable } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  private messages: Message[] = [
    {
      id: 1,
      text: 'Привет! Это первое сообщение',
      author: 'Система',
      timestamp: new Date(),
    },
  ];
  private currentId = 2;

  findAll(): Message[] {
    return this.messages;
  }

  findOne(id: number): Message | undefined {
    return this.messages.find((msg) => msg.id === id);
  }

  create(createMessageDto: CreateMessageDto): Message {
    const message: Message = {
      id: this.currentId++,
      text: createMessageDto.text,
      author: createMessageDto.author,
      timestamp: new Date(),
    };
    this.messages.push(message);
    return message;
  }

  delete(id: number): boolean {
    const index = this.messages.findIndex((msg) => msg.id === id);
    if (index !== -1) {
      this.messages.splice(index, 1);
      return true;
    }
    return false;
  }
}
