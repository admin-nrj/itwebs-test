import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { FilesService } from './files.service';
import { FileValidationPipe } from '../../common/pipes/file-validation.pipe';
import { FileUploadResponseDto } from './dto/file-upload-response.dto';
import type { ConfigType } from '@nestjs/config';
import { memoryStorage } from 'multer';
import appConfig from '../../config/app.config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    @Inject(appConfig.KEY)
    private readonly appCfg: ConfigType<typeof appConfig>,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async upload(@UploadedFile(new FileValidationPipe()) file: Express.Multer.File): Promise<FileUploadResponseDto> {
    const pathName = join(this.appCfg.uploadFolder);
    const savedFile = await this.filesService.create(pathName, file.originalname, file.buffer);

    return {
      fileId: savedFile.fileId,
      name: file.originalname,
      path: pathName,
      size: file.size,
      uploadedAt: savedFile.createdAt,
    };
  }

  @Get()
  async findAll() {
    return await this.filesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.filesService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.filesService.remove(id);
  }
}
