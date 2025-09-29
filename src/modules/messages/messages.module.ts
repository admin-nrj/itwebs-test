import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessagesGateway } from './messages.gateway';
import { MessagesRepository } from '../../dal/repositories/messages.repository';
import { MESSAGES_REPOSITORY_TOKEN } from '../../dal/tokens/repository.tokens';

@Module({
  controllers: [MessagesController],
  providers: [
    MessagesService,
    MessagesGateway,
    {
      provide: MESSAGES_REPOSITORY_TOKEN,
      useClass: MessagesRepository,
    },
  ],
  exports: [MessagesService, MessagesGateway],
})
export class MessagesModule {}
