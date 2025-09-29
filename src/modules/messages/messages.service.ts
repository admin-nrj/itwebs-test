import { Injectable, Inject } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import type { MessagesRepositoryInterface } from '../../dal/interfaces/messages-repository.interface';
import { MESSAGES_REPOSITORY_TOKEN } from '../../dal/tokens/repository.tokens';

@Injectable()
export class MessagesService {
  constructor(
    @Inject(MESSAGES_REPOSITORY_TOKEN)
    private readonly messagesRepository: MessagesRepositoryInterface,
  ) {}

  async findAll(): Promise<Message[]> {
    return await this.messagesRepository.findAll();
  }

  async findOne(id: number): Promise<Message | null> {
    return await this.messagesRepository.findById(id);
  }

  create(createMessageDto: CreateMessageDto): Message {
    return this.messagesRepository.createMessage(createMessageDto);
  }

  async delete(id: number): Promise<boolean> {
    return await this.messagesRepository.delete(id);
  }
}
