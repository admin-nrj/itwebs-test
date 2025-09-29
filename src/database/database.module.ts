import { Module } from '@nestjs/common';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { File } from '../modules/files/entities/file.entity';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get<SequelizeModuleOptions>('database'),
        dialect: 'postgres',
        models: [File],
        autoLoadModels: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
