import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { File } from './entities/file.entity';
import { FilesRepository } from '../../dal/repositories/files.repository';
import { FILES_REPOSITORY_TOKEN } from '../../dal/tokens/repository.tokens';

@Module({
  imports: [
    SequelizeModule.forFeature([File]),
    MulterModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        dest: configService.get<string>('app.uploadFolder'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [FilesController],
  providers: [
    FilesService,
    {
      provide: FILES_REPOSITORY_TOKEN,
      useClass: FilesRepository,
    },
  ],
  exports: [FilesService],
})
export class FilesModule {}
