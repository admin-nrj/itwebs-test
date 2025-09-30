import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigType } from '@nestjs/config';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import appConfig from '../../config/app.config';
import { DalModule } from '../../dal';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: (appCfg: ConfigType<typeof appConfig>) => ({
        dest: appCfg.uploadFolder,
      }),
      inject: [appConfig.KEY],
    }),
    DalModule,
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
