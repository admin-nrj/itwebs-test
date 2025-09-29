import { Message } from '../../modules/messages/entities/message.entity';
import { BaseRepository } from './base-repository.interface';
import { CreateMessageDto } from '../../modules/messages/dto/create-message.dto';

export interface MessagesRepositoryInterface extends BaseRepository<Message> {
  createMessage(createMessageDto: CreateMessageDto): Message;
}
