import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BooksController } from './books/books.controller';
import { MessagesController } from './message/nestjs_controller';
import { MessagesService } from './message/messages.service';
import { MessagesGateway } from './message/nestjs_gateway';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [BooksController, MessagesController],
  providers: [MessagesService, MessagesGateway],
})
export class AppModule {}
