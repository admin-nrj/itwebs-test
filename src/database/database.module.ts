import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { File } from '../modules/files/entities/file.entity';
import databaseConfig from '../config/database.config';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (dbCfg: ConfigType<typeof databaseConfig>) => ({
        host: dbCfg.host,
        port: dbCfg.port,
        username: dbCfg.username,
        password: dbCfg.password,
        database: dbCfg.database,
        synchronize: dbCfg.synchronize,
        dialect: 'postgres',
        models: [File],
        autoLoadModels: true,
      }),
      inject: [databaseConfig.KEY],
    }),
  ],
})
export class DatabaseModule {}
