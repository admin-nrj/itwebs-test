import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BooksController } from './books/books.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [
    AppController,
    BooksController
  ],
  providers: [AppService],
})
export class AppModule {}
