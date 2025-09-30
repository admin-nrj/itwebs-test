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
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { FilesService } from './files.service';
import { FileValidationPipe } from '../../common/pipes/file-validation.pipe';
import { FileUploadResponseDto } from './dto/file-upload-response.dto';
import { FileResponseDto } from './dto/file-response.dto';
import type { ConfigType } from '@nestjs/config';
import { memoryStorage } from 'multer';
import appConfig from '../../config/app.config';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { OwnerOrAdminGuard } from '../../common/guards/owner-or-admin.guard';

@ApiTags('Files')
@ApiBearerAuth()
@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    @Inject(appConfig.KEY)
    private readonly appCfg: ConfigType<typeof appConfig>,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Загрузить файл' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Файл успешно загружен', type: FileUploadResponseDto })
  @ApiResponse({ status: 400, description: 'Неверный файл' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
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

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Получить список всех файлов (только для администраторов)' })
  @ApiResponse({ status: 200, description: 'Список файлов', type: [FileResponseDto] })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async findAll() {
    return await this.filesService.findAll();
  }

  @UseGuards(OwnerOrAdminGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Получить информацию о файле по ID' })
  @ApiParam({ name: 'id', description: 'ID файла', type: 'number' })
  @ApiResponse({ status: 200, description: 'Информация о файле', type: FileResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Файл не найден' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.filesService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить файл (только для администраторов)' })
  @ApiParam({ name: 'id', description: 'ID файла', type: 'number' })
  @ApiResponse({ status: 204, description: 'Файл успешно удален' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Файл не найден' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.filesService.remove(id);
  }
}
