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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { FilesService } from './files.service';
import { FileValidationPipe } from '../../common/pipes/file-validation.pipe';
import { FileUploadResponseDto } from './dto/file-upload-response.dto';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import e from 'express';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        filename(_: e.Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
          callback(null, file.originalname);
        },
      }),
    }),
  )
  async upload(@UploadedFile(new FileValidationPipe()) file: Express.Multer.File): Promise<FileUploadResponseDto> {
    const pathName = join(this.configService.get<string>('app.uploadFolder')!);
    const savedFile = await this.filesService.create(pathName, file.originalname);

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
