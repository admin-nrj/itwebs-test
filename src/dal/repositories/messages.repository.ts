import { Injectable } from '@nestjs/common';
import { Message } from '../../modules/messages/entities/message.entity';
import { MessagesRepositoryInterface } from '../interfaces/messages-repository.interface';
import { CreateMessageDto } from '../../modules/messages/dto/create-message.dto';

@Injectable()
export class MessagesRepository implements MessagesRepositoryInterface {
  private messages: Message[] = [
    {
      id: 1,
      text: 'Привет! Это первое сообщение',
      author: 'Система',
      timestamp: new Date(),
    },
  ];
  private currentId = 2;

  async findAll(): Promise<Message[]> {
    return Promise.resolve(this.messages);
  }

  async findById(id: number): Promise<Message | null> {
    return Promise.resolve(this.messages.find((msg) => msg.id === id) || null);
  }

  async create(data: Partial<Message>): Promise<Message> {
    const message: Message = {
      id: this.currentId++,
      text: data.text!,
      author: data.author!,
      timestamp: new Date(),
    };
    this.messages.push(message);

    return Promise.resolve(message);
  }

  createMessage(createMessageDto: CreateMessageDto): Message {
    const message: Message = {
      id: this.currentId++,
      text: createMessageDto.text,
      author: createMessageDto.author,
      timestamp: new Date(),
    };
    this.messages.push(message);

    return message;
  }

  async delete(id: number): Promise<boolean> {
    const index = this.messages.findIndex((msg) => msg.id === id);
    if (index !== -1) {
      this.messages.splice(index, 1);
      return true;
    }

    return Promise.resolve(false);
  }
}
