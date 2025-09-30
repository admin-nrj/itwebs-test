import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { File } from '../modules/files/entities/file.entity';
import { User } from '../modules/users/entities/user.entity';
import { Message } from '../modules/messages/entities/message.entity';
import databaseConfig from '../config/database.config';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (dbCfg: ConfigType<typeof databaseConfig>) => ({
        ...dbCfg,
        dialect: 'postgres',
        models: [File, User, Message],
        autoLoadModels: true,
      }),
      inject: [databaseConfig.KEY],
    }),
  ],
})
export class DatabaseModule {}
