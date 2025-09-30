import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../modules/users/entities/user.entity';
import { Message } from '../modules/messages/entities/message.entity';
import { File } from '../modules/files/entities/file.entity';
import { USERS_REPOSITORY_TOKEN, MESSAGES_REPOSITORY_TOKEN, FILES_REPOSITORY_TOKEN } from './tokens/repository.tokens';
import { UsersRepository } from './repositories/users.repository';
import { MessagesRepository } from './repositories/messages.repository';
import { FilesRepository } from './repositories/files.repository';

const usersRepositoryProvider = {
  provide: USERS_REPOSITORY_TOKEN,
  useClass: UsersRepository,
};

const messagesRepositoryProvider = {
  provide: MESSAGES_REPOSITORY_TOKEN,
  useClass: MessagesRepository,
};

const filesRepositoryProvider = {
  provide: FILES_REPOSITORY_TOKEN,
  useClass: FilesRepository,
};

@Module({
  imports: [SequelizeModule.forFeature([User, Message, File])],
  providers: [usersRepositoryProvider, messagesRepositoryProvider, filesRepositoryProvider],
  exports: [usersRepositoryProvider, messagesRepositoryProvider, filesRepositoryProvider],
})
export class DalModule {}
