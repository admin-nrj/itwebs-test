import { Injectable } from '@nestjs/common';

export interface Message {
  id: number;
  text: string;
  author: string;
  timestamp: Date;
}

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

  create(text: string, author: string): Message {
    const message: Message = {
      id: this.currentId++,
      text,
      author,
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
