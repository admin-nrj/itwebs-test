import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from '../../modules/messages/entities/message.entity';
import { User } from '../../modules/users/entities/user.entity';
import { MessagesRepositoryInterface } from '../interfaces/messages-repository.interface';

@Injectable()
export class MessagesRepository implements MessagesRepositoryInterface {
  constructor(
    @InjectModel(Message)
    private readonly messageModel: typeof Message,
  ) {}

  async findAll(): Promise<Message[]> {
    return await this.messageModel.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async findAllWithUsers(): Promise<Message[]> {
    return await this.messageModel.findAll({
      include: [{ model: User, attributes: ['userId', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: number): Promise<Message | null> {
    return await this.messageModel.findByPk(id, {
      include: [{ model: User, attributes: ['userId', 'name', 'email'] }],
    });
  }

  async create(data: Message): Promise<Message> {
    return await this.messageModel.create(data);
  }

  async createMessage(text: string, userId: number): Promise<Message> {
    return await this.messageModel.create({ text, userId });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.messageModel.destroy({ where: { messageId: id } });
    return result > 0;
  }
}
