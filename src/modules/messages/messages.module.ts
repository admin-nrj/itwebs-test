import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessagesGateway } from './messages.gateway';
import { WsJwtAuthGuard } from '../../common/guards/ws-jwt-auth.guard';
import { DalModule } from '../../dal';

@Module({
  imports: [JwtModule, DalModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway, WsJwtAuthGuard],
  exports: [MessagesService, MessagesGateway],
})
export class MessagesModule {}
