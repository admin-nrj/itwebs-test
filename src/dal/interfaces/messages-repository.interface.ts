import { Message } from '../../modules/messages/entities/message.entity';
import { BaseRepository } from './base-repository.interface';

export interface MessagesRepositoryInterface extends BaseRepository<Message> {
  createMessage(text: string, userId: number): Promise<Message>;
  findAllWithUsers(): Promise<Message[]>;
}
