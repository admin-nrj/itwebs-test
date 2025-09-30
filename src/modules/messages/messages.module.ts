import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessagesGateway } from './messages.gateway';
import { MessagesRepository } from '../../dal/repositories/messages.repository';
import { UsersRepository } from '../../dal/repositories/users.repository';
import { MESSAGES_REPOSITORY_TOKEN, USERS_REPOSITORY_TOKEN } from '../../dal/tokens/repository.tokens';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { WsJwtAuthGuard } from '../../common/guards/ws-jwt-auth.guard';

@Module({
  imports: [SequelizeModule.forFeature([Message, User]), JwtModule],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    MessagesGateway,
    WsJwtAuthGuard,
    {
      provide: MESSAGES_REPOSITORY_TOKEN,
      useClass: MessagesRepository,
    },
    {
      provide: USERS_REPOSITORY_TOKEN,
      useClass: UsersRepository,
    },
  ],
  exports: [MessagesService, MessagesGateway],
})
export class MessagesModule {}
