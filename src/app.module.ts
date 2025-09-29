import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessagesModule } from './modules/messages/messages.module';
import { BooksModule } from './modules/books/books.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { DatabaseModule } from './database/database.module';
import { FilesModule } from './modules/files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    MessagesModule,
    BooksModule,
    DatabaseModule,
    FilesModule,
  ],
})
export class AppModule {}
