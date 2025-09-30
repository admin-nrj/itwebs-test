import { Injectable, Inject } from '@nestjs/common';
import type { MessagesRepositoryInterface } from '../../dal/interfaces/messages-repository.interface';
import { MESSAGES_REPOSITORY_TOKEN } from '../../dal/tokens/repository.tokens';
import { MessageResponseDto } from './dto/message-response.dto';
import { toDto, toDtoArray } from '../../common/utils/dto.util';

@Injectable()
export class MessagesService {
  constructor(
    @Inject(MESSAGES_REPOSITORY_TOKEN)
    private readonly messagesRepository: MessagesRepositoryInterface,
  ) {}

  async findAll(): Promise<MessageResponseDto[]> {
    const messages = await this.messagesRepository.findAll();
    return toDtoArray(MessageResponseDto, messages);
  }

  async findOne(id: number): Promise<MessageResponseDto | null> {
    const message = await this.messagesRepository.findById(id);
    return message ? toDto(MessageResponseDto, message) : null;
  }

  async create(text: string, userId: number): Promise<MessageResponseDto> {
    const message = await this.messagesRepository.createMessage(text, userId);
    return toDto(MessageResponseDto, message);
  }

  async delete(id: number): Promise<boolean> {
    return await this.messagesRepository.delete(id);
  }
}
