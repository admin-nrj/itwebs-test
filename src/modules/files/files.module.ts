import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigType } from '@nestjs/config';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { File } from './entities/file.entity';
import { FilesRepository } from '../../dal/repositories/files.repository';
import { FILES_REPOSITORY_TOKEN } from '../../dal/tokens/repository.tokens';
import appConfig from '../../config/app.config';

@Module({
  imports: [
    SequelizeModule.forFeature([File]),
    MulterModule.registerAsync({
      useFactory: (appCfg: ConfigType<typeof appConfig>) => ({
        dest: appCfg.uploadFolder,
      }),
      inject: [appConfig.KEY],
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
